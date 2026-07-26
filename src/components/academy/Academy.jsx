import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../../lib/firebase';
import { doc, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { 
  BarChart3, 
  Brain, 
  Target, 
  Zap, 
  BookOpen, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight,
  Lightbulb, 
  ArrowLeft, 
  Star, 
  Users, 
  Clock, 
  Award,
  Play,
  Sparkles,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Compass,
  Trophy,
  Activity,
  ArrowUpRight,
  Filter,
  TrendingUp,
  Bookmark,
  CheckCircle,
  HelpCircle,
  Share2,
  RefreshCw,
  FileText
} from 'lucide-react';
import { schools } from '../../data/academy/academyData';
import { tradingTips } from '../../data/academy/schoolsData';
import Header from '../Header';
import Footer from '../Footer';
import SkillTreeWidget from './SkillTreeWidget';
import AcademyRoadmap, { academyLevels } from './AcademyRoadmap';

// ─── Module Categories Filter ───────────────────────────────────────────────
const moduleCategories = [
  { id: 'all', label: { ar: 'جميع المحاور (0–9)', en: 'All Modules (0–9)' } },
  { id: 'foundation', label: { ar: 'التأسيس والأصلية (0–3)', en: 'Foundations (0–3)' } },
  { id: 'smc_ict', label: { ar: 'المال الذكي SMC & ICT (4–6)', en: 'SMC & ICT (4–6)' } },
  { id: 'risk_psych', label: { ar: 'المخاطر والنفسية (7–8)', en: 'Risk & Psychology (7–8)' } },
  { id: 'capstone', label: { ar: 'المحتص الخبير (Level 9)', en: 'Pro Trader Path (Level 9)' } }
];

// ─── Comprehensive Modules Master List (Levels 0 to 9) ─────────────────────
const academyModulesList = [
  {
    id: 'mod-0.1',
    levelNumber: 0,
    category: 'foundation',
    schoolId: 'foundation',
    title: { ar: 'Level 0: التهيئة وإعداد عقلية المتداول', en: 'Level 0: Orientation & Trader Mindset' },
    desc: { ar: 'إلغاء الخرافات، إعداد بيئة العمل، والالتزام ببروتوكولات الأكاديمية.', en: 'Eliminate myths, establish growth mindset, and set up trading workspace.' },
    difficulty: 'Beginner',
    lessonsCount: 4,
    estimatedTime: '1 Week',
    progress: 100,
    xpReward: 300,
    skillsGained: ['الالتزام التعلمي', 'إعداد بيئة التداول', 'قواعد الأكاديمية'],
    status: 'COMPLETED'
  },
  {
    id: 'mod-1.1',
    levelNumber: 1,
    category: 'foundation',
    schoolId: 'foundation',
    title: { ar: 'Level 1: أساسيات الأسواق والسيولة', en: 'Level 1: Financial Markets & Liquidity' },
    desc: { ar: 'فهم حركة الأموال بين البنوك المركزية، مزودي السيولة، والمتداول الفردي.', en: 'Understand interbank order flow, liquidity providers, and retail execution.' },
    difficulty: 'Beginner',
    lessonsCount: 5,
    estimatedTime: '3 Weeks',
    progress: 100,
    xpReward: 600,
    skillsGained: ['أنواع الأوامر', 'سيولة الأسواق', 'التداول التجريبي'],
    status: 'COMPLETED'
  },
  {
    id: 'mod-2.1',
    levelNumber: 2,
    category: 'foundation',
    schoolId: 'classical',
    title: { ar: 'Level 2: التحليل الكلي والأخبار الاقتصادية', en: 'Level 2: Macroeconomics & News' },
    desc: { ar: 'تفسير تقارير CPI و NFP وقرارات أسعار الفائدة وتأثيرها المباشر على السوق.', en: 'Decode CPI, NFP, interest rates, & their direct impact on FX and Gold.' },
    difficulty: 'Intermediate',
    lessonsCount: 8,
    estimatedTime: '4 Weeks',
    progress: 100,
    xpReward: 900,
    skillsGained: ['الاقتصاد الكلي', 'تقويم الأخبار', 'الاتجاه العام'],
    status: 'COMPLETED'
  },
  {
    id: 'mod-3.1',
    levelNumber: 3,
    category: 'foundation',
    schoolId: 'classical',
    title: { ar: 'Level 3: التحليل الفني وقراءة الشارت', en: 'Level 3: Technical Analysis Mastery' },
    desc: { ar: 'تحديد القمم والقيعان الرئيسية، رسم مناطق الدعم والمقاومة وخطوط الاتجاه.', en: 'Identify major swing pivots, S/R zones, and valid trend channels.' },
    difficulty: 'Intermediate',
    lessonsCount: 10,
    estimatedTime: '6 Weeks',
    progress: 100,
    xpReward: 1200,
    skillsGained: ['هيكلية الاتجاه', 'نماذج الشارت', 'المؤشرات الفنية'],
    status: 'COMPLETED'
  },
  {
    id: 'mod-4.1',
    levelNumber: 4,
    category: 'smc_ict',
    schoolId: 'smc',
    title: { ar: 'Level 4: مفاهيم المال الذكي (SMC)', en: 'Level 4: Smart Money Concepts (SMC)' },
    desc: { ar: 'اكتشاف كتل أوامر المؤسسات (OB) وفجوات الفوليو (FVG) وسحب السيولة.', en: 'Detect institutional Order Blocks (OB), Fair Value Gaps (FVG), & sweeps.' },
    difficulty: 'Advanced',
    lessonsCount: 7,
    estimatedTime: '8 Weeks',
    progress: 45,
    xpReward: 2500,
    skillsGained: ['Order Blocks', 'FVG Gaps', 'Liquidity Sweeps'],
    status: 'IN_PROGRESS'
  },
  {
    id: 'mod-5.1',
    levelNumber: 5,
    category: 'smc_ict',
    schoolId: 'ict',
    title: { ar: 'Level 5: منهجية ICT للتداول اليومي', en: 'Level 5: ICT Method & Killzones' },
    desc: { ar: 'التداول في أوقات Killzones، نماذج OTE، نمط Power of Three، و Silver Bullet.', en: 'Execute intraday models during Killzones, OTE, Power of 3, & Silver Bullet.' },
    difficulty: 'Advanced',
    lessonsCount: 6,
    estimatedTime: '4 Weeks',
    progress: 0,
    xpReward: 3000,
    skillsGained: ['Killzones', 'Power of 3', 'Silver Bullet'],
    status: 'LOCKED'
  },
  {
    id: 'mod-6.1',
    levelNumber: 6,
    category: 'smc_ict',
    schoolId: 'sk',
    title: { ar: 'Level 6: نظام SK لتأكيد الصفقات', en: 'Level 6: SK System Application' },
    desc: { ar: 'تطبيق قواعد نظام SK الصارمة للفلترة والدخول والخروج من الصفقات.', en: 'Apply strict SK system filtering, entry criteria, and target management.' },
    difficulty: 'Advanced',
    lessonsCount: 5,
    estimatedTime: '3 Weeks',
    progress: 0,
    xpReward: 3500,
    skillsGained: ['نظام SK', 'فلترة الدخول', 'نماذج التأكيد'],
    status: 'LOCKED'
  },
  {
    id: 'mod-7.1',
    levelNumber: 7,
    category: 'risk_psych',
    schoolId: 'foundation',
    title: { ar: 'Level 7: إدارة المخاطر وحساب العقود', en: 'Level 7: Risk Management Mastery' },
    desc: { ar: 'معادلات حجم اللوت، منع Drawdown الجسيم، وتحديد نسبة المخاطرة 1%.', en: 'Lot sizing math, expectancy calculation, & strict 1% risk per trade shield.' },
    difficulty: 'Pro',
    lessonsCount: 6,
    estimatedTime: '3 Weeks',
    progress: 0,
    xpReward: 4000,
    skillsGained: ['Position Sizing', 'Max Drawdown Control', 'Risk:Reward Ratio'],
    status: 'LOCKED'
  },
  {
    id: 'mod-8.1',
    levelNumber: 8,
    category: 'risk_psych',
    schoolId: 'foundation',
    title: { ar: 'Level 8: علم النفس والانضباط اليومي', en: 'Level 8: Trading Psychology & Habits' },
    desc: { ar: 'السيطرة على المشاعر، بناء روتين يومي، وتوثيق الصفقات في Journal.', en: 'Emotional control, overcoming FOMO, & daily trade journal auditing.' },
    difficulty: 'Pro',
    lessonsCount: 6,
    estimatedTime: '3 Weeks',
    progress: 0,
    xpReward: 4500,
    skillsGained: ['السيطرة النفسية', 'التدوين اليومي Journal', 'إلغاء FOMO'],
    status: 'LOCKED'
  },
  {
    id: 'mod-9.1',
    levelNumber: 9,
    category: 'capstone',
    schoolId: 'sk',
    title: { ar: 'Level 9: المسار التنافسي واختبار 300 صفقة', en: 'Level 9: Professional Trader Path' },
    desc: { ar: 'اختبار تاريخي لـ 300 صفقة Backtest، إعداد النظام الخاص، والتمويل.', en: '300-trade Backtest validation, custom strategy setup, & Prop Firm prep.' },
    difficulty: 'Master',
    lessonsCount: 4,
    estimatedTime: '8 Weeks',
    progress: 0,
    xpReward: 6000,
    skillsGained: ['Backtest 300 صفقة', 'Prop Evaluation', 'إدارة محفظة مستقلة'],
    status: 'LOCKED'
  }
];

// ─── Main Academy Component ──────────────────────────────────────────────────
const Academy = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : i18n.language?.startsWith('es') ? 'es' : 'en';
  const isRTL = lang === 'ar';

  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'modules' | 'skills' | 'progress'
  const [activeCategory, setActiveCategory] = useState('all');

  // Realtime Firebase Firestore Profile State
  const [userProfile, setUserProfile] = useState({
    displayName: '',
    totalXp: 7250,
    currentLevel: 4,
    rankTitle: 'Smart Money Apprentice',
    streakDays: 14,
    completedLessons: ['les-0.1', 'les-1.1', 'les-2.1', 'les-3.1', 'les-4.1'],
  });
  const [loading, setLoading] = useState(true);

  // Subscribe to Firebase Firestore User Profile Realtime Snapshot
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile({
          displayName: data.displayName || data.fullName || user.email?.split('@')[0] || 'Trader',
          totalXp: data.totalXp || 7250,
          currentLevel: data.currentLevel !== undefined ? data.currentLevel : 4,
          rankTitle: data.rankTitle || (data.currentLevel >= 6 ? 'Quantitative Risk Strategist' : data.currentLevel >= 4 ? 'Smart Money Specialist' : 'Technical Apprentice'),
          streakDays: data.streakDays || 14,
          completedLessons: data.completedLessons || ['les-0.1', 'les-1.1', 'les-2.1', 'les-3.1', 'les-4.1'],
        });
      }
      setLoading(false);
    }, (err) => {
      console.warn('Academy Firestore profile listener error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter Modules by category
  const filteredModules = useMemo(() => {
    return academyModulesList.filter(m => activeCategory === 'all' || m.category === activeCategory);
  }, [activeCategory]);

  // Dynamic Level progress computation
  const levelProgressXp = userProfile.totalXp % 2500;
  const levelProgressPercent = Math.min(100, Math.round((levelProgressXp / 2500) * 100));

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* ─── ZONE 1: HERO CONSOLE & ACADEMY IDENTITY ──────────────────────────── */}
      <section className="relative pt-24 pb-10 overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Top Bar Breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-amber-500 transition-colors text-sm font-medium cursor-pointer"
            >
              {isRTL ? <ChevronLeft className="w-5 h-5 rotate-180" /> : <ArrowLeft className="w-5 h-5" />}
              <span>{isRTL ? 'الرئيسية' : 'Home'}</span>
            </button>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold font-mono">
              <GraduationCap className="w-4 h-4" />
              {isRTL ? 'منظومة الأكاديمية المؤسسية (Levels 0–9)' : 'Institutional Academy (Levels 0–9)'}
            </span>
          </div>

          {/* Hero Console Card */}
          <div className="glass-card border border-amber-500/30 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Student Identity & XP Gauge */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                    {isRTL ? `الرتبة: ${userProfile.rankTitle}` : `Rank: ${userProfile.rankTitle}`}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 font-mono text-xs font-bold border border-purple-500/30">
                    {isRTL ? `المستوى ${userProfile.currentLevel}: مفاهيم SMC` : `Level ${userProfile.currentLevel}: SMC Concepts`}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-secondary px-2.5 py-1 rounded-lg border border-border">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    {userProfile.streakDays} {isRTL ? 'يوم انضباط' : 'Days Streak'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
                  <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                    {isRTL ? 'أكاديمية ShukriTrade للتداول' : 'ShukriTrade Trading Academy'}
                  </span>
                </h1>

                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
                  {isRTL 
                    ? 'منظومة تعليمية تراكمية تمتد لـ 36 أسبوعاً، تنقلك من الصفر حتى بناء نظامك التداولي المستقل وإتقان إدارة المخاطر والسيولة.'
                    : 'A 36-week continuous university progression system transforming beginners into disciplined professional traders.'
                  }
                </p>

                {/* XP Progress Bar */}
                <div className="space-y-2 pt-2 max-w-xl">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-muted-foreground">{isRTL ? 'تقدم خبرة المستوى الحالي (XP)' : 'Level XP Progression'}</span>
                    <span className="text-amber-400 font-bold">{userProfile.totalXp.toLocaleString()} XP / 9,000 XP</span>
                  </div>
                  <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden p-0.5 border border-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProgressPercent}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full shadow-lg shadow-amber-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Continue Learning Primary Card */}
              <div className="lg:col-span-5">
                <div className="bg-secondary/60 border border-amber-500/30 rounded-xl p-5 relative overflow-hidden space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-amber-500" />
                      {isRTL ? 'الدرس الحالي التالي' : 'Continue Learning Task'}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      +50 XP
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">{isRTL ? 'المحور 4.1 — الدرس 2' : 'Module 4.1 — Lesson 2'}</span>
                    <h3 className="text-base sm:text-lg font-bold text-foreground mt-0.5 line-clamp-1">
                      {isRTL ? 'الفجوات السعرية (Fair Value Gap) وإعادة التوازن' : 'Fair Value Gaps (FVG) & Consequent Encroachment'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      25 {isRTL ? 'دقيقة قراءة' : 'min read'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      {isRTL ? 'مستوى متقدم' : 'Advanced'}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('/academy/smc/lesson/1')}
                    className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isRTL ? 'متابعة الدرس الآن' : 'Continue Lesson Now'}</span>
                    {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── ZONE 2: SMART NEXT-STEP RECOMMENDATION AREA ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-gradient-to-r from-amber-500/10 via-card to-secondary border border-amber-500/30 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  {isRTL ? 'خطوتك القادمة الموصى بها (AI Smart Engine)' : 'Your Next Logical Step'}
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">Recommended</span>
              </div>
              <h3 className="text-base font-bold text-foreground mt-0.5">
                {isRTL ? 'درس: الفجوات السعرية (Fair Value Gap) وحساب الاختلال' : 'Lesson: Fair Value Gap Calculation & Imbalances'}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isRTL 
                  ? 'السبب: بناءً على إكمال المستوى 3 وحصولك على 90% في اختبار التحليل الفني الكلاسيكي.' 
                  : 'Reason: Based on completing Level 3 with a 90% score on Classical Technicals.'
                }
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/academy/smc/lesson/1')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer"
          >
            {isRTL ? 'الانتقال للدرس' : 'Go to Lesson'}
          </button>
        </div>
      </section>

      {/* ─── MAIN ACADEMY NAVIGATION TABS ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        
        {/* Nav Tabs Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-border/60 scrollbar-none">
          {[
            { id: 'roadmap', label: isRTL ? 'خارطة الطريق (Levels 0–9)' : 'Levels 0–9 Roadmap', icon: Compass },
            { id: 'modules', label: isRTL ? 'فهرس المحاور الدراسية' : 'Curriculum Catalog', icon: Layers },
            { id: 'skills', label: isRTL ? 'رادار المهارات التداولية (11)' : 'Skill Radar (11 Axis)', icon: Sparkles },
            { id: 'progress', label: isRTL ? 'مركز تقدم الطالب والإنجازات' : 'Student Progress Center', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── TAB 1: ROADMAP VIEW (LEVELS 0–9) ─────────────────────────────── */}
        {activeTab === 'roadmap' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <AcademyRoadmap isRTL={isRTL} onSelectLevel={(lvl) => navigate(`/academy/${lvl.schoolId}`)} />
          </motion.div>
        )}

        {/* ─── TAB 2: MODULES CATALOG VIEW ──────────────────────────────────── */}
        {activeTab === 'modules' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Category Filters */}
            <div className="flex items-center gap-2 flex-wrap pb-2">
              <Filter className="w-4 h-4 text-amber-500 me-2" />
              {moduleCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-secondary/40 text-muted-foreground border border-border hover:bg-secondary'
                  }`}
                >
                  {cat.label[isRTL ? 'ar' : 'en']}
                </button>
              ))}
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((mod) => {
                const isCompleted = mod.status === 'COMPLETED';
                const isInProgress = mod.status === 'IN_PROGRESS';
                const isLocked = mod.status === 'LOCKED';

                return (
                  <motion.div
                    key={mod.id}
                    whileHover={!isLocked ? { y: -4 } : {}}
                    className={`glass-card border rounded-2xl p-6 relative overflow-hidden transition-all flex flex-col justify-between ${
                      isInProgress 
                        ? 'border-amber-500/50 shadow-xl shadow-amber-500/10' 
                        : isCompleted 
                        ? 'border-emerald-500/30' 
                        : 'border-border opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono font-bold text-amber-500 uppercase tracking-widest">
                          {isRTL ? `المستوى ${mod.levelNumber}` : `Level ${mod.levelNumber}`}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isCompleted 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : isInProgress 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-secondary text-muted-foreground border-border'
                        }`}>
                          {isCompleted ? (isRTL ? 'مكتمل' : 'Completed') : isInProgress ? (isRTL ? 'جاري التعلم' : 'In Progress') : (isRTL ? 'مغلق' : 'Locked')}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-foreground mb-2 line-clamp-1">
                        {mod.title[isRTL ? 'ar' : 'en']}
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {mod.desc[isRTL ? 'ar' : 'en']}
                      </p>

                      {/* Skills Gained Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {mod.skillsGained.map((skill, idx) => (
                          <span key={idx} className="text-[10px] bg-secondary border border-border/80 px-2 py-0.5 rounded text-foreground/80 font-medium">
                            #{skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {mod.estimatedTime}
                      </span>
                      <span className="font-mono text-amber-400 font-bold">
                        +{mod.xpReward} XP
                      </span>
                    </div>

                    {!isLocked && (
                      <button
                        onClick={() => navigate(`/academy/${mod.schoolId}`)}
                        className="mt-4 w-full py-2.5 rounded-xl bg-secondary hover:bg-amber-500 hover:text-black border border-border text-foreground font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>{isRTL ? 'دخول المحور' : 'Enter Module'}</span>
                        <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ─── TAB 3: SKILL RADAR MATRIX ─────────────────────────────────────── */}
        {activeTab === 'skills' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <SkillTreeWidget isRTL={isRTL} />
          </motion.div>
        )}

        {/* ─── TAB 4: STUDENT PROGRESS CENTER ────────────────────────────────── */}
        {activeTab === 'progress' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Overview Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-card border border-border p-5 rounded-2xl">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{isRTL ? 'الدروس المكتملة' : 'Completed Lessons'}</span>
                <p className="text-3xl font-black font-mono text-foreground mt-2">18 / 42</p>
                <p className="text-[11px] text-emerald-400 mt-1 font-bold">42.8% {isRTL ? 'إنجاز إجمالي' : 'Overall Completion'}</p>
              </div>

              <div className="glass-card border border-border p-5 rounded-2xl">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{isRTL ? 'نقاط الخبرة (XP)' : 'Total XP Earned'}</span>
                <p className="text-3xl font-black font-mono text-amber-400 mt-2">{userProfile.totalXp.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{isRTL ? 'الرتبة: ' + userProfile.rankTitle : 'Rank: ' + userProfile.rankTitle}</p>
              </div>

              <div className="glass-card border border-border p-5 rounded-2xl">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{isRTL ? 'أيام الاستمرار' : 'Active Study Streak'}</span>
                <p className="text-3xl font-black font-mono text-orange-400 mt-2">{userProfile.streakDays} {isRTL ? 'أيام' : 'Days'}</p>
                <p className="text-[11px] text-emerald-400 mt-1 font-bold">🔥 {isRTL ? 'مستوى انضباط مرتفع' : 'High Consistency'}</p>
              </div>

              <div className="glass-card border border-border p-5 rounded-2xl">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{isRTL ? 'الأوسمة والشهادات' : 'Earned Badges'}</span>
                <p className="text-3xl font-black font-mono text-purple-400 mt-2">4 {isRTL ? 'أوسمة' : 'Badges'}</p>
                <p className="text-[11px] text-purple-400 mt-1 font-bold">📜 {isRTL ? 'شهادة أساسيات مجتازة' : 'Foundations Certified'}</p>
              </div>
            </div>

            {/* Badges & Achievements Showcase */}
            <div className="glass-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                {isRTL ? 'الأوسمة والإنجازات المستحقة' : 'Badges & Milestone Achievements'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {[
                  { title: isRTL ? 'خبير التأسيس' : 'Foundations Master', desc: isRTL ? 'إكمال المستويات 0-3 بنجاح' : 'Completed Levels 0–3', icon: ShieldCheck, color: 'text-emerald-400' },
                  { title: isRTL ? 'صياد السيولة' : 'Liquidity Hunter', desc: isRTL ? 'إتقان سحب السيولة في Level 4' : 'Mastered Level 4 SMC', icon: Zap, color: 'text-amber-400' },
                  { title: isRTL ? 'حارس المخاطرة' : 'Risk Guardian', desc: isRTL ? 'عدم تخطي نسبة 1% مخاطرة' : 'Zero Risk Violations', icon: Target, color: 'text-cyan-400' },
                  { title: isRTL ? 'صاحب الانضباط' : 'Disciplined Trader', desc: isRTL ? 'استمرار دراسي 14 يوماً متواصلة' : '14-Day Continuous Streak', icon: Flame, color: 'text-orange-400' },
                ].map((badge, idx) => (
                  <div key={idx} className="bg-secondary/40 border border-border/80 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                      <badge.icon className={`w-5 h-5 ${badge.color}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{badge.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

      </section>

      <Footer />
    </div>
  );
};

export default Academy;
