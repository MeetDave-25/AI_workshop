import pool from "./db.js";

export async function initDB() {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        booking_id VARCHAR(50),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        ticket_type VARCHAR(100),
        college VARCHAR(255),
        semester VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS food_coupons (
        id SERIAL PRIMARY KEY,
        coupon_id VARCHAR(100) UNIQUE NOT NULL,
        student_id INTEGER REFERENCES students(id),
        student_name VARCHAR(255) NOT NULL,
        student_email VARCHAR(255) NOT NULL,
        day INTEGER NOT NULL CHECK (day >= 1 AND day <= 3),
        date VARCHAR(100),
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        redeemed_at TIMESTAMP,
        UNIQUE(student_email, day)
      );

      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(100) UNIQUE NOT NULL,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        student_name VARCHAR(255) NOT NULL,
        student_email VARCHAR(255) NOT NULL,
        day INTEGER NOT NULL CHECK (day >= 1 AND day <= 3),
        date VARCHAR(100),
        is_scanned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        scanned_at TIMESTAMP,
        UNIQUE(student_email, day)
      );

      CREATE TABLE IF NOT EXISTS prompts (
        id SERIAL PRIMARY KEY,
        prompt_id VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS generation_status (
        id SERIAL PRIMARY KEY,
        day INTEGER NOT NULL CHECK (day >= 1 AND day <= 3),
        ticket_generation_enabled BOOLEAN DEFAULT false,
        coupon_generation_enabled BOOLEAN DEFAULT false,
        updated_at TIMESTAMP DEFAULT NOW(),
        updated_by VARCHAR(100),
        UNIQUE(day)
      );
    `);
      console.log("✅ Database tables initialized");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("❌ Database initialization error:", err.message);
    throw err;
  }
}
