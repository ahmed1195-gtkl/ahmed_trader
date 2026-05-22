import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, ChevronRight, ChevronLeft, X, Bookmark, BookmarkCheck,
  Settings, Volume2, VolumeX, Music, Maximize, Minimize,
  Play, Pause, SkipForward, SkipBack, Type, AlignJustify,
  Moon, Sun, Sparkles, Award, BarChart3, Clock, Target,
  Flame, Eye, MessageSquareQuote, Download, ArrowLeft,
  Mic, MicOff, List, Layers, Zap, Heart, Star, Lock, ShoppingCart, Shield
} from 'lucide-react';
import './ImmersiveBookReader.css';
import { useBookAccess } from '../hooks/useBookAccess';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';
import PaymentModal from './PaymentModal';

// ══════════════════════════════════════════════════════════════
// BOOK CONTENT DATA
// ══════════════════════════════════════════════════════════════
const BOOK_CONTENT = {
  title: 'التداول الرصين',
  author: 'Shukritrade',
  chapters: [
    {
      num: 1,
      title: 'لماذا يخسر أغلب الناس؟',
      free: true,
      pages: [
        {
          header: 'الافتتاحية: وهم المعرفة المسبقة',
          text: `تخيل معي للحظة أنني أعطيتك القدرة على رؤية المستقبل. تحديداً، أعطيتك صحيفة وول ستريت جورنال قبل 24 ساعة من نشرها. أنت تعرف ماذا سيكتبون غداً.\n\nهل تعتقد أنك ستجني أرباحاً خيالية؟\n\nهذه تجربة حقيقية أجرتها شركة Elm Wealth الاستشارية. أعطوا 118 طالباً في كلية المال والأعمال صفحة الجريدة الأولى قبل 24 ساعة من نشرها.`
        },
        {
          text: `النتائج صدمت الجميع: نصف المشاركين خسروا أموالهم. و16% منهم خسروا كل شيء - تم محو حساباتهم بالكامل.\n\nهؤلاء الطلاب توقعوا الاتجاه الصحيح في 51.5% من الحالات. إذا كانوا يعرفون المستقبل… لماذا خسروا؟\n\nلأن التداول ليس مجرد معرفة أين سيتحرك السوق. التداول هو معرفة كم يجب أن تراهن، ومتى تتوقف، وكيف تحمي نفسك عندما تكون مخطئاً.`
        },
        {
          header: 'الدرس الأول: وهم الثراء السريع',
          text: `كارلوس، شاب في التاسعة والعشرين من عمره، كان يعمل مهندساً. في أحد الأيام، ظهر له إعلان بعنوان "كيف حولت 500 دولار إلى 50,000 دولار في شهر واحد".\n\nأودع 3000 دولار. في الأسبوع الأول، ربح 400 دولار. زاد حجم صفقاته. في الأسبوع الثاني، خسر 2500 دولار. بدأ يدخل صفقات عشوائية "لتعويض" ما خسره.`
        },
        {
          text: `بعد شهر واحد فقط، كان حسابه صفراً.\n\nلماذا وهم الثراء السريع قوي جداً؟ عندما ترى صورة لشخص حقق أرباحاً خيالية، يفرز دماغك مادة الدوبامين. هذه المادة تقلل من قدرتك على تقييم المخاطر بشكل موضوعي.\n\nيقول مارك دوغلاس: "السوق لا يكافئ الأذكياء. السوق يكافئ المنضبطين."`
        },
        {
          header: 'الدرس الثاني: تأثير السوشيال ميديا',
          text: `محمد، شاب في الثانية والعشرين، كان يتابع أحد "المؤثرين" الماليين. دفع 200 دولار شهرياً للانضمام لمجموعته. تلقى إشارات تداول. خسر كل مرة.\n\nمحمد لم يكن يعلم أن هذا "المؤثر" لم يكن يتداول أصلاً. كان يكسب ماله من الاشتراكات الشهرية.`
        },
        {
          text: `بحسب التقارير: 1 من كل 3 متداولين جدد ينسحبون تماماً خلال 6 أشهر. و58% من المبتدئين يخسرون كل أموالهم تقريباً خلال عامهم الأول.\n\nالأسباب الأكثر شيوعاً:\n\n• ضعف البحث وفهم السوق - 55%\n• الخوف من تفويت الفرصة (FOMO) - 44%`
        },
        {
          header: 'الدرس الثالث: لماذا يربح القليل فقط؟',
          text: `هناك ثلاث فئات في السوق:\n\nالفئة الأولى - المؤسسات والبنوك: 85% منهم يربحون. لديهم فرق كاملة وأنظمة صارمة.\n\nالفئة الثانية - المتداولون المنضبطون: 45% منهم يحققون أرباحاً. يلتزمون بإدارة المخاطر، لديهم خطة مكتوبة، يتوقفون عند التعب النفسي.`
        },
        {
          text: `الفئة الثالثة - "المحظوظون" المؤقتون: أقل من 2% يستمرون في الربح بعد 5-10 سنوات.\n\nالفرق الحقيقي: الناجح يحدد مسبقاً كم سيخسر. الخاسر لا يحدد أو يخالف قاعدته. الناجح يدخل فقط عندما تتوفر شروط خطته. الخاسر يدخل لأن "السوق يبدو صاعداً".`
        },
        {
          header: 'الدرس الرابع: المقامر والمتداول',
          text: `المقامر لا يعرف متى يتوقف. المقامر يخاطر بأكثر مما يستطيع تحمل خسارته. يلاحق الخسارة محاولاً "تعويضها".\n\nالمتداول الحقيقي يعرف بالضبط كم سيخسر قبل أن يدخل الصفقة. يعرف أن الخسارة جزء من اللعبة.`
        },
        {
          text: `اختبار بسيط لنفسك:\n\n• هل تترك صفقاتك الخاسرة مفتوحة بعد وقف الخسارة؟\n• هل تتداول أكثر بعد سلسلة خسائر؟\n• هل تشعر بالنشوة عند الربح والاكتئاب عند الخسارة؟\n\nإذا أجبت بنعم على 3 أو أكثر، فأنت تتداول بعقلية المقامر.`
        },
        {
          header: 'ماذا تعلمت في هذا الفصل؟',
          text: `ثلاث نقاط أساسية:\n\nأولاً: وهم الثراء السريع فخ كيميائي حقيقي في دماغك. الدوبامين يقلل من قدرتك على تقييم المخاطر.\n\nثانياً: صناع المحتوى المالي نموذج أعمالهم لا يعتمد على نجاحك. يعتمد على مشاركتك.\n\nثالثاً: الفرق بين الخاسر والناجح ليس في الذكاء. الفرق في الانضباط وإدارة المخاطر واحترام الخسارة.`
        },
        {
          text: `"السوق لا يدمر الناس… الناس يدمرون أنفسهم داخل السوق."\n\nهذا الفصل هو الأساس الذي سنبني عليه بقية الكتاب. في الفصل القادم، سنغوص في أعماق سيكولوجية الخوف والطمع - القوتان اللتان تحركان كل قرار تتخذه في السوق.\n\nتذكر دائماً: المتداول الناجح ليس من يعرف أكثر، بل من ينضبط أكثر.`
        }
      ]
    },
    { num: 2, title: 'سيكولوجية الخوف والطمع', free: false, pages: [] },
    { num: 3, title: 'إدارة رأس المال', free: false, pages: [] },
    { num: 4, title: 'بناء خطة التداول', free: false, pages: [] },
    { num: 5, title: 'التحليل الفني الأساسي', free: false, pages: [] },
    { num: 6, title: 'الشموع اليابانية', free: false, pages: [] },
    { num: 7, title: 'مستويات الدعم والمقاومة', free: false, pages: [] },
    { num: 8, title: 'المؤشرات الفنية', free: false, pages: [] },
    { num: 9, title: 'استراتيجيات الدخول والخروج', free: false, pages: [] },
    { num: 10, title: 'التداول في الأخبار', free: false, pages: [] },
    { num: 11, title: 'بناء الروتين اليومي', free: false, pages: [] },
    { num: 12, title: 'الطريق إلى الاحتراف', free: false, pages: [] }
  ]
};

// Audio URLs
const AUDIO = {
  pageFlip: 'https://Shukritrade.b-cdn.net/Page%20Turn%20Sound%20Effect(MP3_160K).mp3',
  music: [
    {
      id: 'royal-calm',
      name: 'Royal Calm',
      nameAr: 'هدوء ملكي',
      desc: 'Warm studying ambience',
      descAr: 'أجواء دراسية دافئة',
      url: 'https://Shukritrade.b-cdn.net/playlist%20for%20studying%20_%20music%20for%20study%20_%20music%20for%20reading_%20writing%20and%20studying%20%EF%BF%BC%E2%9C%A8(MP3_160K).mp3',
      color: '#D4AF37'
    },
    {
      id: 'deep-void',
      name: 'Deep Void',
      nameAr: 'عمق مظلم',
      desc: 'Dark academia deep focus',
      descAr: 'تركيز عميق أكاديمي',
      url: 'https://Shukritrade.b-cdn.net/study%20playlist%20dark%20academia%20%F0%9F%95%B0%EF%B8%8F%20_%20timeless%20ambience%20for%20deep%20focus%20%F0%9F%93%9A%E2%9C%A8_%20Gibran%20Alcocer(MP3_160K).mp3',
      color: '#6366F1'
    }
  ]
};

const VIDEO_BG = 'https://Shukritrade.b-cdn.net/0520.mp4';

// ══════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════
const FREE_PAGES_MAX = 7; // Pages 0-7 are free (first 3 lessons)
const CHAPTER1_LAST_PAGE = 11; // Last page of chapter 1

const ACHIEVEMENTS = {
  'deep-focus': { icon: Target, name: 'ختم التركيز العميق', nameEn: 'Deep Focus Seal', condition: 'Read for 10+ minutes without pause' },
  'chapter-complete': { icon: Award, name: 'ختم إتمام الفصل', nameEn: 'Chapter Completion Seal', condition: 'Finish an entire chapter' },
  'consistency': { icon: Flame, name: 'ختم المداومة', nameEn: 'Consistency Seal', condition: '3 day reading streak' },
  'night-reader': { icon: Moon, name: 'ختم القارئ الليلي', nameEn: 'Night Reader Seal', condition: 'Read after 10pm' },
  'discipline': { icon: Zap, name: 'ختم الانضباط', nameEn: 'Discipline Seal', condition: 'Read 5 sessions total' }
};

const LS_KEY = 'ibr-sober-trading';

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const ImmersiveBookReader = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  // Book access
  const { hasAccess, userId } = useBookAccess();

  // ── State ──
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  // Panels
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Settings
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(2.2);
  const [fontClassic, setFontClassic] = useState(true);

  // Sound
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Narration
  const [narrating, setNarrating] = useState(false);
  const [narrationSpeed, setNarrationSpeed] = useState(1);

  // Bookmarks & Data
  const [bookmarks, setBookmarks] = useState([]);
  const [welcomeBack, setWelcomeBack] = useState(null);
  const [showAchievement, setShowAchievement] = useState(null);

  // Analytics
  const [sessionStart] = useState(Date.now());
  const [totalSessions, setTotalSessions] = useState(0);
  const [readingStreak, setReadingStreak] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // Payment modal
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Rating modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasPromptedRating, setHasPromptedRating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Refs
  const musicRef = useRef(null);
  const pageTurnRef = useRef(null);
  const inactivityTimer = useRef(null);

  const pages = BOOK_CONTENT.chapters[0].pages;
  const totalPages = pages.length;

  const PRICE = 11.99;
  const ORIGINAL_PRICE = 23.98;
  const DISCOUNT_PCT = Math.round(((ORIGINAL_PRICE - PRICE) / ORIGINAL_PRICE) * 100);

  // Is the current/target page locked?
  const isPageLocked = useCallback((pageIdx) => {
    return !hasAccess && pageIdx > FREE_PAGES_MAX;
  }, [hasAccess]);

  // ── Check Desktop ──
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Loading Screen ──
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ── Register Reader & Increment Firestore Count ──
  useEffect(() => {
    if (loading) return;
    const user = auth.currentUser;
    if (!user) return;

    const registerReader = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data().hasReadSoberBook) return;

        // Mark user as reader
        await updateDoc(userRef, { hasReadSoberBook: true });

        // Increment book readers count
        const bookRef = doc(db, 'books', 'sober-trading');
        await setDoc(bookRef, { readersCount: 1 }, { merge: true });
        // Use a second call with increment for actual increment behavior
        await setDoc(bookRef, { readersCount: increment(1) }, { merge: true });
      } catch (err) {
        console.warn('Could not register reader:', err);
      }
    };

    registerReader();
  }, [loading]);

  // ── Load Saved State ──
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (saved.currentPage > 0) {
        const page = hasAccess ? saved.currentPage : Math.min(saved.currentPage, FREE_PAGES_MAX);
        setCurrentPage(page);
        setWelcomeBack(page + 1);
        setTimeout(() => setWelcomeBack(null), 5000);
      }
      if (saved.bookmarks) setBookmarks(saved.bookmarks);
      if (saved.fontSize) setFontSize(saved.fontSize);
      if (saved.lineHeight) setLineHeight(saved.lineHeight);
      if (saved.fontClassic !== undefined) setFontClassic(saved.fontClassic);
      if (saved.totalSessions) setTotalSessions(saved.totalSessions + 1);
      if (saved.readingStreak) setReadingStreak(saved.readingStreak);
      if (saved.achievements) setUnlockedAchievements(saved.achievements);
      if (saved.hasPromptedRating) setHasPromptedRating(saved.hasPromptedRating);
    } else {
      setTotalSessions(1);
    }
  }, [hasAccess]);

  // ── Save State on Change ──
  useEffect(() => {
    if (loading) return;
    saveState({
      currentPage,
      bookmarks,
      fontSize,
      lineHeight,
      fontClassic,
      totalSessions,
      readingStreak,
      achievements: unlockedAchievements,
      hasPromptedRating,
      lastRead: Date.now()
    });
  }, [currentPage, bookmarks, fontSize, lineHeight, fontClassic, totalSessions, readingStreak, unlockedAchievements, hasPromptedRating, loading]);

  // ── Trigger rating on Chapter 1 completion ──
  useEffect(() => {
    if (loading) return;
    if (currentPage === CHAPTER1_LAST_PAGE && !hasPromptedRating) {
      setTimeout(() => {
        setIsExiting(false);
        setShowRatingModal(true);
        setHasPromptedRating(true);
      }, 800);
    }
  }, [currentPage, hasPromptedRating, loading]);

  // ── Inactivity UI Hide ──
  useEffect(() => {
    const handleActivity = () => {
      setUiVisible(true);
      clearTimeout(inactivityTimer.current);
      if (immersiveMode) {
        inactivityTimer.current = setTimeout(() => setUiVisible(false), 3000);
      }
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearTimeout(inactivityTimer.current);
    };
  }, [immersiveMode]);

  // ── Achievement Checks ──
  useEffect(() => {
    if (loading) return;
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 4) unlockAchievement('night-reader');
    if (totalSessions >= 5) unlockAchievement('discipline');
    if (currentPage >= totalPages - 1) unlockAchievement('chapter-complete');
  }, [currentPage, totalSessions, loading]);

  // Deep focus timer
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => unlockAchievement('deep-focus'), 10 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [loading]);

  const unlockAchievement = useCallback((id) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) return prev;
      setTimeout(() => {
        setShowAchievement(id);
        setTimeout(() => setShowAchievement(null), 4000);
      }, 500);
      return [...prev, id];
    });
  }, []);

  // ── Audio Functions ──
  const playPageTurn = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!pageTurnRef.current) {
        pageTurnRef.current = new Audio(AUDIO.pageFlip);
        pageTurnRef.current.volume = 0.4;
      }
      pageTurnRef.current.currentTime = 0;
      pageTurnRef.current.play().catch(() => {});
    } catch { /* ignore */ }
  }, [soundEnabled]);

  const playMusic = useCallback((mood) => {
    if (musicRef.current) { musicRef.current.pause(); musicRef.current = null; }
    if (!mood) { setMusicPlaying(false); setCurrentMood(null); return; }
    const audio = new Audio(mood.url);
    audio.volume = 0;
    audio.loop = true;
    musicRef.current = audio;
    audio.play().then(() => {
      setMusicPlaying(true);
      setCurrentMood(mood.id);
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol += 0.01;
        if (vol >= musicVolume) { audio.volume = musicVolume; clearInterval(fadeIn); }
        else { audio.volume = vol; }
      }, 30);
    }).catch(() => {});
  }, [musicVolume]);

  const stopMusic = useCallback(() => {
    if (musicRef.current) {
      const audio = musicRef.current;
      let vol = audio.volume;
      const fadeOut = setInterval(() => {
        vol -= 0.01;
        if (vol <= 0) { audio.pause(); audio.currentTime = 0; clearInterval(fadeOut); musicRef.current = null; }
        else { audio.volume = vol; }
      }, 30);
    }
    setMusicPlaying(false);
    setCurrentMood(null);
  }, []);

  useEffect(() => {
    if (musicRef.current && musicPlaying) musicRef.current.volume = musicVolume;
  }, [musicVolume, musicPlaying]);

  useEffect(() => {
    return () => { if (musicRef.current) { musicRef.current.pause(); musicRef.current = null; } };
  }, []);

  // ── Page Navigation ──
  const goToPage = useCallback((targetPage) => {
    if (isFlipping || targetPage < 0 || targetPage >= totalPages) return;
    // If target page is locked, show paywall
    if (isPageLocked(targetPage)) {
      setPaymentOpen(true);
      return;
    }
    const direction = targetPage > currentPage ? 'forward' : 'backward';
    setFlipDirection(direction);
    setIsFlipping(true);
    playPageTurn();
    setTimeout(() => {
      setCurrentPage(targetPage);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 700);
  }, [currentPage, isFlipping, totalPages, playPageTurn, isPageLocked]);

  const nextPage = useCallback(() => {
    if (isDesktop) {
      goToPage(Math.min(currentPage + 2, totalPages - 1));
    } else {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage, isDesktop, totalPages]);

  const prevPage = useCallback(() => {
    if (isDesktop) {
      goToPage(Math.max(currentPage - 2, 0));
    } else {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage, isDesktop]);

  // ── Handle Exit (back button) ──
  const handleExit = useCallback(() => {
    if (!hasPromptedRating && currentPage > 0) {
      setIsExiting(true);
      setShowRatingModal(true);
      setHasPromptedRating(true);
    } else {
      navigate('/books');
    }
  }, [hasPromptedRating, currentPage, navigate]);

  // ── Rating Submit ──
  const handleRatingSubmit = useCallback(async (skip = false) => {
    setSubmittingReview(true);
    if (!skip && rating > 0) {
      try {
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, 'book_reviews', `${user.uid}_sober-trading`), {
            rating,
            reviewText: reviewText.trim(),
            userId: user.uid,
            userName: user.displayName || user.email?.split('@')[0] || 'قارئ',
            userEmail: user.email || '',
            bookId: 'sober-trading',
            bookTitle: 'التداول الرصين',
            timestamp: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('Could not save review:', err);
      }
    }
    setSubmittingReview(false);
    setShowRatingModal(false);
    if (isExiting) navigate('/books');
  }, [rating, reviewText, isExiting, navigate]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (e.key === 'ArrowRight') prevPage();
        else nextPage();
      }
      if (e.key === 'Escape') {
        if (immersiveMode) setImmersiveMode(false);
        if (showBookmarks) setShowBookmarks(false);
        if (showMusic) setShowMusic(false);
        if (showSettings) setShowSettings(false);
        if (showChapters) setShowChapters(false);
        if (showAnalytics) setShowAnalytics(false);
        if (showRatingModal) { setShowRatingModal(false); if (isExiting) navigate('/books'); }
      }
      if (e.key === 'f' || e.key === 'F') setImmersiveMode(p => !p);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextPage, prevPage, immersiveMode, showBookmarks, showMusic, showSettings, showChapters, showAnalytics, showRatingModal, isExiting, navigate]);

  // ── Bookmark Functions ──
  const isBookmarked = useMemo(() => bookmarks.some(b => b.page === currentPage), [bookmarks, currentPage]);

  const toggleBookmark = useCallback(() => {
    setBookmarks(prev => {
      if (prev.some(b => b.page === currentPage))
        return prev.filter(b => b.page !== currentPage);
      return [...prev, { page: currentPage, note: '', timestamp: Date.now() }];
    });
  }, [currentPage]);

  // ── Narration ──
  const toggleNarration = useCallback(() => {
    if (narrating) {
      window.speechSynthesis.cancel();
      setNarrating(false);
      if (musicRef.current) musicRef.current.volume = musicVolume;
      return;
    }
    const page = pages[currentPage];
    if (!page) return;
    const utterance = new SpeechSynthesisUtterance(page.text);
    utterance.lang = 'ar-SA';
    utterance.rate = narrationSpeed;
    utterance.pitch = 1;
    if (musicRef.current && musicPlaying) musicRef.current.volume = musicVolume * 0.2;
    utterance.onend = () => {
      setNarrating(false);
      if (musicRef.current) musicRef.current.volume = musicVolume;
    };
    setNarrating(true);
    window.speechSynthesis.speak(utterance);
  }, [narrating, currentPage, pages, narrationSpeed, musicVolume, musicPlaying]);

  // ── Close all panels ──
  const closeAllPanels = useCallback(() => {
    setShowBookmarks(false);
    setShowMusic(false);
    setShowSettings(false);
    setShowChapters(false);
    setShowAnalytics(false);
  }, []);

  // ── Computed ──
  const progressPercent = ((currentPage + 1) / totalPages) * 100;
  const readingTime = Math.round((Date.now() - sessionStart) / 60000);
  const estimatedRemaining = Math.round((totalPages - currentPage - 1) * 1.5);
  const anyPanelOpen = showBookmarks || showMusic || showSettings || showChapters || showAnalytics;

  // ── Get pages for display ──
  const leftPageIdx = isDesktop ? (currentPage % 2 === 0 ? currentPage : currentPage - 1) : null;
  const rightPageIdx = isDesktop ? (currentPage % 2 === 0 ? currentPage + 1 : currentPage) : currentPage;

  // ── Is current view the paywall? ──
  const showPaywall = isPageLocked(currentPage);

  // ══════════════════════════════════════════════════════════════
  // LOADING SCREEN
  // ══════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="ibr-loading">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="ibr-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              '--drift': `${(Math.random() - 0.5) * 100}px`,
              animationDuration: `${6 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
        <motion.div
          className="ibr-loading-logo"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <BookOpen />
        </motion.div>
        <motion.div
          className="ibr-loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          التداول الرصين
        </motion.div>
        <div className="ibr-loading-bar">
          <div className="ibr-loading-bar-fill" />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <div className={`ibr-container ${immersiveMode ? 'ibr-immersive-mode' : ''}`}>
      {/* ── Video Background (Desktop Only) ── */}
      {isDesktop && (
        <div className="ibr-video-bg">
          <video autoPlay muted loop playsInline src={VIDEO_BG} preload="auto" />
        </div>
      )}

      {/* ── Mobile Background ── */}
      {!isDesktop && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.05) 0%, rgba(15,15,16,1) 70%)'
        }} />
      )}

      {/* ── Floating Particles ── */}
      <div className="ibr-particles">
        {[...Array(immersiveMode ? 40 : 15)].map((_, i) => (
          <div
            key={i}
            className={`ibr-particle ${i % 3 === 0 ? 'ibr-particle-dust' : ''}`}
            style={{
              left: `${Math.random() * 100}%`,
              '--drift': `${(Math.random() - 0.5) * 120}px`,
              animationDuration: `${8 + Math.random() * 12}s`,
              animationDelay: `${Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* ── Top Bar ── */}
      <div className={`ibr-topbar ${(!uiVisible || immersiveMode) && !anyPanelOpen ? 'hidden' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="ibr-btn-icon" onClick={handleExit} title="العودة">
            <ArrowLeft />
          </button>
          <div className="ibr-topbar-title">
            {BOOK_CONTENT.title}
            <span>الفصل {BOOK_CONTENT.chapters[0].num}: {BOOK_CONTENT.chapters[0].title}</span>
          </div>
        </div>

        <div className="ibr-topbar-actions">
          {/* Narration */}
          <button className={`ibr-btn-icon ${narrating ? 'active' : ''}`} onClick={toggleNarration} title="السرد الصوتي">
            {narrating ? <MicOff /> : <Mic />}
          </button>

          {/* Bookmark */}
          <button className={`ibr-btn-icon ${isBookmarked ? 'active' : ''}`} onClick={toggleBookmark} title="إشارة مرجعية">
            {isBookmarked ? <BookmarkCheck /> : <Bookmark />}
          </button>

          {/* Chapters */}
          <button className={`ibr-btn-icon ${showChapters ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowChapters(!showChapters); }} title="الفصول">
            <List />
          </button>

          {/* Bookmarks Panel */}
          <button className={`ibr-btn-icon ${showBookmarks ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowBookmarks(!showBookmarks); }} title="الإشارات المرجعية">
            <Layers />
          </button>

          {/* Music */}
          <button className={`ibr-btn-icon ${showMusic ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowMusic(!showMusic); }} title="الموسيقى">
            <Music />
          </button>

          {/* Analytics */}
          <button className={`ibr-btn-icon ${showAnalytics ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowAnalytics(!showAnalytics); }} title="تحليلات القراءة">
            <BarChart3 />
          </button>

          {/* PDF Download - only for paid users */}
          {hasAccess && (
            <a
              href="/sober_trading.pdf"
              download="Sober_Trading.pdf"
              className="ibr-btn-icon"
              title="تحميل PDF"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Download />
            </a>
          )}

          {/* Settings */}
          <button className={`ibr-btn-icon ${showSettings ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowSettings(!showSettings); }} title="الإعدادات">
            <Settings />
          </button>

          {/* Immersive Mode */}
          <button className={`ibr-btn-icon ${immersiveMode ? 'active' : ''}`} onClick={() => setImmersiveMode(!immersiveMode)} title="وضع الغمر">
            {immersiveMode ? <Minimize /> : <Maximize />}
          </button>
        </div>
      </div>

      {/* ── Narration Speed Bar ── */}
      <AnimatePresence>
        {narrating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ position: 'absolute', top: '70px', left: '50%', transform: 'translateX(-50%)', zIndex: 35 }}
          >
            <div className="ibr-narration-bar">
              <button onClick={() => setNarrationSpeed(s => Math.max(0.5, s - 0.25))}><SkipBack style={{ width: 14, height: 14 }} /></button>
              <span className="speed">{narrationSpeed}x</span>
              <button onClick={() => setNarrationSpeed(s => Math.min(2, s + 0.25))}><SkipForward style={{ width: 14, height: 14 }} /></button>
              <button onClick={toggleNarration}><Pause style={{ width: 14, height: 14 }} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Book ── */}
      <div className="ibr-book-wrapper">
        <div className="ibr-book">
          {/* Book Spine (desktop only) */}
          {isDesktop && <div className="ibr-book-spine" />}

          {/* Left Page (desktop only) */}
          {isDesktop && (
            <div className="ibr-page ibr-page-left">
              {leftPageIdx !== null && leftPageIdx >= 0 && leftPageIdx < totalPages && !isPageLocked(leftPageIdx) ? (
                <>
                  <div className="ibr-page-content">
                    {pages[leftPageIdx].header && (
                      <div className="ibr-page-header">
                        <span className="ibr-chapter-label">الفصل الأول</span>
                        <h2>{pages[leftPageIdx].header}</h2>
                      </div>
                    )}
                    <div className={`ibr-page-text ${!fontClassic ? 'font-modern' : ''}`} style={{ fontSize: `${fontSize}px`, lineHeight }}>
                      {pages[leftPageIdx].text.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                  </div>
                  <div className="ibr-page-number">{leftPageIdx + 1}</div>
                </>
              ) : (
                <div className="ibr-page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', opacity: 0.3 }}>
                    <BookOpen style={{ width: 48, height: 48, color: 'var(--ibr-gold-dark)', margin: '0 auto 1rem' }} />
                    <p style={{ fontFamily: 'var(--ibr-font-book)', color: 'var(--ibr-ink)', fontSize: 14 }}>التداول الرصين</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right Page / Paywall */}
          <div className="ibr-page ibr-page-right">
            {showPaywall ? (
              /* ══ PAYWALL OVERLAY ══ */
              <div className="ibr-page-content" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(15,15,16,0.98) 50%)',
                  backdropFilter: 'blur(2px)'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 20,
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <Lock style={{ width: 28, height: 28, color: '#D4AF37' }} />
                  </div>

                  <div style={{
                    fontFamily: 'var(--ibr-font-ui)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
                    color: '#D4AF37', textTransform: 'uppercase', marginBottom: '0.75rem'
                  }}>
                    محتوى مقفل
                  </div>

                  <div style={{
                    fontFamily: 'var(--ibr-font-book)',
                    fontSize: 20, fontWeight: 700,
                    color: 'var(--ibr-cream)', marginBottom: '0.75rem'
                  }}>
                    الدرس الرابع: المقامر والمتداول
                  </div>

                  <p style={{ fontFamily: 'var(--ibr-font-ui)', color: 'var(--ibr-gray)', fontSize: 13, marginBottom: '2rem', lineHeight: 1.7 }}>
                    احصل على وصول كامل للكتاب وجميع فصوله الـ 12 ودروسه الحصرية
                  </p>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--ibr-cream)', fontFamily: 'var(--ibr-font-ui)' }}>${PRICE}</span>
                    <span style={{ fontSize: 16, color: 'var(--ibr-gray)', textDecoration: 'line-through', marginRight: '0.5rem', marginLeft: '0.5rem', fontFamily: 'var(--ibr-font-ui)' }}>${ORIGINAL_PRICE}</span>
                    <span style={{
                      background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)',
                      color: '#f87171', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                      fontFamily: 'var(--ibr-font-ui)'
                    }}>-{DISCOUNT_PCT}%</span>
                  </div>

                  <button
                    onClick={() => setPaymentOpen(true)}
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #B8960E)',
                      color: '#0F0F10', fontFamily: 'var(--ibr-font-ui)',
                      fontSize: 12, fontWeight: 900, letterSpacing: '0.15em',
                      textTransform: 'uppercase', padding: '0.9rem 2rem',
                      borderRadius: 14, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      margin: '0 auto 1.25rem', boxShadow: '0 8px 24px rgba(212,175,55,0.25)'
                    }}
                  >
                    <ShoppingCart style={{ width: 16, height: 16 }} />
                    اشتري الكتاب كاملاً
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--ibr-gray)', fontSize: 10 }}>
                    <Shield style={{ width: 12, height: 12, color: 'rgba(212,175,55,0.5)' }} />
                    <span>إذا قرأت الكتاب كاملاً ولم تستفد — أعيد لك المبلغ خلال 7 أيام</span>
                  </div>
                </div>
              </div>
            ) : (
              rightPageIdx >= 0 && rightPageIdx < totalPages ? (
                <>
                  <div className="ibr-page-content">
                    {pages[rightPageIdx].header && (
                      <div className="ibr-page-header">
                        <span className="ibr-chapter-label">الفصل الأول</span>
                        <h2>{pages[rightPageIdx].header}</h2>
                      </div>
                    )}
                    <div className={`ibr-page-text ${!fontClassic ? 'font-modern' : ''}`} style={{ fontSize: `${fontSize}px`, lineHeight }}>
                      {pages[rightPageIdx].text.split('\n\n').map((p, i) => (
                        <p key={i} className={narrating ? 'ibr-narrating' : ''}>{p}</p>
                      ))}
                    </div>
                  </div>
                  <div className="ibr-page-number">{rightPageIdx + 1}</div>
                </>
              ) : null
            )}
          </div>

          {/* Page Flip Animation Overlay */}
          <AnimatePresence>
            {isFlipping && flipDirection && (
              <div className={`ibr-page-flip ${flipDirection === 'forward' ? 'flipping-forward' : 'flipping-backward'}`}>
                <div className="ibr-page-flip-front" />
                <div className="ibr-page-flip-back" />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Navigation Arrows ── */}
      <button
        className="ibr-nav ibr-nav-prev"
        onClick={prevPage}
        disabled={currentPage <= 0}
        style={{ opacity: currentPage <= 0 ? 0.2 : undefined }}
      >
        <ChevronRight />
      </button>
      <button
        className="ibr-nav ibr-nav-next"
        onClick={nextPage}
        disabled={showPaywall || currentPage >= totalPages - 1}
        style={{ opacity: (showPaywall || currentPage >= totalPages - 1) ? 0.2 : undefined }}
      >
        <ChevronLeft />
      </button>

      {/* ── Bottom Bar ── */}
      <div className={`ibr-bottombar ${(!uiVisible || immersiveMode) && !anyPanelOpen ? 'hidden' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {musicPlaying && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 0.8rem', borderRadius: '10px',
                background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)'
              }}
            >
              <Music style={{ width: 12, height: 12, color: 'var(--ibr-gold)' }} />
              <span style={{ color: 'var(--ibr-gold)', fontSize: 10, fontWeight: 700 }}>
                {AUDIO.music.find(m => m.id === currentMood)?.nameAr || ''}
              </span>
              <button onClick={stopMusic} style={{ background: 'none', border: 'none', color: 'var(--ibr-gold)', cursor: 'pointer', padding: '2px', display: 'flex' }}>
                <X style={{ width: 12, height: 12 }} />
              </button>
            </motion.div>
          )}
          <button className="ibr-btn-icon" onClick={() => setSoundEnabled(!soundEnabled)} style={{ width: 34, height: 34 }}>
            {soundEnabled ? <Volume2 style={{ width: 14, height: 14 }} /> : <VolumeX style={{ width: 14, height: 14 }} />}
          </button>
        </div>

        {/* Progress */}
        <div className="ibr-progress">
          <div className="ibr-progress-bar">
            <div className="ibr-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="ibr-progress-label">
            <span>صفحة {currentPage + 1} من {totalPages}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
        </div>

        {!hasAccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: 'rgba(212,175,55,0.6)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }}>
              {FREE_PAGES_MAX + 1 - currentPage > 0 ? `${FREE_PAGES_MAX + 1 - currentPage} صفحات مجانية متبقية` : 'معاينة مجانية'}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--ibr-gray)', fontSize: 10, fontWeight: 600 }}>{readingTime} دقيقة</span>
          <Clock style={{ width: 12, height: 12, color: 'var(--ibr-gray)' }} />
        </div>
      </div>

      {/* ── Panel Overlay ── */}
      {anyPanelOpen && <div className="ibr-overlay" onClick={closeAllPanels} />}

      {/* ═══════ CHAPTERS PANEL ═══════ */}
      <div className={`ibr-panel ibr-panel-right ${showChapters ? 'open' : ''}`}>
        <div className="ibr-panel-header">
          <h3>الفصول</h3>
          <button className="ibr-btn-icon" onClick={() => setShowChapters(false)} style={{ width: 32, height: 32 }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          {BOOK_CONTENT.chapters.map((ch) => {
            const chapterUnlocked = ch.free || hasAccess;
            return (
              <div
                key={ch.num}
                className={`ibr-chapter-item ${ch.num === 1 ? 'active' : ''}`}
                onClick={() => {
                  if (chapterUnlocked) {
                    setCurrentPage(0);
                    setShowChapters(false);
                  } else {
                    setShowChapters(false);
                    setPaymentOpen(true);
                  }
                }}
              >
                <div className={`ibr-chapter-num ${chapterUnlocked ? 'free' : 'locked'}`}>
                  {chapterUnlocked ? ch.num : <span style={{ fontSize: 10 }}>🔒</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: chapterUnlocked ? 'var(--ibr-cream)' : 'var(--ibr-gray)', fontSize: 12, fontWeight: 700 }}>
                    {ch.title}
                  </div>
                  {ch.free && (
                    <div style={{ color: 'var(--ibr-gold)', fontSize: 9, fontWeight: 600, marginTop: 2 }}>مجاني</div>
                  )}
                  {!chapterUnlocked && (
                    <div style={{ color: 'var(--ibr-gray)', fontSize: 9, marginTop: 2 }}>يتطلب شراء الكتاب</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════ BOOKMARKS PANEL ═══════ */}
      <div className={`ibr-panel ibr-panel-right ${showBookmarks ? 'open' : ''}`}>
        <div className="ibr-panel-header">
          <h3>الإشارات المرجعية</h3>
          <button className="ibr-btn-icon" onClick={() => setShowBookmarks(false)} style={{ width: 32, height: 32 }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          {bookmarks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.4 }}>
              <Bookmark style={{ width: 32, height: 32, color: 'var(--ibr-gold)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--ibr-cream)', fontSize: 12 }}>لا توجد إشارات مرجعية بعد</p>
              <p style={{ color: 'var(--ibr-gray)', fontSize: 10, marginTop: 4 }}>اضغط على أيقونة الإشارة لإضافة واحدة</p>
            </div>
          ) : (
            bookmarks.map((bm, idx) => (
              <div key={idx} className="ibr-bookmark-item" onClick={() => { goToPage(bm.page); setShowBookmarks(false); }}>
                <div className="page-num">
                  <BookmarkCheck style={{ width: 14, height: 14, display: 'inline', marginLeft: 4 }} />
                  صفحة {bm.page + 1}
                </div>
                <div className="note" style={{ fontSize: 10, color: 'var(--ibr-gray)' }}>
                  {new Date(bm.timestamp).toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ═══════ MUSIC PANEL ═══════ */}
      <div className={`ibr-panel ibr-panel-right ${showMusic ? 'open' : ''}`}>
        <div className="ibr-panel-header">
          <h3>أجواء القراءة</h3>
          <button className="ibr-btn-icon" onClick={() => setShowMusic(false)} style={{ width: 32, height: 32 }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          {AUDIO.music.map((mood) => (
            <div
              key={mood.id}
              className={`ibr-mood-card ${currentMood === mood.id ? 'active' : ''}`}
              onClick={() => { if (currentMood === mood.id) stopMusic(); else playMusic(mood); }}
            >
              <div className="ibr-mood-icon" style={{ background: `${mood.color}15`, color: mood.color }}>
                {currentMood === mood.id && musicPlaying ? <Pause style={{ width: 20, height: 20 }} /> : <Play style={{ width: 20, height: 20 }} />}
              </div>
              <div className="ibr-mood-info">
                <h4>{mood.nameAr}</h4>
                <p>{mood.descAr}</p>
              </div>
            </div>
          ))}
          <div className="ibr-volume-wrapper">
            <Volume2 />
            <input
              type="range" className="ibr-slider"
              min="0" max="1" step="0.05" value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            />
            <span style={{ color: 'var(--ibr-gray)', fontSize: 10, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>
              {Math.round(musicVolume * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ SETTINGS PANEL ═══════ */}
      <div className={`ibr-panel ibr-panel-right ${showSettings ? 'open' : ''}`}>
        <div className="ibr-panel-header">
          <h3>إعدادات القراءة</h3>
          <button className="ibr-btn-icon" onClick={() => setShowSettings(false)} style={{ width: 32, height: 32 }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          <div className="ibr-setting-group">
            <label><Type style={{ width: 14, height: 14, display: 'inline', marginLeft: 6 }} />حجم الخط: {fontSize}px</label>
            <input type="range" className="ibr-slider" min="14" max="28" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} />
          </div>
          <div className="ibr-setting-group">
            <label><AlignJustify style={{ width: 14, height: 14, display: 'inline', marginLeft: 6 }} />المسافة بين السطور: {lineHeight}</label>
            <input type="range" className="ibr-slider" min="1.5" max="3" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(parseFloat(e.target.value))} />
          </div>
          <div className="ibr-setting-group">
            <label>نوع الخط</label>
            <div className="ibr-font-switch">
              <button className={fontClassic ? 'active' : ''} onClick={() => setFontClassic(true)} style={{ fontFamily: 'Amiri, serif' }}>كلاسيكي</button>
              <button className={!fontClassic ? 'active' : ''} onClick={() => setFontClassic(false)} style={{ fontFamily: 'Cairo, sans-serif' }}>عصري</button>
            </div>
          </div>
          <div className="ibr-setting-group">
            <label>مؤثرات صوتية</label>
            <div className="ibr-font-switch">
              <button className={soundEnabled ? 'active' : ''} onClick={() => setSoundEnabled(true)}>
                <Volume2 style={{ width: 14, height: 14, display: 'inline', marginLeft: 4 }} />مفعّل
              </button>
              <button className={!soundEnabled ? 'active' : ''} onClick={() => setSoundEnabled(false)}>
                <VolumeX style={{ width: 14, height: 14, display: 'inline', marginLeft: 4 }} />صامت
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ ANALYTICS PANEL ═══════ */}
      <div className={`ibr-panel ibr-panel-right ${showAnalytics ? 'open' : ''}`}>
        <div className="ibr-panel-header">
          <h3>تحليلات القراءة</h3>
          <button className="ibr-btn-icon" onClick={() => setShowAnalytics(false)} style={{ width: 32, height: 32 }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          <div className="ibr-stat-card">
            <div className="ibr-stat-icon"><BarChart3 /></div>
            <div className="ibr-stat-info"><h4>{Math.round(progressPercent)}%</h4><p>نسبة الإنجاز</p></div>
          </div>
          <div className="ibr-stat-card">
            <div className="ibr-stat-icon"><Clock /></div>
            <div className="ibr-stat-info"><h4>{readingTime} دقيقة</h4><p>وقت القراءة</p></div>
          </div>
          <div className="ibr-stat-card">
            <div className="ibr-stat-icon"><Target /></div>
            <div className="ibr-stat-info"><h4>~{estimatedRemaining} دقيقة</h4><p>الوقت المتبقي</p></div>
          </div>
          <div className="ibr-stat-card">
            <div className="ibr-stat-icon"><Flame /></div>
            <div className="ibr-stat-info"><h4>{totalSessions}</h4><p>عدد الجلسات</p></div>
          </div>
          <div className="ibr-stat-card">
            <div className="ibr-stat-icon"><Eye /></div>
            <div className="ibr-stat-info"><h4>{currentPage + 1} / {totalPages}</h4><p>الصفحات المقروءة</p></div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ color: 'var(--ibr-gold)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.8rem' }}>الأختام المحققة</h4>
            {Object.entries(ACHIEVEMENTS).map(([id, ach]) => {
              const unlocked = unlockedAchievements.includes(id);
              const Icon = ach.icon;
              return (
                <div key={id} className="ibr-stat-card" style={{ opacity: unlocked ? 1 : 0.3 }}>
                  <div className="ibr-stat-icon" style={unlocked ? { background: 'rgba(212,175,55,0.15)', boxShadow: '0 0 15px rgba(212,175,55,0.1)' } : {}}>
                    <Icon />
                  </div>
                  <div className="ibr-stat-info">
                    <h4 style={{ fontSize: 13 }}>{ach.name}</h4>
                    <p>{unlocked ? '✓ محقق' : ach.condition}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════ WELCOME BACK TOAST ═══════ */}
      <AnimatePresence>
        {welcomeBack && (
          <motion.div
            className="ibr-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="ibr-toast-icon"><BookOpen /></div>
            <div className="ibr-toast-text">مرحباً بعودتك، توقفت عند صفحة <span>{welcomeBack}</span></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ ACHIEVEMENT REVEAL ═══════ */}
      <AnimatePresence>
        {showAchievement && ACHIEVEMENTS[showAchievement] && (
          <motion.div
            className="ibr-achievement"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAchievement(null)}
          >
            <div style={{ textAlign: 'center' }}>
              <div className="ibr-seal">
                <div className="ibr-seal-ring" />
                <div className="ibr-seal-inner">
                  {React.createElement(ACHIEVEMENTS[showAchievement].icon)}
                  <span>{ACHIEVEMENTS[showAchievement].name}</span>
                </div>
              </div>
              <motion.div
                className="ibr-seal-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                تم فتح ختم جديد!
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ PAYMENT MODAL ═══════ */}
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        bookTitle="التداول الرصين"
        price={PRICE}
        originalPrice={ORIGINAL_PRICE}
      />

      {/* ═══════ RATING MODAL ═══════ */}
      <AnimatePresence>
        {showRatingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9990,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem'
            }}
          >
            {/* Backdrop */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(16px)'
              }}
              onClick={() => { if (!submittingReview) handleRatingSubmit(true); }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '100%', maxWidth: 480,
                background: 'rgba(15,15,16,0.98)',
                border: '1px solid rgba(212,175,55,0.15)',
                borderRadius: 28,
                overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.05)',
              }}
              dir="rtl"
            >
              {/* Top ambient */}
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 300, height: 120,
                background: 'radial-gradient(ellipse, rgba(212,175,55,0.12), transparent 70%)',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '80%', height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)'
              }} />

              <div style={{ padding: '2rem', position: 'relative' }}>
                {/* Close */}
                <button
                  onClick={() => { if (!submittingReview) handleRatingSubmit(true); }}
                  style={{
                    position: 'absolute', top: '1.25rem', left: '1.25rem',
                    width: 32, height: 32, borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>

                {/* Icon */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 20,
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <MessageSquareQuote style={{ width: 28, height: 28, color: '#D4AF37' }} />
                  </div>
                  <h2 style={{
                    fontFamily: 'var(--ibr-font-ui)',
                    fontSize: 20, fontWeight: 900, color: 'var(--ibr-cream)',
                    letterSpacing: '-0.02em', marginBottom: '0.4rem'
                  }}>
                    {isExiting ? 'قبل المغادرة...' : 'كيف كانت تجربتك؟'}
                  </h2>
                  <p style={{ fontFamily: 'var(--ibr-font-ui)', color: 'var(--ibr-gray)', fontSize: 13 }}>
                    {isExiting
                      ? 'شارك رأيك في الكتاب قبل المغادرة'
                      : 'أكملت الفصل الأول! أخبرنا برأيك'}
                  </p>
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setRatingHover(star)}
                      onMouseLeave={() => setRatingHover(0)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: '4px'
                      }}
                    >
                      <Star
                        style={{
                          width: 36, height: 36,
                          fill: star <= (ratingHover || rating) ? '#D4AF37' : 'transparent',
                          color: star <= (ratingHover || rating) ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </motion.button>
                  ))}
                </div>

                {/* Rating label */}
                {(ratingHover || rating) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      textAlign: 'center', marginBottom: '1rem',
                      fontFamily: 'var(--ibr-font-ui)', color: '#D4AF37',
                      fontSize: 12, fontWeight: 700
                    }}
                  >
                    {['', 'ضعيف', 'مقبول', 'جيد', 'ممتاز', 'رائع جداً! 🌟'][ratingHover || rating]}
                  </motion.div>
                )}

                {/* Text input */}
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="اكتب تعليقك أو رأيك (اختياري)..."
                  rows={3}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(212,175,55,0.15)',
                    borderRadius: 14, padding: '0.85rem 1rem',
                    color: 'var(--ibr-cream)', resize: 'none',
                    fontFamily: 'var(--ibr-font-ui)', fontSize: 13,
                    outline: 'none', marginBottom: '1.25rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.4)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.15)'; }}
                />

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleRatingSubmit(true)}
                    disabled={submittingReview}
                    style={{
                      flex: 1, padding: '0.85rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 14, color: 'var(--ibr-gray)',
                      fontFamily: 'var(--ibr-font-ui)', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', letterSpacing: '0.05em'
                    }}
                  >
                    {isExiting ? 'تخطي والخروج' : 'تخطي'}
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRatingSubmit(false)}
                    disabled={submittingReview || rating === 0}
                    style={{
                      flex: 2, padding: '0.85rem',
                      background: rating > 0
                        ? 'linear-gradient(135deg, #D4AF37, #B8960E)'
                        : 'rgba(212,175,55,0.15)',
                      border: 'none', borderRadius: 14,
                      color: rating > 0 ? '#0F0F10' : 'rgba(212,175,55,0.4)',
                      fontFamily: 'var(--ibr-font-ui)', fontSize: 12, fontWeight: 900,
                      cursor: rating > 0 ? 'pointer' : 'not-allowed',
                      letterSpacing: '0.05em',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {submittingReview ? (
                      <span>جاري الإرسال...</span>
                    ) : (
                      <>
                        <Heart style={{ width: 14, height: 14 }} />
                        {isExiting ? 'أرسل وغادر' : 'أرسل التقييم'}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImmersiveBookReader;
