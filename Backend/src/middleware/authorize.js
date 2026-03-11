import { ERROR_MESSAGES, createHttpError } from '../utils/http-error.js';

export const authorize = allowedRoles => (req, _res, next) => {
  const userRole = req.user?.role?.key || req.user?.roleId?.key;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return next(createHttpError(403, ERROR_MESSAGES.FORBIDDEN));
  }

  return next();
};
