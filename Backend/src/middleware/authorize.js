export const authorize = allowedRoles => (req, _res, next) => {
  const userRole = req.user?.role?.key;

  if (!userRole || !allowedRoles.includes(userRole)) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    return next(error);
  }

  return next();
};
