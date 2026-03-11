import { ACTION_TYPE } from '../constant';
import { authApi, clearAuthData } from '../api';

export const logout = () => {
  clearAuthData();
  authApi.logout();

  return { type: ACTION_TYPE.LOGOUT };
};
