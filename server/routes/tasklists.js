import express from "express";

export default function tasklistRoutes(db) {
  const router = express.Router({ mergeParams: true });

  // 🔹 Get all tasklists for a given list
  router.get("/", async (req, res) => {
    const { listId } = req.params;
    try {
      const rows = await db.all(
        "SELECT * FROM tasklists WHERE list_id = ?",
        [listId]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 🔹 Create a new tasklist under a list
  router.post("/", async (req, res) => {
    const { listId } = req.params;
    const { name, date } = req.body;
    try {
      await db.run(
        "INSERT INTO tasklists (list_id, name, date) VALUES (?, ?, ?)",
        [listId, name, date]
      );
      res.status(201).json({ message: "Tasklist created" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // 🔹 Delete a tasklist and its tasks
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await db.run("DELETE FROM tasks WHERE tasklist_id = ?", [id]);
      await db.run("DELETE FROM tasklists WHERE id = ?", [id]);
      res.json({ message: "Tasklist deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
