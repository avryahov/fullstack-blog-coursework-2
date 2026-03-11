import { ACTION_TYPE } from '../constant';
import { clearAuthData, server } from '../api';

export const logout = () => {
  clearAuthData();
  server.logout();

  return { type: ACTION_TYPE.LOGOUT };
};
