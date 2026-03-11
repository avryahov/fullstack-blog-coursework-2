import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectUserSession } from '../actions';
import { server } from '../api';

export const useServerRequest = () => {
  const session = useSelector(selectUserSession);

  return useCallback(
    (operation, ...params) => {
      const request = ['register', 'authorize', 'fetchPost', 'fetchPosts'].includes(operation)
        ? params
        : [session, ...params];

      return server[operation](...request);
    },
    [session]
  );
};
