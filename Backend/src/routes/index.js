import { authRouter } from './auth.routes.js';
import { healthRouter } from './health.routes.js';
import { postRouter } from './post.routes.js';

export const registerRoutes = app => {
  app.use('/api/auth', authRouter);
  app.use('/api/health', healthRouter);
  app.use('/api/posts', postRouter);
};
