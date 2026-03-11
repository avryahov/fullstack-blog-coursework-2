import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectUserSession } from '../actions';
import { server } from '../api';
import { isPublicOperation } from '../api/operations';

export const useServerRequest = () => {
  const session = useSelector(selectUserSession);

  return useCallback(
    (operation, ...params) => {
      const request = isPublicOperation(operation) ? params : [session, ...params];

      return server[operation](...request);
    },
    [session]
  );
};
