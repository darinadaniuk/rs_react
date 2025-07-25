import { render, screen } from '@testing-library/react';

import { Header } from './header';

describe('Header', () => {
  it('should render with logo, title, user name and button', () => {
    render(<Header />);

    expect(screen.getByAltText(/react logo/i)).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toBeInTheDocument();
    expect(screen.getByTestId('header-user')).toBeInTheDocument();
  });
});
