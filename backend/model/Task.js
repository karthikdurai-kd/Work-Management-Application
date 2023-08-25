// Task Model

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Project ID will be saved in this field and it refers the "Project Model"
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User ID will be saved in this field and it refers the "User Model"
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User ID will be saved in this field and it refers the "User Model"
    },
    attachments: {
      // Here file attachments like image, link for that task can be saved
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
