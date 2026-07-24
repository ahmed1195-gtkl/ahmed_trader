import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Bot, SendHorizontal, BookOpen, ChevronRight, EyeOff, Sparkles, Shield,
  Search, HelpCircle, ArrowRight, Zap, Trophy, TrendingUp, Calculator,
  Lock, CheckCircle2, ChevronDown, RefreshCw, PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

/* ─── Platform Knowledge Base Data for Instant Search ─── */
const KB_FAQ_DATA = [
  {
    id: 'auth-1',
    category: 'auth',
    question: { ar: 'كيف أنشئ حساباً جديداً؟', en: 'How do I create an account?', fr: 'Comment créer un compte?' },
    answer: {
      ar: 'انتقل إلى صفحة التسجيل (/auth)، ادخل اسمك، بلدك، رقم هاتفك، وبريدك الإلكتروني وكلمة المرور، ثم قم بتأكيد بريدك الإلكتروني.',
      en: 'Go to /auth, enter your name, country, phone, email, and password, then verify your email address.',
      fr: 'Allez sur /auth, saisissez votre nom, pays, téléphone, e-mail et mot de passe, puis vérifiez votre e-mail.'
    },
    actionPath: '/auth',
    actionText: { ar: 'انتقل لصفحة التسجيل', en: 'Go to Auth Page', fr: 'Page de connexion' }
  },
  {
    id: 'auth-2',
    category: 'auth',
    question: { ar: 'نسيت كلمة المرور، ماذا أفعل؟', en: 'I forgot my password, what should I do?', fr: 'J\'ai oublié mon mot de passe' },
    answer: {
      ar: 'انقر على "نسيت كلمة المرور" في صفحة الدخول (/auth)، أدخل بريدك الإلكتروني وستصلك رسالة إعادة الضبط فوراً.',
      en: 'Click "Forgot Password" on the login page (/auth), enter your email, and you will receive a reset link instantly.',
      fr: 'Cliquez sur "Mot de passe oublié" sur la page de connexion, saisissez votre e-mail pour recevoir un lien.'
    },
    actionPath: '/auth',
    actionText: { ar: 'استعادة كلمة المرور', en: 'Reset Password', fr: 'Réinitialiser' }
  },
  {
    id: 'academy-1',
    category: 'academy',
    question: { ar: 'ما هي المحاور التعليمية المتاحة في الأكاديمية؟', en: 'What courses are available in the Academy?', fr: 'Quels cours sont disponibles?' },
    answer: {
      ar: 'تضم الأكاديمية 5 مدارس رئيسية بها 57+ درساً: التأسيس، التحليل الفني الكلاسيكي، SMC (مفاهيم المال الذكي)، ICT، ونظام SK System.',
      en: 'The Academy has 5 main schools with 57+ lessons: Foundation, Classical Analysis, SMC, ICT, and the SK System.',
      fr: 'L\'Académie comprend 5 écoles avec 57+ leçons: Fondation, Analyse Classique, SMC, ICT et SK System.'
    },
    actionPath: '/academy',
    actionText: { ar: 'تصفح الأكاديمية', en: 'Explore Academy', fr: 'Explorer l\'Académie' }
  },
  {
    id: 'academy-2',
    category: 'academy',
    question: { ar: 'هل الدروس ورسومات الأكاديمية مجانية؟', en: 'Are academy lessons and diagrams free?', fr: 'Les leçons et schémas sont-ils gratuits?' },
    answer: {
      ar: 'نعم، جميع دروس الأكاديمية والرسومات التوضيحية متاحة مجاناً لجميع المستخدمين المسجلين بالمنصة.',
      en: 'Yes, all academy lessons and technical diagrams are completely free for registered platform users.',
      fr: 'Oui, toutes les leçons et schémas sont 100% gratuits pour les utilisateurs inscrits.'
    },
    actionPath: '/academy',
    actionText: { ar: 'ابدأ التعلم الآن', en: 'Start Learning', fr: 'Commencer' }
  },
  {
    id: 'bot-1',
    category: 'tools',
    question: { ar: 'كيف يعمل بوت التداول بالذكاء الاصطناعي؟', en: 'How does the AI Trading Bot work?', fr: 'Comment fonctionne le bot IA?' },
    answer: {
      ar: 'يعتمد البوت على نموذج تعزيز التعلم (RL Model V2) لتحليل الاتجاه، RSI، الفجوات السعرية FVG، التدفقات النقدية والأخبار في الوقت الفعلي تقديم توصيات دقيقة.',
      en: 'The AI Bot uses a Reinforcement Learning V2 engine analyzing trend, RSI, FVG gaps, order flow, and news in real-time to generate signals.',
      fr: 'Le Bot IA utilise l\'apprentissage par renforcement pour analyser la tendance, le RSI, le FVG et les flux en temps réel.'
    },
    actionPath: '/ai-bot',
    actionText: { ar: 'فتح بوت التداول', en: 'Open AI Bot', fr: 'Ouvrir le Bot IA' }
  },
  {
    id: 'challenge-1',
    category: 'challenges',
    question: { ar: 'كيف أشارك في التحديات للتداول والحصول على حساب ممول؟', en: 'How do I join trading challenges?', fr: 'Comment rejoindre les défis?' },
    answer: {
      ar: 'اختر المستوى المناسب (برونزي، فضي، ذهبي)، اربط حسابك التجريبي (MT4/MT5)، وحقق الهدف المالي المطلوب دون تجاوز الحد الأقصى للتراجع.',
      en: 'Pick your tier (Bronze, Silver, Gold), connect your MT4/MT5 demo account, and hit the target without exceeding max drawdown.',
      fr: 'Choisissez votre niveau, connectez votre compte démo MT4/MT5 et atteignez l\'objectif sans dépasser le drawdown.'
    },
    actionPath: '/challenges',
    actionText: { ar: 'دخول التحديات', en: 'Join Challenges', fr: 'Rejoindre les défis' }
  },
  {
    id: 'challenge-2',
    category: 'challenges',
    question: { ar: 'كيف أربط حساب MT4 / MT5 التجريبي؟', en: 'How do I connect my MT4 / MT5 Demo Account?', fr: 'Comment connecter mon compte MT4 / MT5?' },
    answer: {
      ar: 'ادخل كلمة سر المستثمر (Investor Password) ورقم الحساب والسيرفر من إعدادات الحساب أو عند الانضمام للتحدي. كلمة السر هذه للقراءة فقط وآمنة 100%.',
      en: 'Provide your read-only Investor Password, account number, and server. This gives read-only access and is 100% safe.',
      fr: 'Saisissez votre mot de passe investisseur (lecture seule), numéro de compte et serveur. C\'est 100% sécurisé.'
    },
    actionPath: '/setup-account',
    actionText: { ar: 'ربط الحساب التجريبي', en: 'Connect Demo Account', fr: 'Connecter démo' }
  },
  {
    id: 'brokers-1',
    category: 'brokers',
    question: { ar: 'ما هي أفضل الشركات والوسطاء المعتمدين؟', en: 'What are the recommended trading brokers?', fr: 'Quels sont les courtiers recommandés?' },
    answer: {
      ar: 'يمكنك مراجعة قائمة الوسطاء المعتمدين والاطلاع على التقييمات والعروض والعمولات والتسجيل المباشر من صفحة الوسطاء.',
      en: 'View our curated list of verified brokers with ratings, deposit bonuses, spreads, and direct registration links on the Brokers page.',
      fr: 'Consultez notre liste de courtiers vérifiés avec évaluations, bonus et liens d\'inscription sur la page Courtiers.'
    },
    actionPath: '/brokers',
    actionText: { ar: 'صفحة الوسطاء', en: 'View Brokers', fr: 'Voir Courtiers' }
  },
  {
    id: 'pip-1',
    category: 'tools',
    question: { ar: 'كيف أحسب قيمة النقطة وإدارة المخاطر؟', en: 'How do I calculate pip value & position size?', fr: 'Comment calculer la valeur du pip?' },
    answer: {
      ar: 'استخدم حاسبة النقاط (/pip-calculator)، اختر الزوج وحجم اللوت وعملة الحساب لحساب قيمة النقطة والهامش المطلوب فوراً.',
      en: 'Use the Pip Calculator (/pip-calculator). Select your pair, lot size, and account currency to compute exact pip value and margin.',
      fr: 'Utilisez le calculateur de pip (/pip-calculator) pour obtenir la valeur exacte et la marge selon votre lot.'
    },
    actionPath: '/pip-calculator',
    actionText: { ar: 'حاسبة النقاط', en: 'Pip Calculator', fr: 'Calculateur Pip' }
  },
  {
    id: 'subs-1',
    category: 'subscriptions',
    question: { ar: 'ما هي خطط الاشتراكات المميزة المتاحة؟', en: 'What subscription plans are available?', fr: 'Quels sont les abonnements disponibles?' },
    answer: {
      ar: 'توفر المنصة 3 خطط: الخطة المجانية FREE، خطة PRO المتقدمة ($49/شهر)، وخطة ALPHA الاحترافية ($99/شهر) التي تتضمن التوصيات الفورية والتداول النسخي.',
      en: 'We offer 3 tiers: FREE, PRO ($49/mo), and ALPHA ($99/mo) which unlocks early signals, copy trading, and unlimited analysis.',
      fr: '3 formules: GRATUIT, PRO (49$/mois) et ALPHA (99$/mois) débloquant les signaux VIP et le Copy Trading.'
    },
    actionPath: '/subscription',
    actionText: { ar: 'عرض خطط الاشتراك', en: 'View Subscription Plans', fr: 'Voir Abonnements' }
  }
];

const ChatWidget = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : i18n.language?.startsWith('es') ? 'es' : 'en';
  const isRTL = lang === 'ar';

  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  /* Active Tab: 'help' (Knowledge Base) | 'chat' (Admin Support) | 'services' (Quick Links) */
  const [activeTab, setActiveTab] = useState('help');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);

  const TXT = useMemo(() => ({
    en: {
      helpCenter: 'Help Center',
      adminSupport: 'Live Support',
      quickServices: 'Services',
      searchPlaceholder: 'Search features, courses, tools...',
      allCategories: 'All Topics',
      authCat: 'Account & Login',
      academyCat: 'Academy & Courses',
      toolsCat: 'Tools & AI',
      challengesCat: 'Challenges & MT4',
      brokersCat: 'Brokers',
      subsCat: 'Subscriptions',
      noFaqFound: 'No results found. Try chatting directly with our support team!',
      directSupport: 'Talk to Support',
      online: 'Active Now',
      typeMsg: 'Type your message...',
      noMsgs: 'No messages yet',
      startConvo: 'Start a direct chat with our support team',
      fullPage: 'Full Screen Mode',
      hideWidget: 'Hide Widget',
      showWidget: 'ShukriTrade Support & Help',
      aiBot: 'AI Trading Bot',
      telegram: 'VIP Telegram Channel',
      academy: 'Trading Academy',
      pipCalc: 'Pip & Risk Calculator',
      brokers: 'Recommended Brokers',
      viewProfile: 'View Profile',
      askAdmin: 'Still need help? Ask Support'
    },
    ar: {
      helpCenter: 'مركز المساعدة',
      adminSupport: 'الدعم المباشر',
      quickServices: 'الخدمات السريعة',
      searchPlaceholder: 'ابحث في الميزات، الكورسات، الأدوات...',
      allCategories: 'كل المواضيع',
      authCat: 'الحساب والحماية',
      academyCat: 'الأكاديمية والكورسات',
      toolsCat: 'الأدوات والذكاء الاصطناعي',
      challengesCat: 'التحديات و MT4',
      brokersCat: 'الوسطاء',
      subsCat: 'الاشتراكات',
      noFaqFound: 'لم نجد نتائج لبحثك. يمكنك مراسلة الدعم الفني مباشرة!',
      directSupport: 'تحدث مع الدعم',
      online: 'متصل الآن',
      typeMsg: 'اكتب رسالتك...',
      noMsgs: 'لا توجد رسائل بعد',
      startConvo: 'ابدأ محادثة مباشرة مع الدعم الفني',
      fullPage: 'خدمة الرسائل الكاملة',
      hideWidget: 'إخفاء الأيقونة',
      showWidget: 'دعم ومساعدة ShukriTrade',
      aiBot: 'بوت التداول الذكي',
      telegram: 'قناة VIP التليجرام',
      academy: 'أكاديمية التداول',
      pipCalc: 'حاسبة النقاط والمخاطر',
      brokers: 'الوسطاء المعتمدون',
      viewProfile: 'عرض الملف الشخصي',
      askAdmin: 'هل تحتاج مساعدة إضافية؟ تواصل مع الدعم'
    },
    fr: {
      helpCenter: 'Centre d\'aide',
      adminSupport: 'Support En Direct',
      quickServices: 'Services',
      searchPlaceholder: 'Rechercher cours, outils, fonctionnalités...',
      allCategories: 'Tous les sujets',
      authCat: 'Compte & Connexion',
      academyCat: 'Académie & Cours',
      toolsCat: 'Outils & IA',
      challengesCat: 'Défis & MT4',
      brokersCat: 'Courtiers',
      subsCat: 'Abonnements',
      noFaqFound: 'Aucun résultat trouvé. Contactez le support!',
      directSupport: 'Parler au support',
      online: 'En ligne',
      typeMsg: 'Écrire un message...',
      noMsgs: 'Aucun message',
      startConvo: 'Démarrer une discussion directe',
      fullPage: 'Plein écran',
      hideWidget: 'Masquer',
      showWidget: 'Support ShukriTrade',
      aiBot: 'Bot IA de Trading',
      telegram: 'Canal VIP Telegram',
      academy: 'Académie de Trading',
      pipCalc: 'Calculateur de Pip',
      brokers: 'Courtiers Recommandés',
      viewProfile: 'Voir Profil',
      askAdmin: 'Besoin d\'aide? Contactez le support'
    }
  })[lang] || ({
    helpCenter: 'Help Center', adminSupport: 'Live Support', quickServices: 'Services',
    searchPlaceholder: 'Search features, courses...', allCategories: 'All', authCat: 'Auth',
    academyCat: 'Academy', toolsCat: 'Tools', challengesCat: 'Challenges', brokersCat: 'Brokers',
    subsCat: 'Subscriptions', noFaqFound: 'No results.', directSupport: 'Talk to Support',
    online: 'Online', typeMsg: 'Type message...', noMsgs: 'No messages', startConvo: 'Start chat',
    fullPage: 'Full Screen', hideWidget: 'Hide', showWidget: 'Support', aiBot: 'AI Bot',
    telegram: 'Telegram', academy: 'Academy', pipCalc: 'Pip Calculator', brokers: 'Brokers',
    viewProfile: 'Profile', askAdmin: 'Ask Support'
  }), [lang]);

  /* Auth Monitor */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  /* Admin Check */
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

  /* Firestore Messages Stream */
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

  /* Filter FAQs for Search */
  const filteredFaqs = useMemo(() => {
    return KB_FAQ_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const qText = (item.question[lang] || item.question.en).toLowerCase();
      const aText = (item.answer[lang] || item.answer.en).toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || qText.includes(query) || aText.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, lang]);

  if (!user) return null;

  return (
    <>
      {/* ─── 1. Smart Edge Trigger (عند الإخفاء كامل) ─── */}
      <AnimatePresence>
        {isHidden && (
          <motion.button
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
            onClick={() => setIsHidden(false)}
            className={`fixed bottom-6 ${isRTL ? 'left-4' : 'right-4'} z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-card/90 backdrop-blur-2xl border border-amber-500/40 shadow-xl text-xs font-bold text-amber-500 hover:bg-amber-500 hover:text-black transition-all cursor-pointer group`}
            title={TXT.showWidget}
          >
            <HelpCircle className="w-4 h-4 animate-bounce" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
              {TXT.showWidget}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── 2. Floating Draggable Launcher Icon ─── */}
      {!isHidden && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{ left: -window.innerWidth + 80, right: 0, top: -window.innerHeight + 120, bottom: 0 }}
          className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 touch-none flex items-center gap-2`}
        >
          <motion.div className="relative group">
            <motion.button
              onClick={toggleChat}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 text-black shadow-2xl shadow-amber-500/30 flex items-center justify-center border border-amber-300/40 cursor-pointer relative overflow-hidden"
              title={TXT.showWidget}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <HelpCircle className="w-6 h-6 text-black relative z-10" />

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

            {/* Quick Hide Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsHidden(true); }}
              className="absolute -top-2 -left-2 w-6 h-6 bg-card border border-border/80 text-muted-foreground hover:text-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
              title={TXT.hideWidget}
            >
              <EyeOff className="w-3 h-3" />
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* ─── 3. Main Support & Knowledge Base Window ─── */}
      <AnimatePresence>
        {isOpen && !isHidden && (
          <motion.div
            ref={widgetRef}
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className={`fixed bottom-24 ${isRTL ? 'left-6' : 'right-6'} z-50 w-96 max-w-[calc(100vw-2rem)]`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="bg-card/95 backdrop-blur-2xl border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden flex flex-col max-h-[85vh]">
              
              {/* Top Bar Header */}
              <div className="bg-gradient-to-r from-amber-500/20 via-secondary/60 to-background border-b border-border/60 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 flex-shrink-0">
                    <Shield className="w-4.5 h-4.5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground leading-none">
                      ShukriTrade Support
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-500 font-medium">{TXT.online}</span>
                    </div>
                  </div>
                </div>

                {/* Header Window Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setIsOpen(false); navigate('/messages'); }}
                    className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer"
                    title={TXT.fullPage}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsHidden(true)}
                    className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title={TXT.hideWidget}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={toggleChat}
                    className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="flex border-b border-border/40 bg-secondary/30 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('help')}
                  className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${activeTab === 'help' ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {TXT.helpCenter}
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 relative ${activeTab === 'chat' ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {TXT.adminSupport}
                  {unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-2 right-2" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${activeTab === 'services' ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {TXT.quickServices}
                </button>
              </div>

              {/* Main Body */}
              {!isMinimized && (
                <>
                  {/* TAB 1: KNOWLEDGE BASE / HELP CENTER */}
                  {activeTab === 'help' && (
                    <div className="p-4 flex flex-col gap-3 h-96 overflow-y-auto custom-scrollbar">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className={`w-4 h-4 absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-muted-foreground`} />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={TXT.searchPlaceholder}
                          className={`w-full bg-secondary/60 border border-border/60 rounded-xl ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-500/50 transition-all`}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className={`absolute top-2.5 ${isRTL ? 'left-3' : 'right-3'} text-muted-foreground hover:text-foreground`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Categories Filter Pills */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                        {[
                          { id: 'all', name: TXT.allCategories },
                          { id: 'auth', name: TXT.authCat },
                          { id: 'academy', name: TXT.academyCat },
                          { id: 'tools', name: TXT.toolsCat },
                          { id: 'challenges', name: TXT.challengesCat },
                          { id: 'brokers', name: TXT.brokersCat },
                          { id: 'subscriptions', name: TXT.subsCat }
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-amber-500 text-black font-bold shadow-sm' : 'bg-secondary/80 text-muted-foreground hover:text-foreground'}`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>

                      {/* FAQ Items List */}
                      <div className="space-y-2 flex-1">
                        {filteredFaqs.length === 0 ? (
                          <div className="flex flex-col items-center justify-center text-center p-6 bg-secondary/20 rounded-2xl border border-border/40 my-2">
                            <HelpCircle className="w-8 h-8 text-muted-foreground/40 mb-2" />
                            <p className="text-xs text-muted-foreground mb-3">{TXT.noFaqFound}</p>
                            <button
                              onClick={() => setActiveTab('chat')}
                              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
                            >
                              {TXT.directSupport}
                            </button>
                          </div>
                        ) : (
                          filteredFaqs.map((faq) => {
                            const isExpanded = expandedFaqId === faq.id;
                            const questionText = faq.question[lang] || faq.question.en;
                            const answerText = faq.answer[lang] || faq.answer.en;
                            const btnText = faq.actionText[lang] || faq.actionText.en;

                            return (
                              <div
                                key={faq.id}
                                className="bg-secondary/40 hover:bg-secondary/70 border border-border/50 rounded-2xl overflow-hidden transition-all"
                              >
                                <button
                                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                                  className="w-full p-3 flex items-center justify-between text-left gap-2 cursor-pointer"
                                >
                                  <span className="text-xs font-bold text-foreground leading-snug">
                                    {questionText}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 text-amber-500 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="px-3 pb-3 text-xs text-muted-foreground border-t border-border/30 pt-2 space-y-2"
                                    >
                                      <p className="leading-relaxed">{answerText}</p>
                                      {faq.actionPath && (
                                        <button
                                          onClick={() => { setIsOpen(false); navigate(faq.actionPath); }}
                                          className="flex items-center gap-1 text-[11px] font-bold text-amber-500 hover:underline pt-1"
                                        >
                                          <span>{btnText}</span>
                                          <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                                        </button>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Direct Ask Banner at Bottom of Help */}
                      <button
                        onClick={() => setActiveTab('chat')}
                        className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 flex items-center justify-between text-amber-500 hover:bg-amber-500/20 transition-all cursor-pointer"
                      >
                        <span className="text-xs font-bold">{TXT.askAdmin}</span>
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* TAB 2: DIRECT ADMIN CHAT */}
                  {activeTab === 'chat' && (
                    <>
                      <div className="h-80 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                              <MessageCircle className="w-7 h-7 text-amber-500/60" />
                            </div>
                            <p className="text-sm font-bold text-foreground mb-1">{TXT.noMsgs}</p>
                            <p className="text-xs text-muted-foreground">{TXT.startConvo}</p>
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

                      {/* Chat Input */}
                      <form onSubmit={handleSend} className="p-3 border-t border-border/50 bg-card/40 flex items-center gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={TXT.typeMsg}
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
                  )}

                  {/* TAB 3: QUICK SERVICES HUB */}
                  {activeTab === 'services' && (
                    <div className="p-4 space-y-2 h-80 overflow-y-auto custom-scrollbar">
                      {/* AI Bot */}
                      <button
                        onClick={() => { setIsOpen(false); navigate('/ai-bot'); }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 hover:bg-amber-500/10 border border-border/60 hover:border-amber-500/30 transition-all cursor-pointer text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                          <p className="text-xs font-bold text-foreground">{TXT.aiBot}</p>
                          <p className="text-[10px] text-muted-foreground truncate">Instant Market Analysis & Signals</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Telegram VIP */}
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
                          <p className="text-xs font-bold text-foreground">{TXT.telegram}</p>
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
                          <p className="text-xs font-bold text-foreground">{TXT.academy}</p>
                          <p className="text-[10px] text-muted-foreground truncate">Structured Trading Courses</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Pip Calculator */}
                      <button
                        onClick={() => { setIsOpen(false); navigate('/pip-calculator'); }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 hover:bg-amber-500/10 border border-border/60 hover:border-amber-500/30 transition-all cursor-pointer text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-bold">
                          <Calculator className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                          <p className="text-xs font-bold text-foreground">{TXT.pipCalc}</p>
                          <p className="text-[10px] text-muted-foreground truncate">Calculate Lot Size & Risk</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Recommended Brokers */}
                      <button
                        onClick={() => { setIsOpen(false); navigate('/brokers'); }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 hover:bg-amber-500/10 border border-border/60 hover:border-amber-500/30 transition-all cursor-pointer text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                          <p className="text-xs font-bold text-foreground">{TXT.brokers}</p>
                          <p className="text-[10px] text-muted-foreground truncate">Verified Brokers & Bonuses</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Full Messages Page */}
                      <button
                        onClick={() => { setIsOpen(false); navigate('/messages'); }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer text-left mt-2"
                      >
                        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-black font-bold">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                          <p className="text-xs font-bold text-amber-500">{TXT.fullPage}</p>
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
