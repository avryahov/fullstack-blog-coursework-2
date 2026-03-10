import { getRolesList } from '../services/role.service.js';

export const getRoles = async (_req, res, next) => {
  try {
    const roles = await getRolesList();

    res.status(200).json({
      roles,
    });
  } catch (error) {
    next(error);
  }
};
