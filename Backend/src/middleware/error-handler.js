export const errorHandler = (error, _req, res, _next) => {
  if (!error.statusCode || error.statusCode >= 500) {
    console.error(error);
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Internal server error',
  });
};
