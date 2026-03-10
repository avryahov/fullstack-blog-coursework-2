import { Router } from 'express';
import { getPost, getPosts } from '../controllers/post.controller.js';

export const postRouter = Router();

postRouter.get('/', getPosts);
postRouter.get('/:id', getPost);
