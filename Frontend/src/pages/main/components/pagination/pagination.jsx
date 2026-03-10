/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '../../../../components';
import { CurrentPage } from './current-page';

export const Pagination = ({ page, setPage, lastPage, searchPhrase }) => {
  if (searchPhrase && searchPhrase.trim() !== '') {
    return null;
  }

  if (lastPage <= 1) {
    return null;
  }

  return (
    <PaginationContainer>
      <Button disabled={page === 1} onClick={() => setPage(1)}>
        В начало
      </Button>
      <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Предыдущая
      </Button>
      <CurrentPage page={page} />
      <Button disabled={page === lastPage} onClick={() => setPage(page + 1)}>
        Следующая
      </Button>
      <Button disabled={page === lastPage} onClick={() => setPage(lastPage)}>
        В конец
      </Button>
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',

  padding: '0 60px 0 20px',
  gap: '10px',
  fontSize: '18px',
  width: '100%',
});

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  lastPage: PropTypes.number.isRequired,
};
