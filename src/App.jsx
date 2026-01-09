import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Coach from './components/Coach';
import Brokers from './components/Brokers';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Settings from './components/Settings';
import MarketData from './components/MarketData';
import backgroundImage from './assets/background.jpg';
import './App.css';

function MainLayout() {
  return (
    <>
      <Header />
      <div className="pt-20">
        <MarketData />
      </div>
      <main>
        <Hero />
        <Benefits />
        <Coach />
        <Brokers />
      </main>
      <Footer />
    </>
  );
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set initial direction based on language
    if (i18n.language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  return (
    <Router>
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(2px)',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
