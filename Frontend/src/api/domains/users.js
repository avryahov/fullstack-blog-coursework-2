import { apiClient, createAuthorizedConfig, getErrorMessage } from '../client';
import { mapUser } from '../dto';
import { endpoints } from '../endpoints';

export const usersApi = {
  fetchUsers: async token => {
    try {
      const {
        data: { users },
      } = await apiClient.get(endpoints.users.list, createAuthorizedConfig(token));

      return {
        res: users.map(user => ({
          ...mapUser(user),
          roleId: user.role?.id || null,
        })),
        error: null,
      };
    } catch (error) {
      return {
        res: [],
        error: getErrorMessage(error),
      };
    }
  },
  updateUserRole: async (token, userId, roleId) => {
    try {
      const {
        data: { user },
      } = await apiClient.patch(endpoints.users.role(userId), { roleId }, createAuthorizedConfig(token));

      return {
        res: {
          ...mapUser(user),
          roleId: user.role?.id || null,
        },
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
  removeUser: async (token, userId) => {
    try {
      await apiClient.delete(endpoints.users.byId(userId), createAuthorizedConfig(token));

      return {
        res: null,
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
};
