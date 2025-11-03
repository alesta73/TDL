import express from "express";

export default function taskRoutes(db) {
  const router = express.Router({ mergeParams: true });

  // 🔹 Get all tasks for a specific tasklist
  router.get("/", async (req, res) => {
    const { tasklistId } = req.params;
    try {
      const rows = await db.all(
        "SELECT * FROM tasks WHERE tasklist_id = ?",
        [tasklistId]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 🔹 Add new task
  router.post("/", async (req, res) => {
    const { tasklistId } = req.params;
    const { name } = req.body;
    try {
      await db.run(
        "INSERT INTO tasks (tasklist_id, name) VALUES (?, ?)",
        [tasklistId, name]
      );
      res.status(201).json({ message: "Task added" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // 🔹 Delete a task
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await db.run("DELETE FROM tasks WHERE id = ?", [id]);
      res.json({ message: "Task deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
