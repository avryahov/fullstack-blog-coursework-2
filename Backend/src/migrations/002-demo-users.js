import { Role, User } from '../models/index.js';
import { buildUserSeed } from '../seeds/user-seed.js';

export const id = '002-demo-users';
export const description = 'Ensure demo users exist with expected roles and credentials';

export const up = async () => {
  const roles = await Role.find({});
  const rolesByKey = Object.fromEntries(roles.map(role => [role.key, role]));
  const users = await buildUserSeed(rolesByKey);

  const operations = users.map(user => ({
    updateOne: {
      filter: { login: user.login },
      update: {
        $set: {
          passwordHash: user.passwordHash,
          roleId: user.roleId,
          registeredAt: user.registeredAt,
        },
      },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await User.bulkWrite(operations);
  }
};
