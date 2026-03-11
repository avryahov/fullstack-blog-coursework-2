import bcrypt from 'bcryptjs';
import { Role, User } from '../models/index.js';
import { legacyRoleIdToKey, loadReferenceDb, parseReferenceDate } from './reference-db.js';

export const id = '002-reference-users';
export const description = 'Import full reference users from author-blog db.json';

export const up = async () => {
  const referenceDb = await loadReferenceDb();
  const roles = await Role.find({});
  const rolesByKey = Object.fromEntries(roles.map(role => [role.key, role]));

  const users = await Promise.all(
    referenceDb.users.map(async user => {
      const roleKey = legacyRoleIdToKey[user.role_id] ?? 'guest';
      const role = rolesByKey[roleKey];

      if (!role) {
        throw new Error(`Reference role "${roleKey}" is not initialized`);
      }

      return {
        sourceId: String(user.id),
        login: user.login,
        passwordHash: await bcrypt.hash(user.password, 10),
        roleId: role.id,
        registeredAt: parseReferenceDate(user.registered_at, '12:00:00'),
      };
    })
  );

  const operations = users.map(user => ({
    updateOne: {
      filter: {
        $or: [{ sourceId: user.sourceId }, { login: user.login }],
      },
      update: {
        $set: {
          sourceId: user.sourceId,
          login: user.login,
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
