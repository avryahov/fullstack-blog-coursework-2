import { setPostData } from './set-post-data';

export const addCommentAsync = (requestServer, postId, content) => dispatch => {
  requestServer('addComment', postId, content).then(postData => {
    if (postData.res) {
      dispatch(setPostData(postData.res));
    }
  });
};
