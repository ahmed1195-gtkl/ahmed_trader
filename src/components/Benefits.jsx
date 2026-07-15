import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  CheckCircle, TrendingUp, Users, Bot, Shield, GraduationCap,
  BarChart3, BookOpen, Trophy, Star, Quote
} from 'lucide-react';

/* ─────────────── Section header ─────────────── */
function SectionHeader({ badge, title, sub, titleHighlight }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center mb-14"
    >
      {badge && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-5">
          {badge}
        </div>
      )}
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foreground mb-4 leading-tight tracking-tight">
        {titleHighlight ? (
          <>
            {title}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-primary to-amber-500">
              {titleHighlight}
            </span>
          </>
        ) : title}
      </h2>
      {sub && <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">{sub}</p>}
      <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 rounded-full" />
    </motion.div>
  );
}

/* ─────────────── Feature card ─────────────── */
function FeatureCard({ icon: Icon, title, desc, featured, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className={`h-full p-6 md:p-7 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
        featured
          ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/10'
          : 'bg-white/[0.02] border-white/[0.07] hover:border-primary/20 hover:bg-white/[0.04]'
      }`}>
        {featured && (
          <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest shadow-md shadow-primary/30">
            ⭐ Most Popular
          </div>
        )}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
          featured
            ? 'bg-primary/20 text-primary'
            : 'bg-white/[0.05] text-muted-foreground/70 group-hover:bg-primary/10 group-hover:text-primary'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-sm md:text-base font-black text-foreground uppercase tracking-wide mb-2">{title}</h3>
        <p className="text-muted-foreground/70 text-xs md:text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────── Testimonial card ─────────────── */
function TestimonialCard({ name, role, text, rating, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-primary/20 hover:bg-white/[0.05] transition-all duration-300 group"
    >
      <Quote className="w-6 h-6 text-primary/30 mb-3" />
      <p className="text-muted-foreground/80 text-sm leading-relaxed mb-5 italic">"{text}"</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-primary font-black text-sm">{name[0]}</span>
          </div>
          <div>
            <p className="text-foreground font-bold text-xs">{name}</p>
            <p className="text-muted-foreground/50 text-[10px]">{role}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────── Main Benefits Component ─────────────── */
const Benefits = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const features = [
    {
      icon: CheckCircle,
      title: isAr ? 'تعلم من الصفر' : 'Learn from Zero',
      desc: isAr
        ? 'اتقن أساسيات الفوركس والعملات الرقمية بطريقة مبسطة ومنهجية.'
        : 'Master Forex and Crypto fundamentals with our simplified, structured approach.',
    },
    {
      icon: Bot,
      title: isAr ? 'بوت تداول ذكي' : 'AI Trading Bot',
      desc: isAr
        ? 'تحليل آني بالذكاء الاصطناعي، إشارات دقيقة، وتوصيات متكاملة مع Entry و SL و TP.'
        : 'Real-time AI analysis, precise signals with full Entry, SL & TP recommendations.',
      featured: true,
    },
    {
      icon: Users,
      title: isAr ? 'مجتمع نشط' : 'Active Community',
      desc: isAr
        ? 'انضم لمجتمعنا وتواصل مع آلاف المتداولين واحصل على دعم مستمر.'
        : 'Join thousands of traders, share strategies, and get continuous support.',
    },
    {
      icon: GraduationCap,
      title: isAr ? 'أكاديمية احترافية' : 'Pro Academy',
      desc: isAr
        ? '57+ درس احترافي تغطي 5 مدارس تداول كاملة مع اختبارات تفاعلية وشهادات.'
        : '57+ professional lessons across 5 trading schools with interactive tests and certificates.',
    },
    {
      icon: Shield,
      title: isAr ? 'إدارة المخاطر' : 'Risk Management',
      desc: isAr
        ? 'حاسبة الحجم الذكية، نصائح حماية رأس المال، وإستراتيجيات التداول الآمن.'
        : 'Smart position size calculator, capital protection tips, and safe trading strategies.',
    },
    {
      icon: Trophy,
      title: isAr ? 'تحديات تنافسية' : 'Trading Challenges',
      desc: isAr
        ? 'تنافس مع أفضل المتداولين في تحديات افتراضية وتصعّد على لوحة المتصدرين.'
        : 'Compete in virtual trading challenges and climb the global leaderboard.',
    },
  ];

  const testimonials = isAr
    ? [
        { name: 'أحمد المحمود', role: 'متداول فوركس منذ 2 سنوات', text: 'أفضل منصة عربية للتداول رأيتها. الأكاديمية غيّرت طريقة تفكيري في السوق تماماً.', rating: 5 },
        { name: 'سارة الخالد', role: 'مبتدئة في العملات الرقمية', text: 'بدأت من الصفر وخلال شهر واحد فهمت كيف تعمل الأسواق. شكراً Shukritrade!', rating: 5 },
        { name: 'محمد الراشد', role: 'متداول محترف', text: 'بوت الذكاء الاصطناعي مدهش، والتحليلات دقيقة جداً. أنصح به بشدة لكل متداول جاد.', rating: 5 },
      ]
    : [
        { name: 'Ahmed M.', role: 'Forex Trader, 2 Years', text: "Best Arab trading platform I've seen. The academy completely changed how I approach the market.", rating: 5 },
        { name: 'Sara K.', role: 'Crypto Beginner', text: 'Started from zero and within a month I understood how markets work. Thank you Shukritrade!', rating: 5 },
        { name: 'Mohammed R.', role: 'Professional Trader', text: 'The AI bot is impressive and the analysis is very accurate. I highly recommend it to every serious trader.', rating: 5 },
      ];

  return (
    <>
      {/* ── Features Section ── */}
      <section className="py-16 md:py-24 relative" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/2 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <SectionHeader
            badge={isAr ? '✨ مميزات المنصة' : '✨ Platform Features'}
            title={isAr ? 'لماذا تختار' : 'Why Choose'}
            titleHighlight={isAr ? 'Shukritrade؟' : 'Shukritrade?'}
            sub={isAr
              ? 'كل ما تحتاجه لتصبح متداولاً محترفاً في مكان واحد'
              : 'Everything you need to become a professional trader, all in one place'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className="py-16 md:py-20 relative" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <SectionHeader
            badge={isAr ? '💬 آراء المتداولين' : '💬 Trader Reviews'}
            title={isAr ? 'يثق بنا' : 'Trusted by'}
            titleHighlight={isAr ? 'آلاف المتداولين' : 'Thousands of Traders'}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} index={i} />
            ))}
          </div>

          {/* Aggregate star rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-foreground font-black text-lg">4.9 / 5.0</p>
            <span className="text-muted-foreground/50 text-sm hidden sm:block">·</span>
            <p className="text-muted-foreground/60 text-sm">
              {isAr ? 'بناءً على آراء 2,400+ مستخدم' : 'Based on 2,400+ user reviews'}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Benefits;
