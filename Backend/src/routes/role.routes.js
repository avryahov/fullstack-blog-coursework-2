import { Router } from 'express';
import { getRoles } from '../controllers/role.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

export const roleRouter = Router();

roleRouter.get('/', authenticate, authorize(['admin']), getRoles);
