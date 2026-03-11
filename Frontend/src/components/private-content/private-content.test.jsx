import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { PrivateContent } from './private-content';

const renderWithRole = roleId =>
  render(
    <Provider
      store={createStore(() => ({
        user: {
          roleId,
        },
      }))}
    >
      <PrivateContent access={['admin']}>
        <div>Protected body</div>
      </PrivateContent>
    </Provider>
  );

describe('PrivateContent', () => {
  it('shows access denied for guest', () => {
    renderWithRole('guest');

    expect(screen.getByText('Ошибка')).toBeInTheDocument();
    expect(screen.getByText('Доступ запрещен')).toBeInTheDocument();
    expect(screen.queryByText('Protected body')).not.toBeInTheDocument();
  });

  it('renders protected content for admin', () => {
    renderWithRole('admin');

    expect(screen.getByText('Protected body')).toBeInTheDocument();
    expect(screen.queryByText('Доступ запрещен')).not.toBeInTheDocument();
  });
});
