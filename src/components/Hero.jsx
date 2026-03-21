import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Bot, BarChart3, Newspaper, GraduationCap, Shield, TrendingUp } from 'lucide-react';
import shukritradeLogo from '../assets/shukritrade_logo.svg';
import heroImage from '../assets/backgrounds/manus/academey.jpg';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isAr = i18n.language === 'ar';

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
      {/* Background Image for Desktop and Tablet */}
      <div className="hidden md:block absolute inset-0 w-full h-full">
        <img 
          src={heroImage} 
          alt="Shukritrade Trading Platform" 
          className="w-full h-full object-cover opacity-20" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>
      </div>
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#f0bf52]/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"></div>
      
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
            <img 
              src={shukritradeLogo} 
              alt="Shukritrade" 
              className="h-24 sm:h-32 md:h-40 lg:h-48 w-auto object-contain drop-shadow-[0_0_30px_rgba(240,191,82,0.3)] hover:drop-shadow-[0_0_50px_rgba(240,191,82,0.5)] transition-all duration-300" 
            />
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6"
          >
            <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-[#f0bf52]/10 to-[#ac8941]/10 border border-[#f0bf52]/20 text-[#d4a94b] text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
              {isAr ? 'منصة التداول الذكي' : 'Smart Trading Platform'}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight px-2"
          >
            <span className="bg-gradient-to-r from-[#f0bf52] via-[#d4a94b] to-[#ac8941] bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed px-4"
          >
            {t('hero.description')}
          </motion.p>

          {/* Platform Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-sm md:text-base text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed px-4"
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
                className="bg-gradient-to-r from-[#f0bf52] to-[#ac8941] hover:from-[#d4a94b] hover:to-[#9a7a3a] text-black font-bold text-base md:text-lg px-8 md:px-10 py-4 md:py-5 rounded-2xl shadow-2xl hover:shadow-[#f0bf52]/20 transition-all duration-300 hover:scale-105 border-0"
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
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-5xl mx-auto mt-8"
          >
            {features.map((feature, index) => {
              const IconComp = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                  className="group flex flex-col items-center p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f0bf52]/30 hover:bg-[#f0bf52]/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#f0bf52]/15 to-[#ac8941]/15 flex items-center justify-center mb-2 md:mb-3 group-hover:from-[#f0bf52]/25 group-hover:to-[#ac8941]/25 transition-all duration-300">
                    <IconComp className="w-5 h-5 md:w-6 md:h-6 text-[#d4a94b] group-hover:text-[#f0bf52] transition-colors duration-300" />
                  </div>
                  <h3 className="text-white text-[10px] md:text-xs font-bold text-center leading-tight mb-1">{feature.title}</h3>
                  <p className="text-gray-500 text-[8px] md:text-[10px] text-center leading-tight hidden sm:block">{feature.desc}</p>
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
