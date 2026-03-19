import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Target, Zap, BookOpen, GraduationCap, ChevronLeft, Lightbulb, ArrowLeft, Star, Users, Clock, Award } from 'lucide-react';
import { schools } from '../../data/academy/academyData';
import { tradingTips } from '../../data/academy/schoolsData';
import Header from '../Header';
import Footer from '../Footer';
import academyBg from '../../assets/backgrounds/manus/academey.jpg';

const iconMap = { BarChart3, Brain, Target, Zap };

const schoolTranslations = {
  classical: {
    en: { name: 'Classical Technical Analysis', desc: 'Master the foundations of technical analysis including trends, support & resistance, chart patterns, and candlestick analysis.' },
    ar: { name: 'التحليل الفني الكلاسيكي', desc: 'أتقن أساسيات التحليل الفني بما في ذلك الاتجاهات والدعم والمقاومة وأنماط الشارت وتحليل الشموع.' },
    fr: { name: 'Analyse Technique Classique', desc: 'Maîtrisez les fondamentaux de l\'analyse technique.' },
    es: { name: 'Análisis Técnico Clásico', desc: 'Domina los fundamentos del análisis técnico.' }
  },
  smc: {
    en: { name: 'Smart Money Concepts', desc: 'Learn how institutional traders move the market. Understand liquidity, order blocks, and fair value gaps.' },
    ar: { name: 'مفاهيم المال الذكي', desc: 'تعلم كيف يحرك المتداولون المؤسسيون السوق. افهم السيولة وكتل الأوامر وفجوات القيمة العادلة.' },
    fr: { name: 'Smart Money Concepts', desc: 'Apprenez comment les institutions bougent le marché.' },
    es: { name: 'Smart Money Concepts', desc: 'Aprende cómo las instituciones mueven el mercado.' }
  },
  ict: {
    en: { name: 'ICT Trading Method', desc: 'Master the Inner Circle Trader methodology including kill zones, liquidity sweeps, and institutional entry models.' },
    ar: { name: 'منهجية ICT للتداول', desc: 'أتقن منهجية ICT بما في ذلك مناطق القتل واكتساح السيولة ونماذج الدخول المؤسسي.' },
    fr: { name: 'Méthode ICT', desc: 'Maîtrisez la méthodologie ICT.' },
    es: { name: 'Método ICT', desc: 'Domina la metodología ICT.' }
  },
  sk: {
    en: { name: 'SK System', desc: 'A complete proprietary trading system combining the best of SMC and ICT with strict risk management rules.' },
    ar: { name: 'نظام SK', desc: 'نظام تداول متكامل يجمع أفضل ما في SMC و ICT مع قواعد صارمة لإدارة المخاطر.' },
    fr: { name: 'Système SK', desc: 'Un système de trading complet combinant SMC et ICT.' },
    es: { name: 'Sistema SK', desc: 'Un sistema completo que combina SMC e ICT.' }
  }
};

const Academy = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : i18n.language?.startsWith('es') ? 'es' : 'en';
  const isRTL = lang === 'ar';

  const [dailyTip, setDailyTip] = useState(null);

  useEffect(() => {
    const allTips = tradingTips;
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % allTips.length;
    setDailyTip(allTips[dayIndex]);
  }, []);

  const heroTexts = {
    en: {
      badge: 'Professional Trading Education',
      title: 'ShukriTrade Academy',
      subtitle: 'Your journey to becoming a professional trader starts here. Learn from structured courses designed for beginners to advanced traders.',
      schools: 'Trading Schools',
      lessons: 'Lessons',
      languages: 'Languages',
      tipTitle: 'Tip of the Day'
    },
    ar: {
      badge: 'تعليم تداول احترافي',
      title: 'أكاديمية ShukriTrade',
      subtitle: 'رحلتك لتصبح متداولاً محترفاً تبدأ من هنا. تعلم من دورات منظمة مصممة من المبتدئين إلى المتقدمين.',
      schools: 'مدارس تداول',
      lessons: 'درس',
      languages: 'لغات',
      tipTitle: 'نصيحة اليوم'
    },
    fr: {
      badge: 'Formation Trading Professionnelle',
      title: 'ShukriTrade Academy',
      subtitle: 'Votre parcours pour devenir un trader professionnel commence ici.',
      schools: 'Écoles de Trading',
      lessons: 'Leçons',
      languages: 'Langues',
      tipTitle: 'Conseil du Jour'
    },
    es: {
      badge: 'Educación de Trading Profesional',
      title: 'ShukriTrade Academy',
      subtitle: 'Tu camino para convertirte en un trader profesional comienza aquí.',
      schools: 'Escuelas de Trading',
      lessons: 'Lecciones',
      languages: 'Idiomas',
      tipTitle: 'Consejo del Día'
    }
  };

  const texts = heroTexts[lang] || heroTexts.en;

  return (
    <div className={`min-h-screen bg-black text-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden" style={{
        backgroundImage: `url(${academyBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 via-black/50 to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className={`absolute top-4 ${isRTL ? 'right-4 sm:right-6' : 'left-4 sm:left-6'} flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors`}
          >
            {isRTL ? <ChevronLeft className="w-5 h-5 rotate-180" /> : <ArrowLeft className="w-5 h-5" />}
            <span className="text-sm">{isRTL ? 'الرئيسية' : 'Home'}</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              {texts.badge}
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                {texts.title}
              </span>
            </h1>

            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
              {texts.subtitle}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12">
              {[
                { icon: BookOpen, value: '4', label: texts.schools },
                { icon: Star, value: '49+', label: texts.lessons },
                { icon: Users, value: '4', label: texts.languages },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Schools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {schools.map((school, index) => {
            const Icon = iconMap[school.icon] || BookOpen;
            const schoolText = schoolTranslations[school.id]?.[lang] || schoolTranslations[school.id]?.en;
            
            return (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(`/academy/${school.id}`)}
                className="cursor-pointer group"
              >
                <div className="relative h-full bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden p-6">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${school.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${school.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {schoolText?.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {schoolText?.desc}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <BookOpen className="w-3.5 h-3.5" />
                      {school.lessons} {lang === 'ar' ? 'درس' : 'lessons'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-amber-500 group-hover:translate-x-1 transition-transform">
                      {lang === 'ar' ? 'ابدأ التعلم' : 'Start Learning'}
                      <ChevronLeft className={`w-3.5 h-3.5 ${isRTL ? '' : 'rotate-180'}`} />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tip of the Day */}
      {dailyTip && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative bg-gradient-to-br from-amber-500/10 to-amber-900/10 rounded-2xl border border-amber-500/20 p-6 sm:p-8"
          >
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <Lightbulb className="w-8 h-8 text-amber-500 opacity-50" />
            </div>
            <h3 className="text-lg font-bold text-amber-500 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {texts.tipTitle}
            </h3>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed italic">
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
