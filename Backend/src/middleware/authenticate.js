import { findUserById } from '../services/user.service.js';
import { ERROR_MESSAGES, createHttpError } from '../utils/http-error.js';
import { verifyToken } from '../utils/token.js';

export const authenticate = async (req, _res, next) => {
  try {
    const authorizationHeader = req.headers.authorization || '';
    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw createHttpError(401, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const payload = verifyToken(token);
    const user = await findUserById(payload.userId);

    if (!user) {
      throw createHttpError(401, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
