import { ACTION_TYPE } from '../constant';

export const setUser = user => ({
  type: ACTION_TYPE.SET_USER,
  payload: user,
});
