import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Lock, CheckCircle, Star, Clock, Target } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '../Header';
import Footer from '../Footer';
import academyBg from '../../assets/backgrounds/manus/academey.jpg';

// استيراد بيانات المراحل
import { stage0Lessons } from '../../data/academy/stage0Lessons';
import { stage1Lessons } from '../../data/academy/stage1Lessons';
import { stage2Lessons } from '../../data/academy/stage2Lessons';
import { stage3Lessons } from '../../data/academy/stage3Lessons';
import { stage4Lessons } from '../../data/academy/stage4Lessons';
import { stage5Lessons } from '../../data/academy/stage5Lessons';
import { stage6Lessons } from '../../data/academy/stage6Lessons';
import { stage7Lessons } from '../../data/academy/stage7Lessons';
import { stage8Lessons } from '../../data/academy/stage8Lessons';
import { stage9Lessons } from '../../data/academy/stage9Lessons';
import { stage10Lessons } from '../../data/academy/stage10Lessons';
import { stage11Lessons } from '../../data/academy/stage11Lessons';
import { stage12Lessons } from '../../data/academy/stage12Lessons';
import { stage13Lessons } from '../../data/academy/stage13Lessons';
import { stage14Lessons } from '../../data/academy/stage14Lessons';
import { stage15Lessons } from '../../data/academy/stage15Lessons';

const allStagesLessons = [
  stage0Lessons,
  stage1Lessons,
  stage2Lessons,
  stage3Lessons,
  stage4Lessons,
  stage5Lessons,
  stage6Lessons,
  stage7Lessons,
  stage8Lessons,
  stage9Lessons,
  stage10Lessons,
  stage11Lessons,
  stage12Lessons,
  stage13Lessons,
  stage14Lessons,
  stage15Lessons
];

const stageInfo = [
  { title: 'Mental Preparation', titleAr: 'التهيئة الذهنية', difficulty: 'Beginner' },
  { title: 'Basic Technical Analysis', titleAr: 'التحليل الفني الأساسي', difficulty: 'Beginner' },
  { title: 'Japanese Candlesticks', titleAr: 'الشموع اليابانية', difficulty: 'Beginner' },
  { title: 'Support & Resistance', titleAr: 'مستويات الدعم والمقاومة', difficulty: 'Intermediate' },
  { title: 'Technical Indicators', titleAr: 'المؤشرات الفنية', difficulty: 'Intermediate' },
  { title: 'Chart Patterns', titleAr: 'الأنماط السعرية', difficulty: 'Intermediate' },
  { title: 'Risk Management', titleAr: 'إدارة المخاطر', difficulty: 'Intermediate' },
  { title: 'Entry Strategies', titleAr: 'استراتيجيات الدخول', difficulty: 'Advanced' },
  { title: 'Fundamental Analysis', titleAr: 'التحليل الأساسي', difficulty: 'Advanced' },
  { title: 'Trading Psychology', titleAr: 'سيكولوجية التداول', difficulty: 'Advanced' },
  { title: 'Trading Plan', titleAr: 'خطة التداول', difficulty: 'Advanced' },
  { title: 'Advanced Trading', titleAr: 'التداول المتقدم', difficulty: 'Expert' },
  { title: 'Advanced Strategies', titleAr: 'الاستراتيجيات المتقدمة', difficulty: 'Expert' },
  { title: 'Harmonic Patterns', titleAr: 'الأنماط الهارمونية', difficulty: 'Expert' },
  { title: 'AI in Trading', titleAr: 'الذكاء الاصطناعي', difficulty: 'Expert' }
];

const StagePage = () => {
  const { stageId } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  const isRTL = lang === 'ar';

  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const stage = parseInt(stageId);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (stage >= 0 && stage < allStagesLessons.length) {
      setLessons(allStagesLessons[stage] || []);
      if (allStagesLessons[stage]?.length > 0) {
        setSelectedLesson(allStagesLessons[stage][0]);
      }
    }
  }, [stage]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  }

  if (stage < 0 || stage >= stageInfo.length) {
    navigate('/academy');
    return null;
  }

  const stageData = stageInfo[stage];
  const stageName = lang === 'ar' ? stageData.titleAr : stageData.title;

  const getDifficultyColor = (difficulty) => {
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

  const isLessonUnlocked = (index) => {
    // الدرس الأول دائماً مفتوح
    if (index === 0) return true;
    // باقي الدروس مفتوحة (يمكن تعديل هذا لاحقاً حسب نظام التقدم)
    return true;
  };

  return (
    <div className={`min-h-screen bg-black text-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/academy')}
          className={`flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors mb-8`}
        >
          {isRTL ? <ChevronLeft className="w-5 h-5 rotate-180" /> : <ArrowLeft className="w-5 h-5" />}
          <span>{lang === 'ar' ? 'العودة للأكاديمية' : 'Back to Academy'}</span>
        </motion.button>

        {/* Stage Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{stageName}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(stageData.difficulty)}`}>
                  {stageData.difficulty}
                </span>
                <span className="text-gray-400 text-sm">{lang === 'ar' ? 'المرحلة' : 'Stage'} {stage}</span>
                <span className="text-gray-400 text-sm">{lessons.length} {lang === 'ar' ? 'درس' : 'lessons'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'الدروس' : 'Lessons'}</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {lessons.map((lesson, index) => (
                  <motion.button
                    key={lesson.id}
                    whileHover={{ x: 4 }}
                    onClick={() => isLessonUnlocked(index) && setSelectedLesson(lesson)}
                    disabled={!isLessonUnlocked(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedLesson?.id === lesson.id
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                        : isLessonUnlocked(index)
                        ? 'bg-gray-800/50 hover:bg-gray-800 text-gray-300 border border-gray-700'
                        : 'bg-gray-900/50 text-gray-600 border border-gray-800 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isLessonUnlocked(index) ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="text-sm font-medium">{lang === 'ar' ? 'درس' : 'Lesson'} {index + 1}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {lang === 'ar' ? lesson.titleAr || lesson.title : lesson.title}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Lesson Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedLesson ? (
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">
                    {lang === 'ar' ? selectedLesson.titleAr || selectedLesson.title : selectedLesson.title}
                  </h2>
                  <div className="flex items-center gap-4 flex-wrap text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedLesson.estimatedMinutes} {lang === 'ar' ? 'دقيقة' : 'min'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {selectedLesson.keyTakeaways?.length || 0} {lang === 'ar' ? 'نقطة رئيسية' : 'key points'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none mb-8">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {lang === 'ar' ? selectedLesson.content : selectedLesson.contentEn}
                  </div>
                </div>

                {/* Key Takeaways */}
                {selectedLesson.keyTakeaways && selectedLesson.keyTakeaways.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      {lang === 'ar' ? 'النقاط الرئيسية' : 'Key Takeaways'}
                    </h3>
                    <ul className="space-y-2">
                      {selectedLesson.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex gap-3 text-gray-300">
                          <span className="text-amber-400 font-bold flex-shrink-0">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Complete Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
                >
                  {lang === 'ar' ? '✓ إكمال الدرس' : '✓ Complete Lesson'}
                </motion.button>
              </div>
            ) : (
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center text-gray-400">
                {lang === 'ar' ? 'اختر درساً لعرض محتواه' : 'Select a lesson to view its content'}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StagePage;
