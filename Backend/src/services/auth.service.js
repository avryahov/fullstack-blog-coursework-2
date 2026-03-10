import bcrypt from 'bcryptjs';
import { Role } from '../models/index.js';
import { createUser, findUserByLogin, toPublicUser } from './user.service.js';
import { signToken } from '../utils/token.js';

const buildAuthResponse = user => ({
  token: signToken({ userId: user.id }),
  user: toPublicUser(user),
});

export const registerUser = async ({ login, password }) => {
  const existingUser = await findUserByLogin(login);

  if (existingUser) {
    const error = new Error('Login already exists');
    error.statusCode = 409;
    throw error;
  }

  const readerRole = await Role.findOne({ key: 'reader' });

  if (!readerRole) {
    const error = new Error('Reader role is not initialized');
    error.statusCode = 500;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const registeredAt = new Date();

  const user = await createUser({
    login,
    passwordHash,
    roleId: readerRole.id,
    registeredAt,
  });

  return buildAuthResponse(user);
};

export const loginUser = async ({ login, password }) => {
  const user = await findUserByLogin(login, { includePasswordHash: true });

  if (!user) {
    const error = new Error('Invalid login or password');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error('Invalid login or password');
    error.statusCode = 401;
    throw error;
  }

  return buildAuthResponse(user);
};
