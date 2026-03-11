/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { RESET_POST_DATA, loadPostAsync } from '../../actions';
import { Error, PrivateContent } from '../../components';
import { ROLE } from '../../constant';
import { useServerRequest } from '../../hooks';
import { selectPost } from '../../selectors';
import { Comments, PostContent, PostForm } from './components';

export const Post = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const post = useSelector(selectPost);
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const requestServer = useServerRequest();
  const isCreating = location.pathname === '/post';

  useLayoutEffect(() => {
    dispatch(RESET_POST_DATA);
  }, [dispatch, isCreating]);

  useEffect(() => {
    if (isCreating) {
      setIsLoading(false);
      setError(null);

      return;
    }

    dispatch(loadPostAsync(requestServer, params.postId)).then(postData => {
      setError(postData.error);
      setIsLoading(false);
    });
  }, [dispatch, requestServer, params.postId, isCreating]);

  if (isLoading) {
    return null;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!isCreating && !post.id) {
    return <Error error="Пост не найден" />;
  }

  if (isCreating) {
    return (
      <PostContainer>
        <PrivateContent access={[ROLE.ADMIN]} serverError={null}>
          <PostForm post={post} />
        </PrivateContent>
      </PostContainer>
    );
  }

  return (
    <PostContainer>
      <PostContent post={post} />
      <Comments comments={post.comments} postId={post.id} />
    </PostContainer>
  );
};

const PostContainer = styled.div({
  padding: '0 40px',
});
