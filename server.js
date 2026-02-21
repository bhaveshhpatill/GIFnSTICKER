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

// Root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GET all messages
app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST new message
app.post("/messages", async (req, res) => {
  const { username, type, url } = req.body;

  if (!username || !url) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO messages (username, type, url) VALUES ($1, $2, $3) RETURNING *",
      [username, type || "gif", url]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "Insert failed" });
  }
});

export default app;





