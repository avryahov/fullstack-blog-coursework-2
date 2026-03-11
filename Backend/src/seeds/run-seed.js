import mongoose from 'mongoose';
import { readDatabaseEnv } from '../config/env.js';
import { resetDatabase } from '../migrations/helpers/reset-database.js';
import { runMigrations } from '../migrations/runner.js';

const runSeed = async () => {
  const env = readDatabaseEnv();

  await mongoose.connect(env.mongoUri);

  await resetDatabase();
  const result = await runMigrations();

  console.log(JSON.stringify(result, null, 2));

  await mongoose.disconnect();
};

runSeed().catch(error => {
  console.error('Failed to run seed', error);
  process.exit(1);
});
