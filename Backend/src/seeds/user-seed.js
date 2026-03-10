import bcrypt from 'bcryptjs';

const seedUsers = [
  {
    login: 'admin',
    password: 'Admin#123',
    roleKey: 'admin',
  },
  {
    login: 'moder',
    password: 'Moder#123',
    roleKey: 'moder',
  },
  {
    login: 'reader',
    password: 'Reader#123',
    roleKey: 'reader',
  },
];

export const buildUserSeed = async rolesByKey => {
  const registeredAt = new Date();

  return Promise.all(
    seedUsers.map(async user => ({
      login: user.login,
      passwordHash: await bcrypt.hash(user.password, 10),
      roleId: rolesByKey[user.roleKey].id,
      registeredAt,
    }))
  );
};
