import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lock, LogOut } from 'lucide-react';
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
import NewsPage from './components/NewsPage';
import Feed from './components/Feed';
import AdminDashboard from './components/AdminDashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import ResetPassword from './components/ResetPassword';
import AITradingBot from './components/AITradingBot';
import PipCalculator from './components/PipCalculator';
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
        <div className="bg-black">
          <Feed />
        </div>
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

function BannedScreen({ banData }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-zinc-900/50 border border-red-500/20 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl shadow-red-500/5"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <Lock className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Account Suspended</h1>
        <div className="space-y-4 text-left bg-black/40 p-6 rounded-2xl border border-white/5 mb-8">
          <div>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Reason</p>
            <p className="text-sm text-gray-300">{banData.banReason || 'Violation of community guidelines'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Duration</p>
            <p className="text-sm text-gray-300">{banData.banDuration === 'permanent' ? 'Permanent Ban' : `${banData.banDuration} Days`}</p>
          </div>
          {banData.banUntil && (
            <div>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Expires On</p>
              <p className="text-sm text-gray-300">{new Date(banData.banUntil).toLocaleString()}</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => signOut(auth)}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all mb-6"
        >
          <LogOut className="w-5 h-5" /> Logout & Switch Account
        </button>

        <p className="text-xs text-gray-500 leading-relaxed">
          If you believe this is a mistake, please contact our support team via Telegram.
        </p>
      </motion.div>
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setOnboardingCompleted(data.onboardingCompleted);
            setIsAdmin(data.isAdmin || ['mchokri100@gmail.com', 'ahmed1195@gmail.com'].includes(currentUser.email?.toLowerCase()));
          }
          setLoading(false);
        });
        return () => unsubscribeDoc();
      } else {
        setUserData(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
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

  if (loading) return <LoadingScreen />;

  if (userData?.isBanned) {
    return <BannedScreen banData={userData} />;
  }

  return (
    <AnimatePresence mode="wait">
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
                <Route path="/news" element={<NewsPage />} />
                <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/ai-bot" element={<AITradingBot />} />
                <Route path="/pip-calculator" element={<PipCalculator />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
            <CookieConsent />
          </div>
        </Router>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
