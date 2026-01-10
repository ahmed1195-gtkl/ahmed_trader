import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
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
import News from './components/News';
import PrivacyPolicy from './components/PrivacyPolicy';
import ResetPassword from './components/ResetPassword';
import CookieConsent from './components/CookieConsent';
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

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="relative"
      >
        <div className="w-20 h-20 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-yellow-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-yellow-500 font-black tracking-[0.2em] uppercase text-xs"
      >
        Ahmed Trader
      </motion.p>
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    // Set a maximum timeout for loading to prevent infinite loading screen
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn("Loading timeout reached, forcing app to show.");
        setLoading(false);
      }
    }, 3000); // 3 seconds max loading

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Use a promise with timeout for Firestore fetch
          const fetchUserData = async () => {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().onboardingCompleted) {
              setOnboardingCompleted(true);
            } else {
              setOnboardingCompleted(false);
            }
          };

          // Race between fetch and a shorter timeout
          await Promise.race([
            fetchUserData(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), 1500))
          ]).catch(err => console.error("User data fetch issue:", err));

        } catch (err) {
          console.error("Error in auth state change:", err);
        }
      }
      setLoading(false);
      clearTimeout(loadingTimeout);
    });

    return () => {
      unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  useEffect(() => {
    if (i18n.language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loading" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Router>
            <div className="min-h-screen relative bg-black">
              <div className="relative z-10">
                <Routes>
                  <Route path="/" element={<MainLayout />} />
                  <Route path="/auth" element={user ? <Navigate to={onboardingCompleted ? "/" : "/onboarding"} /> : <Auth />} />
                  <Route path="/onboarding" element={user ? (onboardingCompleted ? <Navigate to="/" /> : <Onboarding />) : <Navigate to="/auth" />} />
                  <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
              <CookieConsent />
            </div>
          </Router>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
