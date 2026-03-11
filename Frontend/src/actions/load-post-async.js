import { setPostData } from './set-post-data';

export const loadPostAsync = (requestServer, postId) => dispatch =>
  requestServer(postId).then(postResponse => {
    if (postResponse.res) {
      dispatch(setPostData(postResponse.res));
    }

    return postResponse;
  });
