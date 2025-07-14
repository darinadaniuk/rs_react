import './App.css';
import ErrorBoundary from './components/error-boundary/ErrorBoundary';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Cards from './pages/cards/Cards';

function App() {
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

export default App;
