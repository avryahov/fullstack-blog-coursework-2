import mongoose from 'mongoose';

export const validateUserIdParam = (req, _res, next) => {
  if (!mongoose.isValidObjectId(req.params?.id)) {
    const error = new Error('User id is invalid');
    error.statusCode = 400;
    return next(error);
  }

  return next();
};

export const validateUserRoleBody = (req, _res, next) => {
  const roleId = typeof req.body?.roleId === 'string' ? req.body.roleId.trim() : '';

  if (!roleId) {
    const error = new Error('roleId is required');
    error.statusCode = 400;
    return next(error);
  }

  if (!mongoose.isValidObjectId(roleId)) {
    const error = new Error('roleId is invalid');
    error.statusCode = 400;
    return next(error);
  }

  return next();
};
