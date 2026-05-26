import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, X, Bookmark, BookmarkCheck,
  Settings, Volume2, VolumeX, Music, Maximize, Minimize,
  Play, Pause, Type, AlignJustify,
  Moon, Sun, Sparkles, Award, BarChart3, Clock, Target,
  Flame, Eye, MessageSquareQuote, Download, ArrowLeft,
  Mic, MicOff, List, Layers, Zap, Heart, Star, Lock, ShoppingCart, Shield,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import './ImmersiveBookReader.css';
import { useBookAccess } from '../hooks/useBookAccess';
import { db, auth, storage } from '../lib/firebase';
import { doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import PaymentModal from './PaymentModal';
import { BOOK_CONTENT } from '../data/bookContent';

// ══════════════════════════════════════════════════════════════
// CONSTANTS & CONFIGURATIONS
// ══════════════════════════════════════════════════════════════
const PRICE = 11.99;
const ORIGINAL_PRICE = 23.98;
const DISCOUNT_PCT = Math.round(((ORIGINAL_PRICE - PRICE) / ORIGINAL_PRICE) * 100);
const LS_KEY = 'ibr-sober-v4-vertical';

const SCROLL_SPEEDS = {
  slow:   { px: 0.35, label: 'بطيء',  icon: '🐢' },
  medium: { px: 0.85, label: 'متوسط', icon: '🚶' },
  fast:   { px: 1.75, label: 'سريع',  icon: '🚀' },
};

const FONTS = [
  { id: 'amiri',        name: 'أميري',     css: "'Amiri', serif",                google: 'Amiri:ital,wght@0,400;0,700;1,400;1,700' },
  { id: 'cairo',        name: 'القاهرة',   css: "'Cairo', sans-serif",           google: 'Cairo:wght@300;400;600;700;900' },
  { id: 'tajawal',      name: 'تجوال',     css: "'Tajawal', sans-serif",         google: 'Tajawal:wght@300;400;500;700;900' },
  { id: 'ibm-arabic',   name: 'IBM عربي',  css: "'IBM Plex Arabic', sans-serif", google: 'IBM+Plex+Arabic:wght@300;400;500;600;700' },
  { id: 'scheherazade', name: 'شهرزاد',    css: "'Scheherazade New', serif",     google: 'Scheherazade+New:wght@400;500;600;700' },
  { id: 'lateef',       name: 'لطيف',      css: "'Lateef', serif",               google: 'Lateef:wght@400;700' },
  { id: 'noto-naskh',   name: 'نوتو نسخ',  css: "'Noto Naskh Arabic', serif",    google: 'Noto+Naskh+Arabic:wght@400;500;600;700' },
  { id: 'reem-kufi',    name: 'ريم كوفي',  css: "'Reem Kufi', serif",            google: 'Reem+Kufi:wght@400;500;600;700' },
  { id: 'el-messiri',   name: 'المسيري',   css: "'El Messiri', sans-serif",      google: 'El+Messiri:wght@400;500;600;700' },
  { id: 'lemonada',     name: 'ليمونادة',  css: "'Lemonada', cursive",           google: 'Lemonada:wght@300;400;600;700' }
];

const AUDIO = {
  music: [
    {
      id: 'royal-calm',
      nameAr: 'هدوء ملكي',
      descAr: 'أجواء دراسية دافئة',
      url: 'https://Shukritrade.b-cdn.net/playlist%20for%20studying%20_%20music%20for%20study%20_%20music%20for%20reading_%20writing%20and%20studying%20%EF%BF%BC%E2%9C%A8(MP3_160K).mp3',
      color: '#D4AF37'
    },
    {
      id: 'deep-void',
      nameAr: 'عمق مظلم',
      descAr: 'تركيز عميق أكاديمي',
      url: 'https://Shukritrade.b-cdn.net/study%20playlist%20dark%20academia%20%F0%9F%95%B0%EF%B8%8F%20_%20timeless%20ambience%20for%20deep%20focus%20%F0%9F%93%9A%E2%9C%A8_%20Gibran%20Alcocer(MP3_160K).mp3',
      color: '#6366F1'
    }
  ]
};

const VIDEO_BG = 'https://Shukritrade.b-cdn.net/0520.mp4';

const ACHIEVEMENTS = {
  'deep-focus': { icon: Target, name: 'ختم التركيز العميق', condition: 'قراءة لمدة 10 دقائق متواصلة' },
  'chapter-complete': { icon: Award, name: 'ختم إتمام الفصل', condition: 'إنهاء قراءة فصل كامل' },
  'consistency': { icon: Flame, name: 'ختم المداومة', condition: 'قراءة 3 جلسات تداول متتالية' },
  'night-reader': { icon: Moon, name: 'ختم القارئ الليلي', condition: 'القراءة بعد الساعة 10 مساءً' },
  'discipline': { icon: Zap, name: 'ختم الانضباط', condition: 'إتمام 5 جلسات قراءة إجمالاً' }
};

// Fixed background particles
const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${(i * 4 + Math.sin(i) * 12 + 50) % 100}%`,
  size: i % 3 === 0 ? 2.5 : i % 2 === 0 ? 1.5 : 1,
  delay: `${(i * 0.4) % 8}s`,
  duration: `${8 + (i * 1.1) % 10}s`,
  drift: `${((i % 7) - 3) * 40}px`,
  isDust: i % 2 === 0,
}));

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS FOR STATE MANAGEMENT
// ══════════════════════════════════════════════════════════════
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

  // Book Access Custom Hook
  const { hasAccess, userId } = useBookAccess();

  // ── States ──
  const [loading, setLoading] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  // Styling & Customization
  const [selectedFont, setSelectedFont] = useState('amiri');
  const [fontSize, setFontSize] = useState(20);
  const [lineHeight, setLineHeight] = useState(2.2);
  const [backgroundType, setBackgroundType] = useState('animated'); // 'animated' | 'static'

  // Auto-scroll
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState('medium');
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Panels
  const [showChapters, setShowChapters] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Bookmarks & Data
  const [bookmarks, setBookmarks] = useState([]);
  const [welcomeBack, setWelcomeBack] = useState(null);
  const [showAchievement, setShowAchievement] = useState(null);

  // Audio Moods
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Narration (Speech Synthesis)
  const [narrating, setNarrating] = useState(false);
  const [narrationSpeed, setNarrationSpeed] = useState(1);

  // Analytics Tracking
  const [sessionStart] = useState(Date.now());
  const [totalSessions, setTotalSessions] = useState(1);
  const [readingStreak, setReadingStreak] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // Paywall & Feedback Modals
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasPromptedRating, setHasPromptedRating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  // Refs
  const scrollRef = useRef(null);
  const autoScrollRaf = useRef(null);
  const autoScrollTimerRef = useRef(null);
  const accumulatedScrollRef = useRef(0);
  const musicRef = useRef(null);
  const inactivityTimer = useRef(null);

  const totalChapters = BOOK_CONTENT.chapters.length;
  const currentChapter = BOOK_CONTENT.chapters[currentChapterIndex];

  // ── Access check helper ──
  const isChapterLocked = useCallback((idx) => {
    return !hasAccess && !BOOK_CONTENT.chapters[idx].free;
  }, [hasAccess]);

  const showPaywall = isChapterLocked(currentChapterIndex);

  // ── Loading Screen ──
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ── Register reader on Firestore ──
  useEffect(() => {
    if (loading) return;
    const user = auth.currentUser;
    if (!user) return;

    const registerReader = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data().hasReadSoberBook) return;

        await updateDoc(userRef, { hasReadSoberBook: true });

        const bookRef = doc(db, 'books', 'sober-trading');
        await setDoc(bookRef, { readersCount: increment(1) }, { merge: true });
      } catch (err) {
        console.warn('Could not register reader:', err);
      }
    };

    registerReader();
  }, [loading]);

  // ── Fetch secure PDF download URL from Firebase Storage when user has access ──
  useEffect(() => {
    if (hasAccess) {
      const fetchPdfUrl = async () => {
        try {
          const bookRef = ref(storage, 'books/sober-trading/sober_book.pdf');
          const url = await getDownloadURL(bookRef);
          setPdfUrl(url);
        } catch (err) {
          console.warn('Could not fetch PDF download URL:', err);
        }
      };
      fetchPdfUrl();
    }
  }, [hasAccess]);

  // ── Load Google Fonts dynamically ──
  useEffect(() => {
    const font = FONTS.find(f => f.id === selectedFont);
    if (!font) return;
    const id = `gfont-${font.id}`;
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
      document.head.appendChild(link);
    }
  }, [selectedFont]);

  // ── Load Saved State ──
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (saved.currentChapterIndex !== undefined) {
        const index = hasAccess ? saved.currentChapterIndex : (BOOK_CONTENT.chapters[saved.currentChapterIndex]?.free ? saved.currentChapterIndex : 0);
        setCurrentChapterIndex(index);
        setWelcomeBack(index + 1);
        setTimeout(() => setWelcomeBack(null), 5000);
      }
      if (saved.bookmarks) setBookmarks(saved.bookmarks);
      if (saved.fontSize) setFontSize(saved.fontSize);
      if (saved.lineHeight) setLineHeight(saved.lineHeight);
      if (saved.selectedFont) setSelectedFont(saved.selectedFont);
      if (saved.backgroundType) setBackgroundType(saved.backgroundType);
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
      currentChapterIndex,
      bookmarks,
      fontSize,
      lineHeight,
      selectedFont,
      backgroundType,
      totalSessions,
      readingStreak,
      achievements: unlockedAchievements,
      hasPromptedRating,
      lastRead: Date.now()
    });
  }, [currentChapterIndex, bookmarks, fontSize, lineHeight, selectedFont, backgroundType, totalSessions, readingStreak, unlockedAchievements, hasPromptedRating, loading]);

  // ── Auto-scroll interaction pauses ──
  const handleUserInteraction = useCallback(() => {
    if (!autoScroll) return;
    setIsAutoScrollPaused(true);
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
    }
    autoScrollTimerRef.current = setTimeout(() => {
      setIsAutoScrollPaused(false);
    }, 2000); // Resume auto-scroll after 2 seconds of inactivity
  }, [autoScroll]);

  // ── Auto-scroll loop ──
  useEffect(() => {
    // Reset accumulator on speed or status change
    accumulatedScrollRef.current = 0;

    if (!autoScroll || isAutoScrollPaused || isHovered || showPaywall) {
      if (autoScrollRaf.current) {
        cancelAnimationFrame(autoScrollRaf.current);
        autoScrollRaf.current = null;
      }
      return;
    }

    const container = scrollRef.current;
    if (!container) return;

    const speedConfig = SCROLL_SPEEDS[scrollSpeed] || SCROLL_SPEEDS.medium;
    const pixelsPerFrame = speedConfig.px;

    const scrollStep = () => {
      if (!scrollRef.current) return;
      const maxScroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      
      if (scrollRef.current.scrollTop >= maxScroll - 1) {
        setAutoScroll(false);
        return;
      }

      accumulatedScrollRef.current += pixelsPerFrame;
      const wholePixels = Math.floor(accumulatedScrollRef.current);
      if (wholePixels > 0) {
        scrollRef.current.scrollTop += wholePixels;
        accumulatedScrollRef.current -= wholePixels;
      }
      autoScrollRaf.current = requestAnimationFrame(scrollStep);
    };

    autoScrollRaf.current = requestAnimationFrame(scrollStep);

    return () => {
      if (autoScrollRaf.current) {
        cancelAnimationFrame(autoScrollRaf.current);
        autoScrollRaf.current = null;
      }
    };
  }, [autoScroll, scrollSpeed, isAutoScrollPaused, isHovered, showPaywall, currentChapterIndex]);

  // ── Detect bottom scroll for Chapter 1 review prompt ──
  const handleScroll = useCallback(() => {
    if (loading || currentChapterIndex !== 0 || hasPromptedRating) return;
    const container = scrollRef.current;
    if (!container) return;

    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 60;
    if (isAtBottom) {
      setTimeout(() => {
        setIsExiting(false);
        setShowRatingModal(true);
        setHasPromptedRating(true);
      }, 800);
    }
  }, [currentChapterIndex, hasPromptedRating, loading]);

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
  }, [totalSessions, loading]);

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

  // ── Background Audio controls ──
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

  // ── Speech synthesis (Arabic Read Out Loud) ──
  const getChapterText = useCallback(() => {
    if (!currentChapter) return '';
    return currentChapter.sections.map(sec => {
      const sectionText = sec.title;
      const blocksText = sec.blocks.map(b => b.text).join('\n\n');
      return `${sectionText}\n\n${blocksText}`;
    }).join('\n\n');
  }, [currentChapter]);

  const toggleNarration = useCallback(() => {
    if (narrating) {
      window.speechSynthesis.cancel();
      setNarrating(false);
      if (musicRef.current) musicRef.current.volume = musicVolume;
      return;
    }
    const text = getChapterText();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
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
  }, [narrating, getChapterText, narrationSpeed, musicVolume, musicPlaying]);

  // ── Chapter Navigation ──
  const goToChapter = useCallback((index) => {
    if (index < 0 || index >= totalChapters) return;
    
    if (isChapterLocked(index)) {
      setPaymentOpen(true);
      return;
    }
    
    setCurrentChapterIndex(index);
    setAutoScroll(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [totalChapters, isChapterLocked]);

  const nextChapter = useCallback(() => {
    goToChapter(currentChapterIndex + 1);
  }, [currentChapterIndex, goToChapter]);

  const prevChapter = useCallback(() => {
    goToChapter(currentChapterIndex - 1);
  }, [currentChapterIndex, goToChapter]);

  // ── Exit rating logic ──
  const handleExit = useCallback(() => {
    if (!hasPromptedRating && currentChapterIndex > 0) {
      setIsExiting(true);
      setShowRatingModal(true);
      setHasPromptedRating(true);
    } else {
      navigate('/books');
    }
  }, [hasPromptedRating, currentChapterIndex, navigate]);

  // ── Rating Submission ──
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

  // ── Bookmark toggle ──
  const isBookmarked = useMemo(() => bookmarks.some(b => b.chapterIndex === currentChapterIndex), [bookmarks, currentChapterIndex]);

  const toggleBookmark = useCallback(() => {
    setBookmarks(prev => {
      if (prev.some(b => b.chapterIndex === currentChapterIndex))
        return prev.filter(b => b.chapterIndex !== currentChapterIndex);
      return [...prev, { chapterIndex: currentChapterIndex, note: '', timestamp: Date.now() }];
    });
  }, [currentChapterIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') prevChapter();
      if (e.key === 'ArrowLeft') nextChapter();
      if (e.key === 'Escape') {
        setImmersiveMode(false);
        setShowChapters(false);
        setShowBookmarks(false);
        setShowMusic(false);
        setShowSettings(false);
        setShowAnalytics(false);
        if (showRatingModal) { setShowRatingModal(false); if (isExiting) navigate('/books'); }
      }
      if (e.key === 'f' || e.key === 'F') setImmersiveMode(p => !p);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextChapter, prevChapter, showRatingModal, isExiting, navigate]);

  const closeAllPanels = useCallback(() => {
    setShowChapters(false);
    setShowBookmarks(false);
    setShowMusic(false);
    setShowSettings(false);
    setShowAnalytics(false);
  }, []);

  const anyPanelOpen = showChapters || showBookmarks || showMusic || showSettings || showAnalytics;

  // ── Computed stats ──
  const progressPercent = ((currentChapterIndex + 1) / totalChapters) * 100;
  const readingTime = Math.round((Date.now() - sessionStart) / 60000);
  const estimatedRemaining = Math.round((totalChapters - currentChapterIndex - 1) * 15);

  // Loading Screen rendering
  if (loading) {
    return (
      <div className="ibr-loading">
        {PARTICLES.slice(0, 15).map((p) => (
          <div
            key={p.id}
            className="ibr-particle"
            style={{
              left: p.left,
              top: `${Math.random() * 100}%`,
              '--drift': p.drift,
              animationDuration: p.duration,
              animationDelay: p.delay
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

  return (
    <div className={`ibr-container bg-${backgroundType} ${immersiveMode ? 'ibr-immersive-mode' : ''}`}>
      {/* ── Background: Animated Video ── */}
      {backgroundType === 'animated' && (
        <div className="ibr-video-bg">
          <video autoPlay muted loop playsInline src={VIDEO_BG} preload="auto" />
        </div>
      )}

      {/* ── Background: Static Gradient ── */}
      {backgroundType === 'static' && (
        <div className="ibr-static-bg" />
      )}

      {/* ── Floating background particles ── */}
      <div className="ibr-particles">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className={`ibr-particle ${p.isDust ? 'ibr-particle-dust' : ''}`}
            style={{
              left: p.left,
              '--drift': p.drift,
              animationDuration: p.duration,
              animationDelay: p.delay
            }}
          />
        ))}
      </div>

      {/* ── Top Navigation Bar ── */}
      <div className={`ibr-topbar ${(!uiVisible || immersiveMode) && !anyPanelOpen ? 'hidden' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="ibr-btn-icon" onClick={handleExit} title="العودة">
            <ArrowLeft />
          </button>
          <div className="ibr-topbar-title">
            {BOOK_CONTENT.title}
            <span>الفصل {currentChapter.num}: {currentChapter.title}</span>
          </div>
        </div>

        <div className="ibr-topbar-actions">
          {/* Narrate Voice */}
          <button className={`ibr-btn-icon ${narrating ? 'active' : ''}`} onClick={toggleNarration} title="السرد الصوتي">
            {narrating ? <MicOff /> : <Mic />}
          </button>

          {/* Add Bookmark */}
          <button className={`ibr-btn-icon ${isBookmarked ? 'active' : ''}`} onClick={toggleBookmark} title="إشارة مرجعية">
            {isBookmarked ? <BookmarkCheck /> : <Bookmark />}
          </button>

          {/* Chapters Panel Toggle */}
          <button className={`ibr-btn-icon ${showChapters ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowChapters(!showChapters); }} title="الفصول">
            <List />
          </button>

          {/* Bookmarks Panel Toggle */}
          <button className={`ibr-btn-icon ${showBookmarks ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowBookmarks(!showBookmarks); }} title="الإشارات المرجعية">
            <Layers />
          </button>

          {/* Music Ambient Panel Toggle */}
          <button className={`ibr-btn-icon ${showMusic ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowMusic(!showMusic); }} title="أجواء الموسيقى">
            <Music />
          </button>

          {/* Reading Analytics Panel Toggle */}
          <button className={`ibr-btn-icon ${showAnalytics ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowAnalytics(!showAnalytics); }} title="تحليلات القراءة">
            <BarChart3 />
          </button>

          {/* PDF Download Button - STRICTLY FOR PAID MEMBERS */}
          {hasAccess && (
            <a
              href={pdfUrl || '#'}
              download="Sober_Trading.pdf"
              className="ibr-btn-icon"
              title="تحميل PDF"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Download />
            </a>
          )}

          {/* Reader Settings Toggle */}
          <button className={`ibr-btn-icon ${showSettings ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowSettings(!showSettings); }} title="الإعدادات">
            <Settings />
          </button>

          {/* Fullscreen/Immersive Mode Toggle */}
          <button className={`ibr-btn-icon ${immersiveMode ? 'active' : ''}`} onClick={() => setImmersiveMode(!immersiveMode)} title="وضع الغمر">
            {immersiveMode ? <Minimize /> : <Maximize />}
          </button>
        </div>
      </div>

      {/* ── Narration Audio speed controls overlay ── */}
      <AnimatePresence>
        {narrating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="ibr-narration-bar-wrapper"
          >
            <div className="ibr-narration-bar">
              <button onClick={() => setNarrationSpeed(s => Math.max(0.5, s - 0.25))}><ChevronLeft style={{ width: 14, height: 14 }} /></button>
              <span className="speed">{narrationSpeed}x</span>
              <button onClick={() => setNarrationSpeed(s => Math.min(2, s + 0.25))}><ChevronRight style={{ width: 14, height: 14 }} /></button>
              <button onClick={toggleNarration}><Pause style={{ width: 14, height: 14 }} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Vertical Reading Frame / Book Panel ── */}
      <div className="ibr-book-wrapper vertical-layout">
        {showPaywall ? (
          /* ══ LOCKED PAYWALL LAYER ══ */
          <div className="ibr-paywall-fullscreen">
            <div className="ibr-paywall-content">
              <div className="ibr-paywall-icon">
                <Lock style={{ width: 32, height: 32, color: '#D4AF37' }} />
              </div>
              <div className="ibr-paywall-tag">محتوى مقفل للمشتركين</div>
              <h2 className="ibr-paywall-title">
                الفصل {currentChapter.num}: {currentChapter.title}
              </h2>
              <p className="ibr-paywall-desc">
                اشترك الآن للوصول الكامل إلى جميع فصول كتاب "التداول الرصين" الـ 21 والدروس والتحليلات الحصرية، بالإضافة لزر تحميل الكتاب بصيغة PDF.
              </p>

              <div className="ibr-price-box">
                <span className="price">${PRICE}</span>
                <span className="original-price">${ORIGINAL_PRICE}</span>
                <span className="discount">-{DISCOUNT_PCT}%</span>
              </div>

              <button className="ibr-buy-btn" onClick={() => setPaymentOpen(true)}>
                <ShoppingCart style={{ width: 18, height: 18 }} />
                اشتري الكتاب كاملاً
              </button>

              <div className="ibr-guarantee">
                <Shield style={{ width: 14, height: 14, color: '#D4AF37' }} />
                <span>ضمان استرداد الأموال بالكامل خلال 7 أيام إذا لم تستفد من الكتاب</span>
              </div>
            </div>
          </div>
        ) : (
          /* ══ ACTIVE READING TEXT VIEW ══ */
          <div
            ref={scrollRef}
            className="ibr-scroll-container"
            onScroll={handleScroll}
            onWheel={handleUserInteraction}
            onTouchStart={handleUserInteraction}
            onTouchMove={handleUserInteraction}
            onMouseDown={handleUserInteraction}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              fontFamily: FONTS.find(f => f.id === selectedFont)?.css || 'inherit',
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight
            }}
          >
            <div className="ibr-scroll-inner">
              {/* Chapter Introductory Tag */}
              <div className="ibr-chapter-intro">
                <span className="label">الفصل {currentChapter.num}</span>
                <h1 className="title">{currentChapter.title}</h1>
                <div className="divider" />
              </div>

              {/* Render Sections and Text Blocks */}
              {currentChapter.sections.map((section, sIdx) => {
                // Limit Chapter 1 free preview to first 3 sections (lessons) for unpaid users
                const isSectionLocked = !hasAccess && currentChapterIndex === 0 && sIdx >= 3;
                if (isSectionLocked) return null;

                return (
                  <div key={sIdx} className="ibr-chapter-section">
                    {section.title && section.title !== "الافتتاحية" && (
                      <h2 className="ibr-section-title">{section.title}</h2>
                    )}

                    <div className="ibr-section-blocks">
                      {section.blocks.map((block, bIdx) => {
                        if (block.type === 'header') {
                          return <h3 key={bIdx} className="ibr-block-header">{block.text}</h3>;
                        }
                        if (block.type === 'quote') {
                          return (
                            <blockquote key={bIdx} className="ibr-block-quote">
                              <MessageSquareQuote className="quote-icon" />
                              <p>{block.text}</p>
                            </blockquote>
                          );
                        }
                        if (block.type === 'question') {
                          return (
                            <div key={bIdx} className="ibr-block-question">
                              <span className="q-badge">سؤال للتفكير</span>
                              <p>{block.text}</p>
                            </div>
                          );
                        }
                        // Default paragraph
                        return (
                          <p key={bIdx} className="ibr-block-paragraph">
                            {block.text}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Inline Paywall for Unpaid Users reading Chapter 1 */}
              {!hasAccess && currentChapterIndex === 0 && (
                <div className="ibr-paywall-inline" style={{ marginTop: '3rem', padding: '2.5rem', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '24px', textAlign: 'center' }}>
                  <div className="ibr-paywall-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Lock style={{ width: 24, height: 24, color: '#D4AF37' }} />
                  </div>
                  <h3 style={{ color: 'var(--ibr-cream)', fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.75rem', fontFamily: 'var(--ibr-font-ui)' }}>بقية فصول ودروس الكتاب مقفلة</h3>
                  <p style={{ color: 'var(--ibr-gray)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 1.5rem', fontFamily: 'var(--ibr-font-ui)' }}>
                    لقد أكملت قراءة الدروس الـ 3 المجانية المتاحة للمعاينة. اشترك الآن لفتح جميع دروس الفصل الأول والـ 20 فصلاً المتبقية كاملةً.
                  </p>
                  
                  <div className="ibr-price-box" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--ibr-cream)' }}>${PRICE}</span>
                    <span style={{ fontSize: '1rem', color: 'var(--ibr-gray)', textDecoration: 'line-through' }}>${ORIGINAL_PRICE}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', borderRadius: '8px' }}>-{DISCOUNT_PCT}%</span>
                  </div>

                  <button className="ibr-buy-btn" onClick={() => setPaymentOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #D4AF37, #B8960E)', color: '#0F0F10', border: 'none', borderRadius: '16px', fontWeight: 900, fontSize: '0.875rem', cursor: 'pointer', margin: '0 auto 1rem', fontFamily: 'var(--ibr-font-ui)' }}>
                    <ShoppingCart style={{ width: 16, height: 16 }} />
                    اشترك لفتح الكتاب كاملاً
                  </button>

                  <div className="ibr-guarantee" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--ibr-gray)', fontSize: '0.75rem', fontFamily: 'var(--ibr-font-ui)' }}>
                    <Shield style={{ width: 12, height: 12, color: '#D4AF37' }} />
                    <span>ضمان استرداد 7 أيام بالكامل</span>
                  </div>
                </div>
              )}

              {/* End of Chapter Navigation Links */}
              <div className="ibr-chapter-footer">
                <div className="divider" />
                
                {(hasAccess || currentChapterIndex > 0) && (
                  <div className="navigation-actions">
                    {currentChapterIndex > 0 && (
                      <button className="nav-btn prev" onClick={prevChapter}>
                        <ChevronRight />
                        الفصل السابق
                      </button>
                    )}

                    {currentChapterIndex < totalChapters - 1 ? (
                      <button className="nav-btn next active-next" onClick={nextChapter}>
                        الفصل التالي
                        <ChevronLeft />
                      </button>
                    ) : (
                      <div className="end-badge">لقد أتممت قراءة الكتاب كاملاً! 📚🏆</div>
                    )}
                  </div>
                )}

                {/* Subscriber Extra Section */}
                {hasAccess && (
                  <div className="subscribers-download-card">
                    <Download className="icon" />
                    <h4>تحميل نسخة PDF</h4>
                    <p>بصفتك مشتركاً مسجلاً، يمكنك تنزيل النسخة الرقمية الكاملة لقراءتها في أي وقت.</p>
                    <a href={pdfUrl || '#'} download="Sober_Trading.pdf" className="download-action-btn">
                      تنزيل الآن
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Controls Toolbar ── */}
      <div className={`ibr-bottombar ${(!uiVisible || immersiveMode) && !anyPanelOpen ? 'hidden' : ''}`}>
        {/* Left Actions: Sound Effects and Ambient Audio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {musicPlaying && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ibr-active-music-chip"
            >
              <Music style={{ width: 12, height: 12, color: 'var(--ibr-gold)' }} />
              <span className="title">
                {AUDIO.music.find(m => m.id === currentMood)?.nameAr || ''}
              </span>
              <button onClick={stopMusic} className="close-btn">
                <X style={{ width: 10, height: 10 }} />
              </button>
            </motion.div>
          )}

          <button className="ibr-btn-icon" onClick={() => setSoundEnabled(!soundEnabled)} title={soundEnabled ? 'كتم المؤثرات' : 'تفعيل المؤثرات'}>
            {soundEnabled ? <Volume2 /> : <VolumeX />}
          </button>
        </div>

        {/* Center Progress Stats */}
        <div className="ibr-progress">
          <div className="ibr-progress-bar">
            <div className="ibr-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="ibr-progress-label">
            <span>الفصل {currentChapterIndex + 1} من {totalChapters}</span>
            <span>{Math.round(progressPercent)}% من الكتاب</span>
          </div>
        </div>

        {/* Right Actions: Auto-scroll Controller & Reading timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Smart Auto-scroll Controls */}
          {!showPaywall && (
            <div className="ibr-autoscroll-control-group">
              <button
                className={`ibr-autoscroll-toggle-btn ${autoScroll ? 'active' : ''}`}
                onClick={() => setAutoScroll(!autoScroll)}
                title={autoScroll ? 'إيقاف التمرير التلقائي' : 'تشغيل التمرير التلقائي'}
              >
                {autoScroll ? <Pause style={{ width: 12, height: 12 }} /> : <Play style={{ width: 12, height: 12 }} />}
                <span>تمرير تلقائي</span>
              </button>

              {autoScroll && (
                <div className="ibr-autoscroll-speeds">
                  {Object.entries(SCROLL_SPEEDS).map(([speedKey, speedVal]) => (
                    <button
                      key={speedKey}
                      className={`speed-selector-btn ${scrollSpeed === speedKey ? 'selected' : ''}`}
                      onClick={() => setScrollSpeed(speedKey)}
                      title={speedVal.label}
                    >
                      {speedVal.icon}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Time Analytics */}
          <div className="ibr-reading-time-indicator">
            <span>{readingTime} دقيقة قراءة</span>
            <Clock style={{ width: 12, height: 12, color: 'var(--ibr-gray)' }} />
          </div>
        </div>
      </div>

      {/* ── Overlay for Side Panels ── */}
      {anyPanelOpen && <div className="ibr-overlay" onClick={closeAllPanels} />}

      {/* ═══════ CHAPTERS PANEL ═══════ */}
      <div className={`ibr-panel ibr-panel-right ${showChapters ? 'open' : ''}`}>
        <div className="ibr-panel-header">
          <h3>الفصول الـ 21 للكتاب</h3>
          <button className="ibr-btn-icon" onClick={() => setShowChapters(false)}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          {BOOK_CONTENT.chapters.map((ch, idx) => {
            const isLocked = isChapterLocked(idx);
            const active = idx === currentChapterIndex;
            return (
              <div
                key={idx}
                className={`ibr-chapter-item ${active ? 'active' : ''} ${isLocked ? 'locked-item' : ''}`}
                onClick={() => {
                  if (!isLocked) {
                    goToChapter(idx);
                    setShowChapters(false);
                  } else {
                    setShowChapters(false);
                    setPaymentOpen(true);
                  }
                }}
              >
                <div className={`ibr-chapter-num ${!isLocked ? 'free' : 'locked'}`}>
                  {!isLocked ? ch.num : <Lock style={{ width: 10, height: 10 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: !isLocked ? 'var(--ibr-cream)' : 'var(--ibr-gray)', fontSize: 12, fontWeight: 700 }}>
                    {ch.title}
                  </div>
                  {ch.free && (
                    <div style={{ color: 'var(--ibr-gold)', fontSize: 9, fontWeight: 600, marginTop: 2 }}>معاينة مجانية</div>
                  )}
                  {isLocked && (
                    <div style={{ color: '#D4AF37', fontSize: 9, marginTop: 2 }}>يتطلب اشتراك</div>
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
          <button className="ibr-btn-icon" onClick={() => setShowBookmarks(false)}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          {bookmarks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.4 }}>
              <Bookmark style={{ width: 32, height: 32, color: 'var(--ibr-gold)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--ibr-cream)', fontSize: 12 }}>لا توجد إشارات مرجعية بعد</p>
              <p style={{ color: 'var(--ibr-gray)', fontSize: 10, marginTop: 4 }}>اضغط على أيقونة الإشارة لإضافة إشارة للفصل الحالي</p>
            </div>
          ) : (
            bookmarks.map((bm, idx) => (
              <div
                key={idx}
                className="ibr-bookmark-item"
                onClick={() => {
                  goToChapter(bm.chapterIndex);
                  setShowBookmarks(false);
                }}
              >
                <div className="page-num">
                  <BookmarkCheck style={{ width: 14, height: 14, display: 'inline', marginLeft: 4 }} />
                  الفصل {bm.chapterIndex + 1}: {BOOK_CONTENT.chapters[bm.chapterIndex]?.title}
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
          <button className="ibr-btn-icon" onClick={() => setShowMusic(false)}>
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
          <button className="ibr-btn-icon" onClick={() => setShowSettings(false)}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          {/* Font Selection Dropdown */}
          <div className="ibr-setting-group">
            <label><Type style={{ width: 14, height: 14, display: 'inline', marginLeft: 6 }} />نوع الخط العربي</label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="ibr-font-select-input"
            >
              {FONTS.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="ibr-setting-group">
            <label>حجم الخط: {fontSize}px</label>
            <input type="range" className="ibr-slider" min="16" max="30" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} />
          </div>

          <div className="ibr-setting-group">
            <label><AlignJustify style={{ width: 14, height: 14, display: 'inline', marginLeft: 6 }} />المسافة بين السطور: {lineHeight}</label>
            <input type="range" className="ibr-slider" min="1.6" max="3.0" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(parseFloat(e.target.value))} />
          </div>

          {/* Background Style Toggle */}
          <div className="ibr-setting-group">
            <label>خلفية القارئ</label>
            <div className="ibr-font-switch">
              <button
                className={backgroundType === 'animated' ? 'active' : ''}
                onClick={() => setBackgroundType('animated')}
              >
                متحركة
              </button>
              <button
                className={backgroundType === 'static' ? 'active' : ''}
                onClick={() => setBackgroundType('static')}
              >
                ساكنة
              </button>
            </div>
          </div>

          <div className="ibr-setting-group">
            <label>المؤثرات الصوتية (الموسيقى)</label>
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
          <button className="ibr-btn-icon" onClick={() => setShowAnalytics(false)}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          <div className="ibr-stat-card">
            <div className="ibr-stat-icon"><BarChart3 /></div>
            <div className="ibr-stat-info"><h4>{Math.round(progressPercent)}%</h4><p>نسبة إتمام الكتاب</p></div>
          </div>
          <div className="ibr-stat-card">
            <div className="ibr-stat-icon"><Clock /></div>
            <div className="ibr-stat-info"><h4>{readingTime} دقيقة</h4><p>مدة الجلسة الحالية</p></div>
          </div>
          <div className="ibr-stat-card">
            <div className="ibr-stat-icon"><Target /></div>
            <div className="ibr-stat-info"><h4>~{estimatedRemaining} دقيقة</h4><p>الوقت التقريبي المتبقي</p></div>
          </div>
          <div className="ibr-stat-card">
            <div className="ibr-stat-icon"><Flame /></div>
            <div className="ibr-stat-info"><h4>{totalSessions}</h4><p>إجمالي جلسات القراءة</p></div>
          </div>
          <div className="ibr-stat-card">
            <div className="ibr-stat-icon"><Eye /></div>
            <div className="ibr-stat-info"><h4>الفصل {currentChapterIndex + 1} / {totalChapters}</h4><p>الفصل النشط</p></div>
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
            <div className="ibr-toast-text">مرحباً بعودتك، توقفت عند الفصل <span>{welcomeBack}</span></div>
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
            className="ibr-rating-modal-fullscreen"
          >
            <div
              className="ibr-rating-modal-backdrop"
              onClick={() => { if (!submittingReview) handleRatingSubmit(true); }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="ibr-rating-modal-content-card"
              dir="rtl"
            >
              <div className="top-ambient" />
              <div className="top-border-accent" />

              <div style={{ padding: '2rem', position: 'relative' }}>
                <button
                  className="close-btn"
                  onClick={() => { if (!submittingReview) handleRatingSubmit(true); }}
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div className="icon-wrapper">
                    <MessageSquareQuote style={{ width: 28, height: 28, color: '#D4AF37' }} />
                  </div>
                  <h2 className="title">
                    {isExiting ? 'قبل المغادرة...' : 'كيف كانت تجربتك؟'}
                  </h2>
                  <p className="desc">
                    {isExiting
                      ? 'شارك رأيك في كتاب "التداول الرصين" قبل المغادرة'
                      : 'أكملت الفصل الأول بنجاح! أخبرنا برأيك في هذا الفصل'}
                  </p>
                </div>

                {/* Star rating buttons */}
                <div className="stars-wrapper">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setRatingHover(star)}
                      onMouseLeave={() => setRatingHover(0)}
                      className="star-btn"
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

                {rating > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rating-badge-text"
                  >
                    {['', 'ضعيف', 'مقبول', 'جيد', 'ممتاز', 'رائع جداً! 🌟'][rating]}
                  </motion.div>
                )}

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="اكتب تعليقك أو رأيك حول الكتاب (اختياري)..."
                  rows={3}
                  className="review-textarea"
                />

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleRatingSubmit(true)}
                    disabled={submittingReview}
                    className="skip-btn"
                  >
                    {isExiting ? 'تخطي والخروج' : 'تخطي'}
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRatingSubmit(false)}
                    disabled={submittingReview || rating === 0}
                    className="submit-btn"
                    style={{
                      background: rating > 0
                        ? 'linear-gradient(135deg, #D4AF37, #B8960E)'
                        : 'rgba(212,175,55,0.15)',
                      color: rating > 0 ? '#0F0F10' : 'rgba(212,175,55,0.4)',
                      cursor: rating > 0 ? 'pointer' : 'not-allowed'
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
