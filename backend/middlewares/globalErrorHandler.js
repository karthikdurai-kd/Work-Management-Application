// This is Global Error Handler function

const globalErrorHandler = (err, req, res, next) => {
  const errorStatusCode = err.statusCode || 500;
  const errStatus = err.status || "failed";
  const errMessage = err.message || "Unexpected Failure!!!";

  res.status(errorStatusCode).json({
    status: errStatus,
    message: errMessage,
  });
};

module.exports = globalErrorHandler;
