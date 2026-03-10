import { ACTION_TYPE } from '../constant';

export const setPostData = postData => {
  return {
    type: ACTION_TYPE.SET_POST_DATA,
    payload: postData,
  };
};
