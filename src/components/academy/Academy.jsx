import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GraduationCap, ChevronLeft, Lightbulb, ArrowLeft, Star, Users, Clock, Award, Zap, Lock } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { stages, tradingTips } from '../../data/academy/academyData';
import { 
  getUserProgress, 
  initializeUserProgress,
  isStageUnlocked,
  getProgressSummary 
} from '../../lib/progressService';
import Header from '../Header';
import Footer from '../Footer';
import ProgressDashboard from './ProgressDashboard';
import academyBg from '../../assets/backgrounds/manus/academey.jpg';

const Academy = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : i18n.language?.startsWith('es') ? 'es' : 'en';
  const isRTL = lang === 'ar';

  const [user, setUser] = useState(null);
  const [dailyTip, setDailyTip] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [userProgress, setUserProgress] = useState(null);
  const [unlockedStages, setUnlockedStages] = useState([]);
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // تهيئة ملف التقدم إن لم يكن موجوداً
          await initializeUserProgress(currentUser.uid, currentUser.displayName || 'Trader', currentUser.email);
          
          // تحميل بيانات التقدم
          const progress = await getUserProgress(currentUser.uid);
          setUserProgress(progress);
          
          // حساب المراحل المفتوحة
          const unlocked = [];
          for (let i = 0; i < stages.length; i++) {
            const isUnlocked = await isStageUnlocked(currentUser.uid, i);
            if (isUnlocked) {
              unlocked.push(i);
            }
          }
          setUnlockedStages(unlocked);
        } catch (error) {
          console.error('Error loading user progress:', error);
        }
      } else {
        setUserProgress(null);
        setUnlockedStages([]);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const allTips = tradingTips[lang] || tradingTips.en;
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % allTips.length;
    setDailyTip(allTips[dayIndex]);
  }, [lang]);

  const heroTexts = {
    en: {
      badge: 'Professional Trading Education',
      title: 'ShukriTrade Academy',
      subtitle: 'Your journey to becoming a professional trader starts here. Learn from 15 comprehensive stages with 178 lessons designed for beginners to advanced traders.',
      stages: 'Learning Stages',
      lessons: 'Total Lessons',
      hours: 'Learning Hours',
      languages: 'Languages',
      tipTitle: 'Tip of the Day',
      filterAll: 'All Levels',
      filterBeginner: 'Beginner',
      filterIntermediate: 'Intermediate',
      filterAdvanced: 'Advanced',
      filterExpert: 'Expert',
      myProgress: 'My Progress',
      locked: 'Locked',
      unlocked: 'Unlocked',
      completed: 'Completed',
      loginToUnlock: 'Login to unlock stages'
    },
    ar: {
      badge: 'تعليم تداول احترافي',
      title: 'أكاديمية ShukriTrade',
      subtitle: 'رحلتك لتصبح متداولاً محترفاً تبدأ من هنا. تعلم من 15 مرحلة شاملة تحتوي على 178 درس مصممة للمبتدئين إلى المتقدمين.',
      stages: 'مراحل التعلم',
      lessons: 'إجمالي الدروس',
      hours: 'ساعات التعلم',
      languages: 'لغات',
      tipTitle: 'نصيحة اليوم',
      filterAll: 'جميع المستويات',
      filterBeginner: 'مبتدئ',
      filterIntermediate: 'متوسط',
      filterAdvanced: 'متقدم',
      filterExpert: 'خبير',
      myProgress: 'تقدمي',
      locked: 'مقفلة',
      unlocked: 'مفتوحة',
      completed: 'مكتملة',
      loginToUnlock: 'سجل الدخول لفتح المراحل'
    },
    fr: {
      badge: 'Formation Trading Professionnelle',
      title: 'ShukriTrade Academy',
      subtitle: 'Votre parcours pour devenir un trader professionnel commence ici. Apprenez de 15 étapes complètes avec 178 leçons.',
      stages: 'Étapes d\'apprentissage',
      lessons: 'Leçons totales',
      hours: 'Heures d\'apprentissage',
      languages: 'Langues',
      tipTitle: 'Conseil du Jour',
      filterAll: 'Tous les niveaux',
      filterBeginner: 'Débutant',
      filterIntermediate: 'Intermédiaire',
      filterAdvanced: 'Avancé',
      filterExpert: 'Expert',
      myProgress: 'Ma Progression',
      locked: 'Verrouillé',
      unlocked: 'Déverrouillé',
      completed: 'Complété',
      loginToUnlock: 'Connectez-vous pour déverrouiller les étapes'
    },
    es: {
      badge: 'Educación de Trading Profesional',
      title: 'ShukriTrade Academy',
      subtitle: 'Tu camino para convertirte en un trader profesional comienza aquí. Aprende de 15 etapas completas con 178 lecciones.',
      stages: 'Etapas de aprendizaje',
      lessons: 'Lecciones totales',
      hours: 'Horas de aprendizaje',
      languages: 'Idiomas',
      tipTitle: 'Consejo del Día',
      filterAll: 'Todos los niveles',
      filterBeginner: 'Principiante',
      filterIntermediate: 'Intermedio',
      filterAdvanced: 'Avanzado',
      filterExpert: 'Experto',
      myProgress: 'Mi Progreso',
      locked: 'Bloqueado',
      unlocked: 'Desbloqueado',
      completed: 'Completado',
      loginToUnlock: 'Inicia sesión para desbloquear etapas'
    }
  };

  const texts = heroTexts[lang] || heroTexts.en;

  // Get stage name based on language
  const getStageName = (stage) => {
    if (lang === 'ar') return stage.name;
    if (lang === 'fr') return stage.nameEn;
    if (lang === 'es') return stage.nameEn;
    return stage.nameEn;
  };

  // Get stage description based on language
  const getStageDescription = (stage) => {
    if (lang === 'ar') return stage.description;
    if (lang === 'fr') return stage.descriptionEn;
    if (lang === 'es') return stage.descriptionEn;
    return stage.descriptionEn;
  };

  // Filter stages by difficulty
  const filteredStages = selectedDifficulty === 'all' 
    ? stages 
    : stages.filter(stage => stage.difficulty === selectedDifficulty);

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'from-green-500 to-emerald-500';
      case 'Intermediate':
        return 'from-blue-500 to-cyan-500';
      case 'Advanced':
        return 'from-purple-500 to-pink-500';
      case 'Expert':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Get difficulty badge color
  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Advanced':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Expert':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const handleStageClick = (stageId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (unlockedStages.includes(stageId)) {
      navigate(`/academy/stage/${stageId}`);
    }
  };

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
                { icon: BookOpen, value: '15', label: texts.stages },
                { icon: Star, value: '178', label: texts.lessons },
                { icon: Clock, value: '160+', label: texts.hours },
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

            {/* Progress Dashboard Button */}
            {user && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => setShowProgressDashboard(!showProgressDashboard)}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
              >
                {showProgressDashboard ? '✕ ' : '📊 '} {texts.myProgress}
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Progress Dashboard */}
      <AnimatePresence>
        {showProgressDashboard && user && (
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-gray-800"
          >
            <ProgressDashboard />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-wrap justify-center gap-3">
          {['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedDifficulty === level
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/50'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
              }`}
            >
              {texts[`filter${level.charAt(0).toUpperCase() + level.slice(1)}`] || level}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Stages Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStages.map((stage, index) => {
            const isUnlocked = unlockedStages.includes(stage.id);
            const isCompleted = userProgress?.stagesStatus[`stage_${stage.id}`]?.isCompleted;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index % 6) }}
                whileHover={isUnlocked ? { y: -8, scale: 1.02 } : {}}
                onClick={() => handleStageClick(stage.id)}
                className={`group ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div className={`relative h-full bg-gray-900/60 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden p-6 ${
                  isUnlocked 
                    ? 'border-gray-800 hover:border-amber-500/40' 
                    : 'border-gray-800/50 opacity-60'
                }`}>
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getDifficultyColor(stage.difficulty)} opacity-0 ${isUnlocked ? 'group-hover:opacity-5' : ''} transition-opacity duration-300`} />
                  
                  {/* Lock Icon */}
                  {!isUnlocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-6 h-6 text-red-500" />
                    </div>
                  )}

                  {/* Completed Badge */}
                  {isCompleted && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                        <span className="text-green-400 text-sm">✓</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Stage number and difficulty */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-amber-500/40">
                      {String(stage.id).padStart(2, '0')}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyBadgeColor(stage.difficulty)}`}>
                      {stage.difficulty}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className={`text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors line-clamp-2 ${
                    isUnlocked ? 'text-white' : 'text-gray-400'
                  }`}>
                    {getStageName(stage)}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${
                    isUnlocked ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {getStageDescription(stage)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {stage.lessonsCount} {lang === 'ar' ? 'درس' : 'lessons'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {stage.estimatedHours}h
                      </span>
                    </div>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-xs text-amber-500 group-hover:translate-x-1 transition-transform">
                        {lang === 'ar' ? 'ابدأ' : 'Start'}
                        <ChevronLeft className={`w-3.5 h-3.5 ${isRTL ? '' : 'rotate-180'}`} />
                      </span>
                    ) : (
                      <span className="text-xs text-red-400">{texts.locked}</span>
                    )}
                  </div>

                  {/* Lock Overlay */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
                      <div className="text-center">
                        <Lock className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-red-400 text-sm font-semibold">{texts.locked}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredStages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {lang === 'ar' ? 'لا توجد مراحل بهذا المستوى' : 'No stages found at this level'}
            </p>
          </div>
        )}
      </section>

      {/* Login Prompt */}
      {!user && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-amber-500/10 to-amber-900/10 rounded-2xl border border-amber-500/20 p-6 sm:p-8 text-center"
          >
            <h3 className="text-lg font-bold text-amber-500 mb-3">
              🔓 {texts.loginToUnlock}
            </h3>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              {lang === 'ar'
                ? 'سجل الدخول الآن لتتمكن من فتح المراحل التعليمية وتتبع تقدمك في رحلتك نحو الاحتراف.'
                : 'Login now to unlock learning stages and track your progress on your journey to mastery.'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
            >
              {lang === 'ar' ? 'سجل الدخول' : 'Login'}
            </motion.button>
          </motion.div>
        </section>
      )}

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
              "{dailyTip}"
            </p>
          </motion.div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Academy;
