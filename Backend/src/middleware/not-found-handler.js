import { ERROR_MESSAGES } from '../utils/http-error.js';

export const notFoundHandler = (_req, res) => {
  res.status(404).json({
    error: ERROR_MESSAGES.ROUTE_NOT_FOUND,
  });
};
