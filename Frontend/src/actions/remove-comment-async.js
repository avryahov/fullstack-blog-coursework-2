import { setPostData } from './set-post-data';

export const removeCommentAsync = (requestServer, postId, id) => dispatch => {
  requestServer(postId, id).then(postData => {
    if (postData.res) {
      dispatch(setPostData(postData.res));
    }
  });
};
