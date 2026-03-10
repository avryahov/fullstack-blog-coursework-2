const isLoginValid = login => /^\w{3,15}$/.test(login);
const isPasswordValid = password => /^[\w#%]{6,30}$/.test(password);

export const validateAuthBody = (req, _res, next) => {
  const { login, password } = req.body || {};

  if (!isLoginValid(login || '')) {
    const error = new Error('Login must be 3-15 chars and contain only letters, numbers and underscore');
    error.statusCode = 400;
    return next(error);
  }

  if (!isPasswordValid(password || '')) {
    const error = new Error('Password must be 6-30 chars and contain only letters, numbers, #, % and underscore');
    error.statusCode = 400;
    return next(error);
  }

  return next();
};
