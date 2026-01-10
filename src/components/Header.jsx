import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Button } from './ui/button';
import { Globe, User, LogOut, Settings, Menu, X, LogIn, ChevronDown, Send, Instagram, Video, LayoutDashboard } from 'lucide-react';
import siteLogo from '../assets/site_logo.jpg';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isChannelsOpen, setIsChannelsOpen] = useState(false);
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-lg border-b border-white/10 py-3' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Simple Professional Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <img src={siteLogo} alt="Logo" className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-yellow-500/50 group-hover:scale-105 transition-transform" />
          <span className="text-white font-black text-base md:text-lg tracking-tight uppercase">Ahmed <span className="text-yellow-500">Trader</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link to="/" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}>{t('nav.home')}</Link>
            <Link to="/news" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/news' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}>{t('nav.news')}</Link>
            
            {user && (
              <div className="relative">
                <button 
                  onMouseEnter={() => setIsChannelsOpen(true)}
                  onMouseLeave={() => setIsChannelsOpen(false)}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-yellow-500 transition-colors py-2"
                >
                  {t('nav.channels')}
                  <ChevronDown className={`w-3 h-3 transition-transform ${isChannelsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isChannelsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }}
                      onMouseEnter={() => setIsChannelsOpen(true)}
                      onMouseLeave={() => setIsChannelsOpen(false)}
                      className="absolute top-full left-0 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[180px] py-2"
                    >
                      {socialChannels.map((channel) => (
                        <a 
                          key={channel.name} 
                          href={channel.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`w-full px-4 py-3 text-xs font-bold text-white hover:bg-white/5 transition-colors flex items-center gap-3 ${channel.color}`}
                        >
                          {channel.icon} {channel.name}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {/* Simple Lang Switcher */}
            <div className="relative">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 text-xs font-black text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                <Globe className="w-3 h-3 text-yellow-500" />
                {currentLanguage.name}
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

            {user ? (
              <div className="relative">
                <button onClick={() => setIsUserOpen(!isUserOpen)} className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all">
                  <User className="w-3 h-3" />
                  {user.displayName?.split(' ')[0] || t('nav.account')}
                </button>
                <AnimatePresence>
                  {isUserOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full mt-2 right-0 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[160px]">
                      {(user?.email === 'mchokri100@gmail.com' || user?.email === 'ahmed1195@gmail.com') && (
                        <button onClick={() => { navigate('/admin'); setIsUserOpen(false); }} className="w-full px-4 py-3 text-xs font-bold text-yellow-500 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5">
                          <LayoutDashboard className="w-3 h-3" /> Admin Dashboard
                        </button>
                      )}
                      <button onClick={() => { navigate('/settings'); setIsUserOpen(false); }} className="w-full px-4 py-3 text-xs font-bold text-white hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5">
                        <Settings className="w-3 h-3" /> {t('nav.settings')}
                      </button>
                      <button onClick={() => signOut(auth)} className="w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-3">
                        <LogOut className="w-3 h-3" /> {t('nav.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/auth" className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all flex items-center gap-2">
                <LogIn className="w-3 h-3" /> {t('nav.login')}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Simple Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-black/95 border-b border-white/5 overflow-hidden">
            <div className="p-6 flex flex-col gap-6">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black text-white uppercase tracking-tight">{t('nav.home')}</Link>
              <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black text-white uppercase tracking-tight">{t('nav.news')}</Link>
              
              {user && (
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">{t('nav.channels')}</span>
                  <div className="grid grid-cols-3 gap-2">
                    {socialChannels.map((channel) => (
                      <a key={channel.name} href={channel.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 text-white">
                        {channel.icon}
                        <span className="text-[10px] font-bold">{channel.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-[1px] bg-white/5" />
              <div className="flex gap-4">
                {languages.map((lang) => (
                  <button key={lang.code} onClick={() => { changeLanguage(lang.code); setIsMobileMenuOpen(false); }} className={`flex-1 py-3 rounded-xl border font-black text-xs ${currentLanguage.code === lang.code ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/5 border-white/10 text-white'}`}>
                    {lang.name}
                  </button>
                ))}
              </div>
              {user ? (
                <div className="flex flex-col gap-4">
                  {(user?.email === 'mchokri100@gmail.com' || user?.email === 'ahmed1195@gmail.com') && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="bg-yellow-500 text-black py-4 rounded-xl font-black text-xs uppercase text-center">Admin Dashboard</Link>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 text-white py-4 rounded-xl font-black text-xs uppercase text-center border border-white/10">{t('nav.settings')}</Link>
                    <button onClick={() => signOut(auth)} className="bg-red-500/10 text-red-500 py-4 rounded-xl font-black text-xs uppercase border border-red-500/20">{t('nav.logout')}</button>
                  </div>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="bg-yellow-500 text-black py-4 rounded-xl font-black text-xs uppercase text-center">{t('nav.login')}</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
