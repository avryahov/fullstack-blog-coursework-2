import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { postsApi } from '../../api';
import { Error } from '../../components';
import { PAGINATION_LIMIT } from '../../constant';
import { Pagination, PostCard, Search } from './components';
import { debounce } from './utils';

export const Main = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [shouldSearch, setShouldSearch] = useState(false);

  useEffect(() => {
    postsApi.fetchPosts(searchPhrase, page, PAGINATION_LIMIT).then(({ res, error }) => {
      if (error) {
        setErrorMessage(error);
        setPosts([]);

        return;
      }

      setErrorMessage('');
      setPosts(res.posts);
      setLastPage(Number(res.count));
    });
  }, [page, shouldSearch, searchPhrase]);

  const debouncedSearch = useMemo(() => debounce(setShouldSearch, 2000), []);

  const onSearch = ({ target }) => {
    setSearchPhrase(target.value);
    debouncedSearch(!shouldSearch);
  };

  return (
    <MainContainer>
      <div className="posts-and-search">
        <Search searchPhrase={searchPhrase} onChange={onSearch} />
        {errorMessage ? (
          <Error error={errorMessage} />
        ) : posts.length > 0 ? (
          <div className="post-list">
            {posts.map(({ id, publishedAt, title, commentsCount, imageUrl }) => (
              <PostCard key={id} {...{ id, publishedAt, title, commentsCount, imageUrl }} />
            ))}
          </div>
        ) : (
          <div className="no-posts-found">Статьи не найдены</div>
        )}
      </div>
      {lastPage > 1 && <Pagination {...{ setPage, page, lastPage, searchPhrase }} />}
    </MainContainer>
  );
};

const MainContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',

  '& .post-list': {
    display: 'flex',
    flexWrap: 'wrap',
  },
  '& .no-posts-found': {
    textAlign: 'center',
    marginTop: '20px',
  },
  '& .posts-and-search': {
    marginBottom: '40px',
  },
});
