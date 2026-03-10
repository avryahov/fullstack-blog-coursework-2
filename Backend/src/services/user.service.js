import { User } from '../models/index.js';

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
