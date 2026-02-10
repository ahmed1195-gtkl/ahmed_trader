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
import { Send, MessageCircle, User, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Messages = () => {
  const { t, i18n } = useTranslation();
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-900/60 border-b border-white/10 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4 flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-yellow-500" />
          <h1 className="text-xl font-black text-white uppercase tracking-tight">
            {i18n.language === 'ar' ? 'الرسائل' : 'Messages'}
          </h1>
          {isAdmin && (
            <span className="ml-auto bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              {i18n.language === 'ar' ? 'أدمن' : 'Admin'}
            </span>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${msg.userId === user.uid ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {msg.userPhoto ? (
                    <img 
                      src={msg.userPhoto} 
                      alt={msg.userName}
                      className="w-10 h-10 rounded-full border-2 border-white/10"
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-full ${msg.isAdmin ? 'bg-yellow-500/20' : 'bg-zinc-800'} flex items-center justify-center`}>
                      <User className={`w-5 h-5 ${msg.isAdmin ? 'text-yellow-500' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 max-w-[70%] ${msg.userId === user.uid ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${msg.isAdmin ? 'text-yellow-500' : 'text-gray-500'}`}>
                    {msg.userName}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.userId === user.uid 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-zinc-900/60 border border-white/10 text-white'
                  }`}>
                    <p className="text-sm font-medium break-words">{msg.text}</p>
                  </div>
                  <div className="text-[9px] text-gray-600 font-bold">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '...'}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 border-t border-white/10 backdrop-blur-xl p-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={i18n.language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
            className="flex-1 bg-zinc-800/60 border-white/10 text-white rounded-2xl px-4 py-3 focus:border-yellow-500/50 font-medium"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl px-6 py-3 shadow-xl shadow-yellow-500/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
