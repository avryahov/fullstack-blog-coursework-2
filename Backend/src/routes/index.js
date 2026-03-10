import { authRouter } from './auth.routes.js';
import { commentRouter } from './comment.routes.js';
import { healthRouter } from './health.routes.js';
import { postRouter } from './post.routes.js';
import { roleRouter } from './role.routes.js';
import { userRouter } from './user.routes.js';

export const registerRoutes = app => {
  app.use('/api/auth', authRouter);
  app.use('/api/comments', commentRouter);
  app.use('/api/health', healthRouter);
  app.use('/api/posts', postRouter);
  app.use('/api/roles', roleRouter);
  app.use('/api/users', userRouter);
};
