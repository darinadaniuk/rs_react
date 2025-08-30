'use client';

import Image from 'next/image';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import React from 'react';

import { Button } from '@rs-react/components';

import './error-boundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary error:', error, info);
  }

  refreshPage(): void {
    window.location.reload();
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error">
          <Image
            className="error-icon"
            src="/page-not-found.svg"
            alt="No data"
            width={200}
            height={320}
            unoptimized
          />
          <h3 className="error-title">Something went wrong</h3>
          <p>Error Boundary happened</p>
          <p>Please try refreshing the page</p>
          <Button onClick={this.refreshPage} text="Refresh page" />
        </div>
      );
    }

    return this.props.children;
  }
}
