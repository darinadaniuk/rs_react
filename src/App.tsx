import { Outlet } from 'react-router-dom';

import { ErrorBoundary, Footer, Header } from '@rs-react/components';
import { ThemeProvider } from '@rs-react/context';

import './app.css';

export default function App() {
  return (
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
  );
}
