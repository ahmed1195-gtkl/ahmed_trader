import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Minimize2, Maximize2, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { addTeamMessage } from '../lib/teamService';

function TeamChat({ teamId, teamName }) {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!teamId) return;

    // الاستماع للرسائل الجديدة
    const messagesQuery = query(
      collection(db, 'team_chat'),
      where('teamId', '==', teamId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).reverse();

      setMessages(newMessages);

      // حساب الرسائل غير المقروءة
      if (!isOpen) {
        const unread = newMessages.filter(msg => 
          msg.userId !== user?.uid && 
          msg.timestamp?.toDate() > (lastOpenTime || new Date(0))
        ).length;
        setUnreadCount(unread);
      }
    });

    return () => unsubscribe();
  }, [teamId, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [lastOpenTime, setLastOpenTime] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setLastOpenTime(new Date());
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;

    try {
      await addTeamMessage(
        teamId,
        user.uid,
        user.displayName || 'Anonymous',
        newMessage.trim(),
        'text'
      );

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getMessageTypeStyle = (type) => {
    switch (type) {
      case 'system':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400 text-center italic';
      case 'trade_alert':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default:
        return 'bg-zinc-800 border-white/5';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return i18n.language === 'ar' ? 'الآن' : 'Now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}${i18n.language === 'ar' ? 'د' : 'm'}`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}${i18n.language === 'ar' ? 'س' : 'h'}`;
    
    return date.toLocaleTimeString(i18n.language, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-amber-500 text-black rounded-full shadow-2xl flex items-center justify-center hover:bg-amber-400 transition-all"
      >
        <MessageCircle className="w-8 h-8" />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        height: isMinimized ? '60px' : '500px'
      }}
      className="fixed bottom-6 right-6 z-50 w-96 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-zinc-800 border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="text-sm font-black text-white">
              {teamName || (i18n.language === 'ar' ? 'دردشة الفريق' : 'Team Chat')}
            </div>
            <div className="text-xs text-gray-500">
              {messages.length} {i18n.language === 'ar' ? 'رسالة' : 'messages'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-gray-400" />
            ) : (
              <Minimize2 className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-xl border ${getMessageTypeStyle(msg.type)} ${
                    msg.userId === user?.uid ? 'ml-8' : 'mr-8'
                  }`}
                >
                  {msg.type !== 'system' && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-500">
                        {msg.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-sm text-white break-words">
                    {msg.message}
                  </div>

                  {msg.type === 'trade_alert' && msg.tradeData && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-xs">
                      {msg.tradeData.type === 'buy' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-gray-400">
                        {msg.tradeData.symbol} • {msg.tradeData.volume} lot
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={i18n.language === 'ar' ? 'اكتب رسالة...' : 'Type a message...'}
                className="flex-1 bg-zinc-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-foreground placeholder-gray-500 focus:border-amber-500 outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="w-10 h-10 bg-amber-500 text-black rounded-xl flex items-center justify-center hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </motion.div>
  );
}

export default TeamChat;
