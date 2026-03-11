import { apiClient, createAuthorizedConfig, getErrorMessage } from '../client';
import { mapRole } from '../dto';
import { endpoints } from '../endpoints';

export const rolesApi = {
  fetchRoles: async token => {
    try {
      const {
        data: { roles },
      } = await apiClient.get(endpoints.roles.list, createAuthorizedConfig(token));

      return {
        res: roles.map(mapRole),
        error: null,
      };
    } catch (error) {
      return {
        res: [],
        error: getErrorMessage(error),
      };
    }
  },
};
