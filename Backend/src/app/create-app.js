import express from 'express';
import cors from 'cors';
import { env } from '../config/env.js';
import { registerRoutes } from '../routes/index.js';
import { notFoundHandler } from '../middleware/not-found-handler.js';
import { errorHandler } from '../middleware/error-handler.js';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    })
  );
  app.use(express.json());

  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
