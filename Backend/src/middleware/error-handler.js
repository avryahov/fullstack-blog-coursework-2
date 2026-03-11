import { ERROR_MESSAGES } from '../utils/http-error.js';

export const errorHandler = (error, _req, res, _next) => {
  if (error.name === 'CastError') {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_IDENTIFIER,
    });
  }

  if (!error.statusCode || error.statusCode >= 500) {
    console.error(error);
  }

  res.status(error.statusCode || 500).json({
    error: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
};
