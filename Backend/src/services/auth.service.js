import bcrypt from 'bcryptjs';
import { Role } from '../models/index.js';
import { ERROR_MESSAGES, createHttpError } from '../utils/http-error.js';
import { createUser, findUserByLogin, toPublicUser } from './user.service.js';
import { signToken } from '../utils/token.js';

const buildAuthResponse = user => ({
  token: signToken({ userId: user.id }),
  user: toPublicUser(user),
});

export const registerUser = async ({ login, password }) => {
  const existingUser = await findUserByLogin(login);

  if (existingUser) {
    throw createHttpError(409, ERROR_MESSAGES.LOGIN_ALREADY_EXISTS);
  }

  const readerRole = await Role.findOne({ key: 'reader' });

  if (!readerRole) {
    throw createHttpError(500, ERROR_MESSAGES.READER_ROLE_NOT_INITIALIZED);
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
    throw createHttpError(401, ERROR_MESSAGES.INVALID_LOGIN_OR_PASSWORD);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw createHttpError(401, ERROR_MESSAGES.INVALID_LOGIN_OR_PASSWORD);
  }

  return buildAuthResponse(user);
};
