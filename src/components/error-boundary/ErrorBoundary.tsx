import { Component, type ErrorInfo, type ReactNode } from 'react';

import './ErrorBoundary.css';
import noDataIcon from '../../assets/page-not-found.svg';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary error:', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error">
          <img className="error-icon" src={noDataIcon} alt="No data" />
          <h3 className="error-title">Something went wrong</h3>
          <p>Please try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
