import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, BookOpen, GraduationCap } from 'lucide-react';

const schoolTranslations = {
  foundation: { en: 'Foundation of Trading', ar: 'المحور الأول: التأسيس' },
  classical: { en: 'Classical Technical Analysis', ar: 'التحليل الفني الكلاسيكي' },
  smc: { en: 'Smart Money Concepts', ar: 'مفاهيم المال الذكي' },
  ict: { en: 'ICT Trading Method', ar: 'منهجية ICT للتداول' },
  sk: { en: 'SK System', ar: 'نظام SK' }
};

export const LessonHeader = ({ schoolId, school, lesson, currentIndex, totalLessons, lang = 'ar' }) => {
  const navigate = useNavigate();
  const isRTL = lang === 'ar';
  const schoolName = schoolTranslations[schoolId]?.[lang] || schoolTranslations[schoolId]?.en || schoolId;
  const progressPercent = Math.round(((currentIndex + 1) / totalLessons) * 100);

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-6 flex-wrap font-medium"
      >
        <button
          onClick={() => navigate('/academy')}
          className="hover:text-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded px-1"
        >
          {isRTL ? 'الأكاديمية' : 'Academy'}
        </button>
        <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        <button
          onClick={() => navigate(`/academy/${schoolId}`)}
          className="hover:text-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded px-1"
        >
          {schoolName}
        </button>
        <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        <span className="text-amber-500 font-bold">
          {isRTL ? `الدرس ${lesson.id}` : `Lesson ${lesson.id}`}
        </span>
      </motion.nav>

      {/* Main Title & Meta */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${school?.color || 'from-amber-500 to-amber-600'} flex items-center justify-center text-white font-black text-sm shadow-md`}>
              {lesson.id}
            </div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              {isRTL ? `الدرس ${lesson.id} من أصل ${totalLessons}` : `Lesson ${lesson.id} of ${totalLessons}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {isRTL ? '80 دقيقة مقدرة' : '80 min est.'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              {isRTL ? 'مستوى أساسي' : 'Foundational'}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
          {(lesson[lang] || lesson.en)?.title}
        </h1>

        {/* Progress Bar */}
        <div className="w-full bg-secondary/80 rounded-full h-2 overflow-hidden mt-4 border border-border/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${school?.color || 'from-amber-500 to-amber-600'} rounded-full`}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LessonHeader;
