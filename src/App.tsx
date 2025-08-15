import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet } from 'react-router-dom';

import { ErrorBoundary, Footer, Header } from '@rs-react/components';
import { ThemeProvider } from '@rs-react/context';
import { queryClient } from '@rs-react/query-client.config';

import './app.css';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="app-page">
          <ErrorBoundary>
            <Header />
            <main className="content">
              <Outlet />
            </main>
            <Footer />
          </ErrorBoundary>
        </div>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
