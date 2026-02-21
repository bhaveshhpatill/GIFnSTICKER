import express from "express";
import pg from "pg";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET all messages
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
app.post("/messages", async (req, res) => {
  const { username, url } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO messages (username, type, url) VALUES ($1, $2, $3) RETURNING *",
      [username, "gif", url]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default app;


