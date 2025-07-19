import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import App from './app';

vi.mock('@rs-react/components', () => ({
  Header: () => <div>Mock Header</div>,
  Footer: () => <div>Mock Footer</div>,
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@rs-react/pages', () => ({
  Cards: () => <div>Mock Cards</div>,
}));

describe('App', () => {
  it('renders Header, Cards, and Footer', () => {
    render(<App />);

    expect(screen.getByText('Mock Header')).toBeInTheDocument();
    expect(screen.getByText('Mock Cards')).toBeInTheDocument();
    expect(screen.getByText('Mock Footer')).toBeInTheDocument();
  });
});
