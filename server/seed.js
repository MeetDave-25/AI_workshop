import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import xlsx from "xlsx";
import pool from "./db.js";
import { initDB } from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
    await initDB();

    console.log("📖 Reading Excel file...");
    const excelPath = path.join(__dirname, "../ljcca-ai-powered-creators-bootcamp-2026-confirmed (1).xlsx");

    if (!fs.existsSync(excelPath)) {
        console.error("❌ Excel file not found at:", excelPath);
        process.exit(1);
    }

    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(`Found ${data.length} records. Starting import...`);

    const client = await pool.connect();
    let inserted = 0;
    let skipped = 0;

    try {
        await client.query("BEGIN");

        for (const row of data) {
            if (!row["Email"] || !row["Phone"] || !row["Name"]) {
                continue;
            }

            // Format phone number to clean it (e.g. +919714... -> 9714...) maybe? 
            // The user said "phone number as password", so exact phone match. We'll stringify it.
            const phoneStr = String(row["Phone"]).trim();

            try {
                await client.query(
                    `INSERT INTO students (booking_id, name, email, phone, ticket_type, college, semester)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (email) DO UPDATE 
           SET phone = EXCLUDED.phone, name = EXCLUDED.name`,
                    [
                        String(row["Booking ID"] || ""),
                        String(row["Name"]).trim(),
                        String(row["Email"]).trim().toLowerCase(),
                        phoneStr,
                        String(row["Ticket Type"] || ""),
                        String(row["Form_College Name"] || ""),
                        String(row["Form_Semester"] || "")
                    ]
                );
                inserted++;
            } catch (err) {
                console.error("Error inserting row:", row["Email"], err.message);
                skipped++;
            }
        }

        await client.query("COMMIT");
        console.log(`✅ Import complete! Inserted/Updated: ${inserted}, Skipped/Error: ${skipped}`);
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("❌ Fatal error during import:", err);
    } finally {
        client.release();
        pool.end();
    }
}

seed();
