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
  Calculator,
  Activity,
  Info,
  GraduationCap,
  Plus,
  TrendingUp,
  MessageCircle,
  Trophy,
  Crown,
  BookOpen
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import shukritradeLogo from '../assets/shukritrade_logo.svg';
import { toast } from 'sonner';
import SubscriptionModal from './SubscriptionModal';

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
  const [isBotActive, setIsBotActive] = useState(true);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
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
            setIsAdmin(data.isAdmin || adminEmails.includes(currentUser.email?.toLowerCase()));
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
    { name: t('nav.home'), path: '/', icon: <Home className="w-4 h-4" />, show: true },
    { name: i18n.language === 'ar' ? 'الوسطاء' : i18n.language === 'fr' ? 'Courtiers' : 'Brokers', path: '/brokers', icon: <TrendingUp className="w-4 h-4" />, show: true },
    { name: i18n.language === 'ar' ? 'الأخبار' : 'Market News', path: '/news', icon: <Activity className="w-4 h-4" />, show: true },
    { name: i18n.language === 'ar' ? 'أخبار عالمية' : 'Global News', path: '/global-news', icon: <Newspaper className="w-4 h-4" />, show: true },
    { name: i18n.language === 'ar' ? 'الكورسات' : 'Courses', path: '/courses', icon: <GraduationCap className="w-4 h-4" />, show: true },
    { name: i18n.language === 'ar' ? 'التحديات' : i18n.language === 'fr' ? 'Défis' : 'Challenges', path: '/challenges', icon: <Trophy className="w-4 h-4" />, show: true },
    { name: i18n.language === 'ar' ? 'الرسائل' : 'Messages', path: '/messages', icon: <MessageCircle className="w-4 h-4" />, show: true },
    { name: 'AI Bot', path: '/ai-bot', icon: <Zap className="w-4 h-4" />, show: siteSettings.showAIBot },
    { name: 'Pips', path: '/pip-calculator', icon: <Calculator className="w-4 h-4" />, show: siteSettings.showPipCalculator },
    { name: i18n.language === 'ar' ? 'الأكاديمية' : i18n.language === 'fr' ? 'Académie' : i18n.language === 'es' ? 'Academia' : 'Academy', path: '/academy', icon: <BookOpen className="w-4 h-4" />, show: true },
  ].filter(link => link.show);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
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
        icon: <Activity className="w-4 h-4 text-amber-500" />,
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
        <div className={`relative flex items-center justify-between bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 md:px-6 py-3 transition-all duration-500 ${isScrolled ? 'shadow-2xl shadow-[#f0bf52]/10 border-white/20' : ''}`}>
          
          {/* Logo + Site Name */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative">
              <img src={shukritradeLogo} alt="Shukritrade" className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain transition-all duration-500 group-hover:brightness-125 group-hover:drop-shadow-[0_0_30px_rgba(240,191,82,0.6)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f0bf52]/20 to-[#ac8941]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
          </Link>

          {/* Unified Nav - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5 ${location.pathname === link.path ? 'text-amber-500 bg-amber-500/5' : 'text-gray-400'}`}
              >
                {link.icon} {link.name}
              </Link>
            ))}
            
            {user && isAdmin && (
              <div className="flex items-center gap-2">
                <Link 
                  to="/admin" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-amber-500 hover:text-black ${location.pathname === '/admin' ? 'bg-amber-500 text-black' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}
                >
                  <Plus className="w-3 h-3" /> {t('nav.admin', 'Admin')}
                </Link>
                <Link 
                  to="/admin/courses" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-amber-500 hover:text-black ${location.pathname === '/admin/courses' ? 'bg-amber-500 text-black' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}
                >
                  <GraduationCap className="w-3 h-3" /> {i18n.language === 'ar' ? 'إدارة الكورسات' : 'Manage Courses'}
                </Link>
                <Link 
                  to="/admin/challenges" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-amber-500 hover:text-black ${location.pathname === '/admin/challenges' ? 'bg-amber-500 text-black' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}
                >
                  <Trophy className="w-3 h-3" /> {i18n.language === 'ar' ? 'إدارة التحديات' : 'Manage Challenges'}
                </Link>
              </div>
            )}

            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-amber-500 transition-all hover:bg-white/5">
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
            {/* Subscription Button */}
            {user && (
              <button
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl"
              >
                <Crown size={16} />
                {i18n.language === 'ar' ? 'الاشتراكات' : 'Subscriptions'}
              </button>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <button onClick={toggleLang} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
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
                      <button key={lang.code} onClick={() => changeLanguage(lang.code)} className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${i18n.language === lang.code ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest">{lang.name}</span>
                        <span>{lang.flag}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-white/10">
                <button onClick={() => navigate('/settings')} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-black transition-all">
                  <User className="w-4 h-4" />
                </button>
                <button onClick={() => signOut(auth)} className="hidden md:flex w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth" className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20">
                  {t('nav.login')}
                </Link>
                <Link to="/auth" className="hidden md:flex px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  {t('auth.signup')}
                </Link>
              </div>
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
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${location.pathname === link.path ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                      {link.icon} {link.name}
                    </Link>
                  ))}
                  {user && isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${location.pathname === '/admin' ? 'bg-amber-500 text-black' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest">{t('nav.admin', 'Admin')}</span>
                    </Link>
                  )}
                  {!user && (
                    <>
                      <Link 
                        to="/auth" 
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-amber-500 text-black mt-4"
                      >
                        <LogIn className="w-4 h-4" /> {t('nav.login')}
                      </Link>
                      <Link 
                        to="/auth" 
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-white/5 text-white border border-white/10"
                      >
                        <User className="w-4 h-4" /> {t('auth.signup')}
                      </Link>
                    </>
                  )}

                  {user && (
                    <button 
                      onClick={() => { signOut(auth); setIsSidebarOpen(false); }}
                      className="flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 bg-red-500/10 border border-red-500/20 mt-4"
                    >
                      <LogOut className="w-4 h-4" /> {t('nav.logout')}
                    </button>
                  )}
                </div>
                <div className="mt-auto pt-6 border-t border-white/5">
                  <div className="flex justify-center gap-6">
                    {socialChannels.map((channel) => (
                      <a key={channel.name} href={channel.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-amber-500 transition-all">
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
