import express from "express";
import cors from "cors";
import { initDB } from "./db.js";
import listRoutes from "./routes/lists.js";
import taskRoutes from "./routes/tasks.js";
import tasklistRoutes from "./routes/tasklists.js";

const app = express();
const PORT = 3000;

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

const db = await initDB();

app.use("/lists", listRoutes(db));
app.use("/lists/:listId/tasklists", tasklistRoutes(db));
app.use("/tasklists/:tasklistId/tasks", taskRoutes(db));

app.get("/", (req, res) => {
  res.send("✅ To-Do List API running! Try /lists");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
