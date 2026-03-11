import mongoose from 'mongoose';
import { readDatabaseEnv } from '../config/env.js';
import { runMigrations } from '../migrations/runner.js';
import { resetDatabase } from '../migrations/helpers/reset-database.js';

const runReferenceSeed = async () => {
  const env = readDatabaseEnv();

  await mongoose.connect(env.mongoUri);

  await resetDatabase();
  const result = await runMigrations();

  console.log(JSON.stringify(result, null, 2));

  await mongoose.disconnect();
};

runReferenceSeed().catch(async error => {
  console.error('Failed to run reference seed', error);

  try {
    await mongoose.disconnect();
  } catch {}

  process.exit(1);
});
