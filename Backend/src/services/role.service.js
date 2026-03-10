import { Role } from '../models/index.js';

const toRoleItem = role => ({
  id: role.id,
  key: role.key,
  name: role.name,
});

export const getRolesList = async () => {
  const roles = await Role.find().sort({ createdAt: 1, key: 1 });

  return roles.map(toRoleItem);
};

export const findRoleById = async roleId => {
  return Role.findById(roleId);
};

export const findRoleByKey = async roleKey => {
  return Role.findOne({ key: roleKey });
};
