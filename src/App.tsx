import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

import { ErrorBoundary, Footer, Header } from '@rs-react/components';
import { ThemeProvider } from '@rs-react/context';

import './app.css';

const queryClient = new QueryClient();

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
    </QueryClientProvider>
  );
}
