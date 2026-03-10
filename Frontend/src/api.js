import axios from 'axios';
import { ROLE } from './constant';

const API_URL = `${window.location.protocol}//${window.location.hostname}:3001/api`;
const AUTH_STORAGE_KEY = 'authData';

const formatDate = value => {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const getErrorMessage = error =>
  error.response?.data?.error || error.message || 'Что-то пошло не так. Попробуйте позднее.';

const createAuthorizedConfig = token => ({
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {},
});

const mapRole = role => ({
  id: role.id,
  key: role.key,
  name: role.name,
});

const mapUser = (user, token = null) => ({
  id: user.id,
  login: user.login,
  roleId: user.role?.key || ROLE.GUEST,
  role: user.role ? mapRole(user.role) : null,
  registeredAt: user.registeredAt ? formatDate(user.registeredAt) : '',
  session: token,
});

const mapComment = comment => ({
  id: comment.id,
  author: comment.author || 'Unknown',
  authorId: comment.authorId,
  postId: comment.postId,
  content: comment.content,
  publishedAt: formatDate(comment.publishedAt),
});

const mapPost = post => ({
  id: post.id,
  title: post.title,
  imageUrl: post.imageUrl || '',
  content: post.content || '',
  publishedAt: formatDate(post.publishedAt),
  comments: post.comments ? post.comments.map(mapComment) : [],
  commentsCount: typeof post.commentsCount === 'number' ? post.commentsCount : null,
});

export const readAuthData = () => {
  const rawAuthData = sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawAuthData) {
    return null;
  }

  try {
    return JSON.parse(rawAuthData);
  } catch (_error) {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    return null;
  }
};

export const saveAuthData = token => {
  sessionStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token,
    })
  );
};

export const clearAuthData = () => {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
};

export const server = {
  authorize: async (login, password) => {
    try {
      const {
        data: { user, token },
      } = await axios.post(`${API_URL}/auth/login`, { login, password });

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
      } = await axios.post(`${API_URL}/auth/register`, { login, password });

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
      } = await axios.get(`${API_URL}/auth/me`, createAuthorizedConfig(token));

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
      const { data } = await axios.get(`${API_URL}/posts`, {
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
      } = await axios.get(`${API_URL}/posts/${postId}`);

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
      await axios.post(`${API_URL}/posts/${postId}/comments`, { content }, createAuthorizedConfig(token));

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
      await axios.delete(`${API_URL}/comments/${commentId}`, createAuthorizedConfig(token));

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
      } = await axios.get(`${API_URL}/users`, createAuthorizedConfig(token));

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
      } = await axios.get(`${API_URL}/roles`, createAuthorizedConfig(token));

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
      } = await axios.patch(`${API_URL}/users/${userId}/role`, { roleId }, createAuthorizedConfig(token));

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
      await axios.delete(`${API_URL}/users/${userId}`, createAuthorizedConfig(token));

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
      } = await axios.post(
        `${API_URL}/posts`,
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
