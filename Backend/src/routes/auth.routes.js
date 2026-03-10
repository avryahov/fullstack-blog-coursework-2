import { Router } from 'express';
import { getMe, login, register } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateAuthBody } from '../validation/auth.validation.js';

export const authRouter = Router();

authRouter.post('/register', validateAuthBody, register);
authRouter.post('/login', validateAuthBody, login);
authRouter.get('/me', authenticate, getMe);
