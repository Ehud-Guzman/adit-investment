// src/middleware/errorMiddleware.js

export const errorHandler = (err, req, res, next) => {
  console.error(`[${req.requestId}] ❌ Error:`, err.message);
  res.status(500).json({
    message: "An unexpected error occurred.",
    error: err.message,
  });
};
