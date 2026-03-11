import { ACTION_TYPE } from '../constant';

export const openModal = modalParams => ({
  type: ACTION_TYPE.OPEN_MODAL,
  payload: modalParams,
});
