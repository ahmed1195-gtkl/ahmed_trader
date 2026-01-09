import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { Globe, User, LogOut, Settings, Menu, X, Home, LogIn, ChevronDown, Newspaper } from 'lucide-react';
import siteLogo from '../assets/site_logo.jpg';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsLanguageDropdownOpen(false);
    
    if (langCode === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = langCode;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-xl border-b border-yellow-500/30 py-2 shadow-[0_4px_30px_rgba(234,179,8,0.1)]' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo Section */}
        <div 
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-white/10 bg-black">
              <img src={siteLogo} alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-xl tracking-tighter uppercase leading-none">AHMED</span>
            <span className="text-yellow-500 font-bold text-xs tracking-[0.2em] uppercase leading-none mt-1">TRADER</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-6 mr-4">
            <Link to="/" className={`text-sm font-bold uppercase tracking-widest transition-all ${location.pathname === '/' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}>
              {t('nav.home')}
            </Link>
            <Link to="/news" className={`text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${location.pathname === '/news' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}>
              <Newspaper className="w-4 h-4" />
              News
            </Link>
          </nav>

          <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

          {/* Language Selector - Professional Style */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-all text-white group"
            >
              <Globe className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-black uppercase">{currentLanguage.code}</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLanguageDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute top-full mt-3 right-0 rtl:right-auto rtl:left-0 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden min-w-[180px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60]"
                >
                  <div className="p-2 grid gap-1">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                          currentLanguage.code === language.code ? 'bg-yellow-500 text-black' : 'text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{language.flag}</span>
                          <span className="font-bold text-sm">{language.name}</span>
                        </div>
                        {currentLanguage.code === language.code && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-1 pr-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all group">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black text-xs">
                    {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-black text-yellow-500 uppercase tracking-tighter">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-yellow-500/50 group-hover:text-yellow-500 transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900/95 backdrop-blur-2xl border-white/10 text-white w-56 rounded-2xl p-2 shadow-2xl mt-2">
                <div className="px-4 py-3 mb-2 bg-white/5 rounded-xl">
                  <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Account</p>
                  <p className="text-xs font-bold truncate text-gray-400">{user.email}</p>
                </div>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl focus:bg-yellow-500 focus:text-black cursor-pointer font-bold py-3">
                  <Settings className="w-4 h-4 mr-3" />
                  {t('nav.settings')}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 my-1" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl focus:bg-red-500 focus:text-white text-red-400 cursor-pointer font-bold py-3">
                  <LogOut className="w-4 h-4 mr-3" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={() => navigate('/auth')} 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-black uppercase tracking-widest px-8 rounded-full shadow-lg shadow-yellow-500/20 transition-all active:scale-95"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {t('nav.login')}
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white active:scale-90 transition-all" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu - Professional Fullscreen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] lg:hidden bg-black flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <img src={siteLogo} alt="Logo" className="w-8 h-8 rounded-lg" />
                <span className="text-white font-black text-lg uppercase">AHMED TRADER</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              <div className="grid gap-4">
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Navigation</p>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-black text-white flex items-center justify-between group">
                  {t('nav.home')}
                  <ChevronDown className="w-6 h-6 -rotate-90 text-white/20 group-hover:text-yellow-500 transition-colors" />
                </Link>
                <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-black text-white flex items-center justify-between group">
                  News
                  <ChevronDown className="w-6 h-6 -rotate-90 text-white/20 group-hover:text-yellow-500 transition-colors" />
                </Link>
              </div>

              <div className="grid gap-4">
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Language</p>
                <div className="grid grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { changeLanguage(lang.code); setIsMobileMenuOpen(false); }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${currentLanguage.code === lang.code ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/5 border-white/10 text-white'}`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-[10px] font-black uppercase">{lang.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {user && (
                <div className="grid gap-4">
                  <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Account</p>
                  <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-white">
                    <Settings className="w-6 h-6 text-yellow-500" />
                    <span className="text-lg font-bold">{t('nav.settings')}</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5">
              {user ? (
                <Button onClick={handleLogout} className="w-full h-14 bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest rounded-2xl">
                  <LogOut className="w-5 h-5 mr-3" />
                  {t('nav.logout')}
                </Button>
              ) : (
                <Button onClick={() => { navigate('/auth'); setIsMobileMenuOpen(false); }} className="w-full h-14 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-yellow-500/20">
                  <LogIn className="w-5 h-5 mr-3" />
                  {t('nav.login')}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
