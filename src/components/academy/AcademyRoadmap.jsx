import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Globe, 
  TrendingUp, 
  BarChart2, 
  Zap, 
  Target, 
  ShieldCheck, 
  Brain, 
  Award,
  Lock,
  CheckCircle2,
  Play,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';

export const academyLevels = [
  {
    id: 'level-0',
    number: 0,
    schoolId: 'foundation',
    title: { ar: 'Level 0 — Orientation (التهيئة)', en: 'Level 0 — Orientation & Mindset' },
    desc: {
      ar: 'إعداد عقلية المتداول وفهم كيفية الدراسة والالتزام بالأكاديمية واستبعاد الخرافات.',
      en: 'Eliminate myths, establish growth mindset, and set up your trading workspace.'
    },
    duration: { ar: 'أسبوع واحد', en: '1 Week' },
    xpReward: 300,
    skills: { ar: ['الالتزام التعلمي', 'إعداد البيئة'], en: ['Trader Mindset', 'Environment Setup'] },
    status: 'COMPLETED', // COMPLETED | IN_PROGRESS | LOCKED
    progress: 100,
    icon: GraduationCap,
    color: 'from-slate-500 to-zinc-600',
    borderColor: 'border-slate-500/30'
  },
  {
    id: 'level-1',
    number: 1,
    schoolId: 'foundation',
    title: { ar: 'Level 1 — Market Foundations (أساسيات الأسواق)', en: 'Level 1 — Market Foundations' },
    desc: {
      ar: 'فهم هيكلية الأسواق المالية، حركة الأموال، المشاركين، أنواع الأوامر، والمنصات.',
      en: 'Understand financial markets, liquidity, order flow, bid/ask, and trading platforms.'
    },
    duration: { ar: '3 أسابيع', en: '3 Weeks' },
    xpReward: 600,
    skills: { ar: ['أنواع الأوامر', 'سيولة الأسواق', 'تداول تجريبي'], en: ['Order Types', 'Market Mechanics', 'Demo Trading'] },
    status: 'COMPLETED',
    progress: 100,
    icon: Globe,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 'level-2',
    number: 2,
    schoolId: 'classical',
    title: { ar: 'Level 2 — Economic & Fundamental Analysis', en: 'Level 2 — Economic & Fundamental Analysis' },
    desc: {
      ar: 'فهم محركات الاقتصاد الكلي: الفائدة، التضخم، تقارير NFP وCPI والأخبار عالية التأثير.',
      en: 'Master macroeconomic drivers: GDP, inflation, interest rates, NFP, CPI, & news releases.'
    },
    duration: { ar: '4 أسابيع', en: '4 Weeks' },
    xpReward: 900,
    skills: { ar: ['الاقتصاد الكلي', 'تقويم الأخبار', 'الاتجاه العام'], en: ['Macroeconomics', 'News Calendar', 'Currency Bias'] },
    status: 'COMPLETED',
    progress: 100,
    icon: BarChart2,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'level-3',
    number: 3,
    schoolId: 'classical',
    title: { ar: 'Level 3 — Technical Analysis Mastery', en: 'Level 3 — Technical Analysis Mastery' },
    desc: {
      ar: 'إتقان قراءة الشارت: الاتجاهات، الدعم والمقاومة، أنماط الشموع، النماذج، والفي بوناتشي.',
      en: 'Complete chart literacy: trends, S/R, candlestick patterns, & multi-timeframe confluence.'
    },
    duration: { ar: '6 أسابيع', en: '6 Weeks' },
    xpReward: 1200,
    skills: { ar: ['هيكلية الاتجاه', 'نماذج الشارت', 'المؤشرات الفنية'], en: ['Chart Structure', 'Patterns', 'Fibonacci'] },
    status: 'COMPLETED',
    progress: 100,
    icon: TrendingUp,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'level-4',
    number: 4,
    schoolId: 'smc',
    title: { ar: 'Level 4 — Smart Money Concepts (SMC)', en: 'Level 4 — Smart Money Concepts' },
    desc: {
      ar: 'الانتقال للتحليل المؤسسي: كتل الأوامر OB، فجوات الفوليو FVG، وسحب السيولة EQH/EQL.',
      en: 'Institutional analysis: Order Blocks (OB), Fair Value Gaps (FVG), & Liquidity Sweeps.'
    },
    duration: { ar: '8 أسابيع', en: '8 Weeks' },
    xpReward: 2500,
    skills: { ar: ['Order Blocks', 'FVG Imbalances', 'Liquidity Sweeps'], en: ['Order Blocks', 'FVG', 'Liquidity Sweeps'] },
    status: 'IN_PROGRESS',
    progress: 45,
    icon: Zap,
    color: 'from-purple-500 to-violet-600',
    borderColor: 'border-purple-500/50'
  },
  {
    id: 'level-5',
    number: 5,
    schoolId: 'ict',
    title: { ar: 'Level 5 — ICT & Institutional Trading', en: 'Level 5 — ICT & Institutional Method' },
    desc: {
      ar: 'منهجية ICT: أوقات Kill Zones، نماذج OTE، نمط Power of Three، وSilver Bullet.',
      en: 'ICT methodology: Killzones, OTE models, Power of Three (AMD), & Silver Bullet.'
    },
    duration: { ar: '4 أسابيع', en: '4 Weeks' },
    xpReward: 3000,
    skills: { ar: ['Kill Zones', 'Power of 3', 'Silver Bullet'], en: ['Killzones', 'Power of 3', 'Silver Bullet'] },
    status: 'LOCKED',
    progress: 0,
    icon: Target,
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-border'
  },
  {
    id: 'level-6',
    number: 6,
    schoolId: 'sk',
    title: { ar: 'Level 6 — SK System Application', en: 'Level 6 — SK System Application' },
    desc: {
      ar: 'تطبيق نظام SK المتكامل: قواعد الدخول والخروج الصارمة وفلترة الإشارات.',
      en: 'Complete SK system execution: systematic entries, exit triggers, & signal filtering.'
    },
    duration: { ar: '3 أسابيع', en: '3 Weeks' },
    xpReward: 3500,
    skills: { ar: ['نظام SK', 'فلترة الدخول', 'سيناريوهات حقيقية'], en: ['SK System', 'Entry Protocol', 'Filtering'] },
    status: 'LOCKED',
    progress: 0,
    icon: Zap,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-border'
  },
  {
    id: 'level-7',
    number: 7,
    schoolId: 'foundation',
    title: { ar: 'Level 7 — Risk Management Mastery', en: 'Level 7 — Risk Management Mastery' },
    desc: {
      ar: 'إتقان إدارة المخاطر: حساب العقود، احتمالات Ruin، حماية الحساب، وربح المتداول.',
      en: 'Master position sizing, expectancy, max drawdown prevention, & portfolio math.'
    },
    duration: { ar: '3 أسابيع', en: '3 Weeks' },
    xpReward: 4000,
    skills: { ar: ['حجم العقود', 'نسبة R:R', 'منع الخسارة الجسيمة'], en: ['Position Sizing', 'Risk:Reward', 'Drawdown Control'] },
    status: 'LOCKED',
    progress: 0,
    icon: ShieldCheck,
    color: 'from-green-500 to-emerald-600',
    borderColor: 'border-border'
  },
  {
    id: 'level-8',
    number: 8,
    schoolId: 'foundation',
    title: { ar: 'Level 8 — Trading Psychology & Habits', en: 'Level 8 — Trading Psychology' },
    desc: {
      ar: 'الانضباط النفسي، التغلب على Fear & Greed، والتدوين اليومي الصارم في Journal.',
      en: 'Master emotional regulation, discipline habits, & journal-driven performance.'
    },
    duration: { ar: '3 أسابيع', en: '3 Weeks' },
    xpReward: 4500,
    skills: { ar: ['الانضباط النفسي', 'التدوين اليومي', 'إلغاء الانتقام'], en: ['Emotional Mastery', 'Journaling', 'No Overtrading'] },
    status: 'LOCKED',
    progress: 0,
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-border'
  },
  {
    id: 'level-9',
    number: 9,
    schoolId: 'sk',
    title: { ar: 'Level 9 — Professional Trader Path', en: 'Level 9 — Professional Trader Path' },
    desc: {
      ar: 'تصميم النظام الخاص، اختبار 300 صفقة Backtest، والتحضير لتمويل الشركات Prop Firms.',
      en: 'Build your personal strategy, 300-trade backtesting, & Prop Firm evaluation readiness.'
    },
    duration: { ar: '8 أسابيع', en: '8 Weeks' },
    xpReward: 6000,
    skills: { ar: ['Backtest 300 صفقة', 'اجتياز التقييم', 'إدارة محفظة'], en: ['300-Trade Backtest', 'Prop Qualification', 'Portfolio Growth'] },
    status: 'LOCKED',
    progress: 0,
    icon: Award,
    color: 'from-amber-400 to-yellow-600',
    borderColor: 'border-border'
  }
];

const AcademyRoadmap = ({ isRTL = true, onSelectLevel }) => {
  return (
    <div className="relative space-y-6">
      {/* Visual Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {isRTL ? 'خارطة الطريق التعليمية (36 أسبوعاً)' : 'Visual Skill Journey (36 Weeks)'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isRTL ? 'مسار متسلسل ينقلك من البداية حتى الاحتراف المستقل' : 'Continuous competency-based progression from Level 0 to Pro'}
          </p>
        </div>
      </div>

      {/* Levels Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {academyLevels.map((lvl, index) => {
          const Icon = lvl.icon;
          const isCompleted = lvl.status === 'COMPLETED';
          const isInProgress = lvl.status === 'IN_PROGRESS';
          const isLocked = lvl.status === 'LOCKED';

          return (
            <motion.div
              key={lvl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={!isLocked ? { y: -4, scale: 1.01 } : {}}
              onClick={() => !isLocked && onSelectLevel && onSelectLevel(lvl)}
              className={`relative rounded-2xl p-5 border transition-all duration-300 ${
                isInProgress
                  ? 'glass-card border-amber-500/60 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : isCompleted
                  ? 'glass-card border-emerald-500/30 hover:border-emerald-500/60'
                  : 'bg-secondary/30 border-border/60 opacity-75'
              } ${!isLocked ? 'cursor-pointer group' : 'cursor-not-allowed'}`}
            >
              {/* Level Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${lvl.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-amber-500 uppercase tracking-widest">
                      {isRTL ? `المستوى ${lvl.number}` : `Level ${lvl.number}`}
                    </span>
                    <h4 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {lvl.title[isRTL ? 'ar' : 'en'].split('—')[1] || lvl.title[isRTL ? 'ar' : 'en']}
                    </h4>
                  </div>
                </div>

                <div>
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isRTL ? 'مكتمل' : 'Done'}
                    </span>
                  )}
                  {isInProgress && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full animate-pulse">
                      <Play className="w-3 h-3 fill-amber-400" />
                      {isRTL ? 'جاري التعلم' : 'Active'}
                    </span>
                  )}
                  {isLocked && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-background/80 border border-border px-2.5 py-1 rounded-full">
                      <Lock className="w-3 h-3" />
                      {isRTL ? 'مغلق' : 'Locked'}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                {lvl.desc[isRTL ? 'ar' : 'en']}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {lvl.skills[isRTL ? 'ar' : 'en'].map((skill, idx) => (
                  <span key={idx} className="text-[10px] bg-secondary/80 border border-border/80 px-2 py-0.5 rounded text-foreground/80 font-medium">
                    #{skill}
                  </span>
                ))}
              </div>

              {/* Progress & Meta Footer */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {lvl.duration[isRTL ? 'ar' : 'en']}
                  </span>
                  <span className="font-mono text-amber-400 font-bold">
                    +{lvl.xpReward} XP
                  </span>
                </div>

                {!isLocked && (
                  <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold group-hover:translate-x-1 transition-transform">
                    {isRTL ? 'عرض المحتوى' : 'Explore'}
                    <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                  </span>
                )}
              </div>

              {/* Progress Bar for Active Level */}
              {isInProgress && (
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mt-3">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" 
                    style={{ width: `${lvl.progress}%` }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AcademyRoadmap;
