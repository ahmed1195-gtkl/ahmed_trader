import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  Globe, 
  Layers, 
  Droplet, 
  Box, 
  Zap, 
  ShieldCheck, 
  Brain, 
  Compass, 
  Target, 
  Sparkles,
  Lock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const skillsData = [
  {
    id: 'market_knowledge',
    icon: Globe,
    color: 'from-blue-500 to-indigo-600',
    title: { ar: 'معرفة الأسواق', en: 'Market Knowledge' },
    level: 4,
    maxLevel: 5,
    xp: 850,
    maxXp: 1000,
    unlockedAbilities: {
      ar: ['فهم هيكلة السيولة الدولية', 'قراءة مفاهيم صانعي السوق'],
      en: ['Global Liquidity Mapping', 'Institutional Order Flow Awareness']
    }
  },
  {
    id: 'technical_analysis',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
    title: { ar: 'التحليل الفني الكلاسيكي', en: 'Technical Analysis' },
    level: 5,
    maxLevel: 5,
    xp: 1000,
    maxXp: 1000,
    unlockedAbilities: {
      ar: ['رسم الهيكل بدقة 100%', 'تحديد القمم والقيعان الرئيسية'],
      en: ['100% Precise Structure Mapping', 'Major Swing Pivot Identification']
    }
  },
  {
    id: 'fundamental_analysis',
    icon: BarChart2,
    color: 'from-amber-500 to-orange-600',
    title: { ar: 'التحليل الاقتصادي والكلي', en: 'Fundamental Analysis' },
    level: 3,
    maxLevel: 5,
    xp: 620,
    maxXp: 1000,
    unlockedAbilities: {
      ar: ['ربط الفائدة بالفوركس والذهب', 'تفسير تقارير NFP و CPI'],
      en: ['Interest Rates & FX Correlation', 'NFP & CPI Release Bias']
    }
  },
  {
    id: 'market_structure',
    icon: Layers,
    color: 'from-purple-500 to-violet-600',
    title: { ar: 'هيكلية السوق (BOS/CHoCH)', en: 'Market Structure' },
    level: 4,
    maxLevel: 5,
    xp: 780,
    maxXp: 1000,
    unlockedAbilities: {
      ar: ['تمييز الكسر الحقيقي عن الوهمي', 'رسم CHoCH على الفريمات الصغرى'],
      en: ['Valid vs False BOS Filtering', 'Lower Timeframe CHoCH Confirmation']
    }
  },
  {
    id: 'liquidity',
    icon: Droplet,
    color: 'from-cyan-500 to-blue-600',
    title: { ar: 'هندسة السيولة (Liquidity)', en: 'Liquidity Engineering' },
    level: 4,
    maxLevel: 5,
    xp: 820,
    maxXp: 1000,
    unlockedAbilities: {
      ar: ['تحديد القمم المتساوية EQH/EQL', 'توقع سحب السيولة قبل الانعكاس'],
      en: ['Equal Highs/Lows Sweeps', 'Premature Liquidity Trap Detection']
    }
  },
  {
    id: 'order_blocks',
    icon: Box,
    color: 'from-fuchsia-500 to-pink-600',
    title: { ar: 'كتل الأوامر (Order Blocks)', en: 'Order Blocks (OB)' },
    level: 3,
    maxLevel: 5,
    xp: 650,
    maxXp: 1000,
    unlockedAbilities: {
      ar: ['فلترة كتل الأوامر القوية', 'دمج OB مع الفجوات السعرية FVG'],
      en: ['High Probability OB Filtering', 'Consequent Encroachment Confluence']
    }
  },
  {
    id: 'ict_concepts',
    icon: Zap,
    color: 'from-rose-500 to-red-600',
    title: { ar: 'مفاهيم ICT وتطبيقاتها', en: 'ICT Concepts' },
    level: 2,
    maxLevel: 5,
    xp: 410,
    maxXp: 1000,
    unlockedAbilities: {
      ar: ['التداول في أوقات Killzones', 'نموذج Silver Bullet Intraday'],
      en: ['Session Killzone Timing', 'Silver Bullet 10-11 AM Window']
    }
  },
  {
    id: 'risk_management',
    icon: ShieldCheck,
    color: 'from-green-500 to-emerald-600',
    title: { ar: 'إدارة المخاطر الاحترافية', en: 'Risk Management' },
    level: 4,
    maxLevel: 5,
    xp: 900,
    maxXp: 1000,
    unlockedAbilities: {
      ar: ['حساب حجم العقود تلقائياً', 'الالتزام بحد خسارة 1% كحد أقصى'],
      en: ['Automated Lot Sizing', 'Strict 1% Max Drawdown Shield']
    }
  },
  {
    id: 'psychology',
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    title: { ar: 'علم النفس والسيطرة النفسية', en: 'Trading Psychology' },
    level: 3,
    maxLevel: 5,
    xp: 590,
    maxXp: 1000,
    unlockedAbilities: {
      ar: ['القضاء على التداول الانتقامي', 'إلغاء الخوف من الخسارة FOMO'],
      en: ['Revenge Trading Elimination', 'Fear of Missing Out Mitigation']
    }
  },
  {
    id: 'discipline',
    icon: Target,
    color: 'from-amber-400 to-yellow-600',
    title: { ar: 'الانضباط والروتين اليومي', en: 'Discipline & Habits' },
    level: 4,
    maxLevel: 5,
    xp: 880,
    maxXp: 1000,
    unlockedAbilities: {
      ar: ['تدوين 100% من الصفقات في Journal', 'الالتزام بقائمة التحقق Pre-Trade'],
      en: ['100% Trade Journaling Habit', 'Mandatory Pre-Trade Checklist']
    }
  },
  {
    id: 'execution',
    icon: Compass,
    color: 'from-sky-500 to-indigo-600',
    title: { ar: 'التنفيذ وإستراتيجية العمل', en: 'Execution Excellence' },
    level: 3,
    maxLevel: 5,
    xp: 610,
    maxXp: 1000,
    unlockedAbilities: {
      ar: ['أوامر Limit بدقة عالية', 'اختبار تاريخي لـ 300 صفقة'],
      en: ['Precision Limit Execution', '300-Trade Backtest Validation']
    }
  }
];

const SkillTreeWidget = ({ isRTL = true }) => {
  const [selectedSkill, setSelectedSkill] = useState(skillsData[0]);

  return (
    <div className="glass-card border border-border/80 rounded-2xl p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {isRTL ? 'شجرة المهارات التداولية' : 'Trading Skill Tree'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'تتبع نمو قدراتك التحليلية والنفسية تلقائياً' : 'Track your analytical & behavioral competencies'}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
          11 {isRTL ? 'مهارة تخصصية' : 'Skills'}
        </span>
      </div>

      {/* Grid Layout: Left Node Selector / Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Nodes Matrix */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {skillsData.map((skill) => {
            const Icon = skill.icon;
            const isSelected = selectedSkill.id === skill.id;
            const progressPercent = Math.round((skill.xp / skill.maxXp) * 100);
            const isMastered = skill.level === skill.maxLevel;

            return (
              <motion.button
                key={skill.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSkill(skill)}
                className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-secondary/40 border-border hover:border-amber-500/30'
                }`}
              >
                {/* Node Top Header */}
                <div className="flex items-center justify-between w-full">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isMastered 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-background text-muted-foreground border border-border'
                  }`}>
                    {isMastered ? (isRTL ? 'مكتمل' : 'MAX') : `Lvl ${skill.level}`}
                  </span>
                </div>

                {/* Node Title */}
                <div className="my-1">
                  <p className="text-xs font-bold text-foreground line-clamp-1 leading-snug">
                    {skill.title[isRTL ? 'ar' : 'en']}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full">
                  <div className="flex justify-between text-[9px] text-muted-foreground font-mono mb-1">
                    <span>{progressPercent}%</span>
                    <span>{skill.xp} XP</span>
                  </div>
                  <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-500`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Node Active Details Panel */}
        <div className="lg:col-span-5 bg-secondary/30 rounded-xl border border-border p-5 relative overflow-hidden">
          <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-40 h-40 bg-gradient-to-br ${selectedSkill.color} opacity-10 rounded-full blur-2xl`} />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedSkill.color} flex items-center justify-center shadow-lg`}>
                <selectedSkill.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground">
                  {selectedSkill.title[isRTL ? 'ar' : 'en']}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono text-amber-500 font-bold">
                     المستوى {selectedSkill.level} / {selectedSkill.maxLevel}
                  </span>
                  <span className="text-xs text-muted-foreground">• {selectedSkill.xp} XP</span>
                </div>
              </div>
            </div>

            {/* Unlocked Abilities List */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {isRTL ? 'القدرات المكتسبة والافتراضية:' : 'Unlocked Capabilities:'}
              </p>
              <div className="space-y-2">
                {selectedSkill.unlockedAbilities[isRTL ? 'ar' : 'en'].map((ability, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-foreground bg-background/60 p-2.5 rounded-lg border border-border">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{ability}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Unlock Requirements */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {isRTL ? 'المستوى القادم يتطلب:' : 'Next Tier Requires:'}
              </span>
              <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                +{selectedSkill.maxXp - selectedSkill.xp} XP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTreeWidget;
