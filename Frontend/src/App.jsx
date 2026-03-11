/* eslint-disable react/prop-types */
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { setUser } from './actions';
import { authApi, clearAuthData, readAuthData } from './api';
import './App.css';
import { Footer, Modal, StyledHeader, Error } from './components/';
import { Authorization, Main, Post, Registration, Users } from './pages/';
import { ERROR } from './constant';

const Content = styled.div({
  margin: '20px',
  padding: '120px 0 0',
});

const AppColumn = styled.div({
  position: 'relative',
  width: '1000px',
  minHeight: '100%',
  margin: '0 auto',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

function App() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const authData = readAuthData();

    if (authData?.token) {
      authApi.restoreSession(authData.token).then(({ res, error }) => {
        if (error) {
          clearAuthData();

          return;
        }

        dispatch(setUser(res));
      });
    }
  }, [dispatch]);

  return (
    <AppColumn>
      <StyledHeader />
      <Content>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Authorization />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/post/:postId/edit" element={<Post />} />
          <Route path="/post" element={<Post />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<Error error={ERROR.PAGE_NOT_EXIST} />} />
        </Routes>
      </Content>
      <Footer />
      <Modal />
    </AppColumn>
  );
}

export default App;
