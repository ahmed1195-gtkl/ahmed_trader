import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  where,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Send, MessageCircle, User, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Messages = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef(null);

  // مراقبة حالة المستخدم
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // التحقق من صلاحيات الأدمن
  useEffect(() => {
    if (user) {
      const checkAdmin = async () => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', user.email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setIsAdmin(userData.isAdmin || false);
        }
      };
      checkAdmin();
    }
  }, [user]);

  // جلب الرسائل
  useEffect(() => {
    if (!user) return;

    const messagesQuery = isAdmin 
      ? query(collection(db, 'messages'), orderBy('createdAt', 'asc'))
      : query(
          collection(db, 'messages'), 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'asc')
        );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesList);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL || null,
        isAdmin: isAdmin,
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(i18n.language === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-zinc-900/60 border-white/10 rounded-[2rem] p-8 text-center max-w-md">
          <MessageCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white uppercase mb-4">
            {i18n.language === 'ar' ? 'يجب تسجيل الدخول' : 'Login Required'}
          </h2>
          <p className="text-gray-400 mb-6">
            {i18n.language === 'ar' 
              ? 'يرجى تسجيل الدخول للوصول إلى الرسائل' 
              : 'Please login to access messages'}
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-xs rounded-xl px-6 py-3"
          >
            {i18n.language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900/50 to-black flex flex-col">
      {/* Header - Messenger Style */}
      <div className="bg-black/80 border-b border-yellow-500/20 backdrop-blur-xl sticky top-0 z-10 shadow-lg shadow-yellow-500/5">
        <div className="max-w-4xl mx-auto p-4 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <MessageCircle className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight">
                {i18n.language === 'ar' ? 'الرسائل' : 'Messages'}
              </h1>
              <p className="text-xs text-zinc-400">
                {isAdmin 
                  ? (i18n.language === 'ar' ? 'جميع المحادثات' : 'All Conversations')
                  : (i18n.language === 'ar' ? 'الدردشة مع الإدارة' : 'Chat with Admin')
                }
              </p>
            </div>
          </div>
          {isAdmin && (
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20">
              {i18n.language === 'ar' ? 'أدمن' : 'Admin'}
            </span>
          )}
        </div>
      </div>

      {/* Messages Container - Messenger Style */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 pb-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-full flex items-center justify-center mb-6 border border-yellow-500/20">
                <MessageCircle className="w-12 h-12 text-yellow-500/50" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase">
                {i18n.language === 'ar' ? 'لا توجد رسائل' : 'No Messages Yet'}
              </h3>
              <p className="text-zinc-500 text-sm">
                {i18n.language === 'ar' 
                  ? 'ابدأ محادثة جديدة الآن' 
                  : 'Start a new conversation now'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {messages.map((msg, index) => {
                  const isOwn = msg.userId === user.uid;
                  const showAvatar = index === 0 || messages[index - 1].userId !== msg.userId;
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end`}
                    >
                      {/* Avatar */}
                      <div className="w-8 flex-shrink-0">
                        {showAvatar && (
                          <div 
                            className="cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => navigate(`/profile/${msg.userId}`)}
                            title={i18n.language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
                          >
                            {msg.userPhoto ? (
                              <img 
                                src={msg.userPhoto} 
                                alt={msg.userName}
                                className="w-8 h-8 rounded-full border-2 border-yellow-500/20 hover:border-yellow-500/60 transition-colors"
                              />
                            ) : (
                              <div className={`w-8 h-8 rounded-full ${msg.isAdmin ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-zinc-700'} flex items-center justify-center shadow-lg`}>
                                <User className={`w-4 h-4 ${msg.isAdmin ? 'text-black' : 'text-gray-400'}`} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Message Bubble - Messenger Style */}
                      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        {showAvatar && !isOwn && (
                          <span 
                            className="text-[10px] font-bold text-zinc-500 mb-1 px-3 cursor-pointer hover:text-yellow-500 transition-colors"
                            onClick={() => navigate(`/profile/${msg.userId}`)}
                          >
                            {msg.userName}
                          </span>
                        )}
                        <div className={`rounded-3xl px-4 py-2.5 shadow-lg ${
                          isOwn 
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-yellow-500/20' 
                            : 'bg-zinc-800/80 text-white border border-zinc-700/50'
                        }`}>
                          <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                        </div>
                        {(index === messages.length - 1 || messages[index + 1].userId !== msg.userId) && (
                          <span className={`text-[9px] text-zinc-600 mt-1 px-3 ${isOwn ? 'text-right' : 'text-left'}`}>
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
      </div>

      {/* Input Box - Messenger Style */}
      <div className="bg-black/80 border-t border-yellow-500/20 backdrop-blur-xl p-4 shadow-lg shadow-yellow-500/5">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={i18n.language === 'ar' ? 'اكتب رسالتك...' : 'Type a message...'}
              className="w-full bg-zinc-900/60 border-zinc-800 text-white rounded-full px-6 py-6 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all placeholder:text-zinc-600"
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black rounded-full w-12 h-12 p-0 shadow-lg shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
