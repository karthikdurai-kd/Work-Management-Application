// Project Routes
const projectRouter = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createProjectController,
  getProjectController,
  editProjectController,
  deleteProjectController,
  getProjectBasedOnUserRoleController,
  getProjectByIdController,
  addProjectMemberController,
  deleteProjectMemberController,
} = require("../controller/projectController");

// Base API - "/api/projects"

// Create Project API: POST-> "/create-project"
projectRouter.post("/create-project", authMiddleware, createProjectController);

// Get Projects API: POST-> "/get-project"
projectRouter.post("/get-project", authMiddleware, getProjectController);

// Get Projects based on user role: POST-> "/get-project-user-role"
projectRouter.post(
  "/get-project-user-role",
  authMiddleware,
  getProjectBasedOnUserRoleController
);

// Get Projects based on projectID: GET-> "/:id"
projectRouter.get("/:id", authMiddleware, getProjectByIdController);

// Edir Project API: POST-> "/edit-project"
projectRouter.post("/edit-project", authMiddleware, editProjectController);

// Delete Project API: POST-> "/delete-project"
projectRouter.post("/delete-project", authMiddleware, deleteProjectController);

// Add Project Member API: POST-> "/add-project-member"
projectRouter.post("/add-project-member", addProjectMemberController);

// Delete Member from Project API: POST-> "/delete-member"
projectRouter.post(
  "/delete-project-member",
  authMiddleware,
  deleteProjectMemberController
);

module.exports = projectRouter;
