import express from "express";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔥 FIXED ROOT ROUTE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GET messages
app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST message
app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default app;



