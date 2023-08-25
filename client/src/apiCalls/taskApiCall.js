// Task API Calls

import apiCall from "./index";

// Create Task API Call
export const createTaskAPICall = (values) => {
  return apiCall("post", "/api/tasks/create-task", values);
};

// Get Task API Call
export const getTasksAPICall = (filters) => {
  return apiCall("post", "/api/tasks/get-tasks", filters);
};

// Update Task API Call
export const updateTaskAPICall = (values) => {
  return apiCall("post", "/api/tasks/update-task", values);
};

// Delete Task API Call
export const deleteTaskAPICall = (values) => {
  return apiCall("post", "/api/tasks/delete-task", values);
};
