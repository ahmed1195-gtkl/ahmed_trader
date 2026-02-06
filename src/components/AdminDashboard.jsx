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
  onSnapshot
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
  Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import CreatePost from './CreatePost';
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
    const postsQ = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
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

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Admin Control</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              {i18n.language === 'ar' ? 'مركز' : 'Management'} <span className="text-yellow-500">{i18n.language === 'ar' ? 'الإدارة' : 'Center'}</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'users', icon: Users, label: i18n.language === 'ar' ? 'المستخدمين' : 'Users' },
              { id: 'posts', icon: Newspaper, label: i18n.language === 'ar' ? 'المنشورات' : 'Posts' },
              { id: 'logs', icon: History, label: i18n.language === 'ar' ? 'السجلات' : 'Logs' },
              { id: 'settings', icon: Settings, label: i18n.language === 'ar' ? 'الإعدادات' : 'Settings' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-400 hover:text-white'}`}
              >
                <tab.icon className="w-4 h-4 inline-block mr-2 mb-0.5" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input 
                  placeholder={i18n.language === 'ar' ? 'البحث عن مستخدم...' : 'Search users...'}
                  className="pl-12 bg-white/5 border-white/10 h-12 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid gap-4">
                {filteredUsers.map(user => (
                  <div key={user.id} className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 hover:border-yellow-500/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold">
                        {user.fullName?.[0] || user.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black uppercase tracking-tight flex items-center gap-2">
                          {user.fullName || 'User'}
                          {user.isBanned && <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full">BANNED</span>}
                        </h3>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={() => handleWarnUser(user)}
                        className="bg-white/5 hover:bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                      >
                        <AlertCircle className="w-3 h-3 mr-2" /> {i18n.language === 'ar' ? 'تحذير' : 'Warn'}
                      </Button>
                      <Button onClick={() => { setSelectedUser(user); setIsBanModalOpen(true); }} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/20 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest">
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
              <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-8">
                  <Clock className="w-4 h-4 text-yellow-500" /> {i18n.language === 'ar' ? 'سجل الأنشطة الأخير' : 'Recent Activity Logs'}
                </h3>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                      <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${log.action.includes('BAN') ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">{log.userEmail}</p>
                          <span className="text-[9px] text-gray-500 whitespace-nowrap">{log.timestamp?.toDate().toLocaleString()}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium">{log.details}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[8px] font-black text-gray-500 uppercase tracking-widest">{log.action}</span>
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[8px] font-black text-gray-500 uppercase tracking-widest">{log.platform}</span>
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
                  <Newspaper className="w-6 h-6 text-yellow-500" /> {i18n.language === 'ar' ? 'إدارة المنشورات' : 'Manage Posts'}
                </h3>
              </div>
              <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8">
                <p className="text-gray-400 text-sm mb-8">{i18n.language === 'ar' ? 'استخدم الزر العائم في الأسفل لإضافة منشور جديد.' : 'Use the floating button below to add a new post.'}</p>
                <CreatePost onPostCreated={() => toast.success(i18n.language === 'ar' ? 'تم إضافة المنشور بنجاح' : 'Post created successfully')} />
              </div>
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-900/20 rounded-[2rem] border border-white/5">
                    <p className="text-gray-500 text-sm">{i18n.language === 'ar' ? 'لا توجد منشورات بعد' : 'No posts yet'}</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="bg-zinc-900/40 border-white/5 rounded-[2rem] overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <p className="text-white font-bold text-sm mb-2">{post.author}</p>
                            <p className="text-gray-400 text-xs">{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Just now'}</p>
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
                            className="text-red-500 hover:bg-red-500/10 rounded-full w-8 h-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-gray-300 text-sm mb-4 whitespace-pre-wrap">{post.text}</p>
                        {post.image && (
                          <div className="rounded-xl overflow-hidden">
                            {post.mediaType === 'video' ? (
                              <video src={post.image} controls className="w-full" />
                            ) : post.mediaType === 'audio' ? (
                              <audio src={post.image} controls className="w-full" />
                            ) : (
                              <img src={post.image} alt="Post" className="w-full object-cover max-h-[300px]" />
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
              <Card className="bg-zinc-900/40 border-white/5 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5">
                  <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                    <Settings className="w-6 h-6 text-yellow-500" /> {i18n.language === 'ar' ? 'إعدادات الظهور' : 'Page Visibility'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {[
                    { id: 'showAIBot', label: 'AI Trading Bot', icon: Zap, color: 'yellow' },
                    { id: 'showPipCalculator', label: 'Pip Calculator', icon: Calculator, color: 'blue' }
                  ].map(setting => (
                    <div key={setting.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-${setting.color}-500/10 flex items-center justify-center text-${setting.color}-500`}>
                          <setting.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black uppercase tracking-widest text-sm">{setting.label}</h4>
                          <p className="text-[10px] text-gray-500 mt-1">{i18n.language === 'ar' ? 'التحكم في ظهور الصفحة للمستخدمين' : 'Control page visibility for users'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleSetting(setting.id)}
                        className={`w-16 h-9 rounded-full transition-all duration-300 relative shadow-lg ${siteSettings[setting.id] ? 'bg-yellow-500 shadow-yellow-500/20' : 'bg-zinc-800/80 shadow-black/20'}`}
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
    </div>
  );
};

export default AdminDashboard;
