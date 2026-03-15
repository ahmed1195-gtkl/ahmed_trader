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
import { MessageCircle, Send, X, Minimize2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const ChatWidget = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
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
      
      // حساب الرسائل غير المقروءة
      if (!isOpen) {
        const unread = messagesList.filter(msg => 
          !msg.read && msg.userId !== user.uid
        ).length;
        setUnreadCount(unread);
      }
      
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [user, isAdmin, isOpen]);

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
        userPhoto: user.photoURL || '',
        isAdmin: isAdmin,
        createdAt: serverTimestamp(),
        read: false
      });
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('failedToSend') || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!user) return null;

  return (
    <>
      {/* أيقونة الدردشة العائمة */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-7 h-7 text-black" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* نافذة الدردشة المنبثقة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <div className="bg-black/95 backdrop-blur-xl border border-amber-500/20 rounded-[2rem] shadow-2xl shadow-amber-500/10 overflow-hidden">
              {/* رأس النافذة */}
              <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-b border-amber-500/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">
                      {isAdmin ? t('allMessages') || 'All Messages' : t('chatWithAdmin') || 'Chat with Admin'}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {isAdmin ? `${messages.length} ${t('messages') || 'messages'}` : t('online') || 'Online'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMinimize}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={toggleChat}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* محتوى الدردشة */}
              {!isMinimized && (
                <>
                  {/* منطقة الرسائل - Messenger Style */}
                  <div className="h-96 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                          <MessageCircle className="w-8 h-8 text-amber-500/50" />
                        </div>
                        <p className="text-zinc-400 font-bold text-sm">
                          {t('noMessages') || 'No messages yet'}
                        </p>
                        <p className="text-xs text-zinc-600 mt-2">
                          {t('startConversation') || 'Start a conversation'}
                        </p>
                      </div>
                    ) : (
                      messages.map((message, index) => {
                        const isOwn = message.userId === user.uid;
                        const showAvatar = index === 0 || messages[index - 1].userId !== message.userId;
                        return (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-1.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end`}
                          >
                            {/* صورة المستخدم */}
                            <div className="w-6 flex-shrink-0">
                              {showAvatar && (
                                <div 
                                  className="cursor-pointer hover:scale-110 transition-transform"
                                  onClick={() => navigate(`/profile/${message.userId}`)}
                                  title={t('viewProfile') || 'View Profile'}
                                >
                                  {message.userPhoto ? (
                                    <img
                                      src={message.userPhoto}
                                      alt={message.userName}
                                      className="w-6 h-6 rounded-full object-cover border border-amber-500/20"
                                    />
                                  ) : (
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      message.isAdmin ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-zinc-700'
                                    }`}>
                                      <User className="w-3 h-3 text-black" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* محتوى الرسالة */}
                            <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[75%]`}>
                              <div className={`px-3 py-2 rounded-2xl shadow-sm ${
                                isOwn 
                                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-amber-500/10'
                                  : 'bg-zinc-800/90 text-white border border-zinc-700/50'
                              }`}>
                                <p className="text-sm leading-relaxed break-words">{message.text}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* حقل الإدخال */}
                  <form onSubmit={handleSend} className="border-t border-amber-500/20 p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('typeMessage') || 'Type a message...'}
                        className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading || !newMessage.trim()}
                        className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-5 h-5 text-black" />
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
