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
import { Globe, User, LogOut, Settings, Menu, X, Home, LogIn, ChevronDown } from 'lucide-react';
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

    window.addEventListener('scroll', handleScroll);
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-yellow-500/20 py-2' : 'bg-black/20 backdrop-blur-md border-b border-white/10 py-4'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
            <img src={siteLogo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-white font-black text-xl tracking-tighter uppercase">AHMED TRADER</span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {location.pathname !== '/' && (
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:bg-white/10">
              <Home className="h-4 w-4 mr-2" />
              {t('nav.home')}
            </Button>
          )}

          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <span className="text-lg mr-2">{currentLanguage.flag}</span>
              <span className="hidden sm:inline">{currentLanguage.name}</span>
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            <AnimatePresence>
              {isLanguageDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden min-w-[150px] shadow-2xl"
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-left rtl:text-right hover:bg-yellow-500 hover:text-black transition-colors ${
                        currentLanguage.code === language.code ? 'bg-white/10 text-yellow-400' : 'text-white'
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span className="font-bold">{language.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest">
                  <User className="w-4 h-4 mr-2" />
                  {user.displayName || user.email.split('@')[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-white/10 text-white w-48">
                <DropdownMenuItem onClick={() => navigate('/settings')} className="focus:bg-yellow-500 focus:text-black cursor-pointer font-bold">
                  <Settings className="w-4 h-4 mr-2" />
                  {t('nav.settings')}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-500 focus:text-white text-red-400 cursor-pointer font-bold">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/auth')} className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest">
              <LogIn className="h-4 w-4 mr-2" />
              {t('nav.login')}
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-yellow-500/20 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white flex items-center">
                <Home className="w-5 h-5 mr-2" />
                {t('nav.home')}
              </Link>
              
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { changeLanguage(lang.code); setIsMobileMenuOpen(false); }}
                    className={`p-2 rounded-lg border border-white/10 text-center ${currentLanguage.code === lang.code ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white'}`}
                  >
                    <div className="text-xl">{lang.flag}</div>
                    <div className="text-[10px] font-bold uppercase">{lang.code}</div>
                  </button>
                ))}
              </div>

              {user ? (
                <>
                  <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    {t('nav.settings')}
                  </Link>
                  <button onClick={handleLogout} className="text-left text-lg font-bold text-red-400 flex items-center">
                    <LogOut className="w-5 h-5 mr-2" />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Button onClick={() => { navigate('/auth'); setIsMobileMenuOpen(false); }} className="bg-yellow-500 text-black font-black">
                  <LogIn className="w-5 h-5 mr-2" />
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
