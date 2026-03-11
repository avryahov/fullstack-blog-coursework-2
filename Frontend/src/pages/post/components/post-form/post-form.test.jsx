import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => jest.fn(),
  }),
  { virtual: true }
);

jest.mock('../special-panel/special-panel', () => ({
  SpecialPanel: ({ editButton }) => <div data-testid="special-panel">{editButton}</div>,
}));

jest.mock('../../../../api', () => ({
  postsApi: {
    savePost: jest.fn(),
  },
}));

jest.mock('../../../../components', () => ({
  Input: props => <input {...props} />,
}));

jest.mock('../../../../components/header/components', () => ({
  Icon: () => <button type="button">save</button>,
}));

jest.mock('../../../../actions', () => ({
  savePostAsync: jest.fn(),
  selectUserSession: state => state.user.session,
}));

import { PostForm } from './post-form';

const renderWithProviders = component => {
  const store = createStore(() => ({
    user: {
      session: 'test-session',
    },
  }));

  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('PostForm', () => {
  it('prefills contentEditable with html content', () => {
    const { container } = renderWithProviders(
      <PostForm
        post={{
          id: 'post-1',
          title: 'Editable HTML post',
          imageUrl: 'https://example.com/image.jpg',
          content: '<p><em>Editable body</em></p>',
          publishedAt: '11.03.2026, 14:00',
        }}
      />
    );

    const editable = container.querySelector('[contenteditable="true"]');

    expect(editable).toBeInTheDocument();
    expect(editable.innerHTML).toBe('<p><em>Editable body</em></p>');
    expect(editable.querySelector('em')).toHaveTextContent('Editable body');
  });
});
