import { ErrorBoundary, Footer, Header } from '@rs-react/components';
import { Cards } from '@rs-react/pages';

import './app.css';

export default function App() {
  return (
    <div className="app-page">
      <ErrorBoundary>
        <Header />
        <main className="content">
          <Cards />
        </main>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}
