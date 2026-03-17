import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

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

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`🚀 API Server running on http://localhost:${PORT}`);
    });
}

export default app;
