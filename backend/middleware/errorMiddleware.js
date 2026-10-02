// 404 Handler for undefined API routes
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found - [${req.method}] ${req.originalUrl}`
  });
};

// Centralized Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(`[Server Error]: ${err.message}`, err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
