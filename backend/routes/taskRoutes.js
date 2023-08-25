// Task Routes

const taskRouter = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
} = require("../controller/taskController");

// Task Base API URL: "/api/tasks"

// 1. Create Task API: POST-> "/create-task"
taskRouter.post("/create-task", authMiddleware, createTaskController);

// 2. Get All Tasks based on filters: POST->"/get-tasks"
taskRouter.post("/get-tasks", authMiddleware, getTasksController);

// 3. Update Task: POST-> "/update-task"
taskRouter.post("/update-task", authMiddleware, updateTaskController);

// 4. Delete Task: POST-> "/delete-task"
taskRouter.post("/delete-task", authMiddleware, deleteTaskController);

module.exports = taskRouter;
