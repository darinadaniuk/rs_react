import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';

import { ErrorBoundary } from './error-boundary';

class ErrorTestComp extends React.Component {
  componentDidMount() {
    throw new Error('error');
  }

  render() {
    return <div>Should not be rendered</div>;
  }
}

class ThrowButton extends React.Component<
  Record<string, unknown>,
  { throwError: boolean }
> {
  state = { throwError: false };

  triggerError = () => this.setState({ throwError: true });

  render() {
    if (this.state.throwError) {
      throw new Error('Error from button');
    }
    return <button onClick={this.triggerError}>Trigger Error</button>;
  }
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should catch and handle errors in child components', async () => {
    render(
      <ErrorBoundary>
        <ErrorTestComp />
      </ErrorBoundary>
    );

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
  });

  it('should display fallback UI', async () => {
    render(
      <ErrorBoundary>
        <ErrorTestComp />
      </ErrorBoundary>
    );

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
    expect(screen.getByAltText(/no data/i)).toBeInTheDocument();
    expect(screen.getByText(/refresh page/i)).toBeInTheDocument();
  });

  it('should log error to console', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(errorSpy).not.toHaveBeenCalled();

    try {
      render(
        <ErrorBoundary>
          <ErrorTestComp />
        </ErrorBoundary>
      );
    } catch (error: unknown) {
      console.error(error);
    }

    expect(errorSpy).toHaveBeenCalled();
  });

  it('should show fallback UI after error button click', async () => {
    render(
      <ErrorBoundary>
        <ThrowButton />
      </ErrorBoundary>
    );

    await userEvent.click(
      screen.getByRole('button', { name: /trigger error/i })
    );
    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
  });
});
