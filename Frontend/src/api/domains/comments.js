import { apiClient, createAuthorizedConfig, getErrorMessage } from '../client';
import { endpoints } from '../endpoints';
import { postsApi } from './posts';

export const commentsApi = {
  addComment: async (token, postId, content) => {
    try {
      await apiClient.post(endpoints.posts.comments(postId), { content }, createAuthorizedConfig(token));

      return postsApi.fetchPost(postId);
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
  removePostComment: async (token, postId, commentId) => {
    try {
      await apiClient.delete(endpoints.comments.byId(commentId), createAuthorizedConfig(token));

      return postsApi.fetchPost(postId);
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
};
