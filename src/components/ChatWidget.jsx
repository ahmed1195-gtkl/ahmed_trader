import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import {
  MessageCircle, Send, X, Minimize2, User, ExternalLink,
  Bot, SendHorizontal, BookOpen, GripVertical, ChevronRight, EyeOff, Sparkles, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const ChatWidget = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : i18n.language?.startsWith('es') ? 'es' : 'en';
  const isRTL = lang === 'ar';

  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false); // إخفاء ذكي كامل
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'services'
  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);

  const txt = {
    en: {
      adminChat: 'Admin Support', allMsgs: 'All Conversations',
      online: 'Active Now', typeMsg: 'Type a message…',
      noMsgs: 'No messages yet', startConvo: 'Start a direct chat with support',
      fullPage: 'Full Screen Service', hideWidget: 'Hide Widget',
      showWidget: 'Chat Support', services: 'Quick Services',
      aiBot: 'AI Trading Bot', telegram: 'Telegram Channel', academy: 'Academy',
      viewProfile: 'View Profile'
    },
    ar: {
      adminChat: 'الدعم المباشر', allMsgs: 'جميع المحادثات',
      online: 'متصل الآن', typeMsg: 'اكتب رسالتك…',
      noMsgs: 'لا توجد رسائل بعد', startConvo: 'ابدأ محادثة مباشرة مع الإدارة',
      fullPage: 'خدمة الرسائل الكاملة', hideWidget: 'إخفاء الأيقونة',
      showWidget: 'الدعم والمساعدة', services: 'الخدمات السريعة',
      aiBot: 'بوت التداول الذكي', telegram: 'قناة التليجرام', academy: 'الأكاديمية',
      viewProfile: 'عرض الملف'
    },
    fr: {
      adminChat: 'Support Admin', allMsgs: 'Toutes les conversations',
      online: 'En ligne', typeMsg: 'Écrire un message…',
      noMsgs: 'Aucun message', startConvo: 'Démarrer une discussion',
      fullPage: 'Service complet', hideWidget: 'Masquer',
      showWidget: 'Support', services: 'Services rapides',
      aiBot: 'Bot IA', telegram: 'Canal Telegram', academy: 'Académie',
      viewProfile: 'Voir le profil'
    },
    es: {
      adminChat: 'Soporte Admin', allMsgs: 'Todas las conversaciones',
      online: 'En línea', typeMsg: 'Escribe un mensaje…',
      noMsgs: 'Sin mensajes', startConvo: 'Inicia un chat directo',
      fullPage: 'Servicio completo', hideWidget: 'Ocultar',
      showWidget: 'Soporte', services: 'Servicios rápidos',
      aiBot: 'Bot IA', telegram: 'Canal Telegram', academy: 'Academia',
      viewProfile: 'Ver perfil'
    }
  };
  const T = txt[lang] || txt.en;

  /* auth status */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  /* admin check */
  useEffect(() => {
    if (user) {
      const checkAdmin = async () => {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', user.email));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            setIsAdmin(userData.isAdmin || false);
          }
        } catch (e) {
          console.error(e);
        }
      };
      checkAdmin();
    }
  }, [user]);

  /* messages stream */
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

      const unread = messagesList.filter(msg =>
        !msg.read && msg.userId !== user.uid
      ).length;
      setUnreadCount(unread);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

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
      toast.error(lang === 'ar' ? 'فشل الإرسال' : 'Failed to send');
    } finally {
      setLoading(false);
    }
  }, [newMessage, user, isAdmin, scrollToBottom, lang]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) {
        setUnreadCount(0);
        setIsMinimized(false);
      }
      return !prev;
    });
  }, []);

  if (!user) return null;

  return (
    <>
      {/* ─── 1. Smart Edge Trigger (عند الإخفاء الكامل) ─── */}
      <AnimatePresence>
        {isHidden && (
          <motion.button
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
            onClick={() => setIsHidden(false)}
            className={`fixed bottom-6 ${isRTL ? 'left-4' : 'right-4'} z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-card/80 backdrop-blur-xl border border-amber-500/30 shadow-lg text-xs font-bold text-amber-500 hover:bg-amber-500 hover:text-black transition-all cursor-pointer group`}
            title={T.showWidget}
          >
            <MessageCircle className="w-4 h-4 animate-bounce" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
              {T.showWidget}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── 2. Floating Draggable Icon (عند الظهور) ─── */}
      {!isHidden && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{ left: -window.innerWidth + 80, right: 0, top: -window.innerHeight + 120, bottom: 0 }}
          className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 touch-none flex items-center gap-2`}
        >
          {/* Main Floating Button */}
          <motion.div className="relative group">
            <motion.button
              onClick={toggleChat}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 text-black shadow-xl shadow-amber-500/25 flex items-center justify-center border border-amber-300/40 cursor-pointer relative overflow-hidden"
              title={T.adminChat}
            >
              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <MessageCircle className="w-6 h-6 text-black relative z-10" />

              {/* Unread Badge */}
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-card shadow-md z-20"
                >
                  {unreadCount}
                </motion.div>
              )}
            </motion.button>

            {/* Quick Hide Button on Hover */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsHidden(true); }}
              className="absolute -top-2 -left-2 w-6 h-6 bg-card border border-border/80 text-muted-foreground hover:text-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
              title={T.hideWidget}
            >
              <EyeOff className="w-3 h-3" />
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* ─── 3. Floating Interactive Chat & Services Window ─── */}
      <AnimatePresence>
        {isOpen && !isHidden && (
          <motion.div
            ref={widgetRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className={`fixed bottom-24 ${isRTL ? 'left-6' : 'right-6'} z-50 w-96 max-w-[calc(100vw-2rem)]`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="bg-card/95 backdrop-blur-2xl border border-amber-500/25 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden flex flex-col">
              
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-amber-500/15 via-secondary/60 to-background border-b border-border/60 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 flex-shrink-0">
                    <Shield className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground leading-none">
                      {isAdmin ? T.allMsgs : T.adminChat}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-500 font-medium">{T.online}</span>
                    </div>
                  </div>
                </div>

                {/* Window Actions */}
                <div className="flex items-center gap-1">
                  {/* Full screen service link */}
                  <button
                    onClick={() => { setIsOpen(false); navigate('/messages'); }}
                    className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer"
                    title={T.fullPage}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  {/* Minimize */}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                  {/* Hide completely */}
                  <button
                    onClick={() => setIsHidden(true)}
                    className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title={T.hideWidget}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                  {/* Close window */}
                  <button
                    onClick={toggleChat}
                    className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs (Chat vs Quick Services) */}
              <div className="flex border-b border-border/40 bg-secondary/30 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-2 text-center transition-colors border-b-2 ${activeTab === 'chat' ? 'border-amber-500 text-amber-500 bg-amber-500/5' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  {T.adminChat}
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`flex-1 py-2 text-center transition-colors border-b-2 ${activeTab === 'services' ? 'border-amber-500 text-amber-500 bg-amber-500/5' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  {T.services}
                </button>
              </div>

              {/* Body */}
              {!isMinimized && (
                <>
                  {activeTab === 'chat' ? (
                    <>
                      {/* Messages Area */}
                      <div className="h-80 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                              <MessageCircle className="w-7 h-7 text-amber-500/60" />
                            </div>
                            <p className="text-sm font-bold text-foreground mb-1">{T.noMsgs}</p>
                            <p className="text-xs text-muted-foreground">{T.startConvo}</p>
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
                                className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end`}
                              >
                                <div className="w-6 flex-shrink-0">
                                  {showAvatar && (
                                    message.userPhoto ? (
                                      <img src={message.userPhoto} alt="" className="w-6 h-6 rounded-full object-cover border border-amber-500/30" />
                                    ) : (
                                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                        <User className="w-3 h-3 text-black" />
                                      </div>
                                    )
                                  )}
                                </div>
                                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[78%]`}>
                                  <div className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed break-words shadow-sm ${
                                    isOwn
                                      ? 'bg-gradient-to-br from-amber-500 to-amber-400 text-black font-medium rounded-br-none'
                                      : 'bg-secondary border border-border/60 text-foreground rounded-bl-none'
                                  }`}>
                                    {message.text}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Quick Input */}
                      <form onSubmit={handleSend} className="p-3 border-t border-border/50 bg-card/40 flex items-center gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={T.typeMsg}
                          disabled={loading}
                          className="flex-1 bg-secondary/60 border border-border/60 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 transition-all"
                        />
                        <button
                          type="submit"
                          disabled={loading || !newMessage.trim()}
                          className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 text-black flex items-center justify-center shadow-md shadow-amber-500/20 disabled:opacity-40 transition-all cursor-pointer flex-shrink-0"
                        >
                          <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </button>
                      </form>
                    </>
                  ) : (
                    /* Services Hub Tab */
                    <div className="p-4 space-y-2 h-80 overflow-y-auto">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                        {T.services}
                      </p>
                      
                      {/* AI Trading Bot */}
                      <button
                        onClick={() => { setIsOpen(false); navigate('/ai-bot'); }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 hover:bg-amber-500/10 border border-border/60 hover:border-amber-500/30 transition-all cursor-pointer text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                          <p className="text-xs font-bold text-foreground">{T.aiBot}</p>
                          <p className="text-[10px] text-muted-foreground truncate">Instant Market Analysis & Signals</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Telegram Channel */}
                      <a
                        href="https://t.me/ahmed_trader_123"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 hover:bg-amber-500/10 border border-border/60 hover:border-amber-500/30 transition-all cursor-pointer text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white">
                          <SendHorizontal className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                          <p className="text-xs font-bold text-foreground">{T.telegram}</p>
                          <p className="text-[10px] text-muted-foreground truncate">VIP Signals & Live Updates</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                      </a>

                      {/* Academy */}
                      <button
                        onClick={() => { setIsOpen(false); navigate('/academy'); }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 hover:bg-amber-500/10 border border-border/60 hover:border-amber-500/30 transition-all cursor-pointer text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                          <p className="text-xs font-bold text-foreground">{T.academy}</p>
                          <p className="text-[10px] text-muted-foreground truncate">Structured Trading Courses</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Full Messages Page */}
                      <button
                        onClick={() => { setIsOpen(false); navigate('/messages'); }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer text-left mt-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-black font-bold">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                          <p className="text-xs font-bold text-amber-500">{T.fullPage}</p>
                          <p className="text-[10px] text-muted-foreground truncate">Open full chat interface</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-amber-500 ${isRTL ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  )}
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
