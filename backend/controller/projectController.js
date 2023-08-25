// Project Controller

const Project = require("../model/Project");
const User = require("../model/User");
const appErr = require("../utils/appErr");

// 1. CreateProject Controller
const createProjectController = async (req, res, next) => {
  try {
    // Step-1: Save the data sent from front-end [req.body] into database model [Project]
    const project = await Project.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Project created successfully",
      data: project,
    });
    // Step-2: Send the response to the user
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// 2.getProject based on filters Controller
const getProjectController = async (req, res, next) => {
  try {
    // Step-1: Get the project rom database according to the filters sent by front-end
    const filters = req.body;
    const projectFromDatabase = await Project.find(filters || {}).sort({
      createdAt: -1, // Sorting the data in descending order of createdDate and sending data to front-end. Refer https://chat.openai.com/share/32e3453b-afb9-43a7-bf2a-9256e44fa0c1
    }); // Getting project from Database according to filter or if there is no filter sent from front-end fetch all the project from database
    // Step-2: Send the response to the front-end
    res.status(200).json({
      status: "success",
      message: "Project fetched successfully",
      data: projectFromDatabase,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// 3. getProjectById Controller
const getProjectByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Step-1: Get the project by ID from Database
    const project = await Project.findById(id).populate([
      {
        path: "owner",
      },
      {
        path: "members",
        populate: {
          path: "user",
        },
      },
    ]); // Populating [expanding] owner and member fields from project data

    // Step-2: Send the response to the user
    res.status(200).json({
      status: "success",
      message: "Project fetched successfully",
      data: project,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// 4. getProjectBasedOnUserRole Controller
const getProjectBasedOnUserRoleController = async (req, res, next) => {
  try {
    const { userID } = req.body;
    // Step-1: Get the project from Database based on user role
    const projects = await Project.find({ "members.user": userID })
      .populate("owner") // Expanding owner field with actual owner data from "User" model.
      .sort({ createdAt: -1 });

    // Step-2: Send the response to the user
    res.status(200).json({
      status: "success",
      message: "Projects for the user found successfully",
      data: projects,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// 5. editProject Controller
const editProjectController = async (req, res, next) => {
  try {
    // Step-1: Find the project by ID and update. Here "ID" of the project is sent from front-end in "req.body"
    const editProject = await Project.findByIdAndUpdate(req.body._id, req.body);
    // Step-2: Send the response to the front-end
    res.status(200).json({
      status: "success",
      message: "Project Updated Successfully",
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// 6. deleteProject Controller
const deleteProjectController = async (req, res, next) => {
  try {
    // Step-1: Find the project by ID and delete. Here "ID" of the project is sent from front-end in "req.body"
    const deleteProject = await Project.findByIdAndDelete(req.body._id);
    // Step-2: Send the response to the front-end
    res.status(200).json({
      status: "success",
      message: "Project deleted successfully",
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// 7. addProjectMember Controller
const addProjectMemberController = async (req, res, next) => {
  try {
    const { memberEmailID, memberRole, projectID } = req.body;
    // Step-1: Check whether user exists in "user model" with the help of email ID. If user does not exists, send error response
    const memberInDatabase = await User.findOne({ email: memberEmailID });
    if (!memberInDatabase) {
      const memberNotFoundErrorObj = appErr("User not found", 404);
      return next(memberNotFoundErrorObj);
    }
    // Step-2: Find the project from database [project model] and psuh the project member into "members" field of project model
    await Project.findByIdAndUpdate(projectID, {
      $push: {
        members: {
          user: memberInDatabase._id,
          role: memberRole,
        },
      },
    });
    // Step-3: Send the response to the user
    res.status(200).json({
      status: "success",
      message: "Project member added successully to the project",
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// 8. deleteProjectMember Controller
const deleteProjectMemberController = async (req, res, next) => {
  try {
    const { memberID, projectID } = req.body;
    // Step-1: Find the member in the project and remove from "members" field
    await Project.findByIdAndUpdate(projectID, {
      $pull: {
        members: {
          // Removing the particular user from the members field. Pull is used to remove a particular record. Refer - https://chat.openai.com/share/22d3fa5e-3306-47d6-8991-4effe501ebc9
          _id: memberID,
        },
      },
    });
    // Step-2: Send the response to the front-end
    res.status(200).json({
      status: "success",
      message: "Member removed sucessfully",
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

module.exports = {
  createProjectController,
  getProjectController,
  editProjectController,
  deleteProjectController,
  getProjectBasedOnUserRoleController,
  getProjectByIdController,
  addProjectMemberController,
  deleteProjectMemberController,
};
