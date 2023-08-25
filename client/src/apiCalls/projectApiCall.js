// API Call for projects

import apiCall from "./index";

// Calling "/api/projects/create-project" API from backend
export const createProjectAPICall = (values) => {
  return apiCall("post", "/api/projects/create-project", values);
};

// Calling "/api/projects/get-project" API from backend
export const getProjectAPICall = (values) => {
  return apiCall("post", "/api/projects/get-project", values);
};

// Calling "api/projects/get-project-user-role" API from backend
export const getProjectBasedOnUserRoleCall = (values) => {
  return apiCall("post", "/api/projects/get-project-user-role", values);
};

// Calling "api/projects/id" API from backend [Getting Project by ID]
export const getProjectByIDAPICall = (id) => {
  return apiCall("get", `/api/projects/${id}`);
};

// Calling "/api/projects/edit-project" API from backend
export const editProjectAPICall = (values) => {
  return apiCall("post", "/api/projects/edit-project", values);
};

// Calling "/api/projects/delete-project" API from backend
export const deleteProjectAPICall = (values) => {
  return apiCall("post", "/api/projects/delete-project", {
    _id: values,
  });
};

// Calling "/api/projects/add-project-member" API from backend
export const addProjectMemberAPICall = (values) => {
  return apiCall("post", "/api/projects/add-project-member", values);
};

// Calling "/api/projects/delete-project-member" API from backend
export const deleteProjectMemberAPICall = (values) => {
  return apiCall("post", "/api/projects/delete-project-member", values);
};
