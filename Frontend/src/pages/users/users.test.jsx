import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Users } from './users';

const mockFetchRoles = jest.fn();
const mockFetchUsers = jest.fn();

jest.mock('../../api', () => ({
  rolesApi: {
    fetchRoles: (...args) => mockFetchRoles(...args),
  },
  usersApi: {
    fetchUsers: (...args) => mockFetchUsers(...args),
    removeUser: jest.fn(),
  },
}));

jest.mock('../../components', () => ({
  H2: ({ children }) => <h2>{children}</h2>,
  PrivateContent: ({ children, access, serverError }) => {
    const { useSelector } = require('react-redux');
    const roleId = useSelector(state => state.user.roleId);

    if (serverError) {
      return <div>{serverError}</div>;
    }

    return access.includes(roleId) ? children : <div>Доступ запрещен</div>;
  },
}));

jest.mock('./components', () => ({
  TableRow: ({ children }) => <div>{children}</div>,
  UserRow: ({ login }) => <div>{login}</div>,
}));

const renderUsers = ({ roleId, session = null }) =>
  render(
    <Provider
      store={createStore(() => ({
        user: {
          roleId,
          session,
        },
      }))}
    >
      <Users />
    </Provider>
  );

describe('Users page', () => {
  beforeEach(() => {
    mockFetchRoles.mockReset();
    mockFetchUsers.mockReset();
  });

  it('does not request protected data for guest', () => {
    renderUsers({ roleId: 'guest' });

    expect(screen.getByText('Доступ запрещен')).toBeInTheDocument();
    expect(mockFetchRoles).not.toHaveBeenCalled();
    expect(mockFetchUsers).not.toHaveBeenCalled();
  });

  it('loads roles and users for admin', async () => {
    mockFetchRoles.mockResolvedValue({
      res: [{ id: 'role-1', key: 'admin', name: 'admin' }],
      error: null,
    });
    mockFetchUsers.mockResolvedValue({
      res: [{ id: 'user-1', login: 'reader', registeredAt: '11.03.2026, 14:00', roleId: 'role-1' }],
      error: null,
    });

    renderUsers({ roleId: 'admin', session: 'admin-token' });

    await waitFor(() => expect(mockFetchRoles).toHaveBeenCalledWith('admin-token'));
    await waitFor(() => expect(mockFetchUsers).toHaveBeenCalledWith('admin-token'));
    expect(screen.getByText('Пользователи')).toBeInTheDocument();
    expect(screen.getByText('reader')).toBeInTheDocument();
  });
});
