import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import { initDB } from "./schema.js";
import multer from "multer";
import * as xlsx from "xlsx";

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

const app = express();
app.use(cors());
app.use(express.json());

// --- AUTHENTICATION ---

app.post("/api/auth/login", async (req, res) => {
    const { isStudent, identifier, password } = req.body;

    if (!isStudent) {
        const validUsername = process.env.ADMIN_USERNAME || "admin";
        const validPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (identifier === validUsername && password === validPassword) {
            return res.json({ success: true, user: { role: "admin", name: "Administrator" } });
        }
        return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }

    // Student login
    try {
        const result = await pool.query(
            "SELECT * FROM students WHERE email = $1 AND phone = $2",
            [identifier.toLowerCase().trim(), password.trim()]
        );

        if (result.rows.length > 0) {
            const student = result.rows[0];
            return res.json({
                success: true,
                user: {
                    role: "student",
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    enrollmentNo: student.phone // Using phone as enrollment/identifier in frontend
                }
            });
        }

        res.status(401).json({ success: false, message: "Student not found with this Email and Phone number" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

// --- ADMIN STUDENTS ---

app.get("/api/admin/students", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM students ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching students" });
    }
});

app.delete("/api/admin/students/clear", async (req, res) => {
    try {
        await pool.query("TRUNCATE TABLE students RESTART IDENTITY CASCADE");
        res.json({ success: true, message: "All students deleted successfully" });
    } catch (err) {
        console.error("Error clearing students:", err);
        res.status(500).json({ success: false, message: "Error clearing database" });
    }
});

app.post("/api/admin/students", async (req, res) => {
    const { name, email, phone, college, semester, ticket_type, booking_id } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ success: false, message: "Name, email, and phone are required" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO students (name, email, phone, college, semester, ticket_type, booking_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, email.toLowerCase().trim(), phone.trim(), college, semester, ticket_type, booking_id]
        );
        res.json({ success: true, student: result.rows[0] });
    } catch (err) {
        if (err.constraint === 'students_email_key') {
            return res.status(400).json({ success: false, message: "Student with this email already exists" });
        }
        console.error(err);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

app.post("/api/admin/students/bulk", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    try {
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let successCount = 0;
        let errors = [];

        // Simple validation mapping function to find expected headers loosely
        const findField = (row, possibleNames) => {
            const rowKeys = Object.keys(row);
            for (let k of rowKeys) {
                if (possibleNames.some(pn => k.toLowerCase().includes(pn.toLowerCase()))) {
                    return row[k];
                }
            }
            return null;
        };

        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            const name = findField(row, ["name", "first name", "full name"]) || "";
            const email = findField(row, ["email", "e-mail", "mail"]) || "";
            const phone = findField(row, ["phone", "mobile", "contact", "number", "no"]) || "";
            const college = findField(row, ["college", "university", "institute", "school"]) || "";
            const semester = findField(row, ["semester", "sem", "year", "branch"]) || "";
            const ticket_type = findField(row, ["ticket", "type", "pass"]) || "General";
            const booking_id = findField(row, ["booking", "order", "id"]) || "";

            const phoneStr = phone !== null && phone !== undefined ? String(phone).trim() : "";
            const emailStr = email ? String(email).toLowerCase().trim() : "";

            if (!name || !emailStr || !phoneStr) {
                errors.push({ row: i + 2, message: `Missing required fields (Name, Email, or Phone)` });
                continue;
            }

            try {
                // Try inserting
                await pool.query(
                    `INSERT INTO students (name, email, phone, college, semester, ticket_type, booking_id) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [name, emailStr, phoneStr, String(college), String(semester), String(ticket_type), String(booking_id)]
                );
                successCount++;
            } catch (err) {
                if (err.constraint === 'students_email_key') {
                    errors.push({ row: i + 2, email: emailStr, message: "Email already exists" });
                } else {
                    errors.push({ row: i + 2, email: emailStr, message: err.message || "Insert failed" });
                }
            }
        }

        res.json({
            success: true,
            message: `Processed ${data.length} rows. Added ${successCount} successfully.`,
            successCount,
            errors
        });

    } catch (err) {
        console.error("Bulk upload error:", err);
        res.status(500).json({ success: false, message: "Error processing file. Ensure it's a valid CSV/Excel." });
    }
});

// --- COUPONS ---

app.get("/api/coupons/my", async (req, res) => {
    const { email } = req.query;
    try {
        const result = await pool.query("SELECT * FROM food_coupons WHERE student_email = $1 ORDER BY day ASC", [email]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching coupons" });
    }
});

app.post("/api/coupons/generate", async (req, res) => {
    const { student_id, student_name, student_email, day, date } = req.body;

    try {
        const coupon_id = `AIBC-D${day}-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const result = await pool.query(
            `INSERT INTO food_coupons (coupon_id, student_id, student_name, student_email, day, date) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [coupon_id, student_id, student_name, student_email, day, date]
        );

        res.json({ success: true, coupon: result.rows[0] });
    } catch (err) {
        if (err.constraint === 'food_coupons_student_email_day_key') {
            return res.status(400).json({ success: false, message: `You already have a coupon for Day ${day}` });
        }
        console.error(err);
        res.status(500).json({ success: false, message: "Error generating coupon" });
    }
});

app.get("/api/admin/coupons", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM food_coupons ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching coupons" });
    }
});

app.post("/api/admin/coupons/verify", async (req, res) => {
    const { coupon_id } = req.body;

    try {
        const result = await pool.query("SELECT * FROM food_coupons WHERE coupon_id = $1", [coupon_id]);

        if (result.rows.length === 0) {
            return res.json({ status: "not_found" });
        }

        const coupon = result.rows[0];

        if (coupon.is_used) {
            return res.json({ status: "already_used", coupon });
        }

        // Mark as used
        const updated = await pool.query(
            "UPDATE food_coupons SET is_used = true, redeemed_at = NOW() WHERE coupon_id = $1 RETURNING *",
            [coupon_id]
        );

        res.json({ status: "valid", coupon: updated.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error verifying coupon" });
    }
});

// --- ATTENDANCE ---

app.get("/api/attendance/my", async (req, res) => {
    const { email } = req.query;
    try {
        const result = await pool.query("SELECT * FROM attendance WHERE student_email = $1 ORDER BY day ASC", [email]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching attendance" });
    }
});

app.post("/api/attendance/generate", async (req, res) => {
    const { student_id, student_name, student_email, day, date } = req.body;

    try {
        const ticket_id = `ATND-D${day}-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const result = await pool.query(
            `INSERT INTO attendance (ticket_id, student_id, student_name, student_email, day, date) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [ticket_id, student_id, student_name, student_email, day, date]
        );

        res.json({ success: true, ticket: result.rows[0] });
    } catch (err) {
        if (err.constraint === 'attendance_student_email_day_key') {
            return res.status(400).json({ success: false, message: `You have already generated an attendance ticket for Day ${day}` });
        }
        console.error(err);
        res.status(500).json({ success: false, message: "Error generating attendance ticket" });
    }
});

app.get("/api/admin/attendance", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM attendance ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching attendance records" });
    }
});

app.post("/api/admin/attendance/verify", async (req, res) => {
    const { ticket_id } = req.body;

    try {
        const result = await pool.query("SELECT * FROM attendance WHERE ticket_id = $1", [ticket_id]);

        if (result.rows.length === 0) {
            return res.json({ status: "not_found" });
        }

        const ticket = result.rows[0];

        if (ticket.is_scanned) {
            return res.json({ status: "already_used", ticket }); // reusing already_used for scanner compatibility
        }

        // Mark as used
        const updated = await pool.query(
            "UPDATE attendance SET is_scanned = true, scanned_at = NOW() WHERE ticket_id = $1 RETURNING *",
            [ticket_id]
        );

        // UI Scanner uses `coupon` internally for rendering success message
        res.json({ status: "valid", ticket: updated.rows[0], coupon: updated.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error verifying attendance ticket" });
    }
});

// --- PROMPTS ---

app.get("/api/prompts", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM prompts ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching prompts" });
    }
});

app.post("/api/prompts", async (req, res) => {
    const { title, category, content } = req.body;
    const prompt_id = `PRMT-${Date.now()}`;

    try {
        const result = await pool.query(
            "INSERT INTO prompts (prompt_id, title, category, content) VALUES ($1, $2, $3, $4) RETURNING *",
            [prompt_id, title, category, content]
        );
        res.json({ success: true, prompt: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Error creating prompt" });
    }
});

app.put("/api/prompts/:id", async (req, res) => {
    const { id } = req.params;
    const { title, category, content } = req.body;

    try {
        const result = await pool.query(
            "UPDATE prompts SET title = $1, category = $2, content = $3 WHERE prompt_id = $4 RETURNING *",
            [title, category, content, id]
        );
        res.json({ success: true, prompt: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Error updating prompt" });
    }
});

app.delete("/api/prompts/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM prompts WHERE prompt_id = $1", [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting prompt" });
    }
});

// --- MATERIALS ---

app.get("/api/materials", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM materials ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching materials" });
    }
});

app.get("/api/materials/visible", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM materials WHERE is_visible = true ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching visible materials" });
    }
});

app.post("/api/materials", async (req, res) => {
    const { title, category, link } = req.body;
    const material_id = `MAT-${Date.now()}`;

    try {
        const result = await pool.query(
            "INSERT INTO materials (material_id, title, category, link) VALUES ($1, $2, $3, $4) RETURNING *",
            [material_id, title, category, link]
        );
        res.json({ success: true, material: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Error creating material" });
    }
});

app.put("/api/materials/:id", async (req, res) => {
    const { id } = req.params;
    const { title, category, link, is_visible } = req.body;

    // Handle string or boolean for is_visible
    const visibleFlag = is_visible === true || is_visible === 'true';

    try {
        const result = await pool.query(
            "UPDATE materials SET title = $1, category = $2, link = $3, is_visible = $4 WHERE material_id = $5 RETURNING *",
            [title, category, link, visibleFlag, id]
        );
        res.json({ success: true, material: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Error updating material" });
    }
});

app.delete("/api/materials/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM materials WHERE material_id = $1", [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting material" });
    }
});

// --- GENERATION STATUS CONTROL ---
app.get("/api/generation-status", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM generation_status ORDER BY day ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching generation status" });
    }
});

app.get("/api/generation-status/check/:day/:type", async (req, res) => {
    const { day, type } = req.params;

    try {
        const result = await pool.query("SELECT * FROM generation_status WHERE day = $1", [parseInt(day)]);

        if (result.rows.length === 0) {
            return res.json({ enabled: false });
        }

        const status = result.rows[0];
        const fieldName = type === "ticket" ? "ticket_generation_enabled" : "coupon_generation_enabled";

        res.json({ enabled: status[fieldName] || false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error checking generation status" });
    }
});

app.post("/api/admin/generation-status/:day/:type", async (req, res) => {
    const { day, type } = req.params;
    const { enabled } = req.body;

    try {
        const fieldName = type === "ticket" ? "ticket_generation_enabled" : "coupon_generation_enabled";

        const result = await pool.query(
            `INSERT INTO generation_status (day, ${fieldName}, updated_at, updated_by) 
             VALUES ($1, $2, NOW(), 'admin')
             ON CONFLICT (day) DO UPDATE SET ${fieldName} = $2, updated_at = NOW()
             RETURNING *`,
            [parseInt(day), enabled === true]
        );

        res.json({ success: true, status: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating generation status" });
    }
});

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        // Initialize database tables
        await initDB();

        if (process.env.NODE_ENV !== "production") {
            app.listen(PORT, () => {
                console.log(`🚀 API Server running on http://localhost:${PORT}`);
            });
        }
    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
}

startServer();

export default app;
