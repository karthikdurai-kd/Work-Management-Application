// This is base templtate function for API Calls

import axios from "axios";

const apiCall = async (method, url, payload) => {
  try {
    const res = await axios({
      method,
      url,
      data: payload,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data; // Sending the response data got from backend
  } catch (err) {
    return err.response.data;
  }
};

export default apiCall;
