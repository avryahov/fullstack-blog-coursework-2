import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Authorization } from '../authorization/authorization';
import { Registration } from '../registration/registration';

const mockAuthorize = jest.fn();
const mockRegister = jest.fn();

jest.mock('../../api', () => ({
  authApi: {
    authorize: (...args) => mockAuthorize(...args),
    register: (...args) => mockRegister(...args),
  },
  saveAuthData: jest.fn(),
}));

jest.mock('../../actions', () => ({
  setUser: payload => ({
    type: 'SET_USER',
    payload,
  }),
}));

jest.mock('../../components', () => ({
  AuthRegFormError: ({ children }) => <div>{children}</div>,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  H2: ({ children }) => <h2>{children}</h2>,
  Input: props => <input {...props} />,
}));

jest.mock('../../hooks', () => ({
  useResetForm: jest.fn(),
}));

jest.mock(
  'react-router-dom',
  () => ({
    Link: ({ children, ...props }) => <a {...props}>{children}</a>,
    Navigate: () => null,
  }),
  { virtual: true }
);

const renderWithProviders = component => {
  const store = createStore(() => ({
    app: {
      wasLogout: false,
    },
    user: {
      roleId: 'guest',
      session: null,
    },
  }));

  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('Auth pages', () => {
  beforeEach(() => {
    mockAuthorize.mockReset();
    mockRegister.mockReset();
  });

  it('shows login backend error to the user', async () => {
    mockAuthorize.mockResolvedValue({
      res: null,
      error: 'Нужна авторизация.',
    });

    renderWithProviders(<Authorization />);

    fireEvent.change(screen.getByPlaceholderText('Логин'), {
      target: { value: 'reader' },
    });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), {
      target: { value: 'Reader#123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Авторизироваться' }));

    await waitFor(() => expect(mockAuthorize).toHaveBeenCalledWith('reader', 'Reader#123'));
    expect(await screen.findByText('Нужна авторизация.')).toBeInTheDocument();
  });

  it('shows register backend error to the user', async () => {
    mockRegister.mockResolvedValue({
      res: null,
      error: 'Не удалось выполнить запрос из-за конфликта данных.',
    });

    renderWithProviders(<Registration />);

    fireEvent.change(screen.getByPlaceholderText('Логин'), {
      target: { value: 'reader2' },
    });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), {
      target: { value: 'Reader#123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Повтор пароля'), {
      target: { value: 'Reader#123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зарегистироваться' }));

    await waitFor(() => expect(mockRegister).toHaveBeenCalledWith('reader2', 'Reader#123'));
    expect(await screen.findByText('Не удалось выполнить запрос из-за конфликта данных.')).toBeInTheDocument();
  });
});
