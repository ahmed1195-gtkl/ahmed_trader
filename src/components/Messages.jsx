import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './Header';
import { db, auth } from '../lib/firebase';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  serverTimestamp,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Send, MessageCircle, User, Loader2, ArrowLeft,
  MessageSquareOff, Trash2, Shield, Search, Sparkles, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { usePlatform } from '../context/PlatformContext';
import { isAdminUser } from '../lib/adminService';

/* ─── helpers ─────────────────────────────────── */
const formatTime = (msg, lang) => {
  const raw = msg.timestamp || (msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toISOString() : null);
  if (!raw) return '';
  return new Date(raw).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
};

const Avatar = ({ src, name, size = 10, ring = false }) => (
  src
    ? <img src={src} alt={name} loading="lazy" decoding="async"
        className={`w-${size} h-${size} rounded-full object-cover ${ring ? 'ring-2 ring-amber-500/40' : ''}`} />
    : <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 ${ring ? 'ring-2 ring-amber-500/40' : ''}`}>
        <User className={`w-${Math.floor(size / 2)} h-${Math.floor(size / 2)} text-black`} />
      </div>
);

/* ─── component ────────────────────────────────── */
const Messages = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { features } = usePlatform();
  const messagesEnabled = features?.messagesEnabled !== false;
  const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : i18n.language?.startsWith('es') ? 'es' : 'en';
  const isRTL = lang === 'ar';

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const txt = {
    en: {
      title: 'Messages', admin: 'Admin Panel', noUsers: 'No users yet',
      noMsgs: 'No messages yet', startConvo: 'Start the conversation',
      selectUser: 'Select a conversation', selectDesc: 'Choose a user from the list',
      placeholder: 'Write a message…', active: 'Online',
      loginRequired: 'Login Required', loginDesc: 'Please log in to access messages.',
      backHome: 'Back to Home', back: 'Back', search: 'Search users…',
      delete: 'Delete', unavailable: 'Messages are currently unavailable.',
      send: 'Send', you: 'You'
    },
    ar: {
      title: 'الرسائل', admin: 'لوحة الأدمن', noUsers: 'لا يوجد مستخدمون',
      noMsgs: 'لا توجد رسائل بعد', startConvo: 'ابدأ المحادثة',
      selectUser: 'اختر محادثة', selectDesc: 'اختر مستخدماً من القائمة',
      placeholder: 'اكتب رسالتك…', active: 'متصل',
      loginRequired: 'يجب تسجيل الدخول', loginDesc: 'يرجى تسجيل الدخول للوصول إلى الرسائل.',
      backHome: 'العودة للرئيسية', back: 'رجوع', search: 'ابحث عن مستخدم…',
      delete: 'حذف', unavailable: 'الرسائل غير متاحة حالياً.',
      send: 'إرسال', you: 'أنت'
    },
    fr: {
      title: 'Messages', admin: 'Admin', noUsers: 'Aucun utilisateur',
      noMsgs: 'Aucun message', startConvo: 'Démarrez la conversation',
      selectUser: 'Sélectionner', selectDesc: 'Choisissez un utilisateur',
      placeholder: 'Écrire un message…', active: 'En ligne',
      loginRequired: 'Connexion requise', loginDesc: 'Veuillez vous connecter.',
      backHome: 'Retour', back: 'Retour', search: 'Rechercher…',
      delete: 'Supprimer', unavailable: 'Messages indisponibles.',
      send: 'Envoyer', you: 'Vous'
    },
    es: {
      title: 'Mensajes', admin: 'Admin', noUsers: 'Sin usuarios',
      noMsgs: 'Sin mensajes', startConvo: 'Inicia la conversación',
      selectUser: 'Seleccionar', selectDesc: 'Elige un usuario de la lista',
      placeholder: 'Escribe un mensaje…', active: 'En línea',
      loginRequired: 'Inicio de sesión requerido', loginDesc: 'Por favor inicia sesión.',
      backHome: 'Volver', back: 'Volver', search: 'Buscar usuarios…',
      delete: 'Eliminar', unavailable: 'Mensajes no disponibles.',
      send: 'Enviar', you: 'Tú'
    }
  };
  const T = txt[lang] || txt.en;

  /* auth */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (cu) => {
      setUser(cu);
      if (cu) {
        const snap = await getDoc(doc(db, 'users', cu.uid));
        const adminCheck = isAdminUser(snap.exists() ? snap.data() : null);
        setIsAdmin(adminCheck);
        if (!adminCheck) {
          setSelectedUser({ uid: 'admin', displayName: T.admin, photoURL: null, isAdmin: true });
          setMobileView('chat');
        }
      }
      setAuthLoading(false);
    });
    return unsub;
  }, [lang]);

  /* fetch users (admin) */
  useEffect(() => {
    if (!isAdmin) return;
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const list = snap.docs.map(d => ({ uid: d.id, ...d.data() })).filter(u => !u.isAdmin);
        setUsers(list);
        setFilteredUsers(list);
      } catch (e) { console.error(e); }
    };
    fetchUsers();
  }, [isAdmin]);

  /* search filter */
  useEffect(() => {
    if (!searchQuery.trim()) { setFilteredUsers(users); return; }
    const q = searchQuery.toLowerCase();
    setFilteredUsers(users.filter(u =>
      (u.displayName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    ));
  }, [searchQuery, users]);

  /* messages subscription */
  useEffect(() => {
    if (!user) return;
    let q;
    if (isAdmin && selectedUser) {
      q = query(collection(db, 'messages'), where('participants', 'array-contains', selectedUser.uid));
    } else if (!isAdmin) {
      q = query(collection(db, 'messages'), where('userId', '==', user.uid));
    } else return;

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const ta = a.createdAt?.seconds || (a.timestamp ? new Date(a.timestamp).getTime() / 1000 : 0);
        const tb = b.createdAt?.seconds || (b.timestamp ? new Date(b.timestamp).getTime() / 1000 : 0);
        return ta - tb;
      });
      setMessages(list);
      requestAnimationFrame(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }));
    }, console.error);
    return unsub;
  }, [user, isAdmin, selectedUser]);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        userId: (isAdmin ? selectedUser?.uid : user?.uid) || '',
        userName: (isAdmin ? (selectedUser?.displayName || selectedUser?.email) : (user?.displayName || user?.email)) || 'User',
        userPhoto: (isAdmin ? selectedUser?.photoURL : user?.photoURL) || null,
        senderId: user?.uid || '',
        senderName: (user?.displayName || user?.email) || 'User',
        senderPhoto: user?.photoURL || null,
        isAdmin,
        participants: isAdmin ? [selectedUser?.uid || '', user?.uid || ''] : [user?.uid || ''],
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
      inputRef.current?.focus();
    } catch {
      toast.error(lang === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }, [newMessage, user, isAdmin, selectedUser, lang]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      toast.success(lang === 'ar' ? 'تم الحذف' : 'Deleted');
    } catch {
      toast.error(lang === 'ar' ? 'فشل الحذف' : 'Failed to delete');
    }
  }, [lang]);

  /* ─── Not logged in ─── */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center p-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-sm w-full text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/10">
              <MessageCircle className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-3">{T.loginRequired}</h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{T.loginDesc}</p>
            <button onClick={() => navigate('/')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 cursor-pointer">
              {T.backHome}
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  /* ─── Main UI ─── */
  return (
    <>
      <Header />
      <div
        className="min-h-screen bg-background text-foreground flex flex-col"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ paddingTop: '64px' }}
      >
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative flex-1 flex overflow-hidden" style={{ zIndex: 1, height: 'calc(100vh - 64px)' }}>

          {/* ─── Sidebar (admin only) ─── */}
          {isAdmin && (
            <motion.aside
              initial={{ x: isRTL ? 80 : -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`
                ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}
                flex-col
                w-full md:w-80 lg:w-88
                border-r border-border/50
                bg-card/60 backdrop-blur-xl
                flex-shrink-0
              `}
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
                    <Shield className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h1 className="text-base font-black text-foreground leading-tight">{T.title}</h1>
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">{T.admin}</span>
                  </div>
                </div>
                {/* Search */}
                <div className="relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={T.search}
                    className={`w-full bg-secondary/60 border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 py-2.5 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                  />
                </div>
              </div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/60 flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-muted-foreground text-sm">{T.noUsers}</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredUsers.map((u, i) => (
                      <motion.button
                        key={u.uid}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => { setSelectedUser(u); setMobileView('chat'); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all text-left ${
                          selectedUser?.uid === u.uid
                            ? 'bg-amber-500/15 border border-amber-500/25 shadow-md shadow-amber-500/10'
                            : 'hover:bg-secondary/60 border border-transparent'
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <Avatar src={u.photoURL} name={u.displayName} size={10} />
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                          <p className="text-sm font-bold text-foreground truncate">{u.displayName || u.email}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                        {selectedUser?.uid === u.uid && (
                          <ChevronRight className={`w-4 h-4 text-amber-500 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.aside>
          )}

          {/* ─── Chat Area ─── */}
          <div className="flex-1 flex flex-col min-w-0">
            {selectedUser || !isAdmin ? (
              <>
                {/* Chat Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-card/60 backdrop-blur-xl flex-shrink-0"
                >
                  {/* Mobile back */}
                  {isAdmin && (
                    <button
                      onClick={() => { setMobileView('list'); setSelectedUser(null); }}
                      className="md:hidden w-9 h-9 rounded-xl bg-secondary/60 flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer flex-shrink-0"
                    >
                      <ArrowLeft className={`w-4 h-4 text-foreground ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  )}

                  {/* Avatar + name */}
                  <button
                    className={`flex items-center gap-3 flex-1 min-w-0 rounded-2xl p-2 transition-colors ${isAdmin && selectedUser ? 'hover:bg-secondary/40 cursor-pointer' : 'cursor-default'}`}
                    onClick={() => isAdmin && selectedUser && navigate(`/profile/${selectedUser.uid}`)}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar src={selectedUser?.photoURL} name={selectedUser?.displayName} size={10} ring />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
                    </div>
                    <div className="text-start min-w-0">
                      <h2 className="text-sm font-black text-foreground truncate">
                        {selectedUser?.displayName || (lang === 'ar' ? 'الإدارة' : 'Admin Support')}
                      </h2>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-emerald-500 font-medium">{T.active}</span>
                      </div>
                    </div>
                  </button>

                  {/* Sparkle decoration */}
                  <Sparkles className="w-4 h-4 text-amber-500/40 flex-shrink-0" />
                </motion.div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6">
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center gap-4"
                    >
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/20 flex items-center justify-center shadow-xl shadow-amber-500/5">
                        <MessageCircle className="w-12 h-12 text-amber-500/60" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-foreground mb-1">{T.noMsgs}</h3>
                        <p className="text-muted-foreground text-sm">{T.startConvo}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-1 max-w-3xl mx-auto">
                      <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => {
                          const isOwn = msg.senderId === user.uid;
                          const prev = messages[idx - 1];
                          const next = messages[idx + 1];
                          const isFirstInGroup = !prev || prev.senderId !== msg.senderId;
                          const isLastInGroup = !next || next.senderId !== msg.senderId;
                          const showTime = isLastInGroup;

                          return (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end group ${isFirstInGroup ? 'mt-4' : 'mt-0.5'}`}
                            >
                              {/* Avatar column */}
                              <div className="w-8 flex-shrink-0 mb-1">
                                {isLastInGroup && (
                                  <Avatar src={msg.senderPhoto} name={msg.senderName} size={8} />
                                )}
                              </div>

                              {/* Bubble + actions */}
                              <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[72%] md:max-w-[60%]`}>
                                {isFirstInGroup && !isOwn && (
                                  <span className="text-[10px] text-muted-foreground font-medium mb-1 px-1">
                                    {msg.senderName}
                                  </span>
                                )}

                                <div className="flex items-center gap-1.5 group/bubble">
                                  {/* Delete btn (admin/own) — appears on hover */}
                                  {(isAdmin || isOwn) && (
                                    <motion.button
                                      initial={{ opacity: 0 }}
                                      whileHover={{ scale: 1.1 }}
                                      onClick={() => handleDelete(msg.id)}
                                      className="opacity-0 group-hover/bubble:opacity-100 p-1.5 rounded-xl bg-secondary/80 hover:bg-destructive/20 hover:text-destructive text-muted-foreground transition-all cursor-pointer"
                                      title={T.delete}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </motion.button>
                                  )}

                                  {/* Bubble */}
                                  <div className={`
                                    relative px-4 py-2.5 shadow-md text-sm leading-relaxed break-words
                                    ${isOwn
                                      ? 'bg-gradient-to-br from-amber-500 to-amber-400 text-black font-medium shadow-amber-500/20 rounded-3xl rounded-br-md'
                                      : 'bg-card border border-border/60 text-foreground shadow-black/5 rounded-3xl rounded-bl-md'
                                    }
                                  `}>
                                    {msg.text}
                                  </div>
                                </div>

                                {showTime && (
                                  <span className="text-[10px] text-muted-foreground/60 mt-1.5 px-1">
                                    {isOwn && <span className="mr-1">{T.you} · </span>}
                                    {formatTime(msg, lang)}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      <div ref={messagesEndRef} className="h-2" />
                    </div>
                  )}
                </div>

                {/* Input area */}
                <div className="px-4 py-4 border-t border-border/50 bg-card/40 backdrop-blur-xl flex-shrink-0">
                  {!messagesEnabled && !isAdmin ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-secondary/60 border border-border/50"
                    >
                      <MessageSquareOff className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{T.unavailable}</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          ref={inputRef}
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
                          placeholder={T.placeholder}
                          disabled={loading}
                          className="w-full bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground/40 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all disabled:opacity-50"
                          aria-label={T.placeholder}
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={loading || !newMessage.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0"
                        aria-label={T.send}
                      >
                        {loading
                          ? <Loader2 className="w-5 h-5 animate-spin" />
                          : <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                        }
                      </motion.button>
                    </form>
                  )}
                </div>
              </>
            ) : (
              /* Admin — no user selected */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/15 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <MessageCircle className="w-16 h-16 text-amber-500/50" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">{T.selectUser}</h3>
                <p className="text-muted-foreground text-sm">{T.selectDesc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--muted-foreground) / 0.4); }
      `}</style>
    </>
  );
};

export default Messages;
