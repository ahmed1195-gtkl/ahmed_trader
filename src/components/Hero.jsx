import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Bot, BarChart3, Newspaper, GraduationCap, Shield, TrendingUp } from 'lucide-react';
import shukritradeLogo from '../assets/shukritrade_logo.svg';
import { useSEO } from '../hooks/useSEO';

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
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  const features = [
    {
      icon: Bot,
      title: isAr ? 'بوت تداول ذكي' : 'AI Trading Bot',
      desc: isAr ? 'تحليل فوري بالذكاء الاصطناعي' : 'Real-time AI analysis',
    },
    {
      icon: BarChart3,
      title: isAr ? 'تحليلات متقدمة' : 'Advanced Analytics',
      desc: isAr ? 'رسوم بيانية وتدفق الطلبات' : 'Charts & Order Flow',
    },
    {
      icon: Newspaper,
      title: isAr ? 'أخبار السوق' : 'Market News',
      desc: isAr ? 'أخبار لحظية تؤثر على السوق' : 'Real-time market news',
    },
    {
      icon: GraduationCap,
      title: isAr ? 'دورات تعليمية' : 'Trading Courses',
      desc: isAr ? 'تعلم التداول من الصفر' : 'Learn trading from scratch',
    },
    {
      icon: Shield,
      title: isAr ? 'إدارة المخاطر' : 'Risk Management',
      desc: isAr ? 'حماية رأس مالك بذكاء' : 'Smart capital protection',
    },
    {
      icon: TrendingUp,
      title: isAr ? 'إشارات تداول' : 'Trading Signals',
      desc: isAr ? 'توصيات دقيقة بنسبة ثقة عالية' : 'High-confidence signals',
    },
  ];

  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden py-16 md:py-24">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <img src={shukritradeLogo} 
              alt="Shukritrade" 
              className="h-16 sm:h-20 md:h-28 lg:h-32 w-auto object-contain drop-shadow-[0_0_30px_var(--gold-shadow)]" 
              decoding="async" />
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6"
          >
            <span className="inline-block px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-black uppercase tracking-[0.2em]">
              {isAr ? 'منصة التداول الذكي' : 'Smart Trading Platform'}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight tracking-tight uppercase px-2 text-wrap-balance"
          >
            {t('hero.title')}
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed px-4 text-wrap-pretty"
          >
            {t('hero.description')}
          </motion.p>

          {/* Platform Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-sm md:text-base text-muted-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed px-4 text-wrap-pretty"
          >
            {isAr 
              ? 'Shukritrade هي منصتك الشاملة للتداول في الفوركس والعملات الرقمية. نوفر لك بوت تداول بالذكاء الاصطناعي، تحليلات متقدمة، أخبار السوق اللحظية، ودورات تعليمية احترافية لمساعدتك على تحقيق أرباح مستدامة.'
              : 'Shukritrade is your all-in-one platform for Forex and Crypto trading. We provide AI-powered trading bots, advanced analytics, real-time market news, and professional courses to help you achieve sustainable profits.'
            }
          </motion.p>

          {/* CTA Button */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-14"
            >
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-primary text-primary-foreground hover:brightness-110 font-black text-xs md:text-sm uppercase tracking-widest px-8 md:px-10 py-4 md:py-5 rounded-md shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 border-0 cursor-pointer"
              >
                {t('hero.cta')}
              </Button>
            </motion.div>
          )}

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-3 md:gap-4 max-w-5xl mx-auto mt-8"
          >
            {features.map((feature, index) => {
              const IconComp = feature.icon;
              const isFeatured = index === 0 || index === 5;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                  className={`glass-card glass-card-hover group flex flex-col items-center p-3 md:p-4 rounded-md relative ${
                    isFeatured 
                      ? 'border-primary/30 bg-primary/5 shadow-md shadow-gold-glow lg:col-span-2 lg:flex-row lg:items-center lg:gap-4 lg:text-left lg:p-5' 
                      : 'border-border'
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </div>
                  )}
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center mb-2 md:mb-3 transition-all duration-300 ${
                    isFeatured 
                      ? 'bg-primary/20 text-primary group-hover:bg-primary/30 lg:mb-0 shrink-0' 
                      : 'bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 shrink-0'
                  }`}>
                    <IconComp className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className={isFeatured ? 'lg:flex lg:flex-col' : ''}>
                    <h3 className="text-foreground text-[10px] md:text-xs font-black uppercase tracking-wider leading-tight mb-1 text-center lg:text-left">{feature.title}</h3>
                    <p className="text-muted-foreground text-[8px] md:text-[10px] leading-tight hidden sm:block text-center lg:text-left">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
