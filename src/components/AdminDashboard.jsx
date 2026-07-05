import React, { useState, useEffect } from 'react';
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
  BookOpen
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import CreatePost from './CreatePost';
import AdminSubscriptionPanel from './AdminSubscriptionPanel';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [siteSettings, setSiteSettings] = useState({ showAIBot: true, showPipCalculator: true });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banDuration, setBanDuration] = useState('permanent');

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

    return () => {
      unsubscribeUsers();
      unsubscribePosts();
      unsubscribeLogs();
      unsubscribeSettings();
    };
  }, []);

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
      toast.success(i18n.language === 'ar' ? 'تم تحديث الإعدادات' : 'Settings updated');
    } catch (error) {
      console.error('Error updating settings:', error);
      // إرجاع التغيير في حالة الفشل
      setSiteSettings(prev => ({ ...prev, [setting]: !newValue }));
      toast.error(i18n.language === 'ar' ? 'فشل التحديث' : 'Error updating settings');
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;
    try {
      const banData = {
        isBanned: true,
        banType: banDuration,
        bannedAt: new Date().toISOString()
      };
      await updateDoc(doc(db, 'users', selectedUser.id), banData);
      await logAdminAction('BAN_USER', `Admin banned user ${selectedUser.email} (${banDuration})`);
      setIsBanModalOpen(false);
      setSelectedUser(null);
      toast.success('User banned');
    } catch (error) {
      toast.error('Error banning user');
    }
  };

  const handleWarnUser = async (user) => {
    const warningMessage = prompt(i18n.language === 'ar' ? 'أدخل رسالة التحذير:' : 'Enter warning message:');
    if (!warningMessage) return;

    try {
      await updateDoc(doc(db, 'users', user.id), {
        warning: warningMessage,
        warningRead: false,
        warnedAt: serverTimestamp()
      });
      await logAdminAction('WARN_USER', `Admin warned user ${user.email}: ${warningMessage}`);
      toast.success(i18n.language === 'ar' ? 'تم إرسال التحذير' : 'Warning sent');
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
      toast.success(i18n.language === 'ar' 
        ? (newValue ? 'تم منح صلاحية الكتاب بنجاح' : 'تم إلغاء صلاحية الكتاب بنجاح')
        : `Book access ${newValue ? 'granted' : 'revoked'} successfully`
      );
    } catch (error) {
      console.error('Error updating book access:', error);
      toast.error(i18n.language === 'ar' ? 'فشل تحديث صلاحية الكتاب' : 'Failed to update book access');
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Admin Control</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              {i18n.language === 'ar' ? 'مركز' : 'Management'} <span className="text-primary">{i18n.language === 'ar' ? 'الإدارة' : 'Center'}</span>
            </h1>
          </div>
          
            <div className="flex flex-wrap bg-secondary p-1 rounded-xl border border-border">
            {[
              { id: 'users', icon: Users, label: i18n.language === 'ar' ? 'المستخدمين' : 'Users' },
              { id: 'subscriptions', icon: Crown, label: i18n.language === 'ar' ? 'الاشتراكات' : 'Subscriptions' },
              { id: 'posts', icon: Newspaper, label: i18n.language === 'ar' ? 'المنشورات' : 'Posts' },
              { id: 'courses', icon: GraduationCap, label: i18n.language === 'ar' ? 'الكورسات' : 'Courses' },
              { id: 'logs', icon: History, label: i18n.language === 'ar' ? 'السجلات' : 'Logs' },
              { id: 'settings', icon: Settings, label: i18n.language === 'ar' ? 'الإعدادات' : 'Settings' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <tab.icon className="w-4 h-4 inline-block mr-2 mb-0.5" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'courses' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="bg-card border border-border p-12 rounded-xl text-center">
                <GraduationCap className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-black uppercase mb-4">{i18n.language === 'ar' ? 'إدارة الكورسات' : 'Course Management'}</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">{i18n.language === 'ar' ? 'يمكنك إضافة وتعديل وحذف الكورسات من خلال لوحة التحكم المخصصة.' : 'You can add, edit, and delete courses through the dedicated control panel.'}</p>
                <Button 
                  onClick={() => navigate('/admin/courses')}
                  className="bg-primary text-primary-foreground hover:brightness-110 font-black uppercase tracking-widest px-8 py-4 rounded-md border-0 cursor-pointer"
                >
                  {i18n.language === 'ar' ? 'فتح لوحة إدارة الكورسات' : 'Open Course Management'}
                </Button>
              </div>
            </motion.div>
          )}
          {activeTab === 'subscriptions' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdminSubscriptionPanel />
            </motion.div>
          )}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <Input 
                  placeholder={i18n.language === 'ar' ? 'البحث عن مستخدم...' : 'Search users...'}
                  className="pl-12 bg-secondary border-border h-12 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid gap-4">
                {filteredUsers.map(user => (
                  <div key={user.id} className="bg-card border border-border p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                        {user.fullName?.[0] || user.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black uppercase tracking-tight flex items-center gap-2">
                          {user.fullName || 'User'}
                          {user.isBanned && <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full">BANNED</span>}
                          {user.soberBookAccess && <span className="text-[8px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold">SOBER BOOK</span>}
                        </h3>
                        <p className="text-xs text-muted-foreground/60">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={() => toggleBookAccess(user)}
                        className={`h-10 px-4 rounded-md text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                          user.soberBookAccess 
                            ? 'bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30' 
                            : 'bg-secondary hover:bg-primary/10 text-primary border border-primary/20'
                        }`}
                      >
                        <BookOpen className="w-3 h-3 mr-2" />
                        {user.soberBookAccess 
                          ? (i18n.language === 'ar' ? 'صلاحية الكتاب: مفعّلة' : 'Book: Active') 
                          : (i18n.language === 'ar' ? 'منح صلاحية الكتاب' : 'Grant Book Access')}
                      </Button>
                      <Button 
                        onClick={() => handleWarnUser(user)}
                        className="bg-secondary hover:bg-primary/10 text-primary border border-primary/20 h-10 px-4 rounded-md text-[10px] font-black uppercase tracking-widest cursor-pointer"
                      >
                        <AlertCircle className="w-3 h-3 mr-2" /> {i18n.language === 'ar' ? 'تحذير' : 'Warn'}
                      </Button>
                      <Button onClick={() => { setSelectedUser(user); setIsBanModalOpen(true); }} className="bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border border-destructive/20 h-10 px-4 rounded-md text-[10px] font-black uppercase tracking-widest cursor-pointer">
                        <Ban className="w-3 h-3 mr-2" /> {i18n.language === 'ar' ? 'حظر' : 'Ban'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-8">
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2 mb-8">
                  <Clock className="w-4 h-4 text-primary" /> {i18n.language === 'ar' ? 'سجل الأنشطة الأخير' : 'Recent Activity Logs'}
                </h3>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 rounded-md bg-secondary border border-border hover:border-border/80 transition-all">
                      <div className={`mt-1 w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${log.action.includes('BAN') ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <p className="text-[10px] font-black text-foreground uppercase tracking-widest truncate">{log.userEmail}</p>
                          <span className="text-[9px] text-muted-foreground/50 whitespace-nowrap">{log.timestamp?.toDate().toLocaleString()}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium">{log.details}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest">{log.action}</span>
                          <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest">{log.platform}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'posts' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <Newspaper className="w-6 h-6 text-amber-500" /> {i18n.language === 'ar' ? 'إدارة المنشورات' : 'Manage Posts'}
                </h3>
              </div>
              <div className="bg-card border border-border rounded-xl p-8">
                <p className="text-muted-foreground text-sm mb-8">{i18n.language === 'ar' ? 'استخدم الزر العائم في الأسفل لإضافة منشور جديد.' : 'Use the floating button below to add a new post.'}</p>
                <CreatePost onPostCreated={() => toast.success(i18n.language === 'ar' ? 'تم إضافة المنشور بنجاح' : 'Post created successfully')} />
              </div>
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <p className="text-muted-foreground text-sm">{i18n.language === 'ar' ? 'لا توجد منشورات بعد' : 'No posts yet'}</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="bg-card border-border rounded-xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <p className="text-foreground font-bold text-sm mb-2">{post.author}</p>
                            <p className="text-muted-foreground/60 text-xs">{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Just now'}</p>
                          </div>
                          <Button 
                            onClick={async () => {
                              if (window.confirm(i18n.language === 'ar' ? 'هل أنت متأكد من حذف هذا المنشور؟' : 'Are you sure you want to delete this post?')) {
                                try {
                                  await deleteDoc(doc(db, 'posts', post.id));
                                  toast.success(i18n.language === 'ar' ? 'تم حذف المنشور' : 'Post deleted');
                                } catch (error) {
                                  toast.error(i18n.language === 'ar' ? 'فشل الحذف' : 'Failed to delete');
                                }
                              }
                            }}
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10 rounded-md w-8 h-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4 whitespace-pre-wrap">{post.text}</p>
                        {post.image && (
                          <div className="rounded-xl overflow-hidden">
                            {post.mediaType === 'video' ? (
                              <video src={post.image} controls className="w-full" preload="none" />
                            ) : post.mediaType === 'audio' ? (
                              <audio src={post.image} controls className="w-full" />
                            ) : (
                              <img src={post.image} alt="Post" className="w-full object-cover max-h-[300px]" decoding="async" loading="lazy" />
                            )}
                          </div>
                        )}
                        <div className="flex gap-4 mt-4 text-xs text-gray-500">
                          <span>{post.likes?.length || 0} {i18n.language === 'ar' ? 'إعجاب' : 'Likes'}</span>
                          <span>{post.comments?.length || 0} {i18n.language === 'ar' ? 'تعليق' : 'Comments'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-8">
              <Card className="bg-card border-border rounded-xl overflow-hidden">
                <CardHeader className="p-8 border-b border-border">
                  <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                    <Settings className="w-6 h-6 text-primary" /> {i18n.language === 'ar' ? 'إعدادات الظهور' : 'Page Visibility'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {[
                    { id: 'showAIBot', label: 'AI Trading Bot', icon: Zap },
                    { id: 'showPipCalculator', label: 'Pip Calculator', icon: Calculator }
                  ].map(setting => (
                    <div key={setting.id} className="flex items-center justify-between p-6 bg-secondary rounded-md border border-border hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          <setting.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black uppercase tracking-widest text-sm">{setting.label}</h4>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">{i18n.language === 'ar' ? 'التحكم في ظهور الصفحة للمستخدمين' : 'Control page visibility for users'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleSetting(setting.id)}
                        className={`w-16 h-9 rounded-full transition-all duration-300 relative shadow-lg cursor-pointer ${siteSettings[setting.id] ? 'bg-primary shadow-primary/20' : 'bg-secondary border border-border shadow-none'}`}
                      >
                        <div className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-md transition-all duration-300 ${siteSettings[setting.id] ? 'left-8' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Ban Modal */}
      <AnimatePresence>
        {isBanModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsBanModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-destructive/20 rounded-xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                  <Ban className="w-6 h-6 text-destructive" />
                  {i18n.language === 'ar' ? 'حظر المستخدم' : 'Ban User'}
                </h3>
                <button
                  onClick={() => setIsBanModalOpen(false)}
                  className="w-8 h-8 rounded-md bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {selectedUser && (
                <div className="mb-6 p-4 bg-secondary rounded-md border border-border">
                  <p className="text-sm text-muted-foreground mb-1">{i18n.language === 'ar' ? 'المستخدم' : 'User'}</p>
                  <p className="text-foreground font-bold">{selectedUser.fullName || selectedUser.email}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{selectedUser.email}</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <label className="text-sm font-bold text-foreground block">
                  {i18n.language === 'ar' ? 'مدة الحظر' : 'Ban Duration'}
                </label>
                <div className="space-y-2">
                  {[
                    { value: '1day', label: i18n.language === 'ar' ? 'يوم واحد' : '1 Day' },
                    { value: '7days', label: i18n.language === 'ar' ? '7 أيام' : '7 Days' },
                    { value: '30days', label: i18n.language === 'ar' ? '30 يوم' : '30 Days' },
                    { value: 'permanent', label: i18n.language === 'ar' ? 'دائم' : 'Permanent' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setBanDuration(option.value)}
                      className={`w-full p-3 rounded-md text-sm font-bold transition-all cursor-pointer ${
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
                  className="flex-1 bg-secondary hover:bg-secondary/60 text-foreground border-0 h-12 rounded-md font-black uppercase tracking-widest cursor-pointer"
                >
                  {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleBanUser}
                  className="flex-1 bg-destructive hover:brightness-90 text-white border-0 h-12 rounded-md font-black uppercase tracking-widest cursor-pointer"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  {i18n.language === 'ar' ? 'حظر' : 'Ban'}
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
