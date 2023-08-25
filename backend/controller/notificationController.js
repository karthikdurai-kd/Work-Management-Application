// Notification Controller

const Notifcation = require("../model/Notification");
const appErr = require("../utils/appErr");

// Create Notification controller
const createNotificationController = async (req, res, next) => {
  try {
    // Step-1: Create Notification with "req.body"
    const notification = await Notifcation.create(req.body);
    // Step-2: Send the response to the user
    res.status(200).json({
      status: "success",
      message: "Notification created successfully",
      data: notification,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj); // Control will be transferred to Express JS Error Handling Middleware [globalErrorHandler.js file]
  }
};

// Get Notification controller
const getNotificationController = async (req, res) => {
  try {
    const { userID } = req; // "userID" is added in "req" object by the "authMiddleware"
    // Step-1: Get the notification that is realted to the logged in user. Logged In user's userID can be obtained from "authMiddleware"
    const notificationsForUser = await Notifcation.find({ user: userID }).sort({
      createdAt: -1,
    }); // Sorting the notification fetched from Databse in descending order [-1 indicates descending, 1 indicated ascending]
    // Step-2: Send the response to the user
    res.status(200).json({
      status: "success",
      message: "Notification fetched successfully",
      data: notificationsForUser,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj); // Control will be transferred to Express JS Error Handling Middleware [globalErrorHandler.js file]
  }
};

// Mark notifications as read controller
const markNotificationsReadController = async (req, res, next) => {
  try {
    // Step-1: Mark the notifiation of the loggedin user [we can get req.userID appended by the authMiddleware] and change all the notification whose "read" fields is "false" to "true"
    await Notifcation.updateMany(
      {
        user: req.userID, // Both the condition must satisfy [user-userID, read-false]
        read: false,
      },
      { read: true } // If the both the condition is met, then read is set to true for that record
    );
    // Step-2: Find the updated notifications of the logged in user
    const updatedNotifications = await Notifcation.find({
      user: req.userID,
    }).sort({ createdAt: -1 });
    // Step-3: Send the response to front-end
    res.status(200).json({
      status: "success",
      message: "Notifications marked as read",
      data: updatedNotifications,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// Delete All Notification controller
const deleteAllNotificationController = async (req, res, next) => {
  try {
    // Step-1: Delete All Notifications of the that logged in user using "req.userID" appended by "authMiddleware"
    await Notifcation.deleteMany({
      user: req.userID,
    });
    // Step-2: Send the response to the user
    res.status(200).json({
      status: "success",
      message: "All Notifications of the user deleted successfuly",
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

module.exports = {
  createNotificationController,
  getNotificationController,
  markNotificationsReadController,
  deleteAllNotificationController,
};
