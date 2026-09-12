// Error middleware

export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  console.log(err);

  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
};
