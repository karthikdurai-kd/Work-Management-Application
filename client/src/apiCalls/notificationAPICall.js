// Notifications API Call

import apiCall from "./index";

// Add Notification Backend API Call
export const addNotificationAPICall = (values) => {
  return apiCall("post", "/api/notifications/create-notification", values);
};

// Get Notification Backend API Call
export const getNotificationAPICall = () => {
  return apiCall("get", "/api/notifications/get-notification");
};

// Mark Notification as Read API Call
export const markNotificationReadAPICall = () => {
  return apiCall("post", "/api/notifications/mark-notification-read");
};

// Delete All Notification API Call
export const deleteAllNotificationAPICall = () => {
  return apiCall("delete", "/api/notifications/delete-all-notification");
};
