import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './Header';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  where,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Send, MessageCircle, User, Loader2, ArrowLeft, MessageSquareOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { usePlatform } from '../context/PlatformContext';
import { isAdminUser } from '../lib/adminService';

const Messages = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { features } = usePlatform();
  const messagesEnabled = features?.messagesEnabled !== false;
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // مراقبة حالة المستخدم
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        const adminCheck = isAdminUser(snap.exists() ? snap.data() : null);
        setIsAdmin(adminCheck);
        
        // إذا كان مستخدم عادي، اختر الأدمن تلقائياً
        if (!adminCheck) {
          const adminUser = {
            uid: 'admin',
            displayName: i18n.language === 'ar' ? 'الإدارة' : 'Admin',
            photoURL: null,
            isAdmin: true
          };
          setSelectedUser(adminUser);
        }
      }
    });
    return () => unsubscribe();
  }, [i18n.language]);

  // جلب قائمة المستخدمين (للأدمن فقط)
  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const usersList = snapshot.docs
          .map(doc => ({
            uid: doc.id,
            ...doc.data()
          }))
          .filter(u => !u.isAdmin);
        
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  // جلب الرسائل
  useEffect(() => {
    if (!user) return;

    let q;
    
    if (isAdmin && selectedUser) {
      // الأدمن يرى رسائل المستخدم المحدد فقط
      q = query(
        collection(db, 'messages'),
        where('participants', 'array-contains', selectedUser.uid)
      );
    } else if (!isAdmin) {
      // المستخدم العادي يرى رسائله مع الأدمن فقط
      q = query(
        collection(db, 'messages'),
        where('userId', '==', user.uid)
      );
    } else {
      return; // لا توجد رسائل للعرض
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // ترتيب الرسائل محلياً لتجنب الحاجة لكشافات مركبة (Composite Indexes) في Firebase
      msgList.sort((a, b) => {
        const timeA = a.createdAt?.seconds || (a.timestamp ? new Date(a.timestamp).getTime() / 1000 : 0);
        const timeB = b.createdAt?.seconds || (b.timestamp ? new Date(b.timestamp).getTime() / 1000 : 0);
        return timeA - timeB;
      });

      setMessages(msgList);
      requestAnimationFrame(scrollToBottom);
    }, (error) => {
      console.error("Messages subscription error:", error);
    });

    return () => unsubscribe();
  }, [user, isAdmin, selectedUser]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const messageData = {
        text: newMessage,
        userId: isAdmin ? selectedUser.uid : user.uid,
        userName: isAdmin ? selectedUser.displayName || selectedUser.email : (user.displayName || user.email),
        userPhoto: isAdmin ? selectedUser.photoURL : user.photoURL,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        senderPhoto: user.photoURL || null,
        isAdmin: isAdmin,
        participants: isAdmin ? [selectedUser.uid, user.uid] : [user.uid],
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'messages'), messageData);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(i18n.language === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }, [newMessage, user, isAdmin, selectedUser, i18n.language, scrollToBottom]);

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="glass-card border border-border rounded-[2rem] p-8 text-center max-w-md">
            <MessageCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-foreground uppercase mb-4">
              {i18n.language === 'ar' ? 'يجب تسجيل الدخول' : 'Login Required'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {i18n.language === 'ar' 
                ? 'يرجى تسجيل الدخول للوصول إلى الرسائل' 
                : 'Please login to access messages'}
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-xl px-6 py-3"
            >
              {i18n.language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background text-foreground flex">
      {/* قائمة المستخدمين - للأدمن فقط */}
      {isAdmin && (
        <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-border bg-card`}>
          {/* Header */}
          <div className="p-4 border-b border-border bg-secondary/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                <MessageCircle className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-black text-foreground uppercase tracking-tight">
                  {i18n.language === 'ar' ? 'الرسائل' : 'Messages'}
                </h1>
                <span className="text-[10px] text-amber-500 font-black uppercase">
                  {i18n.language === 'ar' ? 'أدمن' : 'Admin'}
                </span>
              </div>
            </div>
          </div>

          {/* قائمة المستخدمين */}
          <div className="flex-1 overflow-y-auto">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <User className="w-16 h-16 text-zinc-700 mb-4" />
                <p className="text-zinc-500 text-sm">
                  {i18n.language === 'ar' ? 'لا يوجد مستخدمون' : 'No users'}
                </p>
              </div>
            ) : (
              users.map((u) => (
                <motion.div
                  key={u.uid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedUser(u)}
                  className={`p-4 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/30 transition-colors ${
                    selectedUser?.uid === u.uid ? 'bg-zinc-800/50 border-l-4 border-l-amber-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {u.photoURL ? (
                      <img src={u.photoURL}
                        alt={u.displayName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/20"
                      decoding="async" loading="lazy" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-black" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm truncate">
                        {u.displayName || u.email}
                      </h3>
                      <p className="text-zinc-500 text-xs truncate">
                        {u.email}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* منطقة المحادثة */}
      <div className="flex-1 flex flex-col">
        {selectedUser || !isAdmin ? (
          <>
            {/* Header المحادثة */}
            <div className="p-4 border-b border-amber-500/20 bg-black/80 backdrop-blur-xl flex items-center gap-3">
              {isAdmin && (
                <Button
                  onClick={() => setSelectedUser(null)}
                  className="md:hidden bg-transparent hover:bg-zinc-800 text-white p-2 rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div 
                className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-zinc-800/30 p-2 rounded-xl transition-colors"
                onClick={() => {
                  if (isAdmin && selectedUser) {
                    navigate(`/profile/${selectedUser.uid}`);
                  }
                }}
              >
                {selectedUser?.photoURL ? (
                  <img src={selectedUser.photoURL}
                    alt={selectedUser.displayName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/20"
                  decoding="async" loading="lazy" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-black" />
                  </div>
                )}
                <div>
                  <h2 className="text-white font-bold">
                    {selectedUser?.displayName || (i18n.language === 'ar' ? 'الإدارة' : 'Admin')}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {i18n.language === 'ar' ? 'نشط' : 'Active'}
                  </p>
                </div>
              </div>
            </div>

            {/* الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-black via-zinc-900/30 to-black">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
                    <MessageCircle className="w-12 h-12 text-amber-500/50" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 uppercase">
                    {i18n.language === 'ar' ? 'لا توجد رسائل' : 'No Messages Yet'}
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    {i18n.language === 'ar' ? 'ابدأ محادثة جديدة' : 'Start a new conversation'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-w-4xl mx-auto">
                  <AnimatePresence>
                    {messages.map((msg, index) => {
                      const isOwn = msg.senderId === user.uid;
                      const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
                      
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end`}
                        >
                          <div className="w-8 flex-shrink-0">
                            {showAvatar && (
                              <div className="cursor-pointer hover:scale-110 transition-transform">
                                {msg.senderPhoto ? (
                                  <img src={msg.senderPhoto} 
                                    alt={msg.senderName}
                                    className="w-8 h-8 rounded-full border-2 border-amber-500/20"
                                  decoding="async" loading="lazy" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                                    <User className="w-4 h-4 text-black" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                            <div className={`rounded-3xl px-4 py-2.5 shadow-lg ${
                              isOwn 
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-amber-500/20' 
                                : 'bg-zinc-800/80 text-white border border-zinc-700/50'
                            }`}>
                              <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                            </div>
                            {(index === messages.length - 1 || messages[index + 1].senderId !== msg.senderId) && (
                              <span className="text-[9px] text-zinc-600 mt-1 px-3">
                                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : '...'}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-primary/20 bg-background/80 backdrop-blur-xl">
              {/* Show disabled notice for non-admins when messaging is off */}
              {!messagesEnabled && !isAdmin ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto flex items-center gap-3 px-4 py-3 rounded-md bg-secondary border border-border"
                >
                  <MessageSquareOff className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm text-muted-foreground font-medium">
                    {t('messages.unavailable')}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={i18n.language === 'ar' ? 'اكتب رسالتك...' : 'Type a message...'}
                    className="flex-1 bg-secondary border-border text-foreground rounded-full px-6 py-6 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
                    disabled={loading}
                    aria-label={i18n.language === 'ar' ? 'اكتب رسالتك' : 'Type your message'}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !newMessage.trim()}
                    aria-label={i18n.language === 'ar' ? 'إرسال الرسالة' : 'Send message'}
                    className="bg-primary hover:brightness-110 text-primary-foreground font-black rounded-full w-12 h-12 p-0 shadow-lg shadow-primary/20 disabled:opacity-50 transition-all hover:-translate-y-0.5 border-0 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-black via-zinc-900/30 to-black">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                <MessageCircle className="w-16 h-16 text-amber-500/50" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 uppercase">
                {i18n.language === 'ar' ? 'اختر مستخدم' : 'Select a User'}
              </h3>
              <p className="text-zinc-500">
                {i18n.language === 'ar' 
                  ? 'اختر مستخدم من القائمة لبدء المراسلة' 
                  : 'Choose a user from the list to start messaging'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Messages;
