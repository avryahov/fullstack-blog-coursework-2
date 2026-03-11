export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  posts: {
    list: '/posts',
    byId: postId => `/posts/${postId}`,
    comments: postId => `/posts/${postId}/comments`,
  },
  comments: {
    byId: commentId => `/comments/${commentId}`,
  },
  users: {
    list: '/users',
    byId: userId => `/users/${userId}`,
    role: userId => `/users/${userId}/role`,
  },
  roles: {
    list: '/roles',
  },
};
