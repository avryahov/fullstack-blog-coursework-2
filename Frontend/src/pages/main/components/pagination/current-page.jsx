/* eslint-disable react/prop-types */
import styled from 'styled-components';

export const CurrentPage = ({ page }) => {
  return <CurrentPageContainer>Страница {page}</CurrentPageContainer>;
};

const CurrentPageContainer = styled.div({
  width: '100%',
  height: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid black',
});
