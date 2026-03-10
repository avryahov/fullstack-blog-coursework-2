import mongoose from 'mongoose';
import { readDatabaseEnv } from '../config/env.js';
import { Role } from '../models/index.js';
import { roleSeed } from './role-seed.js';

const runSeed = async () => {
  const env = readDatabaseEnv();

  await mongoose.connect(env.mongoUri);

  await Role.deleteMany({});
  await Role.insertMany(roleSeed);

  await mongoose.disconnect();
};

runSeed().catch(error => {
  console.error('Failed to run seed', error);
  process.exit(1);
});
