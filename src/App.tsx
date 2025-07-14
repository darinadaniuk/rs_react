import './App.css';
import ErrorBoundary from './components/error-boundary/ErrorBoundary';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Cards from './pages/cards/Cards';

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
