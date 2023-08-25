// Notifcation Routes APIs

const notificationRouter = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createNotificationController,
  getNotificationController,
  markNotificationsReadController,
  deleteAllNotificationController,
} = require("../controller/notificationController");

// Base API URL - "/api/notifications"

// Create Notification: POST-> "/create-notification"
notificationRouter.post(
  "/create-notification",
  authMiddleware,
  createNotificationController
);

// Get All notification related to the logged in user controller: GET-> "/get-notification"
notificationRouter.get(
  "/get-notification",
  authMiddleware,
  getNotificationController
);

// Mark Notifications as read of the logged in user: POST-> "/mark-notification-read"
notificationRouter.post(
  "/mark-notification-read",
  authMiddleware,
  markNotificationsReadController
);

// Delete All Notification of he loggedin user: DELETE-> "/delete-all-notification"
notificationRouter.delete(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

module.exports = notificationRouter;
