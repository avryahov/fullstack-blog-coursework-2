import { Comment, User } from '../models/index.js';
import { findRoleById, findRoleByKey } from './role.service.js';

const userPopulate = {
  path: 'roleId',
  select: 'key name',
};

export const toPublicUser = user => ({
  id: user.id,
  login: user.login,
  role: user.roleId
    ? {
        id: user.roleId.id,
        key: user.roleId.key,
        name: user.roleId.name,
      }
    : null,
  registeredAt: user.registeredAt,
});

export const createUser = async data => {
  const user = await User.create(data);

  return User.findById(user.id).populate(userPopulate);
};

export const findUserByLogin = async (login, options = {}) => {
  const query = User.findOne({ login }).populate(userPopulate);

  if (!options.includePasswordHash) {
    query.select('-passwordHash');
  }

  return query;
};

export const findUserById = async userId => {
  return User.findById(userId).select('-passwordHash').populate(userPopulate);
};

export const getUsersList = async () => {
  const users = await User.find().select('-passwordHash').populate(userPopulate).sort({ registeredAt: -1, createdAt: -1 });

  return users.map(toPublicUser);
};

const ensureNotLastAdmin = async user => {
  if (user.roleId?.key !== 'admin') {
    return;
  }

  const adminRole = await findRoleByKey('admin');

  if (!adminRole) {
    return;
  }

  const adminCount = await User.countDocuments({ roleId: adminRole.id });

  if (adminCount <= 1) {
    const error = new Error('At least one admin user must remain');
    error.statusCode = 409;
    throw error;
  }
};

export const updateUserRoleById = async ({ userId, roleId }) => {
  const [user, nextRole] = await Promise.all([User.findById(userId).populate(userPopulate), findRoleById(roleId)]);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (!nextRole) {
    const error = new Error('Role not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.roleId?.id === nextRole.id) {
    return toPublicUser(user);
  }

  await ensureNotLastAdmin(user);

  user.roleId = nextRole.id;
  await user.save();

  const updatedUser = await User.findById(user.id).select('-passwordHash').populate(userPopulate);

  return toPublicUser(updatedUser);
};

export const deleteUserById = async userId => {
  const user = await User.findById(userId).populate(userPopulate);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  await ensureNotLastAdmin(user);

  await Promise.all([Comment.deleteMany({ authorId: user.id }), User.findByIdAndDelete(user.id)]);
};
