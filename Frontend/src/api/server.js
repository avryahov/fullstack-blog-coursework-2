import { apiClient, createAuthorizedConfig, getErrorMessage } from './client';
import { mapPost, mapRole, mapUser } from './dto';
import { endpoints } from './endpoints';

export const server = {
  authorize: async (login, password) => {
    try {
      const {
        data: { user, token },
      } = await apiClient.post(endpoints.auth.login, { login, password });

      return {
        res: mapUser(user, token),
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
  register: async (login, password) => {
    try {
      const {
        data: { user, token },
      } = await apiClient.post(endpoints.auth.register, { login, password });

      return {
        res: mapUser(user, token),
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
  restoreSession: async token => {
    try {
      const {
        data: { user },
      } = await apiClient.get(endpoints.auth.me, createAuthorizedConfig(token));

      return {
        res: mapUser(user, token),
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
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
  addComment: async (token, postId, content) => {
    try {
      await apiClient.post(
        endpoints.posts.comments(postId),
        { content },
        createAuthorizedConfig(token)
      );

      return server.fetchPost(postId);
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

      return server.fetchPost(postId);
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
  fetchUsers: async token => {
    try {
      const {
        data: { users },
      } = await apiClient.get(endpoints.users.list, createAuthorizedConfig(token));

      return {
        res: users.map(user => ({
          ...mapUser(user),
          roleId: user.role?.id || null,
        })),
        error: null,
      };
    } catch (error) {
      return {
        res: [],
        error: getErrorMessage(error),
      };
    }
  },
  fetchRoles: async token => {
    try {
      const {
        data: { roles },
      } = await apiClient.get(endpoints.roles.list, createAuthorizedConfig(token));

      return {
        res: roles.map(mapRole),
        error: null,
      };
    } catch (error) {
      return {
        res: [],
        error: getErrorMessage(error),
      };
    }
  },
  updateUserRole: async (token, userId, roleId) => {
    try {
      const {
        data: { user },
      } = await apiClient.patch(endpoints.users.role(userId), { roleId }, createAuthorizedConfig(token));

      return {
        res: {
          ...mapUser(user),
          roleId: user.role?.id || null,
        },
        error: null,
      };
    } catch (error) {
      return {
        res: null,
        error: getErrorMessage(error),
      };
    }
  },
  removeUser: async (token, userId) => {
    try {
      await apiClient.delete(endpoints.users.byId(userId), createAuthorizedConfig(token));

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
  savePost: async (token, newPostData) => {
    if (newPostData.id) {
      return {
        res: null,
        error: 'Редактирование постов будет сделано на следующем этапе',
      };
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
  logout: async () => ({
    res: null,
    error: null,
  }),
};
