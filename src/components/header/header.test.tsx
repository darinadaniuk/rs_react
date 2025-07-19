import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorBoundary } from '@rs-react/components/error-boundary/error-boundary';

import { Header } from './header';

describe('Header', () => {
  it('should render with logo, title, user name and button', () => {
    render(<Header />);

    expect(screen.getByAltText(/react logo/i)).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toBeInTheDocument();
    expect(screen.getByTestId('header-user')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /error boundary/i })
    ).toBeInTheDocument();
  });

  it('should trigger ErrorBoundary fallback UI when button is clicked', async () => {
    render(
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /error boundary/i });
    await userEvent.click(button);

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/error boundary happened/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /refresh page/i })
    ).toBeInTheDocument();
  });
});
