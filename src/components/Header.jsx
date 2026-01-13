import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { Button } from './ui/button';
import { User, LogOut, Settings, Menu, X, LogIn, Send, Instagram, Video, LayoutDashboard, Bell, AlertTriangle, Home, Newspaper } from 'lucide-react';
import siteLogo from '../assets/site_logo.jpg';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const socialChannels = [
    { name: 'Telegram', icon: <Send className="w-4 h-4" />, url: 'https://t.me/ahmed_trader_123' },
    { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, url: 'https://www.instagram.com/mohamed_chokry' },
    { name: 'TikTok', icon: <Video className="w-4 h-4" />, url: 'https://www.tiktok.com/@ahmed.trader123' }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // التحقق من الأدمن
        const adminEmails = ['mchokri100@gmail.com', 'ahmed1195@gmail.com'];
        setIsAdmin(adminEmails.includes(currentUser.email?.toLowerCase()));
        
        // جلب بيانات المستخدم
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

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleAdminClick = (e) => {
    e.preventDefault();
    setIsSidebarOpen(false);
    setIsUserOpen(false);
    navigate('/admin');
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
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 w-full ${isScrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/10 py-2' : 'bg-black/50 backdrop-blur-sm py-4'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between max-w-full">
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-white hover:text-yellow-500 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2 group">
            <img src={siteLogo} alt="Logo" className="w-8 h-8 rounded-full border border-yellow-500/50" />
            <span className="text-white font-black text-sm tracking-tight uppercase hidden xs:block">Ahmed <span className="text-yellow-500">Trader</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {user && (
            <div className="relative">
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                <Bell className="w-5 h-5" />
                {showWarning && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-black animate-pulse" />}
              </button>
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full mt-2 right-0 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[250px] p-2 z-[110]">
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Notifications</span>
                    </div>
                    {userData?.warning ? (
                      <div className={`p-3 rounded-lg transition-colors cursor-pointer ${userData.warningRead ? 'bg-white/5' : 'bg-red-500/10 border border-red-500/20'}`} onClick={markWarningAsRead}>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <p className="text-[10px] font-bold text-white">Warning</p>
                        </div>
                        <p className="text-[10px] text-gray-400 line-clamp-2">{userData.warning}</p>
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">No notifications</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {user ? (
            <div className="relative">
              <button onClick={() => setIsUserOpen(!isUserOpen)} className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all">
                <User className="w-3 h-3" />
                <span className="hidden sm:inline">{userData?.fullName?.split(' ')[0] || user.displayName?.split(' ')[0] || 'User'}</span>
              </button>
              <AnimatePresence>
                {isUserOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full mt-2 right-0 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[160px] z-[110]">
                    {isAdmin && (
                      <button onClick={handleAdminClick} className="w-full px-4 py-3 text-[10px] font-bold text-yellow-500 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5">
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </button>
                    )}
                    <button onClick={() => { navigate('/settings'); setIsUserOpen(false); }} className="w-full px-4 py-3 text-[10px] font-bold text-white hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button onClick={() => signOut(auth)} className="w-full px-4 py-3 text-[10px] font-bold text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-3">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/auth" className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all flex items-center gap-2">
              <LogIn className="w-3 h-3" /> <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]" />
            <motion.div 
              initial={{ x: i18n.language === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: i18n.language === 'ar' ? '100%' : '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed top-0 ${i18n.language === 'ar' ? 'right-0' : 'left-0'} bottom-0 w-[280px] bg-zinc-950 border-${i18n.language === 'ar' ? 'l' : 'r'} border-white/10 z-[160] shadow-2xl flex flex-col`}
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={siteLogo} alt="Logo" className="w-8 h-8 rounded-full border border-yellow-500/50" />
                  <span className="text-white font-black text-lg uppercase tracking-tighter">Ahmed <span className="text-yellow-500">Trader</span></span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                <div className="space-y-2">
                  <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Navigation</p>
                  <Link to="/" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname === '/' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <Home className="w-5 h-5" /> Home
                  </Link>
                  <Link to="/news" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname === '/news' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <Newspaper className="w-5 h-5" /> News
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname === '/admin' ? 'bg-yellow-500 text-black' : 'text-yellow-500 hover:bg-white/5'}`}>
                      <LayoutDashboard className="w-5 h-5" /> Admin Panel
                    </Link>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Social Channels</p>
                  <div className="grid grid-cols-1 gap-2">
                    {socialChannels.map((channel) => (
                      <a key={channel.name} href={channel.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-300 hover:border-yellow-500/30 hover:text-white transition-all">
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center border border-white/10">{channel.icon}</div>
                        <span className="text-sm font-bold">{channel.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/5 bg-black/50">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center overflow-hidden">
                        {userData?.photoURL ? <img src={userData.photoURL} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-yellow-500" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white truncate max-w-[150px]">{userData?.fullName || user.displayName || 'User'}</span>
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
                    <LogIn className="w-5 h-5" /> Login
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
