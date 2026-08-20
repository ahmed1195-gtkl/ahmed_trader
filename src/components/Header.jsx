import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Calculator,
  Activity,
  Info,
  GraduationCap,
  Plus,
  TrendingUp,
  MessageCircle,
  Trophy,
  Crown,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import shukritradeLogo from '../assets/logo.png';
import { toast } from 'sonner';
import SubscriptionModal from './SubscriptionModal';
import { useTheme } from '../context/ThemeContext';
import { isAdminUser } from '../lib/adminService';
import { usePlatform } from '../context/PlatformContext';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [siteSettings, setSiteSettings] = useState({ showAIBot: true, showPipCalculator: true });
  const [isBotActive, setIsBotActive] = useState(true);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setIsAdmin(isAdminUser(data));
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

  const languages = useMemo(() => [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ], []);

  const socialChannels = useMemo(() => [
    { name: 'TikTok', icon: <video className="w-4 h-4" preload="none" />, url: 'https://www.tiktok.com/@ahmed.trader123' },
    { name: 'Telegram', icon: <Send className="w-4 h-4" />, url: 'https://t.me/ahmed_trader_123' },
    { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, url: 'https://www.instagram.com/mohamed_chokry' }
  ], []);

  const { maintenance, pageMaintenance } = usePlatform();

  const navLinks = useMemo(() => [
    { key: 'home', name: t('nav.home'), path: '/', icon: <Home className="w-4 h-4" />, show: true },
    { key: 'brokers', name: i18n.language === 'ar' ? 'الوسطاء' : i18n.language === 'fr' ? 'Courtiers' : 'Brokers', path: '/brokers', icon: <TrendingUp className="w-4 h-4" />, show: true },
    { key: 'news', name: i18n.language === 'ar' ? 'الأخبار' : 'Market News', path: '/news', icon: <Activity className="w-4 h-4" />, show: true },
    { key: 'news', name: i18n.language === 'ar' ? 'أخبار عالمية' : 'Global News', path: '/global-news', icon: <Newspaper className="w-4 h-4" />, show: true },
    { key: 'courses', name: i18n.language === 'ar' ? 'الكورسات' : 'Courses', path: '/courses', icon: <GraduationCap className="w-4 h-4" />, show: true },
    { key: 'challenges', name: i18n.language === 'ar' ? 'التحديات' : i18n.language === 'fr' ? 'Défis' : 'Challenges', path: '/challenges', icon: <Trophy className="w-4 h-4" />, show: true },
    { key: 'messages', name: i18n.language === 'ar' ? 'الرسائل' : 'Messages', path: '/messages', icon: <MessageCircle className="w-4 h-4" />, show: true },
    { key: 'aiBot', name: 'AI Bot', path: '/ai-bot', icon: <Zap className="w-4 h-4" />, show: siteSettings.showAIBot },
    { key: 'pipCalculator', name: 'Pips', path: '/pip-calculator', icon: <Calculator className="w-4 h-4" />, show: siteSettings.showPipCalculator },
    { key: 'academy', name: i18n.language === 'ar' ? 'الأكاديمية' : i18n.language === 'fr' ? 'Académie' : i18n.language === 'es' ? 'Academia' : 'Academy', path: '/academy', icon: <BookOpen className="w-4 h-4" />, show: true },
    { key: 'books', name: i18n.language === 'ar' ? 'الكتب' : i18n.language === 'fr' ? 'Livres' : 'Books', path: '/books', icon: <BookOpen className="w-4 h-4" />, show: true },
  ].filter(link => link.show), [i18n.language, t, siteSettings.showAIBot, siteSettings.showPipCalculator]);

  const changeLanguage = useCallback((code) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
    window.location.reload();
  }, [i18n]);

  const markWarningAsRead = useCallback(async () => {
    if (user && userData?.warning) {
      await updateDoc(doc(db, 'users', user.uid), {
        warningRead: true
      });
      setShowWarning(false);
    }
  }, [user, userData]);

  const prefetchRoute = useCallback((path) => {
    try {
      if (path === '/brokers') import('./BrokersPage');
      else if (path === '/news') import('./NewsPage');
      else if (path === '/books') import('./BooksPage');
      else if (path === '/academy') import('./academy/Academy');
      else if (path === '/ai-bot') import('./AITradingBot');
      else if (path === '/pip-calculator') import('./PipCalculator');
      else if (path === '/messages') import('./Messages');
      else if (path === '/settings') import('./Settings');
      else if (path === '/admin') import('./AdminDashboard');
      else if (path === '/admin/courses') import('./CoursesAdmin');
      else if (path === '/admin/challenges') import('./ChallengeAdmin');
      else if (path === '/global-leaderboard') import('./GlobalLeaderboard');
      else if (path === '/market-intelligence') import('./MarketIntelligence');
      else if (path === '/sheets-guide') import('./SheetsGuide');
    } catch (e) {
      console.warn("Failed to prefetch route", path, e);
    }
  }, []);


  // وظيفة تبديل حالة البوت مع تسجيل النشاط وإظهار إشعار
  const toggleBot = async () => {
    const newStatus = !isBotActive;
    setIsBotActive(newStatus);
    
    // إغلاق القوائم الأخرى عند التفاعل
    setIsLangOpen(false);
    setIsNotificationsOpen(false);

    // إظهار إشعار مؤقت
    if (newStatus) {
      toast.info(i18n.language === 'ar' ? 'تم تفعيل التحليل الخلفي. تنبيه: قد يزداد استهلاك موارد الجهاز.' : 'Background analysis activated. Warning: Resource usage may increase.', {
        icon: <Activity className="w-4 h-4 text-primary" />,
        duration: 4000
      });
    } else {
      toast.success(i18n.language === 'ar' ? 'تم إيقاف التحليل الخلفي لتوفير الموارد.' : 'Background analysis paused to save resources.', {
        icon: <Info className="w-4 h-4 text-blue-500" />,
        duration: 4000
      });
    }

    // تسجيل النشاط في Firebase
    if (user) {
      try {
        await addDoc(collection(db, 'activity_logs'), {
          userId: user.uid,
          userEmail: user.email,
          action: newStatus ? 'ACTIVATE_BOT' : 'DEACTIVATE_BOT',
          details: newStatus ? 'User enabled background analysis' : 'User disabled background analysis',
          timestamp: serverTimestamp(),
          platform: 'Web'
        });
      } catch (error) {
        console.error("Error logging activity:", error);
      }
    }
  };

  // وظائف لفتح القوائم مع إغلاق الأخرى لمنع التداخل
  const toggleLang = () => {
    setIsLangOpen(!isLangOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsLangOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-2' : 'py-6'}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className={`relative flex items-center justify-between bg-card/40 backdrop-blur-2xl border border-border rounded-xl px-4 md:px-6 py-3 transition-all duration-500 ${isScrolled ? 'shadow-lg shadow-gold-glow border-border' : ''}`}>
          
          {/* Logo + Site Name */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative">
              <img src={shukritradeLogo} alt="Shukritrade" className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-all duration-500 group-hover:brightness-110 group-hover:drop-shadow-[0_0_15px_var(--gold-shadow)]" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
          </Link>



          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md bg-secondary border border-border text-foreground hover:bg-muted transition-all"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={toggleLang} 
                aria-label="Switch Language"
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md bg-secondary border border-border text-foreground hover:bg-muted transition-all"
              >
                <Globe className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 10 }} 
                    className="absolute top-full right-0 mt-4 w-40 bg-card/95 backdrop-blur-2xl border border-border rounded-lg p-2 shadow-2xl z-[102]"
                  >
                    {languages.map((lang) => (
                      <button key={lang.code} onClick={() => changeLanguage(lang.code)} className={`flex items-center justify-between w-full px-4 py-3 rounded-md transition-all ${i18n.language === lang.code ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest">{lang.name}</span>
                        <span>{lang.flag}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages Quick Button */}
            {user && (
              <button
                onClick={() => navigate('/messages')}
                onMouseEnter={() => prefetchRoute('/messages')}
                aria-label="Messages"
                className="w-9 h-9 md:w-10 md:h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground hover:bg-muted hover:border-amber-500/40 transition-all relative"
                title={i18n.language === 'ar' ? 'الرسائل' : 'Messages'}
              >
                <MessageCircle className="w-4 h-4 text-amber-500" />
              </button>
            )}

            {/* User Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-border">
                <button 
                  onClick={() => navigate('/settings')} 
                  onMouseEnter={() => prefetchRoute('/settings')}
                  aria-label="Profile Settings"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <User className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => signOut(auth)} 
                  aria-label="Sign Out"
                  className="hidden md:flex w-10 h-10 rounded-md bg-destructive/10 border border-destructive/20 items-center justify-center text-destructive hover:bg-destructive hover:text-amber-500 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth" className="px-4 md:px-6 py-2 md:py-2.5 rounded-md bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                  {t('nav.login')}
                </Link>
              </div>
            )}

            {/* Menu Toggle (always visible on all devices) */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="w-9 h-9 flex items-center justify-center rounded-md bg-secondary border border-border text-foreground hover:bg-muted"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-card border-l border-border z-[101] p-6 overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                  <span className="text-foreground font-black uppercase tracking-widest text-sm">Menu</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isLinkUnderMaintenance = maintenance || (link.key && pageMaintenance?.[link.key]?.enabled === true);
                    return (
                      <Link 
                        key={link.path} 
                        to={link.path} 
                        onClick={() => setIsSidebarOpen(false)}
                        onMouseEnter={() => prefetchRoute(link.path)}
                        className={`flex items-center justify-between px-4 py-4 rounded-md text-xs font-black uppercase tracking-widest transition-all ${location.pathname === link.path ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                      >
                        <span className="flex items-center gap-3">
                          {link.icon} {link.name}
                        </span>
                        {isLinkUnderMaintenance && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[9px] font-black tracking-wider">
                            {i18n.language === 'ar' ? 'تحت الصيانة' : 'Maint'}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                  {user && isAdmin && (
                    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest px-4 mb-1">
                        {i18n.language === 'ar' ? 'الإدارة' : 'Administration'}
                      </span>
                      <Link 
                        to="/admin" 
                        onClick={() => setIsSidebarOpen(false)}
                        onMouseEnter={() => prefetchRoute('/admin')}
                        className={`flex items-center gap-4 p-4 rounded-md transition-all ${location.pathname === '/admin' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary border border-primary/20'}`}
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">{t('nav.admin', 'Admin')}</span>
                      </Link>
                      <Link 
                        to="/admin/courses" 
                        onClick={() => setIsSidebarOpen(false)}
                        onMouseEnter={() => prefetchRoute('/admin/courses')}
                        className={`flex items-center gap-4 p-4 rounded-md transition-all ${location.pathname === '/admin/courses' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary border border-primary/20'}`}
                      >
                        <GraduationCap className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">{i18n.language === 'ar' ? 'إدارة الكورسات' : 'Manage Courses'}</span>
                      </Link>
                      <Link 
                        to="/admin/challenges" 
                        onClick={() => setIsSidebarOpen(false)}
                        onMouseEnter={() => prefetchRoute('/admin/challenges')}
                        className={`flex items-center gap-4 p-4 rounded-md transition-all ${location.pathname === '/admin/challenges' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary border border-primary/20'}`}
                      >
                        <Trophy className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">{i18n.language === 'ar' ? 'إدارة التحديات' : 'Manage Challenges'}</span>
                      </Link>
                    </div>
                  )}
                  {!user && (
                    <>
                      <Link 
                        to="/auth" 
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-md text-xs font-black uppercase tracking-widest bg-primary text-primary-foreground mt-4"
                      >
                        <LogIn className="w-4 h-4" /> {t('nav.login')}
                      </Link>
                      <Link 
                        to="/auth" 
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-md text-xs font-black uppercase tracking-widest bg-secondary text-foreground border border-border"
                      >
                        <User className="w-4 h-4" /> {t('auth.signup')}
                      </Link>
                    </>
                  )}

                  {user && (
                    <button 
                      onClick={() => { signOut(auth); setIsSidebarOpen(false); }}
                      className="flex items-center gap-4 px-4 py-4 rounded-md text-xs font-black uppercase tracking-widest text-destructive bg-destructive/10 border border-destructive/20 mt-4 text-left"
                    >
                      <LogOut className="w-4 h-4" /> {t('nav.logout')}
                    </button>
                  )}
                </div>
                <div className="mt-auto pt-6 border-t border-border">
                  <div className="flex justify-center gap-6">
                    {socialChannels.map((channel) => (
                      <a key={channel.name} href={channel.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-md bg-secondary text-muted-foreground hover:text-primary transition-all">
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

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen} 
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentPlan={userData?.subscription || 'free'}
      />
    </header>
  );
};

export default Header;
