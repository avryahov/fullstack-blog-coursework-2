import jwt from 'jsonwebtoken';
import { readServerEnv } from '../config/env.js';

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
    const error = new Error('Authentication required');
    error.statusCode = 401;
    throw error;
  }
};
