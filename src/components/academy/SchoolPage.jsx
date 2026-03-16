import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Target, Zap, BookOpen, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { schools, lessonsData } from '../../data/academy/academyData';
import { smcLessons, ictLessons, skLessons } from '../../data/academy/schoolsData';
import Header from '../Header';
import Footer from '../Footer';

const iconMap = { BarChart3, Brain, Target, Zap };

const schoolTranslations = {
  classical: { en: 'Classical Technical Analysis', ar: 'التحليل الفني الكلاسيكي', fr: 'Analyse Technique Classique', es: 'Análisis Técnico Clásico' },
  smc: { en: 'Smart Money Concepts', ar: 'مفاهيم المال الذكي', fr: 'Smart Money Concepts', es: 'Smart Money Concepts' },
  ict: { en: 'ICT Trading Method', ar: 'منهجية ICT للتداول', fr: 'Méthode ICT', es: 'Método ICT' },
  sk: { en: 'SK System', ar: 'نظام SK', fr: 'Système SK', es: 'Sistema SK' }
};

const levelLabels = {
  en: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
  ar: { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم' },
  fr: { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' },
  es: { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' }
};

const SchoolPage = () => {
  const { schoolId } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : i18n.language?.startsWith('es') ? 'es' : 'en';
  const isRTL = lang === 'ar';

  const school = schools.find(s => s.id === schoolId);
  if (!school) {
    navigate('/academy');
    return null;
  }

  const Icon = iconMap[school.icon] || BookOpen;

  // Get lessons based on school
  let lessons = [];
  if (schoolId === 'classical') lessons = lessonsData.classical || [];
  else if (schoolId === 'smc') lessons = smcLessons || [];
  else if (schoolId === 'ict') lessons = ictLessons || [];
  else if (schoolId === 'sk') lessons = skLessons || [];

  const schoolName = schoolTranslations[schoolId]?.[lang] || schoolTranslations[schoolId]?.en;
  const levels = levelLabels[lang] || levelLabels.en;

  // Categorize lessons by level
  const getLevel = (index, total) => {
    if (index < Math.ceil(total * 0.4)) return 'beginner';
    if (index < Math.ceil(total * 0.75)) return 'intermediate';
    return 'advanced';
  };

  const levelColors = {
    beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
    intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    advanced: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  return (
    <div className={`min-h-screen bg-black text-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* Hero */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${school.color.replace('from-', 'from-').replace('to-', 'to-')} opacity-5`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/academy')}
            className={`flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors mb-8`}
          >
            {isRTL ? <ChevronRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            <span className="text-sm">{isRTL ? 'العودة للأكاديمية' : 'Back to Academy'}</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${school.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {schoolName}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {lessons.length} {lang === 'ar' ? 'درس' : 'lessons'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lessons List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const level = getLevel(index, lessons.length);
            const lessonData = lesson[lang] || lesson.en;
            
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => navigate(`/academy/${schoolId}/lesson/${lesson.id}`)}
                className="cursor-pointer group"
              >
                <div className="flex items-center gap-4 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-amber-500/30 transition-all duration-300 p-4 sm:p-5">
                  {/* Lesson number */}
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${school.color} flex items-center justify-center text-white font-bold text-sm sm:text-base`}>
                    {lesson.id}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-amber-400 transition-colors truncate">
                      {lessonData?.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${levelColors[level]}`}>
                        {levels[level]}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {lang === 'ar' ? '5-10 دقائق' : '5-10 min'}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronLeft className={`flex-shrink-0 w-5 h-5 text-gray-600 group-hover:text-amber-500 transition-colors ${isRTL ? '' : 'rotate-180'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SchoolPage;
