import mongoose from 'mongoose';
import { readDatabaseEnv } from '../config/env.js';
import { runMigrations } from './runner.js';

const run = async () => {
  const env = readDatabaseEnv();

  await mongoose.connect(env.mongoUri);

  const result = await runMigrations();

  console.log(JSON.stringify(result, null, 2));

  await mongoose.disconnect();
};

run().catch(async error => {
  console.error('Failed to run migrations', error);

  try {
    await mongoose.disconnect();
  } catch {}

  process.exit(1);
});
