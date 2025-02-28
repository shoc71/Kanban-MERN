import express from "express";
import { Pool } from "pg";
import { authenticateToken } from "../middleware/authMiddleware";
import { body, validationResult } from "express-validator";

const router = express.Router();
const pool = new Pool();

// Get tasks by board ID
router.get("/:boardId", authenticateToken, async (req, res) => {
  try {
    const { boardId } = req.params;
    const tasks = await pool.query("SELECT * FROM tasks WHERE board_id = $1 ORDER BY id", [boardId]);
    res.json({ success: true, data: tasks.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
});

// Create a new task
router.post(
  "/",
  authenticateToken,
  [
    body("board_id").isInt(),
    body("title").notEmpty(),
    body("status").isIn(["todo", "in-progress", "done"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { board_id, title, description, status } = req.body;
      const result = await pool.query(
        "INSERT INTO tasks (board_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *",
        [board_id, title, description, status]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to create task" });
    }
  }
);

// Update task status
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query("UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update task" });
  }
});

// Delete a task
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete task" });
  }
});

export default router;
