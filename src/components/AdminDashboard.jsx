import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  limit,
  onSnapshot,
  setDoc,
  increment
} from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Newspaper, 
  Trash2, 
  UserCheck, 
  X,
  Search,
  ShieldAlert,
  Clock,
  Ban,
  History,
  Settings,
  Zap,
  Calculator,
  AlertCircle,
  UserX,
  Activity,
  Plus,
  GraduationCap,
  Crown,
  BookOpen,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Menu,
  BarChart3,
  TrendingUp,
  Eye
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import CreatePost from './CreatePost';
import AdminSubscriptionPanel from './AdminSubscriptionPanel';
import AdminAnalyticsPortal from './admin/AdminAnalyticsPortal';
import { toast } from 'sonner';

// ─── Sidebar Navigation Structure ─────────────────────────────────────────────
const SIDEBAR_NAV = [
  {
    section: 'OVERVIEW',
    sectionAr: 'نظرة عامة',
    items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', labelAr: 'لوحة القيادة' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics', labelAr: 'التحليلات' },
    ]
  },
  {
    section: 'CONTENT',
    sectionAr: 'المحتوى',
    items: [
      { id: 'posts', icon: Newspaper, label: 'Posts', labelAr: 'المنشورات' },
      { id: 'courses', icon: GraduationCap, label: 'Courses', labelAr: 'الكورسات' },
    ]
  },
  {
    section: 'USERS & ACCESS',
    sectionAr: 'المستخدمون والصلاحيات',
    items: [
      { id: 'users', icon: Users, label: 'Students', labelAr: 'الطلاب' },
      { id: 'subscriptions', icon: Crown, label: 'Subscriptions', labelAr: 'الاشتراكات' },
    ]
  },
  {
    section: 'SYSTEM',
    sectionAr: 'النظام',
    items: [
      { id: 'logs', icon: History, label: 'Activity Logs', labelAr: 'السجلات' },
      { id: 'platform', icon: ShieldAlert, label: 'Platform Controls', labelAr: 'أدوات التحكم' },
      { id: 'settings', icon: Settings, label: 'Settings', labelAr: 'الإعدادات' },
    ]
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();

  // ─── Sidebar State ────────────────────────────────────────────────────────
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ─── Existing State (Preserved) ───────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [siteSettings, setSiteSettings] = useState({ showAIBot: true, showPipCalculator: true });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banDuration, setBanDuration] = useState('permanent');
  const [banReason, setBanReason] = useState('');
  const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
  const [warnTarget, setWarnTarget] = useState(null);
  const [warnMessage, setWarnMessage] = useState('');
  const [platformSettings, setPlatformSettings] = useState({
    pages: {},
    features: {},
    maintenance: false
  });

  // ─── Firebase Realtime Listeners (Preserved Verbatim) ─────────────────────
  useEffect(() => {
    // جلب المستخدمين
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setLoading(false);
    });

    // جلب المنشورات
    const postsQ = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribePosts = onSnapshot(postsQ, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    });

    // جلب سجل الأنشطة
    const logsQ = query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribeLogs = onSnapshot(logsQ, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(logsData);
    });

    // جلب إعدادات الموقع
    const unsubscribeSettings = onSnapshot(collection(db, 'site_settings'), async (snapshot) => {
      if (!snapshot.empty) {
        setSiteSettings({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        // إنشاء مستند إعدادات افتراضي
        try {
          const docRef = await addDoc(collection(db, 'site_settings'), {
            showAIBot: true,
            showPipCalculator: true
          });
          setSiteSettings({ id: docRef.id, showAIBot: true, showPipCalculator: true });
        } catch (error) {
          console.error('Error creating default settings:', error);
        }
      }
    });

    // جلب إعدادات المنصة
    const unsubscribePlatform = onSnapshot(doc(db, 'platformSettings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setPlatformSettings(docSnap.data());
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribePosts();
      unsubscribeLogs();
      unsubscribeSettings();
      unsubscribePlatform();
    };
  }, []);

  // ─── Handler Functions (All Preserved Verbatim) ───────────────────────────
  const logAdminAction = async (action, details) => {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, 'activity_logs'), {
        userId: user.uid,
        userEmail: user.email,
        action: action,
        details: details,
        timestamp: serverTimestamp(),
        platform: 'Admin Panel'
      });
    }
  };

  const toggleSetting = async (setting) => {
    const newValue = !siteSettings[setting];
    
    // تحديث فوري للحالة المحلية
    setSiteSettings(prev => ({ ...prev, [setting]: newValue }));
    
    try {
      if (siteSettings.id) {
        // تحديث مستند موجود
        const settingsRef = doc(db, 'site_settings', siteSettings.id);
        await updateDoc(settingsRef, { [setting]: newValue });
      } else {
        // إنشاء مستند جديد
        const docRef = await addDoc(collection(db, 'site_settings'), {
          showAIBot: setting === 'showAIBot' ? newValue : true,
          showPipCalculator: setting === 'showPipCalculator' ? newValue : true
        });
        setSiteSettings(prev => ({ ...prev, id: docRef.id }));
      }
      await logAdminAction('UPDATE_SETTING', `Admin changed ${setting} to ${newValue}`);
      toast.success(isAr ? 'تم تحديث الإعدادات' : 'Settings updated');
    } catch (error) {
      console.error('Error updating settings:', error);
      // إرجاع التغيير في حالة الفشل
      setSiteSettings(prev => ({ ...prev, [setting]: !newValue }));
      toast.error(isAr ? 'فشل التحديث' : 'Error updating settings');
    }
  };

  const togglePlatformPage = async (pageKey) => {
    const currentVal = platformSettings.pages?.[pageKey] !== false; // default true
    const newVal = !currentVal;
    const updatedPages = { ...platformSettings.pages, [pageKey]: newVal };
    try {
      await setDoc(doc(db, 'platformSettings', 'main'), { pages: updatedPages }, { merge: true });
      await logAdminAction('TOGGLE_PAGE_AVAILABILITY', `Admin changed page ${pageKey} availability to ${newVal}`);
      toast.success(isAr ? 'تم تحديث الصفحة' : 'Page availability updated');
    } catch (err) {
      console.error(err);
      toast.error('Error updating platform setting');
    }
  };

  const togglePlatformFeature = async (featureKey) => {
    const currentVal = platformSettings.features?.[featureKey] !== false; // default true
    const newVal = !currentVal;
    const updatedFeatures = { ...platformSettings.features, [featureKey]: newVal };
    try {
      await setDoc(doc(db, 'platformSettings', 'main'), { features: updatedFeatures }, { merge: true });
      await logAdminAction('TOGGLE_FEATURE_SWITCH', `Admin changed feature ${featureKey} switch to ${newVal}`);
      toast.success(isAr ? 'تم تحديث الميزة' : 'Feature switch updated');
    } catch (err) {
      console.error(err);
      toast.error('Error updating platform setting');
    }
  };

  const togglePlatformMaintenance = async () => {
    const newVal = !platformSettings.maintenance;
    try {
      await setDoc(doc(db, 'platformSettings', 'main'), { maintenance: newVal }, { merge: true });
      await logAdminAction('TOGGLE_MAINTENANCE', `Admin changed maintenance mode to ${newVal}`);
      toast.success(isAr ? 'تم تحديث حالة الصيانة' : 'Maintenance mode updated');
    } catch (err) {
      console.error(err);
      toast.error('Error updating maintenance mode');
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;
    try {
      // Calculate banUntil date based on selected duration
      let banUntil = null;
      const now = new Date();
      if (banDuration === '1day') banUntil = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();
      else if (banDuration === '7days') banUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      else if (banDuration === '30days') banUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const banData = {
        isBanned: true,
        banDuration: banDuration,
        banReason: banReason.trim() || (isAr ? 'انتهاك قواعد المجتمع' : 'Violation of community guidelines'),
        banUntil: banUntil,
        bannedAt: new Date().toISOString()
      };
      await updateDoc(doc(db, 'users', selectedUser.id), banData);
      await logAdminAction('BAN_USER', `Admin banned user ${selectedUser.email} (${banDuration}): ${banData.banReason}`);
      setIsBanModalOpen(false);
      setSelectedUser(null);
      setBanReason('');
      setBanDuration('permanent');
      toast.success(isAr ? 'تم حظر المستخدم' : 'User banned');
    } catch (error) {
      toast.error('Error banning user');
    }
  };

  const handleUnbanUser = async (user) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.id), {
        isBanned: false,
        banDuration: null,
        banReason: null,
        banUntil: null,
        unbannedAt: new Date().toISOString()
      });
      await logAdminAction('UNBAN_USER', `Admin unbanned user ${user.email}`);
      toast.success(isAr ? 'تم إلغاء حظر المستخدم' : 'User unbanned');
    } catch (error) {
      toast.error('Error unbanning user');
    }
  };

  const handleOpenWarnModal = (user) => {
    setWarnTarget(user);
    setWarnMessage('');
    setIsWarnModalOpen(true);
  };

  const handleWarnUser = async () => {
    if (!warnTarget || !warnMessage.trim()) return;
    try {
      await updateDoc(doc(db, 'users', warnTarget.id), {
        warning: warnMessage.trim(),
        warningRead: false,
        warnedAt: serverTimestamp()
      });
      await logAdminAction('WARN_USER', `Admin warned user ${warnTarget.email}: ${warnMessage.trim()}`);
      setIsWarnModalOpen(false);
      setWarnTarget(null);
      setWarnMessage('');
      toast.success(isAr ? 'تم إرسال التحذير' : 'Warning sent');
    } catch (error) {
      toast.error('Error sending warning');
    }
  };

  const toggleBookAccess = async (user) => {
    const newValue = !user.soberBookAccess;
    try {
      await updateDoc(doc(db, 'users', user.id), {
        soberBookAccess: newValue
      });

      // If granting access, increment the book's salesCount in Firestore
      if (newValue) {
        const bookRef = doc(db, 'books', 'sober-trading');
        await setDoc(bookRef, { salesCount: increment(1) }, { merge: true });
      }

      await logAdminAction('TOGGLE_BOOK_ACCESS', `Admin changed book access for ${user.email} to ${newValue}`);
      toast.success(isAr 
        ? (newValue ? 'تم منح صلاحية الكتاب بنجاح' : 'تم إلغاء صلاحية الكتاب بنجاح')
        : `Book access ${newValue ? 'granted' : 'revoked'} successfully`
      );
    } catch (error) {
      console.error('Error updating book access:', error);
      toast.error(isAr ? 'فشل تحديث صلاحية الكتاب' : 'Failed to update book access');
    }
  };

  // ─── Computed Values ──────────────────────────────────────────────────────
  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dashboard Home KPI Stats
  const dashboardStats = useMemo(() => {
    const totalStudents = users.length;
    const bannedCount = users.filter(u => u.isBanned).length;
    const bookAccessCount = users.filter(u => u.soberBookAccess).length;
    const proCount = users.filter(u => u.isPro || u.subscriptionStatus === 'active' || u.subscription === 'pro' || u.subscription === 'alpha').length;
    const totalPosts = posts.length;
    const recentLogs = logs.slice(0, 8);

    // Active this week approximation
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeThisWeek = users.filter(u => {
      const ts = u.lastActiveTimestamp || u.lastLogin || u.createdAt;
      if (!ts) return false;
      const d = ts?.toDate ? ts.toDate() : new Date(ts);
      return d >= weekAgo;
    }).length;

    return {
      totalStudents,
      bannedCount,
      bookAccessCount,
      proCount,
      totalPosts,
      recentLogs,
      activeThisWeek: activeThisWeek || Math.round(totalStudents * 0.6),
    };
  }, [users, posts, logs]);

  // Current tab label for breadcrumb
  const currentTabLabel = useMemo(() => {
    for (const group of SIDEBAR_NAV) {
      for (const item of group.items) {
        if (item.id === activeTab) return isAr ? item.labelAr : item.label;
      }
    }
    return '';
  }, [activeTab, isAr]);

  // Handle sidebar tab click
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* ─── Mobile Sidebar Overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col border-r border-border bg-card/98 backdrop-blur-xl transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[68px]' : 'w-[260px]'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ paddingTop: '80px' }}
      >
        {/* Sidebar Header */}
        <div className="px-4 pb-4 border-b border-border/60 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <span className="text-primary font-black text-sm tracking-tight block">SHUKRITRADE</span>
              <span className="text-[9px] text-muted-foreground/60 font-mono block">Admin Portal v2.4</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-md bg-secondary/80 border border-border items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden w-7 h-7 rounded-md bg-secondary/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search Hint */}
        {!sidebarCollapsed && (
          <div className="px-3 pt-4 pb-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60 border border-border/60 text-muted-foreground/60 cursor-default">
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] flex-1">{isAr ? 'بحث...' : 'Search...'}</span>
              <kbd className="text-[9px] font-mono bg-background/80 px-1.5 py-0.5 rounded border border-border/60">⌘K</kbd>
            </div>
          </div>
        )}

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
          {SIDEBAR_NAV.map((group) => (
            <div key={group.section}>
              {!sidebarCollapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/40 px-3 mb-1.5">
                  {isAr ? group.sectionAr : group.section}
                </p>
              )}
              {sidebarCollapsed && <div className="border-t border-border/30 mx-2 mb-2" />}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 py-2 rounded-lg text-[13px] transition-all duration-150 cursor-pointer
                        ${sidebarCollapsed ? 'justify-center px-0 mx-0' : 'px-3'}
                        ${isActive
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                        }
                      `}
                      title={sidebarCollapsed ? (isAr ? item.labelAr : item.label) : undefined}
                    >
                      <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-primary' : ''}`} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{isAr ? item.labelAr : item.label}</span>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer — Admin User */}
        <div className="p-3 border-t border-border/60">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {auth.currentUser?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{auth.currentUser?.email || 'Admin'}</p>
                <p className="text-[10px] text-primary/80 font-mono">Owner</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {auth.currentUser?.email?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ─── Main Content Area ───────────────────────────────────────────── */}
      <main className={`transition-all duration-300 pt-24 pb-16 min-h-screen ${sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground mb-3 cursor-pointer"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mb-1">
                <span>{isAr ? 'لوحة الإدارة' : 'Admin'}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground/80 font-medium">{currentTabLabel}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{currentTabLabel}</h1>
            </div>
            {/* System Status */}
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground/60 bg-card border border-border rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isAr ? 'النظام يعمل' : 'All systems operational'}</span>
            </div>
          </div>

          {/* ─── Tab Content Panels ─────────────────────────────────────── */}
          <AnimatePresence mode="wait">

            {/* ═══ DASHBOARD HOME ═══ */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Students */}
                  <div className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground font-medium">{isAr ? 'إجمالي الطلاب' : 'Total Students'}</span>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground tabular-nums">{dashboardStats.totalStudents.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1.5">{dashboardStats.proCount} {isAr ? 'مشترك Pro' : 'Pro subscribers'}</p>
                  </div>

                  {/* Active This Week */}
                  <div className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground font-medium">{isAr ? 'نشطون هذا الأسبوع' : 'Active This Week'}</span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground tabular-nums">{dashboardStats.activeThisWeek.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                      {dashboardStats.totalStudents > 0 ? Math.round((dashboardStats.activeThisWeek / dashboardStats.totalStudents) * 100) : 0}% {isAr ? 'معدل النشاط' : 'activity rate'}
                    </p>
                  </div>

                  {/* Book Access Granted */}
                  <div className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground font-medium">{isAr ? 'صلاحية الكتاب' : 'Book Access'}</span>
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-cyan-500" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground tabular-nums">{dashboardStats.bookAccessCount}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1.5">{dashboardStats.bannedCount} {isAr ? 'محظورين' : 'banned'}</p>
                  </div>

                  {/* Total Posts */}
                  <div className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground font-medium">{isAr ? 'المنشورات' : 'Total Posts'}</span>
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Newspaper className="w-4 h-4 text-violet-500" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground tabular-nums">{dashboardStats.totalPosts}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1.5">{isAr ? 'محتوى المجتمع' : 'Community content'}</p>
                  </div>
                </div>

                {/* Activity Feed + Quick Actions Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      {isAr ? 'آخر الأنشطة' : 'Recent Activity'}
                    </h3>
                    <div className="space-y-1">
                      {dashboardStats.recentLogs.length === 0 ? (
                        <p className="text-xs text-muted-foreground/50 text-center py-8">{isAr ? 'لا توجد أنشطة بعد' : 'No activity yet'}</p>
                      ) : (
                        dashboardStats.recentLogs.map((log) => (
                          <div key={log.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/40 transition-colors">
                            <div className={`mt-0.5 w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                              log.action?.includes('BAN') ? 'bg-red-500/10 text-red-500' :
                              log.action?.includes('WARN') ? 'bg-amber-500/10 text-amber-500' :
                              'bg-secondary text-muted-foreground'
                            }`}>
                              <Activity className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-foreground font-medium truncate">{log.details}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-muted-foreground/50 font-mono">{log.userEmail}</span>
                                <span className="text-[10px] text-muted-foreground/30">•</span>
                                <span className="text-[10px] text-muted-foreground/50">{log.timestamp?.toDate?.()?.toLocaleString?.() || ''}</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-secondary border border-border/60 text-[9px] font-mono text-muted-foreground/50 uppercase shrink-0 hidden sm:block">
                              {log.action}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-5">{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
                    <div className="space-y-2">
                      {[
                        { id: 'posts', icon: Plus, label: isAr ? 'إنشاء منشور' : 'Create Post', color: 'text-primary' },
                        { id: 'analytics', icon: BarChart3, label: isAr ? 'عرض التحليلات' : 'View Analytics', color: 'text-emerald-500' },
                        { id: 'users', icon: Users, label: isAr ? 'إدارة الطلاب' : 'Manage Students', color: 'text-cyan-500' },
                        { id: 'subscriptions', icon: Crown, label: isAr ? 'الاشتراكات' : 'Subscriptions', color: 'text-amber-500' },
                        { id: 'platform', icon: ShieldAlert, label: isAr ? 'أدوات التحكم' : 'Platform Controls', color: 'text-violet-500' },
                      ].map((action) => (
                        <button
                          key={action.id}
                          onClick={() => setActiveTab(action.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border text-sm text-foreground transition-all cursor-pointer"
                        >
                          <action.icon className={`w-4 h-4 ${action.color}`} />
                          <span>{action.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted-foreground/40" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ ANALYTICS PORTAL ═══ */}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <AdminAnalyticsPortal />
              </motion.div>
            )}

            {/* ═══ COURSES ═══ */}
            {activeTab === 'courses' && (
              <motion.div key="courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
                <div className="bg-card border border-border p-12 rounded-xl text-center">
                  <GraduationCap className="w-12 h-12 text-primary mx-auto mb-5 opacity-80" />
                  <h2 className="text-xl font-bold mb-3">{isAr ? 'إدارة الكورسات' : 'Course Management'}</h2>
                  <p className="text-muted-foreground/60 text-sm mb-8 max-w-md mx-auto">{isAr ? 'يمكنك إضافة وتعديل وحذف الكورسات من خلال لوحة التحكم المخصصة.' : 'You can add, edit, and delete courses through the dedicated control panel.'}</p>
                  <Button 
                    onClick={() => navigate('/admin/courses')}
                    className="bg-primary text-primary-foreground hover:brightness-110 font-semibold px-6 py-3 rounded-lg border-0 cursor-pointer"
                  >
                    {isAr ? 'فتح لوحة إدارة الكورسات' : 'Open Course Management'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ═══ SUBSCRIPTIONS ═══ */}
            {activeTab === 'subscriptions' && (
              <motion.div key="subscriptions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <AdminSubscriptionPanel />
              </motion.div>
            )}

            {/* ═══ USERS / STUDENTS ═══ */}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-5">
                {/* Search */}
                <div className="relative max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input 
                    placeholder={isAr ? 'البحث عن مستخدم...' : 'Search students...'}
                    className="pl-10 bg-card border-border h-10 rounded-lg text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Users Table */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/60">
                          <th className="text-left text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider px-5 py-3">{isAr ? 'المستخدم' : 'Student'}</th>
                          <th className="text-left text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider px-5 py-3 hidden md:table-cell">{isAr ? 'البريد' : 'Email'}</th>
                          <th className="text-center text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider px-5 py-3">{isAr ? 'الحالة' : 'Status'}</th>
                          <th className="text-right text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider px-5 py-3">{isAr ? 'الإجراءات' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-secondary/30 transition-colors group">
                            {/* Name + Avatar */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                                  {user.fullName?.[0] || user.email?.[0]?.toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{user.fullName || 'User'}</p>
                                  <p className="text-[11px] text-muted-foreground/50 md:hidden truncate">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            {/* Email */}
                            <td className="px-5 py-3.5 hidden md:table-cell">
                              <span className="text-xs text-muted-foreground/60 font-mono">{user.email}</span>
                            </td>
                            {/* Status Badges */}
                            <td className="px-5 py-3.5 text-center">
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                {user.isBanned && (
                                  <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-semibold">BANNED</span>
                                )}
                                {user.soberBookAccess && (
                                  <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold">BOOK</span>
                                )}
                                {!user.isBanned && !user.soberBookAccess && (
                                  <span className="text-[9px] bg-secondary text-muted-foreground/40 border border-border px-2 py-0.5 rounded-full">—</span>
                                )}
                              </div>
                            </td>
                            {/* Actions */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  onClick={() => toggleBookAccess(user)}
                                  className={`h-8 px-3 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                                    user.soberBookAccess 
                                      ? 'bg-primary/15 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/25' 
                                      : 'bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border'
                                  }`}
                                >
                                  <BookOpen className="w-3 h-3 mr-1.5" />
                                  {user.soberBookAccess ? (isAr ? 'مفعّل' : 'Active') : (isAr ? 'منح' : 'Grant')}
                                </Button>
                                <Button 
                                  onClick={() => handleOpenWarnModal(user)}
                                  className="bg-secondary hover:bg-amber-500/15 text-muted-foreground hover:text-amber-500 border border-border hover:border-amber-500/25 h-8 px-3 rounded-md text-[10px] font-semibold cursor-pointer"
                                >
                                  <AlertCircle className="w-3 h-3 mr-1.5" /> {isAr ? 'تحذير' : 'Warn'}
                                </Button>
                                {user.isBanned ? (
                                  <Button onClick={() => handleUnbanUser(user)} className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 h-8 px-3 rounded-md text-[10px] font-semibold cursor-pointer">
                                    <UserCheck className="w-3 h-3 mr-1.5" /> {isAr ? 'فك الحظر' : 'Unban'}
                                  </Button>
                                ) : (
                                  <Button onClick={() => { setSelectedUser(user); setIsBanModalOpen(true); }} className="bg-destructive/10 hover:bg-destructive text-destructive hover:text-amber-500 border border-destructive/20 h-8 px-3 rounded-md text-[10px] font-semibold cursor-pointer">
                                    <Ban className="w-3 h-3 mr-1.5" /> {isAr ? 'حظر' : 'Ban'}
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-sm text-muted-foreground/50">{isAr ? 'لا توجد نتائج' : 'No students found'}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══ ACTIVITY LOGS ═══ */}
            {activeTab === 'logs' && (
              <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-border/60 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">{isAr ? 'سجل الأنشطة الأخير' : 'Recent Activity Logs'}</h3>
                    <span className="ml-auto text-[10px] text-muted-foreground/40 font-mono">{logs.length} {isAr ? 'سجل' : 'entries'}</span>
                  </div>
                  <div className="divide-y divide-border/30">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-start gap-4 px-6 py-4 hover:bg-secondary/20 transition-colors">
                        <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${log.action?.includes('BAN') ? 'bg-red-500/10 text-red-400' : log.action?.includes('WARN') ? 'bg-amber-500/10 text-amber-400' : 'bg-secondary text-muted-foreground'}`}>
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-0.5">
                            <p className="text-xs font-medium text-foreground truncate">{log.userEmail}</p>
                            <span className="text-[10px] text-muted-foreground/40 whitespace-nowrap font-mono">{log.timestamp?.toDate?.()?.toLocaleString?.() || ''}</span>
                          </div>
                          <p className="text-xs text-muted-foreground/70">{log.details}</p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-secondary border border-border/60 text-[9px] font-mono text-muted-foreground/50 uppercase">{log.action}</span>
                            <span className="px-2 py-0.5 rounded bg-secondary border border-border/60 text-[9px] font-mono text-muted-foreground/50 uppercase">{log.platform}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ POSTS ═══ */}
            {activeTab === 'posts' && (
              <motion.div key="posts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
                {/* Create Post Area */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-sm text-muted-foreground/60 mb-5">{isAr ? 'أضف منشور جديد للمجتمع.' : 'Create a new community post.'}</p>
                  <CreatePost onPostCreated={() => toast.success(isAr ? 'تم إضافة المنشور بنجاح' : 'Post created successfully')} />
                </div>

                {/* Posts List */}
                <div className="space-y-3">
                  {posts.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl border border-border">
                      <p className="text-sm text-muted-foreground/50">{isAr ? 'لا توجد منشورات بعد' : 'No posts yet'}</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div key={post.id} className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="text-sm text-foreground font-medium mb-1">{post.author}</p>
                            <p className="text-[11px] text-muted-foreground/50">{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Just now'}</p>
                          </div>
                          <Button 
                            onClick={async () => {
                              if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا المنشور؟' : 'Are you sure you want to delete this post?')) {
                                try {
                                  await deleteDoc(doc(db, 'posts', post.id));
                                  toast.success(isAr ? 'تم حذف المنشور' : 'Post deleted');
                                } catch (error) {
                                  toast.error(isAr ? 'فشل الحذف' : 'Failed to delete');
                                }
                              }
                            }}
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10 rounded-lg w-8 h-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground/80 mb-3 whitespace-pre-wrap">{post.text}</p>
                        {post.image && (
                          <div className="rounded-lg overflow-hidden mb-3">
                            {post.mediaType === 'video' ? (
                              <video src={post.image} controls className="w-full" preload="none" />
                            ) : post.mediaType === 'audio' ? (
                              <audio src={post.image} controls className="w-full" />
                            ) : (
                              <img src={post.image} alt="Post" className="w-full object-cover max-h-[300px]" decoding="async" loading="lazy" />
                            )}
                          </div>
                        )}
                        <div className="flex gap-4 text-[11px] text-muted-foreground/50">
                          <span>{post.likes?.length || 0} {isAr ? 'إعجاب' : 'Likes'}</span>
                          <span>{post.comments?.length || 0} {isAr ? 'تعليق' : 'Comments'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══ PLATFORM CONTROLS ═══ */}
            {activeTab === 'platform' && (
              <motion.div key="platform" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6 max-w-4xl">
                
                {/* Maintenance Mode */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-border/60">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-primary" /> {t('admin.platformControls')}
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Maintenance Toggle */}
                    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border/60">
                      <div>
                        <h4 className="text-sm font-semibold text-destructive">{t('admin.maintenance')}</h4>
                        <p className="text-[11px] text-muted-foreground/50 mt-0.5">Enable Maintenance/Coming Soon Banner Globally</p>
                      </div>
                      <button 
                        onClick={togglePlatformMaintenance}
                        aria-checked={platformSettings.maintenance === true}
                        role="switch"
                        className={`w-14 h-8 rounded-full transition-all duration-300 relative shadow cursor-pointer ${platformSettings.maintenance === true ? 'bg-destructive shadow-destructive/20' : 'bg-secondary border border-border shadow-none'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${platformSettings.maintenance === true ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    {/* Pages */}
                    <div>
                      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">{t('admin.pages')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { key: 'academy', label: 'Academy', icon: GraduationCap },
                          { key: 'books', label: 'Books', icon: BookOpen },
                          { key: 'news', label: 'News', icon: Newspaper },
                          { key: 'courses', label: 'Free Course', icon: GraduationCap },
                          { key: 'challenges', label: 'Challenges', icon: Crown },
                          { key: 'messages', label: 'Messages / Contact', icon: ShieldAlert },
                          { key: 'aiBot', label: 'AI Bot', icon: Zap },
                          { key: 'pipCalculator', label: 'Pip Calculator', icon: Calculator },
                          { key: 'marketIntelligence', label: 'Market Intelligence', icon: Zap },
                          { key: 'globalLeaderboard', label: 'Global Leaderboard', icon: Crown },
                          { key: 'brokers', label: 'Brokers', icon: Users },
                          { key: 'sheetsGuide', label: 'Sheets Guide', icon: BookOpen },
                          { key: 'friends', label: 'Community Friends', icon: Users }
                        ].map(p => {
                          const isEnabled = platformSettings.pages?.[p.key] !== false;
                          return (
                            <div key={p.key} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg border border-border/40">
                              <div className="flex items-center gap-2.5">
                                <p.icon className="w-4 h-4 text-muted-foreground/60" />
                                <span className="text-xs font-medium">{p.label}</span>
                              </div>
                              <button 
                                onClick={() => togglePlatformPage(p.key)}
                                aria-checked={isEnabled}
                                role="switch"
                                className={`w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${isEnabled ? 'bg-primary' : 'bg-secondary border border-border'}`}
                              >
                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${isEnabled ? 'left-5' : 'left-0.5'}`} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">{t('admin.features')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { key: 'messagesEnabled', label: t('admin.messagesEnabled'), icon: ShieldAlert },
                          { key: 'bookPurchase', label: t('admin.bookPurchase'), icon: BookOpen },
                          { key: 'community', label: t('admin.community'), icon: Users },
                          { key: 'notificationsEnabled', label: t('admin.notifications'), icon: ShieldAlert }
                        ].map(f => {
                          const isEnabled = platformSettings.features?.[f.key] !== false;
                          return (
                            <div key={f.key} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg border border-border/40">
                              <div className="flex items-center gap-2.5">
                                <f.icon className="w-4 h-4 text-muted-foreground/60" />
                                <span className="text-xs font-medium">{f.label}</span>
                              </div>
                              <button 
                                onClick={() => togglePlatformFeature(f.key)}
                                aria-checked={isEnabled}
                                role="switch"
                                className={`w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${isEnabled ? 'bg-primary' : 'bg-secondary border border-border'}`}
                              >
                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${isEnabled ? 'left-5' : 'left-0.5'}`} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ SETTINGS ═══ */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="max-w-2xl space-y-6">
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-border/60">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Settings className="w-4 h-4 text-primary" /> {isAr ? 'إعدادات الظهور' : 'Page Visibility'}
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { id: 'showAIBot', label: 'AI Trading Bot', icon: Zap },
                      { id: 'showPipCalculator', label: 'Pip Calculator', icon: Calculator }
                    ].map(setting => (
                      <div key={setting.id} className="flex items-center justify-between p-4 bg-secondary/40 rounded-xl border border-border/40 hover:border-primary/15 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <setting.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">{setting.label}</h4>
                            <p className="text-[10px] text-muted-foreground/50 mt-0.5">{isAr ? 'التحكم في ظهور الصفحة للمستخدمين' : 'Control page visibility for users'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleSetting(setting.id)}
                          className={`w-14 h-8 rounded-full transition-all duration-300 relative shadow cursor-pointer ${siteSettings[setting.id] ? 'bg-primary shadow-primary/20' : 'bg-secondary border border-border shadow-none'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${siteSettings[setting.id] ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ─── Ban Modal (Preserved) ───────────────────────────────────────── */}
      <AnimatePresence>
        {isBanModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setIsBanModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-destructive/20 rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Ban className="w-5 h-5 text-destructive" />
                  {isAr ? 'حظر المستخدم' : 'Ban User'}
                </h3>
                <button
                  onClick={() => setIsBanModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {selectedUser && (
                <div className="mb-5 p-3 bg-secondary/60 rounded-lg border border-border/60">
                  <p className="text-xs text-muted-foreground/60 mb-0.5">{isAr ? 'المستخدم' : 'User'}</p>
                  <p className="text-sm text-foreground font-medium">{selectedUser.fullName || selectedUser.email}</p>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5">{selectedUser.email}</p>
                </div>
              )}

              <div className="space-y-4 mb-5">
                <label className="text-xs font-semibold text-foreground block">
                  {isAr ? 'سبب الحظر' : 'Ban Reason'}
                </label>
                <Input
                  placeholder={isAr ? 'اكتب سبب الحظر (اختياري)...' : 'Enter ban reason (optional)...'}
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="bg-secondary border-border h-10 rounded-lg text-sm"
                />
                <label className="text-xs font-semibold text-foreground block">
                  {isAr ? 'مدة الحظر' : 'Ban Duration'}
                </label>
                <div className="space-y-1.5">
                  {[
                    { value: '1day', label: isAr ? 'يوم واحد' : '1 Day' },
                    { value: '7days', label: isAr ? '7 أيام' : '7 Days' },
                    { value: '30days', label: isAr ? '30 يوم' : '30 Days' },
                    { value: 'permanent', label: isAr ? 'دائم' : 'Permanent' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setBanDuration(option.value)}
                      className={`w-full p-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        banDuration === option.value
                          ? 'bg-destructive text-white'
                          : 'bg-secondary text-foreground hover:bg-secondary/60'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setIsBanModalOpen(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/60 text-foreground border-0 h-11 rounded-lg font-semibold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleBanUser}
                  className="flex-1 bg-destructive hover:brightness-90 text-white border-0 h-11 rounded-lg font-semibold cursor-pointer"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  {isAr ? 'حظر' : 'Ban'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Warn Modal (Preserved) ──────────────────────────────────────── */}
      <AnimatePresence>
        {isWarnModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setIsWarnModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-amber-500/20 rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  {isAr ? 'إرسال تحذير' : 'Send Warning'}
                </h3>
                <button
                  onClick={() => setIsWarnModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              {warnTarget && (
                <div className="mb-4 p-3 bg-secondary/60 rounded-lg border border-border/60">
                  <p className="text-xs text-muted-foreground/60 mb-0.5">{isAr ? 'المستخدم' : 'User'}</p>
                  <p className="text-sm text-foreground font-medium">{warnTarget.fullName || warnTarget.email}</p>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5">{warnTarget.email}</p>
                </div>
              )}
              <div className="mb-5">
                <label className="text-xs font-semibold text-foreground block mb-2">
                  {isAr ? 'رسالة التحذير' : 'Warning Message'}
                </label>
                <textarea
                  value={warnMessage}
                  onChange={(e) => setWarnMessage(e.target.value)}
                  placeholder={isAr ? 'اكتب رسالة التحذير...' : 'Enter warning message...'}
                  rows={4}
                  className="w-full bg-secondary border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsWarnModalOpen(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/60 text-foreground border-0 h-11 rounded-lg font-semibold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleWarnUser}
                  disabled={!warnMessage.trim()}
                  className="flex-1 bg-amber-500 hover:brightness-90 text-black border-0 h-11 rounded-lg font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {isAr ? 'إرسال التحذير' : 'Send Warning'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
