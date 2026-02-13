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
  getDocs,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Send, MessageCircle, User, Loader2, ArrowLeft, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Messages = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // مراقبة حالة المستخدم
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // التحقق من صلاحيات الأدمن
        const adminEmails = ['mchokri100@gmail.com', 'ahmed1195@gmail.com'];
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const isAdminUser = userDoc.exists() && userDoc.data().isAdmin === true || adminEmails.includes(currentUser.email?.toLowerCase());
        setIsAdmin(isAdminUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // جلب قائمة المحادثات
  useEffect(() => {
    if (!user) return;

    const conversationsRef = collection(db, 'conversations');
    const q = isAdmin 
      ? query(conversationsRef, orderBy('lastMessageAt', 'desc'))
      : query(conversationsRef, where('participants', 'array-contains', user.uid), orderBy('lastMessageAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(convList);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  // جلب رسائل المحادثة المحددة
  useEffect(() => {
    if (!selectedConversation) return;

    const messagesRef = collection(db, 'conversations', selectedConversation.id, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgList);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOrCreateConversation = async (otherUserId) => {
    const conversationId = [user.uid, otherUserId].sort().join('_');
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);

    if (!conversationSnap.exists()) {
      // إنشاء محادثة جديدة
      const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
      const otherUserData = otherUserDoc.data();
      
      await setDoc(conversationRef, {
        participants: [user.uid, otherUserId],
        participantsData: {
          [user.uid]: {
            name: user.displayName || user.email,
            photo: user.photoURL || null
          },
          [otherUserId]: {
            name: otherUserData?.displayName || otherUserData?.email || 'User',
            photo: otherUserData?.photoURL || null
          }
        },
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });
    }

    return conversationId;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      const messagesRef = collection(db, 'conversations', selectedConversation.id, 'messages');
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        senderPhoto: user.photoURL || null,
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      });

      // تحديث آخر رسالة في المحادثة
      const conversationRef = doc(db, 'conversations', selectedConversation.id);
      await setDoc(conversationRef, {
        lastMessage: newMessage,
        lastMessageAt: serverTimestamp()
      }, { merge: true });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(i18n.language === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation || !user) return null;
    const otherUserId = conversation.participants?.find(id => id !== user.uid);
    return conversation.participantsData?.[otherUserId];
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherParticipant(conv);
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900/60 border border-white/10 rounded-[2rem] p-8 text-center max-w-md">
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
            onClick={() => navigate('/')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-xs rounded-xl px-6 py-3"
          >
            {i18n.language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* قائمة المحادثات - Sidebar */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-yellow-500/20 bg-zinc-900/30`}>
        {/* Header */}
        <div className="p-4 border-b border-yellow-500/20 bg-black/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <MessageCircle className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-black text-white uppercase tracking-tight">
                {i18n.language === 'ar' ? 'الرسائل' : 'Messages'}
              </h1>
              {isAdmin && (
                <span className="text-[10px] text-yellow-500 font-black uppercase">
                  {i18n.language === 'ar' ? 'أدمن' : 'Admin'}
                </span>
              )}
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={i18n.language === 'ar' ? 'بحث...' : 'Search...'}
              className="w-full bg-zinc-800/50 border-zinc-700 text-white rounded-full pl-10 py-2 text-sm focus:border-yellow-500/50"
            />
          </div>
        </div>

        {/* قائمة المحادثات */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageCircle className="w-16 h-16 text-zinc-700 mb-4" />
              <p className="text-zinc-500 text-sm">
                {i18n.language === 'ar' ? 'لا توجد محادثات' : 'No conversations'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const otherUser = getOtherParticipant(conv);
              return (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/30 transition-colors ${
                    selectedConversation?.id === conv.id ? 'bg-zinc-800/50 border-l-4 border-l-yellow-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {otherUser?.photo ? (
                      <img
                        src={otherUser.photo}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-black" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm truncate">
                        {otherUser?.name || 'User'}
                      </h3>
                      <p className="text-zinc-500 text-xs truncate">
                        {conv.lastMessage || (i18n.language === 'ar' ? 'لا توجد رسائل' : 'No messages')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* منطقة المحادثة */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header المحادثة */}
            <div className="p-4 border-b border-yellow-500/20 bg-black/80 backdrop-blur-xl flex items-center gap-3">
              <Button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden bg-transparent hover:bg-zinc-800 text-white p-2 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              {(() => {
                const otherUser = getOtherParticipant(selectedConversation);
                return (
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-zinc-800/30 p-2 rounded-xl transition-colors"
                    onClick={() => {
                      const otherUserId = selectedConversation.participants?.find(id => id !== user.uid);
                      if (otherUserId) navigate(`/profile/${otherUserId}`);
                    }}
                  >
                    {otherUser?.photo ? (
                      <img
                        src={otherUser.photo}
                        alt={otherUser.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-black" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-white font-bold">{otherUser?.name || 'User'}</h2>
                      <p className="text-xs text-zinc-400">
                        {i18n.language === 'ar' ? 'نشط' : 'Active'}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-black via-zinc-900/30 to-black">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-full flex items-center justify-center mb-6 border border-yellow-500/20">
                    <MessageCircle className="w-12 h-12 text-yellow-500/50" />
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
                              <div 
                                className="cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => navigate(`/profile/${msg.senderId}`)}
                              >
                                {msg.senderPhoto ? (
                                  <img 
                                    src={msg.senderPhoto} 
                                    alt={msg.senderName}
                                    className="w-8 h-8 rounded-full border-2 border-yellow-500/20 hover:border-yellow-500/60 transition-colors"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                                    <User className="w-4 h-4 text-black" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                            <div className={`rounded-3xl px-4 py-2.5 shadow-lg ${
                              isOwn 
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-yellow-500/20' 
                                : 'bg-zinc-800/80 text-white border border-zinc-700/50'
                            }`}>
                              <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                            </div>
                            {(index === messages.length - 1 || messages[index + 1].senderId !== msg.senderId) && (
                              <span className={`text-[9px] text-zinc-600 mt-1 px-3`}>
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

            {/* حقل الإدخال */}
            <div className="p-4 border-t border-yellow-500/20 bg-black/80 backdrop-blur-xl">
              <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={i18n.language === 'ar' ? 'اكتب رسالتك...' : 'Type a message...'}
                  className="flex-1 bg-zinc-900/60 border-zinc-800 text-white rounded-full px-6 py-6 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 placeholder:text-zinc-600"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black rounded-full w-12 h-12 p-0 shadow-lg shadow-yellow-500/30 disabled:opacity-50 transition-all hover:scale-105"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-black via-zinc-900/30 to-black">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
                <MessageCircle className="w-16 h-16 text-yellow-500/50" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 uppercase">
                {i18n.language === 'ar' ? 'اختر محادثة' : 'Select a Conversation'}
              </h3>
              <p className="text-zinc-500">
                {i18n.language === 'ar' 
                  ? 'اختر محادثة من القائمة لبدء المراسلة' 
                  : 'Choose a conversation from the list to start messaging'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
