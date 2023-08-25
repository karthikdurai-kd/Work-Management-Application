// Task Controller

const Task = require("../model/Task");
const appErr = require("../utils/appErr");

// Create Task Controller
const createTaskController = async (req, res, next) => {
  try {
    // Step-1: Create Task by saving the "req.body" data
    const task = await Task.create(req.body);
    // Step-2: Send the response data
    res.status(201).json({
      status: "success",
      message: "Task created successfully",
      data: task,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj); // Control will be transferred to ExpressJS Error handler [globalErrorHandler.js]
  }
};

// Get Tasks based on filters controller
const getTasksController = async (req, res, next) => {
  const { filters } = req.body;
  // Removing Filter is value is "All"
  try {
    if (filters.status === "All") {
      delete filters.status;
    }
    if (filters.assignedTo === "All") {
      delete filters.assignedTo;
    }
    if (filters.assignedBy === "All") {
      delete filters.assignedBy;
    }

    // Step-1: Get the tasks from Database based on filters
    const tasks = await Task.find(req.body.filters)
      .populate([
        // Expanding all ID with respective model data
        {
          path: "project",
        },
        {
          path: "assignedTo",
        },
        {
          path: "assignedBy",
        },
      ])
      .sort({ createdAt: -1 }); // Here "filters" will be sent by front-end which specifies type of tasks to be fetched

    // Step-2: Send the response to the front-end
    res.status(200).json({
      status: "success",
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj); // Control will be transferred to ExpressJS Error handler [globalErrorHandler.js]
  }
};

// Update Task Controller
const updateTaskController = async (req, res, next) => {
  try {
    // Step-1: Find the task by ID and update with "req.body" data sent from front-end
    await Task.findByIdAndUpdate(req.body._id, req.body);
    // Step-2: Send the response to the front-end
    res.status(200).json({
      status: "success",
      message: "Task updated successfully",
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj); // Control will be transferred to ExpressJS Error handler [globalErrorHandler.js]
  }
};

// Delete Task Controller
const deleteTaskController = async (req, res) => {
  try {
    const { taskID } = req.body;
    // Step-1: Find the task by ID and delete from database
    await Task.findByIdAndDelete(taskID);
    // Step-2: Send the response to front-end
    res.status(200).json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj); // Control will be transferred to ExpressJS Error handler [globalErrorHandler.js]
  }
};

module.exports = {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
};
