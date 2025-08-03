import { render, screen } from '@testing-library/react';

import { Flyout } from './flyout';

describe('Flyout', () => {
  it('renders children correctly', () => {
    render(
      <Flyout>
        <div data-testid="child">Hello Flyout</div>
      </Flyout>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello Flyout')).toBeInTheDocument();
  });

  it('has the correct CSS class', () => {
    const { container } = render(<Flyout>Content</Flyout>);
    expect(container.firstChild).toHaveClass('flyout');
  });
});
