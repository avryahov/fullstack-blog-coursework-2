import { Router } from 'express';
import { deleteComment } from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

export const commentRouter = Router();

commentRouter.delete('/:id', authenticate, authorize(['admin', 'moder']), deleteComment);
