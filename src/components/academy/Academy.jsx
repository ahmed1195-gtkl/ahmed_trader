import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
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
  Filter
} from 'lucide-react';
import { schools } from '../../data/academy/academyData';
import { tradingTips } from '../../data/academy/schoolsData';
import Header from '../Header';
import Footer from '../Footer';
import SkillTreeWidget from './SkillTreeWidget';
import AcademyRoadmap, { academyLevels } from './AcademyRoadmap';

const moduleCategories = [
  { id: 'all', label: { ar: 'جميع الوحدات', en: 'All Modules' } },
  { id: 'foundation', label: { ar: 'التأسيس والأسواق', en: 'Foundations' } },
  { id: 'smc_ict', label: { ar: 'المال الذكي SMC & ICT', en: 'SMC & ICT' } },
  { id: 'risk_psych', label: { ar: 'المخاطر والنفسية', en: 'Risk & Psychology' } },
  { id: 'capstone', label: { ar: 'المشاريع والتخرج', en: 'Capstones & Pro' } }
];

const academyModulesList = [
  {
    id: 'mod-1.1',
    category: 'foundation',
    schoolId: 'foundation',
    title: { ar: 'المحور 1: مدخل الأسواق والسيولة', en: 'Module 1.1: Financial Markets & Liquidity' },
    desc: { ar: 'فهم كيف تتحرك الأموال بين البنوك المركزية، المزودين، والمتداول الصغير.', en: 'Understand interbank order flow, liquidity providers, and retail execution.' },
    difficulty: 'Beginner',
    lessonsCount: 5,
    estimatedTime: '3 Hours',
    progress: 100,
    xpReward: 300,
    skillsGained: ['المشاركون', 'دورات الأموال', 'أنواع الأوامر'],
    status: 'COMPLETED'
  },
  {
    id: 'mod-2.1',
    category: 'foundation',
    schoolId: 'classical',
    title: { ar: 'المحور 2: التحليل الكلي والأخبار الاقتصادية', en: 'Module 2.1: Macroeconomics & News' },
    desc: { ar: 'تفسير تقارير CPI وNFP وقرارات أسعار الفائدة وتأثيرها على العملات والذهب.', en: 'Decode CPI, NFP, interest rates, & their direct impact on FX and Gold.' },
    difficulty: 'Intermediate',
    lessonsCount: 8,
    estimatedTime: '6 Hours',
    progress: 100,
    xpReward: 500,
    skillsGained: ['التضخم', 'الفائدة', 'تقويم الأخبار'],
    status: 'COMPLETED'
  },
  {
    id: 'mod-3.1',
    category: 'foundation',
    schoolId: 'classical',
    title: { ar: 'المحور 3: هيكلية السعر والاتجاه الفني', en: 'Module 3.1: Chart Structure & Trend' },
    desc: { ar: 'تحديد القمم والقيعان الرئيسية، رسم الدعم والمقاومة، وخطوط الاتجاه الصحيحة.', en: 'Identify major swing pivots, S/R zones, and valid trend channels.' },
    difficulty: 'Intermediate',
    lessonsCount: 10,
    estimatedTime: '8 Hours',
    progress: 100,
    xpReward: 700,
    skillsGained: ['الاتجاه العام', 'الدعم والمقاومة', 'أنماط الشموع'],
    status: 'COMPLETED'
  },
  {
    id: 'mod-4.1',
    category: 'smc_ict',
    schoolId: 'smc',
    title: { ar: 'المحور 4: مفاهيم المال الذكي (Order Blocks & FVG)', en: 'Module 4.1: Smart Money Concepts Core' },
    desc: { ar: 'اكتشاف كتل أوامر المؤسسات OB وفجوات الفوليو FVG وسحب السيولة.', en: 'Detect institutional Order Blocks (OB), Fair Value Gaps (FVG), & sweeps.' },
    difficulty: 'Advanced',
    lessonsCount: 7,
    estimatedTime: '15 Hours',
    progress: 45,
    xpReward: 1200,
    skillsGained: ['Order Blocks', 'FVG Gaps', 'Liquidity Sweeps'],
    status: 'IN_PROGRESS'
  },
  {
    id: 'mod-5.1',
    category: 'smc_ict',
    schoolId: 'ict',
    title: { ar: 'المحور 5: منهجية ICT للتداول اليومي', en: 'Module 5.1: ICT Method & Killzones' },
    desc: { ar: 'التداول في أوقات Killzones، نماذج OTE، نمط Power of Three، وSilver Bullet.', en: 'Execute intraday models during Killzones, OTE, Power of 3, & Silver Bullet.' },
    difficulty: 'Advanced',
    lessonsCount: 6,
    estimatedTime: '12 Hours',
    progress: 0,
    xpReward: 1500,
    skillsGained: ['Killzones', 'Power of 3', 'Silver Bullet'],
    status: 'LOCKED'
  },
  {
    id: 'mod-6.1',
    category: 'smc_ict',
    schoolId: 'sk',
    title: { ar: 'المحور 6: نظام SK لتأكيد الصفقات', en: 'Module 6.1: SK System Execution' },
    desc: { ar: 'تطبيق قواعد نظام SK الصارمة للفلترة والدخول والخروج من الصفقات.', en: 'Apply strict SK system filtering, entry criteria, and target management.' },
    difficulty: 'Advanced',
    lessonsCount: 5,
    estimatedTime: '10 Hours',
    progress: 0,
    xpReward: 1800,
    skillsGained: ['نظام SK', 'فلترة الصفقات', 'نماذج التأكيد'],
    status: 'LOCKED'
  },
  {
    id: 'mod-7.1',
    category: 'risk_psych',
    schoolId: 'foundation',
    title: { ar: 'المحور 7: إدارة المخاطر وحساب العقود', en: 'Module 7.1: Professional Risk Protocol' },
    desc: { ar: 'معادلات حجم اللوت، منع Drawdown الجسيم، وتحديد نسبة المخاطرة 1%.', en: 'Lot sizing math, expectancy calculation, & strict 1% risk per trade shield.' },
    difficulty: 'Pro',
    lessonsCount: 6,
    estimatedTime: '8 Hours',
    progress: 0,
    xpReward: 2000,
    skillsGained: ['Position Sizing', 'Max Drawdown', 'Risk Ratio'],
    status: 'LOCKED'
  },
  {
    id: 'mod-8.1',
    category: 'risk_psych',
    schoolId: 'foundation',
    title: { ar: 'المحور 8: علم النفس والانضباط اليومي', en: 'Module 8.1: Trading Psychology & Journal' },
    desc: { ar: 'السيطرة على المشاعر، بناء روتين اليومي، وتوثيق الصفقات في Journal.', en: 'Emotional control, overcoming FOMO, & daily trade journal auditing.' },
    difficulty: 'Pro',
    lessonsCount: 6,
    estimatedTime: '8 Hours',
    progress: 0,
    xpReward: 2200,
    skillsGained: ['السيطرة النفسية', 'التدوين اليومي', 'إلغاء FOMO'],
    status: 'LOCKED'
  },
  {
    id: 'mod-9.1',
    category: 'capstone',
    schoolId: 'sk',
    title: { ar: 'المحور 9: المشروع النهائي واختبار 300 صفقة', en: 'Module 9.1: Pro Trader Qualification' },
    desc: { ar: 'اختبار تاريخي 300 صفقة Backtest، إعداد نظام التداول الخاص، والتحضير للتمويل.', en: '300-trade Backtest validation, custom strategy setup, & Prop Firm prep.' },
    difficulty: 'Master',
    lessonsCount: 4,
    estimatedTime: '20 Hours',
    progress: 0,
    xpReward: 5000,
    skillsGained: ['Backtest 300 صفقة', 'Prop Evaluation', 'نظام خاص'],
    status: 'LOCKED'
  }
];

const Academy = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : i18n.language?.startsWith('es') ? 'es' : 'en';
  const isRTL = lang === 'ar';

  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'modules' | 'skills' | 'dashboard'
  const [activeCategory, setActiveCategory] = useState('all');
  const [dailyTip, setDailyTip] = useState(null);

  useEffect(() => {
    const allTips = tradingTips;
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % allTips.length;
    setDailyTip(allTips[dayIndex]);
  }, []);

  const filteredModules = academyModulesList.filter(m => activeCategory === 'all' || m.category === activeCategory);

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* ─── Hero Command Center Banner ────────────────────────────────────────── */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top navigation back */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-amber-500 transition-colors text-sm font-medium"
            >
              {isRTL ? <ChevronLeft className="w-5 h-5 rotate-180" /> : <ArrowLeft className="w-5 h-5" />}
              <span>{isRTL ? 'الرئيسية' : 'Home'}</span>
            </button>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold">
              <GraduationCap className="w-4 h-4" />
              {isRTL ? 'المنظومة التعليمية المتكاملة' : 'Institutional Trading Academy'}
            </span>
          </div>

          {/* Hero Grid Card */}
          <div className="glass-card border border-amber-500/30 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: User Status & Level */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                    {isRTL ? 'الرتبة: متداول مؤسسي مبتدئ' : 'Rank: Smart Money Apprentice'}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 font-mono text-xs font-bold border border-purple-500/30">
                    {isRTL ? 'المستوى 4: مفاهيم SMC' : 'Level 4: Smart Money Concepts'}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-secondary px-2.5 py-1 rounded-lg border border-border">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    14 {isRTL ? 'يوم استمرار' : 'Days Streak'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
                  <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                    {isRTL ? 'أكاديمية ShukriTrade' : 'ShukriTrade Academy'}
                  </span>
                </h1>

                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
                  {isRTL 
                    ? 'منظومة تعليمية تراكمية تمتد لـ 36 أسبوعاً، تنقلك وفق نموذج الأكاديميات الحديثة من الصفر حتى إتقان بناء نظامك التداولي المستقل.'
                    : 'A 36-week continuous university progression system transforming beginners into disciplined professional traders.'
                  }
                </p>

                {/* XP Progress Bar Component */}
                <div className="space-y-2 pt-2 max-w-xl">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-muted-foreground">{isRTL ? 'تقدم خبرة المستوى (XP)' : 'Level XP Progress'}</span>
                    <span className="text-amber-400 font-bold">6,250 / 9,000 XP (69%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden p-0.5 border border-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '69%' }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full shadow-lg shadow-amber-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Continue Learning Card */}
              <div className="lg:col-span-5">
                <div className="bg-secondary/60 border border-amber-500/30 rounded-xl p-5 relative overflow-hidden space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-amber-500" />
                      {isRTL ? 'المهمة الحالية للتعلم' : 'Continue Learning Task'}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      +50 XP
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">{isRTL ? 'الموديل 4.2 — الدرس الثاني' : 'Module 4.2 — Lesson 2'}</span>
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

      {/* ─── Main Content Tabs Switcher ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-border/60 scrollbar-none">
          {[
            { id: 'roadmap', label: isRTL ? 'خارطة الطريق (9 مستويات)' : '9-Level Roadmap', icon: Compass },
            { id: 'modules', label: isRTL ? 'فهرس الوحدات الدراسية' : 'Curriculum Modules', icon: Layers },
            { id: 'skills', label: isRTL ? 'شجرة المهارات التداولية' : 'Trading Skill Tree', icon: Sparkles },
            { id: 'dashboard', label: isRTL ? 'لوحة إحصائيات الطالب' : 'Student Dashboard', icon: Activity },
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

        {/* Tab 1: Roadmap View */}
        {activeTab === 'roadmap' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <AcademyRoadmap isRTL={isRTL} onSelectLevel={(lvl) => navigate(`/academy/${lvl.schoolId}`)} />
          </motion.div>
        )}

        {/* Tab 2: Modules View */}
        {activeTab === 'modules' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Category Filter */}
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

            {/* Modules Cards Grid */}
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
                        <span className="text-[11px] font-mono font-bold text-amber-500">
                          {mod.id.toUpperCase()}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isCompleted 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : isInProgress 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-background text-muted-foreground border-border'
                        }`}>
                          {isCompleted ? (isRTL ? 'مكتمل 100%' : '100% Done') : isInProgress ? `${mod.progress}%` : (isRTL ? 'مغلق' : 'Locked')}
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
                        {mod.skillsGained.map((sk, idx) => (
                          <span key={idx} className="text-[10px] bg-secondary/80 px-2 py-0.5 rounded text-foreground/80 font-medium">
                            #{sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                          {mod.lessonsCount} {isRTL ? 'دروس' : 'lessons'}
                        </span>
                        <span className="font-mono text-amber-400 font-bold">+{mod.xpReward} XP</span>
                      </div>

                      {!isLocked ? (
                        <button
                          onClick={() => navigate(`/academy/${mod.schoolId}`)}
                          className="flex items-center gap-1 text-amber-500 font-bold hover:underline cursor-pointer"
                        >
                          <span>{isRTL ? 'دخول الوحدة' : 'Open'}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Tab 3: Skill Tree View */}
        {activeTab === 'skills' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <SkillTreeWidget isRTL={isRTL} />
          </motion.div>
        )}

        {/* Tab 4: Student Dashboard View */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Stats Overview */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: isRTL ? 'إجمالي XP المكتسب' : 'Total XP Earned', val: '6,250 XP', icon: Trophy, color: 'text-amber-400' },
                  { label: isRTL ? 'الدروس المكتملة' : 'Lessons Mastered', val: '28 / 57', icon: CheckCircle2, color: 'text-emerald-400' },
                  { label: isRTL ? 'أيام الاستمرار' : 'Streak Days', val: '14 Days', icon: Flame, color: 'text-orange-400' },
                  { label: isRTL ? 'الأوسمة والشهادات' : 'Certificates', val: '3 Earned', icon: Award, color: 'text-purple-400' },
                ].map((st, idx) => (
                  <div key={idx} className="glass-card border border-border/80 p-4 rounded-xl">
                    <st.icon className={`w-6 h-6 mb-2 ${st.color}`} />
                    <p className="text-xl font-bold font-mono text-foreground">{st.val}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{st.label}</p>
                  </div>
                ))}
              </div>

              {/* Achievements Showcase */}
              <div className="glass-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  {isRTL ? 'الأوسمة والإنجازات المحققة' : 'Unlocked Badges & Achievements'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { title: { ar: 'متقن التأسيس', en: 'Foundation Master' }, desc: { ar: 'إتمام المستوى 0 و1 بنسبة 100%', en: 'Passed Level 0 & 1' }, color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
                    { title: { ar: 'محلل فني كلاسيكي', en: 'Technical Analyst' }, desc: { ar: 'إكمال دروس الشارت والاتجاه', en: 'Mastered Chart Structure' }, color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
                    { title: { ar: 'بطل الاستمرار 14 يوماً', en: '14-Day Streak' }, desc: { ar: 'الدراسة اليومية بدون انقطاع', en: 'Unbroken Study Streak' }, color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
                  ].map((ach, i) => (
                    <div key={i} className={`p-3.5 rounded-xl border ${ach.color}`}>
                      <p className="text-xs font-bold">{ach.title[isRTL ? 'ar' : 'en']}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{ach.desc[isRTL ? 'ar' : 'en']}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Quests Widget */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-500" />
                  {isRTL ? 'المهام اليومية (Daily Quests)' : 'Daily Quests'}
                </h3>
                <div className="space-y-3">
                  {[
                    { title: { ar: 'قراءة درس في مفاهيم SMC', en: 'Complete 1 SMC Lesson' }, xp: '+50 XP', done: true },
                    { title: { ar: 'إجراء اختبار قصير بنسبة 80%+', en: 'Pass Quiz ≥ 80%' }, xp: '+30 XP', done: false },
                    { title: { ar: 'مراجعة شجرة المهارات', en: 'Check Skill Growth' }, xp: '+20 XP', done: true },
                  ].map((q, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 ${q.done ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                        <span className={`text-xs ${q.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {q.title[isRTL ? 'ar' : 'en']}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">{q.xp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* ─── Tip of the Day Banner ─────────────────────────────────────────────── */}
      {dailyTip && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl border border-amber-500/20 p-6 sm:p-8"
          >
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <Lightbulb className="w-8 h-8 text-amber-500 opacity-50" />
            </div>
            <h3 className="text-lg font-bold text-amber-500 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {isRTL ? 'نصيحة اليوم من الأكاديمية' : 'Academy Tip of the Day'}
            </h3>
            <p className="text-foreground/90 text-base sm:text-lg leading-relaxed italic">
              "{dailyTip[lang] || dailyTip.en}"
            </p>
          </motion.div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Academy;
