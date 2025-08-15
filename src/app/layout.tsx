'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ErrorBoundary, Footer, Header } from '@rs-react/components';
import { ThemeProvider } from '@rs-react/context';
import { queryClient } from '@rs-react/query-client.config';

import './app.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ErrorBoundary>
              <Header />
              <main className="content">{children}</main>
              <Footer />
            </ErrorBoundary>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
