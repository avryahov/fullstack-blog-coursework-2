import { render, screen } from '@testing-library/react';

jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => jest.fn(),
  }),
  { virtual: true }
);

jest.mock('../special-panel/special-panel', () => ({
  SpecialPanel: () => <div data-testid="special-panel" />,
}));

jest.mock('../../../../components', () => ({
  H2: ({ children }) => <h2>{children}</h2>,
}));

jest.mock('../../../../components/header/components', () => ({
  Icon: () => <button type="button">edit</button>,
}));

import { PostContent } from './post-content';

describe('PostContent', () => {
  it('renders post html content instead of escaped tags', () => {
    render(
      <PostContent
        post={{
          id: 'post-1',
          title: 'HTML post',
          imageUrl: 'https://example.com/image.jpg',
          content: '<p><strong>HTML body</strong> with text</p>',
          publishedAt: '11.03.2026, 14:00',
        }}
      />
    );

    expect(screen.getByText('HTML body', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.queryByText('<p><strong>HTML body</strong> with text</p>')).not.toBeInTheDocument();
  });
});
