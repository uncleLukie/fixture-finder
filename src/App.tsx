import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Sports from './pages/Sports';
import About from './pages/About';
import { useSportsData } from './hooks/useSportsData';
import './App.css';

function App() {
  const { refreshData, loading } = useSportsData();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onRefresh={refreshData} loading={loading} />
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
