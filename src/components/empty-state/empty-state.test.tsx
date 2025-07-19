import { render, screen } from '@testing-library/react';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('should render with default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('should render with input message', () => {
    render(<EmptyState message="Oops! Nothing here" />);
    expect(screen.getByText('Oops! Nothing here')).toBeInTheDocument();
  });

  it('should render image', () => {
    render(<EmptyState />);

    const img = screen.getByAltText('No data') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('page-not-found.svg');
  });
});
