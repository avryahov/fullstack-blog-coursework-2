import { apiClient, createAuthorizedConfig, getErrorMessage } from '../client';
import { mapPost } from '../dto';
import { endpoints } from '../endpoints';

export const postsApi = {
  fetchPosts: async (searchPhrase, page, limit) => {
    try {
      const { data } = await apiClient.get(endpoints.posts.list, {
        params: {
          search: searchPhrase,
          page,
          limit,
        },
      });

      return {
        res: {
          posts: data.posts.map(mapPost),
          count: data.pagination.pages,
        },
        error: null,
      };
    } catch (error) {
      return {
        res: {
          posts: [],
          count: 0,
        },
        error: getErrorMessage(error),
      };
    }
  },
  fetchPost: async postId => {
    try {
      const {
        data: { post },
      } = await apiClient.get(endpoints.posts.byId(postId));

      return {
        res: mapPost(post),
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
  savePost: async (token, newPostData) => {
    if (newPostData.id) {
      try {
        const {
          data: { post },
        } = await apiClient.patch(
          endpoints.posts.update(newPostData.id),
          {
            title: newPostData.title,
            imageUrl: newPostData.imageUrl,
            content: newPostData.content,
          },
          createAuthorizedConfig(token)
        );

        return {
          res: mapPost(post),
          error: null,
        };
      } catch (error) {
        return {
          res: null,
          error: getErrorMessage(error),
        };
      }
    }

    try {
      const {
        data: { post },
      } = await apiClient.post(
        endpoints.posts.list,
        {
          title: newPostData.title,
          imageUrl: newPostData.imageUrl,
          content: newPostData.content,
        },
        createAuthorizedConfig(token)
      );

      return {
        res: mapPost(post),
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
  removePost: async (token, postId) => {
    try {
      await apiClient.delete(endpoints.posts.remove(postId), createAuthorizedConfig(token));

      return {
        res: null,
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
};
