import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Globe, 
  ChevronDown, 
  LayoutDashboard, 
  Newspaper, 
  Settings, 
  LogOut, 
  User, 
  LogIn, 
  Instagram, 
  Send, 
  Video,
  Home,
  Bell,
  AlertTriangle,
  Zap,
  Calculator
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, collection } from 'firebase/firestore';
import teamLogo from '../assets/team_logo.png';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [siteSettings, setSiteSettings] = useState({ showAIBot: true, showPipCalculator: true });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // تحسين استجابة التمرير
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    const adminEmails = ['mchokri100@gmail.com', 'ahmed1195@gmail.com'];
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(adminEmails.includes(currentUser.email?.toLowerCase()));
        
        const userRef = doc(db, 'users', currentUser.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            if (data.warning && !data.warningRead) {
              setShowWarning(true);
            } else {
              setShowWarning(false);
            }
          }
        });
        return () => unsubscribeDoc();
      } else {
        setIsAdmin(false);
        setUserData(null);
        setShowWarning(false);
      }
    });

    // جلب إعدادات الموقع
    const settingsRef = collection(db, 'site_settings');
    const unsubscribeSettings = onSnapshot(settingsRef, (snapshot) => {
      if (!snapshot.empty) {
        setSiteSettings(snapshot.docs[0].data());
      }
    });

    return () => {
      unsubscribeSettings();
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const socialChannels = [
    { name: 'TikTok', icon: <Video className="w-4 h-4" />, url: 'https://www.tiktok.com/@ahmed.trader123' },
    { name: 'Telegram', icon: <Send className="w-4 h-4" />, url: 'https://t.me/ahmed_trader_123' },
    { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, url: 'https://www.instagram.com/mohamed_chokry' }
  ];

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: <Home className="w-4 h-4" /> },
    { name: t('nav.news'), path: '/news', icon: <Newspaper className="w-4 h-4" /> },
    ...(siteSettings.showAIBot ? [{ name: 'AI Bot', path: '/ai-bot', icon: <Zap className="w-4 h-4" /> }] : []),
    ...(siteSettings.showPipCalculator ? [{ name: 'Pips', path: '/pip-calculator', icon: <Calculator className="w-4 h-4" /> }] : []),
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
    // تحديث الصفحة تلقائياً عند تغيير اللغة لضمان مزامنة كافة المكونات
    window.location.reload();
  };

  const markWarningAsRead = async () => {
    if (user && userData?.warning) {
      await updateDoc(doc(db, 'users', user.uid), {
        warningRead: true
      });
      setShowWarning(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-2' : 'py-6'}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className={`relative flex items-center justify-between bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 md:px-6 py-3 transition-all duration-500 ${isScrolled ? 'shadow-2xl shadow-yellow-500/10 border-white/20' : ''}`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={teamLogo} alt="Logo" className="h-8 w-8 md:h-10 md:w-10 rounded-xl object-cover border border-white/10 group-hover:border-yellow-500/50 transition-all duration-500" />
              <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-sm md:text-lg uppercase tracking-tighter leading-none">Ahmed</span>
              <span className="text-yellow-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em] leading-none mt-1">Trader</span>
            </div>
          </Link>

          {/* Unified Nav - Desktop & Mobile Style */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5 ${location.pathname === link.path ? 'text-yellow-500 bg-yellow-500/5' : 'text-gray-400'}`}
              >
                {link.icon} {link.name}
              </Link>
            ))}
            
            {user && isAdmin && (
              <Link 
                to="/admin" 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5 ${location.pathname === '/admin' ? 'text-yellow-500 bg-yellow-500/5' : 'text-gray-400'}`}
              >
                <LayoutDashboard className="w-3 h-3" /> {t('nav.admin', 'Admin')}
              </Link>
            )}

            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-yellow-500 transition-all hover:bg-white/5">
                {t('nav.channels')} <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-2xl">
                {socialChannels.map((channel) => (
                  <a key={channel.name} href={channel.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                    {channel.icon} <span className="text-[10px] font-black uppercase tracking-widest">{channel.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notifications */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-yellow-500 transition-all relative"
                >
                  <Bell className="w-4 h-4" />
                  {showWarning && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-900 animate-pulse" />}
                </button>
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }} 
                      className="absolute top-full right-0 mt-4 w-64 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl z-[110]"
                    >
                      <div className="px-4 py-2 border-b border-white/5 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Notifications</span>
                      </div>
                      {userData?.warning ? (
                        <div 
                          className={`p-3 rounded-xl transition-colors cursor-pointer ${userData.warningRead ? 'bg-white/5' : 'bg-red-500/10 border border-red-500/20'}`}
                          onClick={markWarningAsRead}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <p className="text-[10px] font-bold text-white">System Warning</p>
                          </div>
                          <p className="text-[10px] text-gray-400 line-clamp-2">{userData.warning}</p>
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">No new notifications</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                <Globe className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 10 }} 
                    className="absolute top-full right-0 mt-4 w-40 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl"
                  >
                    {languages.map((lang) => (
                      <button key={lang.code} onClick={() => changeLanguage(lang.code)} className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${i18n.language === lang.code ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest">{lang.name}</span>
                        <span>{lang.flag}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            {user ? (
              <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-white/10">
                <button onClick={() => navigate('/settings')} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all">
                  <User className="w-4 h-4" />
                </button>
                <button onClick={() => signOut(auth)} className="hidden md:flex w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20">
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-zinc-950 border-l border-white/10 z-[101] p-6 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                  <span className="text-white font-black uppercase tracking-widest text-sm">Menu</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path} 
                      to={link.path} 
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${location.pathname === link.path ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                      {link.icon} {link.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto pt-6 border-t border-white/5">
                  <div className="flex justify-center gap-6">
                    {socialChannels.map((channel) => (
                      <a key={channel.name} href={channel.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-yellow-500 transition-all">
                        {channel.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
