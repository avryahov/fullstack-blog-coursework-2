import { Router } from 'express';
import { deleteUser, getUsers, updateUserRole } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validateUserIdParam, validateUserRoleBody } from '../validation/user.validation.js';

export const userRouter = Router();

userRouter.use(authenticate, authorize(['admin']));

userRouter.get('/', getUsers);
userRouter.patch('/:id/role', validateUserIdParam, validateUserRoleBody, updateUserRole);
userRouter.delete('/:id', validateUserIdParam, deleteUser);
