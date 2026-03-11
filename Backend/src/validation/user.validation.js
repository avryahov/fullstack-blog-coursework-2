import mongoose from 'mongoose';
import { ERROR_MESSAGES, createHttpError } from '../utils/http-error.js';

export const validateUserIdParam = (req, _res, next) => {
  if (!mongoose.isValidObjectId(req.params?.id)) {
    return next(createHttpError(400, ERROR_MESSAGES.USER_ID_INVALID));
  }

  return next();
};

export const validateUserRoleBody = (req, _res, next) => {
  const roleId = typeof req.body?.roleId === 'string' ? req.body.roleId.trim() : '';

  if (!roleId) {
    return next(createHttpError(400, ERROR_MESSAGES.ROLE_ID_REQUIRED));
  }

  if (!mongoose.isValidObjectId(roleId)) {
    return next(createHttpError(400, ERROR_MESSAGES.ROLE_ID_INVALID));
  }

  return next();
};
