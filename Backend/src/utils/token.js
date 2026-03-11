import jwt from 'jsonwebtoken';
import { readServerEnv } from '../config/env.js';
import { ERROR_MESSAGES, createHttpError } from './http-error.js';

const getJwtSecret = () => readServerEnv().jwtSecret;

export const signToken = payload => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: '7d',
  });
};

export const verifyToken = token => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    throw createHttpError(401, ERROR_MESSAGES.AUTH_REQUIRED);
  }
};
