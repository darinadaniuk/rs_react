import './App.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Cards from './pages/cards/Cards';
import ErrorBoundary from './components/error-boundary/ErrorBoundary';

function App() {
  return (
    <div className="app-page">
      <Header />
      <main className="content">
        <ErrorBoundary>
          <Cards />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default App;
