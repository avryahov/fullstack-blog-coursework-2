import { deleteUserById, getUsersList, updateUserRoleById } from '../services/user.service.js';

export const getUsers = async (_req, res, next) => {
  try {
    const users = await getUsersList();

    res.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await updateUserRoleById({
      userId: req.params.id,
      roleId: req.body.roleId,
    });

    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await deleteUserById(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
