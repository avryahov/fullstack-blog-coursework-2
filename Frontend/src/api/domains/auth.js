import { apiClient, createAuthorizedConfig, getErrorMessage } from '../client';
import { mapUser } from '../dto';
import { endpoints } from '../endpoints';

export const authApi = {
  authorize: async (login, password) => {
    try {
      const {
        data: { user, token },
      } = await apiClient.post(endpoints.auth.login, { login, password });

      return {
        res: mapUser(user, token),
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
  register: async (login, password) => {
    try {
      const {
        data: { user, token },
      } = await apiClient.post(endpoints.auth.register, { login, password });

      return {
        res: mapUser(user, token),
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
  restoreSession: async token => {
    try {
      const {
        data: { user },
      } = await apiClient.get(endpoints.auth.me, createAuthorizedConfig(token));

      return {
        res: mapUser(user, token),
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
  logout: async () => ({
    res: null,
    error: null,
  }),
};
