import { healthRouter } from './health.routes.js';

export const registerRoutes = app => {
  app.use('/api/health', healthRouter);
};
