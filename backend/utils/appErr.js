// This function is used to create error object

const appErr = (message, statusCode) => {
  // Creating Error object
  const err = new Error(message);
  err.statusCode = statusCode;
  err.status = "failed";
  return err;
};

module.exports = appErr;
