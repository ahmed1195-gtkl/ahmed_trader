import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Globe, User, LogOut, Settings, Menu, X, LogIn, ChevronDown, Send, Instagram, Video, LayoutDashboard, Home, Newspaper, Share2 } from 'lucide-react';
import siteLogo from '../assets/site_logo.jpg';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const languages = [
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'ar', name: 'AR', flag: '🇸🇦' },
    { code: 'fr', name: 'FR', flag: '🇫🇷' }
  ];

  const socialChannels = [
    { name: 'Telegram', icon: <Send className="w-4 h-4" />, url: 'https://t.me/ahmed_trader_123', color: 'hover:text-[#0088cc]' },
    { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, url: 'https://www.instagram.com/mohamed_chokry', color: 'hover:text-[#e1306c]' },
    { name: 'TikTok', icon: <Video className="w-4 h-4" />, url: 'https://www.tiktok.com/@ahmed.trader123', color: 'hover:text-[#ff0050]' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const adminEmails = ['mchokri100@gmail.com', 'ahmed1195@gmail.com', 'admin@ahmedtrader.com'];
        setIsAdmin(adminEmails.includes(currentUser.email?.toLowerCase()));
      } else {
        setIsAdmin(false);
      }
    });
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsLangOpen(false);
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  };

  const handleAdminClick = (e) => {
    e.preventDefault();
    setIsSidebarOpen(false);
    setIsUserOpen(false);
    // Use window.location for a more reliable navigation on all devices
    window.location.hash = '/admin';
  };

  const sidebarVariants = {
    closed: { x: i18n.language === 'ar' ? '100%' : '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-lg border-b border-white/10 py-3' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 text-white hover:text-yellow-500 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <img src={siteLogo} alt="Logo" className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-yellow-500/50 group-hover:scale-105 transition-transform" />
            <span className="text-white font-black text-base md:text-lg tracking-tight uppercase hidden sm:block">Ahmed <span className="text-yellow-500">Trader</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}>{t('nav.home')}</Link>
          <Link to="/news" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/news' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}>{t('nav.news')}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Language Switcher */}
          <div className="relative">
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 text-xs font-black text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
              <Globe className="w-3 h-3 text-yellow-500" />
              <span className="hidden xs:inline">{currentLanguage.name}</span>
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full mt-2 right-0 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[100px]">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => changeLanguage(lang.code)} className="w-full px-4 py-3 text-xs font-bold text-white hover:bg-yellow-500 hover:text-black transition-colors flex items-center gap-3">
                      <span>{lang.flag}</span> {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button onClick={() => setIsUserOpen(!isUserOpen)} className="flex items-center gap-2 bg-yellow-500 text-black px-3 md:px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all">
                <User className="w-3 h-3" />
                <span className="hidden sm:inline">{user.displayName?.split(' ')[0] || t('nav.account')}</span>
              </button>
              <AnimatePresence>
                {isUserOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full mt-2 right-0 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[180px]">
                    {isAdmin && (
                      <button 
                        onClick={handleAdminClick}
                        className="w-full px-4 py-3 text-xs font-bold text-yellow-500 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </button>
                    )}
                    <button onClick={() => { navigate('/settings'); setIsUserOpen(false); }} className="w-full px-4 py-3 text-xs font-bold text-white hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5">
                      <Settings className="w-4 h-4" /> {t('nav.settings')}
                    </button>
                    <button onClick={() => signOut(auth)} className="w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-3">
                      <LogOut className="w-4 h-4" /> {t('nav.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/auth" className="bg-yellow-500 text-black px-4 md:px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all flex items-center gap-2">
              <LogIn className="w-3 h-3" /> <span className="hidden xs:inline">{t('nav.login')}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`fixed top-0 ${i18n.language === 'ar' ? 'right-0' : 'left-0'} bottom-0 w-[280px] sm:w-[320px] bg-zinc-950 border-${i18n.language === 'ar' ? 'l' : 'r'} border-white/10 z-[70] shadow-2xl flex flex-col`}
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={siteLogo} alt="Logo" className="w-8 h-8 rounded-full border border-yellow-500/50" />
                  <span className="text-white font-black text-lg uppercase tracking-tighter">Ahmed <span className="text-yellow-500">Trader</span></span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                {/* Main Links */}
                <div className="space-y-2">
                  <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Navigation</p>
                  <Link to="/" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname === '/' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <Home className="w-5 h-5" /> {t('nav.home')}
                  </Link>
                  <Link to="/news" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname === '/news' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <Newspaper className="w-5 h-5" /> {t('nav.news')}
                  </Link>
                  {isAdmin && (
                    <button 
                      onClick={handleAdminClick}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-yellow-500 hover:bg-yellow-500/10 transition-all border border-yellow-500/20 mt-4"
                    >
                      <LayoutDashboard className="w-5 h-5" /> Admin Dashboard
                    </button>
                  )}
                </div>

                {/* Social Channels */}
                <div className="space-y-2">
                  <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Social Channels</p>
                  <div className="grid grid-cols-1 gap-2">
                    {socialChannels.map((channel) => (
                      <a 
                        key={channel.name} 
                        href={channel.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-300 hover:border-yellow-500/30 hover:text-white transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center border border-white/10">
                          {channel.icon}
                        </div>
                        <span className="text-sm font-bold">{channel.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-white/5 bg-black/50">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black">
                        {user.email?.[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white truncate max-w-[150px]">{user.displayName || 'User'}</span>
                        <span className="text-[10px] text-gray-500 truncate max-w-[150px]">{user.email}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => { navigate('/settings'); setIsSidebarOpen(false); }} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all">
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <button onClick={() => signOut(auth)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsSidebarOpen(false)} className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-yellow-500 text-black font-black text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all">
                    <LogIn className="w-5 h-5" /> {t('nav.login')}
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
