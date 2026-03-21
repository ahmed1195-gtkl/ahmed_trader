import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  BookOpen, 
  Target, 
  Zap,
  CheckCircle,
  Lock,
  Star,
  Trophy,
  Flame
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { 
  getUserProgress, 
  getProgressSummary,
  calculateOverallProgress,
  getUnlockedStages 
} from '../../lib/progressService';

const ProgressDashboard = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  const isRTL = lang === 'ar';

  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadProgressData(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadProgressData = async (userId) => {
    try {
      setLoading(true);
      const progressData = await getUserProgress(userId);
      const summaryData = await getProgressSummary(userId);

      setProgress(progressData);
      setSummary(summaryData);
      setError(null);
    } catch (err) {
      console.error('Error loading progress:', err);
      setError('فشل تحميل بيانات التقدم');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={`text-center py-12 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <p className="text-gray-400">
          {lang === 'ar' ? 'يرجى تسجيل الدخول لعرض التقدم' : 'Please login to view your progress'}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className={`text-center py-12 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <p className="text-red-400">{error || 'حدث خطأ في تحميل البيانات'}</p>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress(progress);
  const unlockedStages = getUnlockedStages(progress);

  const texts = {
    ar: {
      myProgress: 'تقدمي',
      overallProgress: 'التقدم الإجمالي',
      completedStages: 'المراحل المكتملة',
      completedLessons: 'الدروس المكتملة',
      totalPoints: 'النقاط الإجمالية',
      achievements: 'الإنجازات',
      badges: 'الأوسمة',
      timeSpent: 'الوقت المستغرق',
      passRate: 'نسبة النجاح',
      unlockedStages: 'المراحل المفتوحة',
      nextMilestone: 'الهدف التالي',
      keepGoing: 'استمر في التقدم!',
      minutes: 'دقيقة',
      hours: 'ساعة'
    },
    en: {
      myProgress: 'My Progress',
      overallProgress: 'Overall Progress',
      completedStages: 'Completed Stages',
      completedLessons: 'Completed Lessons',
      totalPoints: 'Total Points',
      achievements: 'Achievements',
      badges: 'Badges',
      timeSpent: 'Time Spent',
      passRate: 'Pass Rate',
      unlockedStages: 'Unlocked Stages',
      nextMilestone: 'Next Milestone',
      keepGoing: 'Keep Going!',
      minutes: 'minutes',
      hours: 'hours'
    }
  };

  const currentTexts = texts[lang] || texts.en;

  // تنسيق الوقت
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} ${currentTexts.minutes}`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // حساب الهدف التالي
  const nextMilestone = Math.ceil((summary.completedStages + 1) / 5) * 5;
  const milestonesRemaining = nextMilestone - summary.completedStages;

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* رأس لوحة التقدم */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-amber-500" />
          {currentTexts.myProgress}
        </h2>
        <div className="text-right">
          <p className="text-gray-400 text-sm">{summary.userName}</p>
          <p className="text-amber-500 font-bold">{summary.totalPoints} نقطة</p>
        </div>
      </div>

      {/* شريط التقدم الرئيسي */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{currentTexts.overallProgress}</h3>
          <span className="text-2xl font-bold text-amber-500">{overallProgress}%</span>
        </div>

        {/* شريط التقدم */}
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
          />
        </div>

        {/* تفاصيل التقدم */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { icon: CheckCircle, label: currentTexts.completedStages, value: summary.completedStages, max: summary.totalStages },
            { icon: BookOpen, label: currentTexts.completedLessons, value: summary.completedLessons, max: summary.totalLessons },
            { icon: Trophy, label: currentTexts.achievements, value: summary.achievements, max: '∞' },
            { icon: Star, label: currentTexts.badges, value: summary.badges, max: '∞' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4 text-center">
              <item.icon className="w-5 h-5 text-amber-500 mx-auto mb-2" />
              <p className="text-gray-400 text-xs mb-1">{item.label}</p>
              <p className="text-xl font-bold text-white">
                {item.value}{typeof item.max === 'number' ? `/${item.max}` : ''}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* شبكة الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* الوقت المستغرق */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl border border-blue-700/30 p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white">{currentTexts.timeSpent}</h4>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {formatTime(summary.stats.totalTimeSpent)}
          </p>
        </motion.div>

        {/* نسبة النجاح */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl border border-green-700/30 p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-white">{currentTexts.passRate}</h4>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {summary.stats.passRate}%
          </p>
        </motion.div>
      </div>

      {/* المراحل المفتوحة */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl border border-purple-700/30 p-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <Flame className="w-5 h-5 text-purple-400" />
          <h4 className="font-semibold text-white">{currentTexts.unlockedStages}</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {unlockedStages.map((stageId) => (
            <span key={stageId} className="px-3 py-1 bg-purple-600/50 text-purple-200 rounded-full text-sm">
              {lang === 'ar' ? `المرحلة ${stageId}` : `Stage ${stageId}`}
            </span>
          ))}
        </div>
      </motion.div>

      {/* الهدف التالي */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-xl border border-amber-700/30 p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white mb-2">{currentTexts.nextMilestone}</h4>
            <p className="text-amber-400">
              {lang === 'ar' 
                ? `أكمل ${milestonesRemaining} مراحل أخرى للوصول إلى الهدف ${nextMilestone}`
                : `Complete ${milestonesRemaining} more stages to reach milestone ${nextMilestone}`
              }
            </p>
          </div>
          <Target className="w-8 h-8 text-amber-500" />
        </div>
      </motion.div>

      {/* رسالة التشجيع */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30 p-4 text-center"
      >
        <p className="text-amber-300 font-semibold">
          🎯 {currentTexts.keepGoing}
        </p>
        <p className="text-gray-300 text-sm mt-1">
          {lang === 'ar'
            ? 'أنت تحرز تقدماً رائعاً! استمر في تعلم الدروس وأكمل الاختبارات لفتح المراحل الجديدة.'
            : 'You\'re making great progress! Keep learning and complete exams to unlock new stages.'
          }
        </p>
      </motion.div>
    </div>
  );
};

export default ProgressDashboard;
