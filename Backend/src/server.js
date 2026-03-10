import { createApp } from './app/create-app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

const startServer = async () => {
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Backend listening on port ${env.port}`);
  });
};

startServer().catch(error => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
