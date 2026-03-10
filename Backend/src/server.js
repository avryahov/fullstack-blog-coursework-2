import { createApp } from './app/create-app.js';
import { readServerEnv } from './config/env.js';
import { connectDatabase } from './config/database.js';

const startServer = async () => {
  const env = readServerEnv();

  await connectDatabase(env.mongoUri);

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Backend listening on port ${env.port}`);
  });
};

startServer().catch(error => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
