import { authApi, commentsApi, postsApi, rolesApi, usersApi } from './domains';

export const server = {
  ...authApi,
  ...postsApi,
  ...commentsApi,
  ...usersApi,
  ...rolesApi,
};
