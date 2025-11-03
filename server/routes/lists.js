import express from "express";

export default function listRoutes(db) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const rows = await db.all("SELECT * FROM lists");
    res.json(rows);
  });

  router.post("/", async (req, res) => {
    const { name } = req.body;
    try {
      await db.run("INSERT INTO lists (name) VALUES (?)", [name]);
      res.status(201).json({ message: "List added" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await db.run("DELETE FROM lists WHERE id = ?", [id]);
    res.json({ message: "List deleted" });
  });

  return router; // ✅ crucial line
}
