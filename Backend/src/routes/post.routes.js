import { Router } from 'express';
import { getPost, getPosts } from '../controllers/post.controller.js';
import { createComment } from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateCommentBody } from '../validation/comment.validation.js';

export const postRouter = Router();

postRouter.get('/', getPosts);
postRouter.get('/:id', getPost);
postRouter.post('/:id/comments', authenticate, validateCommentBody, createComment);
