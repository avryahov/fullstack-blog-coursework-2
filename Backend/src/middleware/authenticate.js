import { findUserById } from '../services/user.service.js';
import { verifyToken } from '../utils/token.js';

export const authenticate = async (req, _res, next) => {
  try {
    const authorizationHeader = req.headers.authorization || '';
    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      throw error;
    }

    const payload = verifyToken(token);
    const user = await findUserById(payload.userId);

    if (!user) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
