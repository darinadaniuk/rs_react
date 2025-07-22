import { render, screen } from '@testing-library/react';

import { Footer } from './footer';

describe('<Footer />', () => {
  it('renders the footer text', () => {
    render(<Footer />);

    expect(screen.getByText('© 2025 All rights reserved')).toBeInTheDocument();
  });

  it('renders inside a <footer> element', () => {
    render(<Footer />);

    const footer = screen.getByText(/all rights reserved/i).closest('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('footer');
  });
});
