import { Role } from '../models/index.js';
import { roleSeed } from '../seeds/role-seed.js';

export const id = '001-core-roles';
export const description = 'Create core roles for ACL and auth flows';

export const up = async () => {
  const operations = roleSeed.map(role => ({
    updateOne: {
      filter: { key: role.key },
      update: {
        $set: {
          name: role.name,
        },
        $setOnInsert: {
          key: role.key,
        },
      },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await Role.bulkWrite(operations);
  }
};
