import apiCall from "./index"; // importing Base API Call function

// User Register API Call
export const userRegisterAPI = async (payload) => {
  return apiCall("post", "/api/users/register", payload);
};

// User Login API Call
export const userLoginAPI = async (payload) => {
  return apiCall("post", "/api/users/login", payload);
};

// User Profile View API Call
export const userProfileAPI = () => {
  return apiCall("get", "/api/users/profile", null);
};
