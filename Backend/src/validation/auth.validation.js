import { ERROR_MESSAGES, createHttpError } from '../utils/http-error.js';

const isLoginValid = login => /^\w{3,15}$/.test(login);
const isPasswordValid = password => /^[\w#%]{6,30}$/.test(password);

export const validateAuthBody = (req, _res, next) => {
  const { login, password } = req.body || {};

  if (!isLoginValid(login || '')) {
    return next(createHttpError(400, ERROR_MESSAGES.LOGIN_VALIDATION));
  }

  if (!isPasswordValid(password || '')) {
    return next(createHttpError(400, ERROR_MESSAGES.PASSWORD_VALIDATION));
  }

  return next();
};
