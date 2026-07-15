import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useSEO } from '../hooks/useSEO';
import {
  ArrowRight, Bot, GraduationCap, TrendingUp, Shield,
  BarChart3, ChevronRight, Users, BookOpen, Star, Zap
} from 'lucide-react';
import logoImg from '../assets/logo.png';

/* ─────────────────── Animated Counter ─────────────────── */
function AnimatedCounter({ to, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setCount(Math.floor((to * current) / steps));
      if (current >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

/* ─────────────────── Floating orb background ─────────────────── */
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/6 rounded-full blur-[120px]" />
      {/* Top-left accent */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-5%] left-[10%] w-[300px] h-[300px] bg-amber-500/4 rounded-full blur-[80px]"
      />
      {/* Bottom-right accent */}
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] bg-primary/5 rounded-full blur-[70px]"
      />
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

/* ─────────────────── Feature pill ─────────────────── */
function FeaturePill({ icon: Icon, label, isRTL }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-muted-foreground/70 hover:text-primary hover:border-primary/30 transition-all duration-300 text-[11px] font-semibold tracking-wide cursor-default"
    >
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span>{label}</span>
    </motion.div>
  );
}

/* ─────────────────── Stat card ─────────────────── */
function StatCard({ value, suffix, label, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center p-4 md:p-5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-primary/20 hover:bg-white/[0.05] transition-all duration-300 group"
    >
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="text-xl md:text-2xl font-black text-foreground tabular-nums">
        <AnimatedCounter to={value} suffix={suffix} duration={1800} />
      </div>
      <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wider mt-0.5 text-center">{label}</p>
    </motion.div>
  );
}

/* ─────────────────── Main Hero ─────────────────── */
const Hero = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isAr = i18n.language === 'ar';

  useSEO({
    title: isAr ? 'منصة التداول والتعليم الذكي' : 'Smart Trading & Education Platform',
    description: isAr
      ? 'تعلم الفوركس والعملات الرقمية، بوت التداول الذكي، التوصيات والتحليلات مجاناً مع Shukritrade.'
      : 'Master the Forex & Crypto markets with AI-driven insights, real-time market news, professional courses, and live trading challenges.',
    canonicalPath: '/',
    ogType: 'website'
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const features = [
    { icon: Bot, label: isAr ? 'بوت تداول AI' : 'AI Trading Bot' },
    { icon: GraduationCap, label: isAr ? 'أكاديمية احترافية' : 'Pro Academy' },
    { icon: TrendingUp, label: isAr ? 'إشارات تداول' : 'Live Signals' },
    { icon: Shield, label: isAr ? 'إدارة المخاطر' : 'Risk Management' },
    { icon: BarChart3, label: isAr ? 'تحليلات متقدمة' : 'Market Analytics' },
    { icon: BookOpen, label: isAr ? 'مكتبة ضخمة' : 'Rich Library' },
  ];

  const stats = [
    { value: 12000, suffix: '+', label: isAr ? 'متداول نشط' : 'Active Traders', icon: Users, delay: 0.8 },
    { value: 57, suffix: '+', label: isAr ? 'درس احترافي' : 'Pro Lessons', icon: BookOpen, delay: 0.9 },
    { value: 95, suffix: '%', label: isAr ? 'رضا المتداولين' : 'Satisfaction Rate', icon: Star, delay: 1.0 },
    { value: 24, suffix: '/7', label: isAr ? 'دعم فوري' : 'Live Support', icon: Zap, delay: 1.1 },
  ];

  return (
    <section
      className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden py-20 md:py-28"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <HeroBackground />

      <div className="relative z-20 container mx-auto px-4 text-center max-w-5xl">

        {/* ── Logo ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150 animate-pulse" />
            <img
              src={logoImg}
              alt="Shukritrade"
              className="relative h-20 sm:h-24 md:h-32 w-auto object-contain drop-shadow-[0_0_40px_rgba(245,185,50,0.25)]"
              loading="eager"
              decoding="async"
            />
          </div>
        </motion.div>

        {/* ── Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-black uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {isAr ? '🏆 منصة التداول العربية الأولى' : '🏆 #1 Arab Trading Platform'}
          </div>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.05] tracking-tight mb-5"
        >
          {isAr ? (
            <>
              تداول بذكاء{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-primary to-amber-500">
                احترافي
              </span>
            </>
          ) : (
            <>
              Trade with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-primary to-amber-500">
                Pro Intelligence
              </span>
            </>
          )}
        </motion.h1>

        {/* ── Sub-headline ── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8 px-4"
        >
          {isAr
            ? 'منصتك الشاملة للتداول في الفوركس والعملات الرقمية — بوت ذكاء اصطناعي، أكاديمية احترافية، إشارات حية، وتحديات تداول تنافسية.'
            : 'Your all-in-one Forex & Crypto trading ecosystem — AI bot, pro academy, live signals, and competitive trading challenges.'}
        </motion.p>

        {/* ── CTA Buttons ── */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            {/* Primary CTA */}
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth')}
              className="relative group w-full sm:w-auto px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest overflow-hidden text-primary-foreground cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-primary to-amber-500 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-primary to-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={{ translateX: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
              />
              <span className="relative flex items-center justify-center gap-2">
                {isAr ? 'ابدأ مجاناً الآن' : 'Start Free Now'}
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/academy')}
              className="group w-full sm:w-auto px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest border border-primary/25 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              {isAr ? 'استكشف الأكاديمية' : 'Explore Academy'}
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </motion.div>
        )}

        {/* ── Feature Pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {features.map((f, i) => (
            <FeaturePill key={i} icon={f.icon} label={f.label} isRTL={isAr} />
          ))}
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
        >
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </motion.div>

        {/* ── Social Proof Trust Strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="flex items-center justify-center gap-4 mt-8 flex-wrap"
        >
          {[
            isAr ? '🔒 بيانات مشفرة' : '🔒 Encrypted Data',
            isAr ? '✅ Firebase Auth' : '✅ Firebase Auth',
            isAr ? '⚡ 99.9% تشغيل' : '⚡ 99.9% Uptime',
          ].map((badge, i) => (
            <span key={i} className="text-[10px] font-bold text-muted-foreground/35 uppercase tracking-wider">
              {badge}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
