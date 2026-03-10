import { Router } from 'express';
import { createPost, getPost, getPosts } from '../controllers/post.controller.js';
import { createComment } from '../controllers/comment.controller.js';
import { authorize } from '../middleware/authorize.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateCommentBody } from '../validation/comment.validation.js';
import { validatePostBody } from '../validation/post.validation.js';

export const postRouter = Router();

postRouter.get('/', getPosts);
postRouter.get('/:id', getPost);
postRouter.post('/', authenticate, authorize(['admin']), validatePostBody, createPost);
postRouter.post('/:id/comments', authenticate, validateCommentBody, createComment);
