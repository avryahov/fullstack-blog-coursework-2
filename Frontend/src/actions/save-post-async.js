import { setPostData } from './set-post-data';

export const savePostAsync = (requestServer, newPostData) => dispatch =>
  requestServer(newPostData).then(updatedPost => {
    if (updatedPost.res) {
      dispatch(setPostData(updatedPost.res));
    }

    return updatedPost.res;
  });
