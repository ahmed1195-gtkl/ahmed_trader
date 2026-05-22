import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, X, Bookmark, BookmarkCheck,
  Settings, Volume2, VolumeX, Music, Maximize, Minimize,
  Play, Pause, SkipForward, SkipBack, BarChart3, Clock, Target,
  Flame, Eye, MessageSquareQuote, Download, ArrowLeft,
  List, Layers, Zap, Heart, Star, Lock, ShoppingCart, Shield, Sparkles,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import * as THREE from 'three';
import * as pdfjs from 'pdfjs-dist';
import './ImmersiveBookReader.css';
import { useBookAccess } from '../hooks/useBookAccess';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';
import PaymentModal from './PaymentModal';

// Setup pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.7.284/pdf.worker.min.mjs';

// ══════════════════════════════════════════════════════════════
// CONSTANTS & CONFIGURATION
// ══════════════════════════════════════════════════════════════
const PDF_URL = '/sober_trading_full.pdf';
const FREE_PAGES_MAX = 7; // Pages 0-7 are free (first 8 pages of PDF)
const CHAPTER1_LAST_PAGE = 11;

const PRICE = 11.99;
const ORIGINAL_PRICE = 23.98;
const DISCOUNT_PCT = Math.round(((ORIGINAL_PRICE - PRICE) / ORIGINAL_PRICE) * 100);

const AUDIO = {
  pageFlip: 'https://Shukritrade.b-cdn.net/Page%20Turn%20Sound%20Effect(MP3_160K).mp3',
  music: [
    {
      id: 'royal-calm',
      name: 'Royal Calm',
      nameAr: 'هدوء ملكي',
      descAr: 'أجواء دراسية دافئة',
      url: 'https://Shukritrade.b-cdn.net/playlist%20for%20studying%20_%20music%20for%20study%20_%20music%20for%20reading_%20writing%20and%20studying%20%EF%BF%BC%E2%9C%A8(MP3_160K).mp3',
      color: '#D4AF37'
    },
    {
      id: 'deep-void',
      name: 'Deep Void',
      nameAr: 'عمق مظلم',
      descAr: 'تركيز عميق أكاديمي',
      url: 'https://Shukritrade.b-cdn.net/study%20playlist%20dark%20academia%20%F0%9F%95%B0%EF%B8%8F%20_%20timeless%20ambience%20for%20deep%20focus%20%F0%9F%93%9A%E2%9C%A8_%20Gibran%20Alcocer(MP3_160K).mp3',
      color: '#6366F1'
    }
  ]
};

const ACHIEVEMENTS = {
  'deep-focus': { icon: Target, name: 'ختم التركيز العميق', condition: 'قراءة لمدة 10 دقائق متواصلة' },
  'chapter-complete': { icon: BookOpen, name: 'ختم إتمام المعاينة', condition: 'قراءة كامل صفحات الفصل الأول' },
  'consistency': { icon: Flame, name: 'ختم المداومة', condition: '3 أيام متتالية من القراءة' },
  'night-reader': { icon: Zap, name: 'القارئ الليلي', condition: 'القراءة بعد الساعة 10 مساءً' }
};

const LS_KEY = 'ibr-sober-trading-3d';

// ══════════════════════════════════════════════════════════════
// COMPONENT IMPLEMENTATION
// ══════════════════════════════════════════════════════════════
const ImmersiveBookReader = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';
  const { hasAccess, userId } = useBookAccess();

  // Loading & State
  const [loading, setLoading] = useState(true);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [liteMode, setLiteMode] = useState(false);
  const [zoomFactor, setZoomFactor] = useState(1.0);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  // Chapters & Panels
  const [showChapters, setShowChapters] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Interaction Modals
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasPromptedRating, setHasPromptedRating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Audio state
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // User Stats & Bookmarks
  const [bookmarks, setBookmarks] = useState([]);
  const [readingStreak, setReadingStreak] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [sessionStart] = useState(Date.now());
  const [totalSessions, setTotalSessions] = useState(1);
  const [showAchievement, setShowAchievement] = useState(null);

  // Responsive device state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Refs
  const mountRef = useRef(null);
  const musicRef = useRef(null);
  const pageTurnRef = useRef(null);
  const inactivityTimer = useRef(null);
  const textureCache = useRef(new Map());
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const bookGroupRef = useRef(null);

  // Materials & Geometries Refs
  const leftPageMeshRef = useRef(null);
  const rightPageMeshRef = useRef(null);
  const turningGroupRef = useRef(null);
  const turningFrontMeshRef = useRef(null);
  const turningBackMeshRef = useRef(null);

  // PDF Page Size aspect ratio tracker
  const pageSize = useRef({ width: 3.5, height: 5.0 });

  // Access checking
  const isPageLocked = useCallback((pageIdx) => {
    return !hasAccess && pageIdx > FREE_PAGES_MAX;
  }, [hasAccess]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (cameraRef.current && rendererRef.current && mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── 1. Init PDF.js ──
  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjs.getDocument(PDF_URL);
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setLoading(false);
      }
    };
    loadPDF();
  }, []);

  // Register Reader count in Firestore
  useEffect(() => {
    if (loading || !userId) return;
    const registerReader = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data().hasReadSoberBook) return;

        await updateDoc(userRef, { hasReadSoberBook: true });
        const bookRef = doc(db, 'books', 'sober-trading');
        await setDoc(bookRef, { readersCount: increment(1) }, { merge: true });
      } catch (err) {
        console.warn('Firestore count increment failed:', err);
      }
    };
    registerReader();
  }, [loading, userId]);

  // Load Saved LocalState
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.currentPage > 0) {
          const page = hasAccess ? saved.currentPage : Math.min(saved.currentPage, FREE_PAGES_MAX);
          setCurrentPage(page);
        }
        if (saved.bookmarks) setBookmarks(saved.bookmarks);
        if (saved.totalSessions) setTotalSessions(saved.totalSessions + 1);
        if (saved.achievements) setUnlockedAchievements(saved.achievements);
        if (saved.hasPromptedRating) setHasPromptedRating(saved.hasPromptedRating);
      }
    } catch (e) {
      console.warn('LocalState load failed:', e);
    }
  }, [hasAccess]);

  // Save LocalState on Change
  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        currentPage,
        bookmarks,
        totalSessions,
        achievements: unlockedAchievements,
        hasPromptedRating,
        lastRead: Date.now()
      }));
    } catch (e) {
      console.warn('LocalState save failed:', e);
    }
  }, [currentPage, bookmarks, totalSessions, unlockedAchievements, hasPromptedRating, loading]);

  // Trigger rating on Preview completion (page index 11)
  useEffect(() => {
    if (loading) return;
    if (currentPage === CHAPTER1_LAST_PAGE && !hasPromptedRating) {
      setTimeout(() => {
        setIsExiting(false);
        setShowRatingModal(true);
        setHasPromptedRating(true);
      }, 1000);
    }
  }, [currentPage, hasPromptedRating, loading]);

  // Inactivity overlay timeout
  useEffect(() => {
    const resetTimer = () => {
      setUiVisible(true);
      clearTimeout(inactivityTimer.current);
      if (immersiveMode) {
        inactivityTimer.current = setTimeout(() => setUiVisible(false), 3000);
      }
    };
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      clearTimeout(inactivityTimer.current);
    };
  }, [immersiveMode]);

  // ── 2. Texture Lazy Loader & Cache ──
  const getPageTexture = useCallback(async (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return null;
    if (textureCache.current.has(pageNum)) {
      return textureCache.current.get(pageNum);
    }

    try {
      const page = await pdfDoc.getPage(pageNum);
      const renderScale = liteMode ? 1.2 : 2.2;
      const viewport = page.getViewport({ scale: renderScale });
      
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      // Clear with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport }).promise;

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Keep cache size bounded
      if (textureCache.current.size >= 12) {
        const oldestKey = textureCache.current.keys().next().value;
        const oldTex = textureCache.current.get(oldestKey);
        if (oldTex) oldTex.dispose();
        textureCache.current.delete(oldestKey);
      }

      textureCache.current.set(pageNum, texture);
      return texture;
    } catch (err) {
      console.error(`Error rendering texture page ${pageNum}:`, err);
      return null;
    }
  }, [pdfDoc, totalPages, liteMode]);

  // Sound Engine
  const playPageTurnSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!pageTurnRef.current) {
        pageTurnRef.current = new Audio(AUDIO.pageFlip);
        pageTurnRef.current.volume = 0.5;
      }
      pageTurnRef.current.currentTime = 0;
      pageTurnRef.current.play().catch(() => {});
    } catch {}
  }, [soundEnabled]);

  // Background Moods
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
        vol += 0.02;
        if (vol >= musicVolume) { audio.volume = musicVolume; clearInterval(fadeIn); }
        else { audio.volume = vol; }
      }, 40);
    }).catch(() => {});
  }, [musicVolume]);

  const stopMusic = useCallback(() => {
    if (musicRef.current) {
      const audio = musicRef.current;
      let vol = audio.volume;
      const fadeOut = setInterval(() => {
        vol -= 0.02;
        if (vol <= 0) { audio.pause(); audio.currentTime = 0; clearInterval(fadeOut); musicRef.current = null; }
        else { audio.volume = vol; }
      }, 40);
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

  // ── 3. Three.js Engine Lifecycle ──
  const [transition, setTransition] = useState({
    active: false,
    progress: 0,
    direction: 'forward',
    onComplete: null
  });

  const updatePageDeformation = (geometry, progress, direction) => {
    const pos = geometry.attributes.position;
    const W = pageSize.current.width;
    const maxBend = 0.45;

    for (let i = 0; i < pos.count; i++) {
      const xLocal = pos.getX(i);
      const xAbs = xLocal + W / 2; // offset to range 0 to W
      
      const bendFactor = Math.sin(progress * Math.PI);
      const xFactor = Math.sin((xAbs / W) * Math.PI);
      const z = bendFactor * xFactor * maxBend;
      
      pos.setZ(i, direction === 'forward' ? z : -z);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  };

  // Setup the entire WebGL scene
  useEffect(() => {
    if (!mountRef.current || loading) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: !liteMode, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !liteMode;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);
    cameraRef.current = camera;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.55);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xFFF6E6, 1.25);
    dirLight.position.set(2, 4, 6);
    dirLight.castShadow = !liteMode;
    if (!liteMode) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.001;
    }
    scene.add(dirLight);

    // Book Group
    const bookGroup = new THREE.Group();
    scene.add(bookGroup);
    bookGroupRef.current = bookGroup;

    // Geometries
    const W = pageSize.current.width;
    const H = pageSize.current.height;
    const pageGeometry = new THREE.PlaneGeometry(W, H, 32, 1);
    
    // Default Loading Blank Textures
    const createBlankMaterial = () => new THREE.MeshStandardMaterial({
      color: 0xFAFAFA,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    // Left Page Mesh
    const leftPageMat = createBlankMaterial();
    const leftPageMesh = new THREE.Mesh(pageGeometry, leftPageMat);
    leftPageMesh.position.set(-W / 2, 0, 0.01);
    leftPageMesh.receiveShadow = !liteMode;
    bookGroup.add(leftPageMesh);
    leftPageMeshRef.current = leftPageMesh;

    // Right Page Mesh
    const rightPageMat = createBlankMaterial();
    const rightPageMesh = new THREE.Mesh(pageGeometry, rightPageMat);
    rightPageMesh.position.set(W / 2, 0, 0.01);
    rightPageMesh.receiveShadow = !liteMode;
    bookGroup.add(rightPageMesh);
    rightPageMeshRef.current = rightPageMesh;

    // Turning Page Group (Pivot)
    const turningGroup = new THREE.Group();
    turningGroup.position.set(0, 0, 0.02);
    bookGroup.add(turningGroup);
    turningGroupRef.current = turningGroup;

    const turningGeometry = new THREE.PlaneGeometry(W, H, 32, 1);

    // Front Side (facing +Z at start)
    const turningFrontMat = createBlankMaterial();
    turningFrontMat.side = THREE.FrontSide;
    const turningFrontMesh = new THREE.Mesh(turningGeometry, turningFrontMat);
    turningFrontMesh.position.set(W / 2, 0, 0);
    turningFrontMesh.castShadow = !liteMode;
    turningGroup.add(turningFrontMesh);
    turningFrontMeshRef.current = turningFrontMesh;

    // Back Side (facing -Z at start)
    const turningBackMat = createBlankMaterial();
    turningBackMat.side = THREE.BackSide;
    const turningBackMesh = new THREE.Mesh(turningGeometry, turningBackMat);
    turningBackMesh.position.set(W / 2, 0, 0);
    // Rotate to face backwards
    turningBackMesh.rotation.y = Math.PI;
    turningBackMesh.castShadow = !liteMode;
    turningGroup.add(turningBackMesh);
    turningBackMeshRef.current = turningBackMesh;

    // Initially hide turning group
    turningGroup.visible = false;

    // Leather Book Cover Group
    const coverGroup = new THREE.Group();
    coverGroup.position.set(0, 0, -0.05);
    bookGroup.add(coverGroup);

    const coverGeom = new THREE.PlaneGeometry(W + 0.15, H + 0.2, 1, 1);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x1A140E,
      roughness: 0.9,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    const leftCover = new THREE.Mesh(coverGeom, coverMat);
    leftCover.position.set(-(W + 0.15) / 2, 0, 0);
    leftCover.castShadow = !liteMode;
    coverGroup.add(leftCover);

    const rightCover = new THREE.Mesh(coverGeom, coverMat);
    rightCover.position.set((W + 0.15) / 2, 0, 0);
    rightCover.castShadow = !liteMode;
    coverGroup.add(rightCover);

    // Render loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      
      // Update animations
      bookGroup.scale.setScalar(zoomFactor);

      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      pageGeometry.dispose();
      turningGeometry.dispose();
      coverGeom.dispose();
      leftPageMat.dispose();
      rightPageMat.dispose();
      turningFrontMat.dispose();
      turningBackMat.dispose();
      coverMat.dispose();
    };
  }, [loading, liteMode]);

  // Camera Zoom transition
  useEffect(() => {
    if (bookGroupRef.current) {
      bookGroupRef.current.scale.setScalar(zoomFactor);
    }
  }, [zoomFactor]);

  // ── 4. Texture Updaters ──
  const updateTextures = useCallback(async () => {
    if (!pdfDoc || transition.active) return;

    const leftPageNum = currentPage + 1;
    const rightPageNum = currentPage + 2;

    const leftTex = await getPageTexture(leftPageNum);
    const rightTex = await getPageTexture(rightPageNum);

    if (leftPageMeshRef.current) {
      leftPageMeshRef.current.material.map = leftTex;
      leftPageMeshRef.current.material.needsUpdate = true;
    }
    if (rightPageMeshRef.current) {
      rightPageMeshRef.current.material.map = rightTex;
      rightPageMeshRef.current.material.needsUpdate = true;
    }
  }, [pdfDoc, currentPage, getPageTexture, transition.active]);

  useEffect(() => {
    updateTextures();
  }, [currentPage, pdfDoc, updateTextures]);

  // Preloading surrounding pages
  useEffect(() => {
    if (!pdfDoc) return;
    const pagesToPreload = [
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      currentPage + 3,
      currentPage + 4
    ];
    pagesToPreload.forEach(page => {
      if (page >= 0 && page < totalPages) {
        getPageTexture(page + 1); // pages are 1-indexed in PDF
      }
    });
  }, [currentPage, pdfDoc, totalPages, getPageTexture]);

  // ── 5. Page Turn Controller ──
  const startTransition = useCallback(async (dir) => {
    if (transition.active || !pdfDoc) return;

    if (dir === 'forward') {
      if (currentPage + 2 >= totalPages) return;
      if (isPageLocked(currentPage + 2)) {
        setPaymentOpen(true);
        return;
      }

      playPageTurnSound();

      // Textures for page turn forward
      const currentRightTex = await getPageTexture(currentPage + 2); // texture page index currentPage+2
      const nextLeftTex = await getPageTexture(currentPage + 3);

      if (turningFrontMeshRef.current && turningBackMeshRef.current) {
        turningFrontMeshRef.current.material.map = currentRightTex;
        turningBackMeshRef.current.material.map = nextLeftTex;
        turningFrontMeshRef.current.material.needsUpdate = true;
        turningBackMeshRef.current.material.needsUpdate = true;
      }

      // Left static remains current
      // Right static shows what's underneath turning page (currentPage + 4)
      const nextRightTex = await getPageTexture(currentPage + 4);
      if (rightPageMeshRef.current) {
        rightPageMeshRef.current.material.map = nextRightTex;
        rightPageMeshRef.current.material.needsUpdate = true;
      }

      if (turningGroupRef.current) {
        turningGroupRef.current.visible = true;
        turningGroupRef.current.rotation.y = 0;
      }

      setTransition({
        active: true,
        progress: 0,
        direction: 'forward',
        onComplete: () => {
          if (turningGroupRef.current) {
            turningGroupRef.current.visible = false;
            turningGroupRef.current.rotation.y = 0;
          }
          setCurrentPage(prev => prev + 2);
          setTransition(t => ({ ...t, active: false }));
        }
      });

    } else { // backward
      if (currentPage - 2 < 0) return;
      if (isPageLocked(currentPage - 2)) {
        setPaymentOpen(true);
        return;
      }

      playPageTurnSound();

      // Textures for page turn backward
      const prevRightTex = await getPageTexture(currentPage);
      const prevLeftTex = await getPageTexture(currentPage - 1);

      if (turningFrontMeshRef.current && turningBackMeshRef.current) {
        turningFrontMeshRef.current.material.map = prevRightTex;
        turningBackMeshRef.current.material.map = prevLeftTex;
        turningFrontMeshRef.current.material.needsUpdate = true;
        turningBackMeshRef.current.material.needsUpdate = true;
      }

      // Right static remains current
      // Left static shows what's underneath turning page (currentPage - 2)
      const prevLeftStaticTex = await getPageTexture(currentPage - 2);
      if (leftPageMeshRef.current) {
        leftPageMeshRef.current.material.map = prevLeftStaticTex;
        leftPageMeshRef.current.material.needsUpdate = true;
      }

      if (turningGroupRef.current) {
        turningGroupRef.current.visible = true;
        turningGroupRef.current.rotation.y = -Math.PI;
      }

      setTransition({
        active: true,
        progress: 0,
        direction: 'backward',
        onComplete: () => {
          if (turningGroupRef.current) {
            turningGroupRef.current.visible = false;
            turningGroupRef.current.rotation.y = 0;
          }
          setCurrentPage(prev => prev - 2);
          setTransition(t => ({ ...t, active: false }));
        }
      });
    }
  }, [currentPage, totalPages, pdfDoc, transition.active, getPageTexture, playPageTurnSound, isPageLocked]);

  // RequestAnimation Frame for transition loops
  useEffect(() => {
    if (!transition.active) return;
    let animId;
    let start = performance.now();
    const duration = 650; // ms

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1.0);
      
      // Easing curve
      const ease = 1 - Math.pow(1 - progress, 3); // Cubic Out

      if (turningGroupRef.current && turningFrontMeshRef.current) {
        if (transition.direction === 'forward') {
          turningGroupRef.current.rotation.y = -ease * Math.PI;
          updatePageDeformation(turningFrontMeshRef.current.geometry, ease, 'forward');
          updatePageDeformation(turningBackMeshRef.current.geometry, ease, 'forward');
        } else {
          turningGroupRef.current.rotation.y = -Math.PI + ease * Math.PI;
          updatePageDeformation(turningFrontMeshRef.current.geometry, ease, 'backward');
          updatePageDeformation(turningBackMeshRef.current.geometry, ease, 'backward');
        }
      }

      if (progress < 1.0) {
        animId = requestAnimationFrame(step);
      } else {
        transition.onComplete();
      }
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [transition]);

  // ── 6. Controls & Drag & Pinch Gestures ──
  const startDragX = useRef(0);
  const startDragY = useRef(0);
  const dragRatio = useRef(0);
  const isDragging = useRef(false);
  const lastTouchTime = useRef(0);

  // Keyboard Shortcuts (Ctrl + I for Fullscreen)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setImmersiveMode(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setImmersiveMode(false);
    }
  };

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startDragX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startDragY.current = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    dragRatio.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || transition.active) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diffX = clientX - startDragX.current;
    
    // Swiping forward/backward triggers
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) { // Drag left
        startTransition('forward');
        isDragging.current = false;
      } else { // Drag right
        startTransition('backward');
        isDragging.current = false;
      }
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Pinch-to-zoom calculation
  const touchStartDist = useRef(0);
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      touchStartDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1) {
      // Check Triple Tap Fullscreen
      const now = Date.now();
      if (now - lastTouchTime.current < 350) {
        lastTouchTime.current = 0; // reset
        toggleFullscreen();
      } else {
        lastTouchTime.current = now;
      }
      handlePointerDown(e);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartDist.current;
      setZoomFactor(z => Math.min(Math.max(1.0, z * (factor > 1 ? 1.01 : 0.99)), 3.0));
    } else if (e.touches.length === 1) {
      handlePointerMove(e);
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    setZoomFactor(z => Math.min(Math.max(1.0, z - e.deltaY * 0.0015), 3.0));
  };

  // ── 7. Rating Submit ──
  const handleRatingSubmit = useCallback(async (skip = false) => {
    setSubmittingReview(true);
    if (!skip && rating > 0 && userId) {
      try {
        await setDoc(doc(db, 'book_reviews', `${userId}_sober-trading`), {
          rating,
          reviewText: reviewText.trim(),
          userId,
          userName: auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'قارئ',
          userEmail: auth.currentUser?.email || '',
          bookId: 'sober-trading',
          bookTitle: 'التداول الرصين',
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not save review:', err);
      }
    }
    setSubmittingReview(false);
    setShowRatingModal(false);
    if (isExiting) navigate('/books');
  }, [rating, reviewText, isExiting, userId, navigate]);

  const handleExit = useCallback(() => {
    if (!hasPromptedRating && currentPage > 0) {
      setIsExiting(true);
      setShowRatingModal(true);
      setHasPromptedRating(true);
    } else {
      navigate('/books');
    }
  }, [hasPromptedRating, currentPage, navigate]);

  // Bookmarks handlers
  const isBookmarked = useMemo(() => bookmarks.some(b => b.page === currentPage), [bookmarks, currentPage]);
  const toggleBookmark = () => {
    setBookmarks(prev => {
      if (prev.some(b => b.page === currentPage))
        return prev.filter(b => b.page !== currentPage);
      return [...prev, { page: currentPage, timestamp: Date.now() }];
    });
  };

  const closeAllPanels = () => {
    setShowChapters(false);
    setShowBookmarks(false);
    setShowMusic(false);
    setShowSettings(false);
    setShowAnalytics(false);
  };

  const progressPercent = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0;
  const readingTime = Math.round((Date.now() - sessionStart) / 60000);
  const estimatedRemaining = Math.round((totalPages - currentPage) * 0.75);

  const CHAPTERS_LIST = [
    { page: 0, ar: 'الفصل الأول: لماذا يخسر أغلب الناس؟', free: true },
    { page: 12, ar: 'الفصل الثاني: سيكولوجية الخوف والطمع', free: false },
    { page: 24, ar: 'الفصل الثالث: إدارة رأس المال', free: false },
    { page: 36, ar: 'الفصل الرابع: بناء خطة التداول', free: false },
    { page: 48, ar: 'الفصل الخامس: التحليل الفني الأساسي', free: false }
  ];

  // ══════════════════════════════════════════════════════════════
  // RENDER SECTIONS
  // ══════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="ibr-loading">
        <motion.div
          className="ibr-loading-logo"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <BookOpen />
        </motion.div>
        <motion.div className="ibr-loading-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          جاري تهيئة القارئ ثلاثي الأبعاد...
        </motion.div>
        <div className="ibr-loading-bar"><div className="ibr-loading-bar-fill" /></div>
      </div>
    );
  }

  return (
    <div className={`ibr-container ${immersiveMode ? 'ibr-immersive-mode' : ''}`}>
      {/* ── Background Ambient ── */}
      <div style={{ position: 'absolute', inset: 0, background: '#09090b', zIndex: 0 }} />

      {/* ── Three.js WebGL Container ── */}
      <div
        ref={mountRef}
        className="ibr-canvas-container"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handlePointerUp}
        onWheel={handleWheel}
      />

      {/* ── Lite Mode Indicator ── */}
      {liteMode && <div className="ibr-lite-mode-badge">الوضع الخفيف نشط</div>}
      {zoomFactor > 1.0 && <div className="ibr-zoom-badge">تكبير: {zoomFactor.toFixed(1)}x</div>}

      {/* ── Top Bar ── */}
      <div className={`ibr-topbar ${(!uiVisible || immersiveMode) && !showChapters && !showBookmarks && !showMusic && !showSettings && !showAnalytics ? 'hidden' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="ibr-btn-icon" onClick={handleExit} title="العودة">
            <ArrowLeft />
          </button>
          <div className="ibr-topbar-title">
            التداول الرصين 3D
            <span>صفحة {currentPage + 1} من {totalPages}</span>
          </div>
        </div>

        <div className="ibr-topbar-actions">
          {/* Bookmark */}
          <button className={`ibr-btn-icon ${isBookmarked ? 'active' : ''}`} onClick={toggleBookmark} title="إشارة مرجعية">
            {isBookmarked ? <BookmarkCheck /> : <Bookmark />}
          </button>

          {/* Chapters */}
          <button className={`ibr-btn-icon ${showChapters ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowChapters(!showChapters); }} title="الفصول">
            <List />
          </button>

          {/* Bookmarks */}
          <button className={`ibr-btn-icon ${showBookmarks ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowBookmarks(!showBookmarks); }} title="الإشارات">
            <Layers />
          </button>

          {/* Music */}
          <button className={`ibr-btn-icon ${showMusic ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowMusic(!showMusic); }} title="الأجواء الموسيقية">
            <Music />
          </button>

          {/* Stats */}
          <button className={`ibr-btn-icon ${showAnalytics ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowAnalytics(!showAnalytics); }} title="التحليلات">
            <BarChart3 />
          </button>

          {/* Settings */}
          <button className={`ibr-btn-icon ${showSettings ? 'active' : ''}`} onClick={() => { closeAllPanels(); setShowSettings(!showSettings); }} title="الإعدادات">
            <Settings />
          </button>

          {/* Fullscreen */}
          <button className="ibr-btn-icon" onClick={toggleFullscreen} title="ملء الشاشة">
            {immersiveMode ? <Minimize /> : <Maximize />}
          </button>
        </div>
      </div>

      {/* ── Navigation Arrows ── */}
      <button
        className="ibr-nav ibr-nav-prev"
        onClick={() => startTransition('backward')}
        disabled={currentPage <= 0 || transition.active}
        style={{ opacity: (currentPage <= 0) ? 0.2 : undefined }}
      >
        <ChevronRight />
      </button>

      <button
        className="ibr-nav ibr-nav-next"
        onClick={() => startTransition('forward')}
        disabled={currentPage + 2 >= totalPages || transition.active}
        style={{ opacity: (currentPage + 2 >= totalPages) ? 0.2 : undefined }}
      >
        <ChevronLeft />
      </button>

      {/* ── Bottom Bar ── */}
      <div className={`ibr-bottombar ${(!uiVisible || immersiveMode) && !showChapters && !showBookmarks && !showMusic && !showSettings && !showAnalytics ? 'hidden' : ''}`}>
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
              <button onClick={stopMusic} style={{ background: 'none', border: 'none', color: 'var(--ibr-gold)', cursor: 'pointer', display: 'flex' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--ibr-gray)', fontSize: 10 }}>{readingTime} دقيقة</span>
          <Clock style={{ width: 12, height: 12, color: 'var(--ibr-gray)' }} />
        </div>
      </div>

      {/* ── Paywall Overlay Gate ── */}
      {isPageLocked(currentPage) && (
        <div className="ibr-3d-paywall">
          <div className="ibr-3d-paywall-card">
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.2)',
              display: 'flex', alignItems: 'center', justifyCenter: 'center',
              margin: '0 auto 1.5rem', alignContent: 'center', justifyContent: 'center'
            }}>
              <Lock style={{ width: 24, height: 24, color: '#D4AF37' }} />
            </div>

            <h3 style={{ fontSize: 18, color: '#ffffff', fontWeight: 900, marginBottom: '0.5rem' }}>
              المحتوى التالي مغلق
            </h3>
            <p style={{ fontSize: 13, color: 'var(--ibr-gray)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              المعاينة المجانية انتهت. للحصول على وصول كامل لكافة فصول وتفاصيل الكتاب وتحديثاته المستمرة، يرجى تفعيل الاشتراك.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: '#ffffff' }}>${PRICE}</span>
              <span style={{ fontSize: 15, color: 'var(--ibr-gray)', textDecoration: 'line-through', marginRight: '0.5rem', marginLeft: '0.5rem' }}>${ORIGINAL_PRICE}</span>
              <span style={{
                background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6
              }}>-{DISCOUNT_PCT}%</span>
            </div>

            <button
              onClick={() => setPaymentOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #B8960E)',
                color: '#0F0F10', fontFamily: 'var(--ibr-font-ui)',
                fontSize: 12, fontWeight: 900, letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '0.9rem 2rem',
                borderRadius: 14, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(212,175,55,0.25)'
              }}
            >
              <ShoppingCart style={{ width: 16, height: 16 }} />
              شراء النسخة الكاملة
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--ibr-gray)', fontSize: 10 }}>
              <Shield style={{ width: 12, height: 12, color: 'rgba(212,175,55,0.5)' }} />
              <span>ضمان استرداد 7 أيام — إذا لم تجد القيمة المرجوة، سنعيد لك المبلغ بالكامل</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Overlay for Side Panels ── */}
      {(showChapters || showBookmarks || showMusic || showSettings || showAnalytics) && (
        <div className="ibr-overlay" onClick={closeAllPanels} />
      )}

      {/* ═══════ CHAPTERS PANEL ═══════ */}
      <div className={`ibr-panel ibr-panel-right ${showChapters ? 'open' : ''}`}>
        <div className="ibr-panel-header">
          <h3>فصول الكتاب</h3>
          <button className="ibr-btn-icon" onClick={() => setShowChapters(false)} style={{ width: 32, height: 32 }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          {CHAPTERS_LIST.map((ch, idx) => {
            const unlocked = ch.free || hasAccess;
            return (
              <div
                key={idx}
                className="ibr-mood-card"
                style={{ opacity: unlocked ? 1 : 0.5, cursor: unlocked ? 'pointer' : 'not-allowed' }}
                onClick={() => {
                  if (unlocked) {
                    setCurrentPage(ch.page);
                    setShowChapters(false);
                  } else {
                    setPaymentOpen(true);
                  }
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: unlocked ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {unlocked ? <BookOpen style={{ width: 14, height: 14, color: 'var(--ibr-gold)' }} /> : <Lock style={{ width: 14, height: 14, color: 'var(--ibr-gray)' }} />}
                </div>
                <div>
                  <h4 style={{ fontSize: 12, color: unlocked ? '#ffffff' : 'var(--ibr-gray)' }}>{ch.ar}</h4>
                  <p style={{ fontSize: 9 }}>{ch.free ? 'معاينة مجانية' : 'مغلق للمشتركين'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════ BOOKMARKS PANEL ═══════ */}
      <div className={`ibr-panel ibr-panel-right ${showBookmarks ? 'open' : ''}`}>
        <div className="ibr-panel-header">
          <h3>الإشارات المحفوظة</h3>
          <button className="ibr-btn-icon" onClick={() => setShowBookmarks(false)} style={{ width: 32, height: 32 }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          {bookmarks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.4 }}>
              <Bookmark style={{ width: 32, height: 32, color: 'var(--ibr-gold)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--ibr-cream)', fontSize: 12 }}>لا توجد إشارات مرجعية بعد</p>
            </div>
          ) : (
            bookmarks.map((bm, idx) => (
              <div key={idx} className="ibr-bookmark-item" onClick={() => { setCurrentPage(bm.page); setShowBookmarks(false); }}>
                <div className="page-num">صفحة {bm.page + 1}</div>
                <div className="note">{new Date(bm.timestamp).toLocaleDateString('ar-SA')}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ═══════ MUSIC PANEL ═══════ */}
      <div className={`ibr-panel ibr-panel-right ${showMusic ? 'open' : ''}`}>
        <div className="ibr-panel-header">
          <h3>الأجواء الموسيقية</h3>
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
          </div>
        </div>
      </div>

      {/* ═══════ SETTINGS PANEL ═══════ */}
      <div className={`ibr-panel ibr-panel-right ${showSettings ? 'open' : ''}`}>
        <div className="ibr-panel-header">
          <h3>خيارات العرض</h3>
          <button className="ibr-btn-icon" onClick={() => setShowSettings(false)} style={{ width: 32, height: 32 }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          <div className="ibr-setting-group">
            <label>جودة العرض والأداء</label>
            <div className="ibr-font-switch" style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={!liteMode ? 'active' : ''}
                onClick={() => setLiteMode(false)}
                style={{
                  flex: 1, padding: '0.5rem', background: !liteMode ? 'var(--ibr-gold)' : 'rgba(255,255,255,0.05)',
                  color: !liteMode ? '#000000' : '#ffffff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 11
                }}
              >
                دقة فائقة (3D واقعي)
              </button>
              <button
                className={liteMode ? 'active' : ''}
                onClick={() => setLiteMode(true)}
                style={{
                  flex: 1, padding: '0.5rem', background: liteMode ? 'var(--ibr-gold)' : 'rgba(255,255,255,0.05)',
                  color: liteMode ? '#000000' : '#ffffff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 11
                }}
              >
                الوضع الخفيف (أداء سلس)
              </button>
            </div>
          </div>

          <div className="ibr-setting-group">
            <label>مستوى التكبير الافتراضي</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="range" className="ibr-slider" min="1.0" max="2.5" step="0.1"
                value={zoomFactor} onChange={(e) => setZoomFactor(parseFloat(e.target.value))}
              />
              <span style={{ color: '#ffffff', fontSize: 11 }}>{zoomFactor.toFixed(1)}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ ANALYTICS PANEL ═══════ */}
      <div className={`ibr-panel ibr-panel-right ${showAnalytics ? 'open' : ''}`}>
        <div className="ibr-panel-header">
          <h3>إحصائيات القراءة</h3>
          <button className="ibr-btn-icon" onClick={() => setShowAnalytics(false)} style={{ width: 32, height: 32 }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="ibr-panel-body">
          <div className="ibr-stat-card" style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.8rem' }}>
            <div style={{ color: 'var(--ibr-gold)' }}><Clock /></div>
            <div>
              <h4 style={{ fontSize: 14, color: '#ffffff' }}>{readingTime} دقيقة</h4>
              <p style={{ fontSize: 10, color: 'var(--ibr-gray)' }}>مدة الجلسة الحالية</p>
            </div>
          </div>
          <div className="ibr-stat-card" style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.8rem' }}>
            <div style={{ color: 'var(--ibr-gold)' }}><Target /></div>
            <div>
              <h4 style={{ fontSize: 14, color: '#ffffff' }}>~{estimatedRemaining} دقيقة</h4>
              <p style={{ fontSize: 10, color: 'var(--ibr-gray)' }}>الوقت المقدر لإنهاء الباب</p>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ color: 'var(--ibr-gold)', fontSize: 11, fontWeight: 700, marginBottom: '0.8rem' }}>أوسمة القراءة</h4>
            {Object.entries(ACHIEVEMENTS).map(([id, ach]) => {
              const unlocked = unlockedAchievements.includes(id);
              const Icon = ach.icon;
              return (
                <div key={id} style={{ display: 'flex', gap: '1rem', padding: '0.8rem', borderRadius: 10, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '0.5rem', opacity: unlocked ? 1 : 0.35 }}>
                  <div style={{ color: unlocked ? 'var(--ibr-gold)' : 'var(--ibr-gray)' }}><Icon /></div>
                  <div>
                    <h4 style={{ fontSize: 12, color: '#ffffff' }}>{ach.name}</h4>
                    <p style={{ fontSize: 9, color: 'var(--ibr-gray)' }}>{ach.condition}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════ RATING MODAL ═══════ */}
      <AnimatePresence>
        {showRatingModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9990, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }} onClick={() => { if (!submittingReview) handleRatingSubmit(true); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
              style={{ position: 'relative', width: '100%', maxWidth: 460, background: '#0F0F10', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 28, padding: '2rem', boxSizing: 'border-box' }}
              dir="rtl"
            >
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <MessageSquareQuote style={{ width: 24, height: 24, color: '#D4AF37' }} />
                </div>
                <h3 style={{ color: '#ffffff', fontSize: 18, fontWeight: 900, marginBottom: '0.4rem' }}>
                  {isExiting ? 'قبل مغادرة القارئ...' : 'أخبرنا برأيك عن المعاينة'}
                </h3>
                <p style={{ color: 'var(--ibr-gray)', fontSize: 12 }}>
                  رأيك يهمنا ويساعدنا في تحسين وتطوير الكتاب بشكل دائم.
                </p>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star} onClick={() => setRating(star)} onMouseEnter={() => setRatingHover(star)} onMouseLeave={() => setRatingHover(0)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <Star style={{ width: 32, height: 32, fill: star <= (ratingHover || rating) ? '#D4AF37' : 'transparent', color: star <= (ratingHover || rating) ? '#D4AF37' : 'rgba(255,255,255,0.2)' }} />
                  </button>
                ))}
              </div>

              {/* Input text */}
              <textarea
                value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                placeholder="اكتب ملاحظاتك أو انطباعك عن الكتاب هنا (اختياري)..." rows={3}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 14, padding: '0.8rem', color: '#ffffff', fontSize: 13, outline: 'none', resize: 'none', marginBottom: '1.5rem' }}
              />

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  onClick={() => handleRatingSubmit(true)} disabled={submittingReview}
                  style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 12, color: 'var(--ibr-gray)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  تخطي
                </button>
                <button
                  onClick={() => handleRatingSubmit(false)} disabled={submittingReview || rating === 0}
                  style={{
                    flex: 2, padding: '0.8rem', background: rating > 0 ? 'linear-gradient(135deg, #D4AF37, #B8960E)' : 'rgba(212,175,55,0.15)',
                    border: 'none', borderRadius: 12, color: rating > 0 ? '#000000' : 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 900, cursor: rating > 0 ? 'pointer' : 'not-allowed'
                  }}
                >
                  {submittingReview ? 'إرسال...' : 'أرسل التقييم'}
                </button>
              </div>
            </motion.div>
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
    </div>
  );
};

export default ImmersiveBookReader;
