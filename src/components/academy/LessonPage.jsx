import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, CheckCircle, Lightbulb, Target, ListOrdered, BarChart3, Brain, Zap } from 'lucide-react';
import { schools, lessonsData, diagramTypes } from '../../data/academy/academyData';
import { smcLessons, ictLessons, skLessons } from '../../data/academy/schoolsData';
import DiagramSVG from './TradingDiagrams';
import Header from '../Header';
import Footer from '../Footer';

const iconMap = { BarChart3, Brain, Target, Zap };

const schoolTranslations = {
  classical: { en: 'Classical Technical Analysis', ar: 'التحليل الفني الكلاسيكي', fr: 'Analyse Technique Classique', es: 'Análisis Técnico Clásico' },
  smc: { en: 'Smart Money Concepts', ar: 'مفاهيم المال الذكي', fr: 'Smart Money Concepts', es: 'Smart Money Concepts' },
  ict: { en: 'ICT Trading Method', ar: 'منهجية ICT للتداول', fr: 'Méthode ICT', es: 'Método ICT' },
  sk: { en: 'SK System', ar: 'نظام SK', fr: 'Système SK', es: 'Sistema SK' }
};

const LessonPage = () => {
  const { schoolId, lessonId } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : i18n.language?.startsWith('es') ? 'es' : 'en';
  const isRTL = lang === 'ar';

  const school = schools.find(s => s.id === schoolId);

  // Get lessons
  let lessons = [];
  if (schoolId === 'classical') lessons = lessonsData.classical || [];
  else if (schoolId === 'smc') lessons = smcLessons || [];
  else if (schoolId === 'ict') lessons = ictLessons || [];
  else if (schoolId === 'sk') lessons = skLessons || [];

  const currentIndex = lessons.findIndex(l => l.id === parseInt(lessonId));
  const lesson = lessons[currentIndex];
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lessonId]);

  if (!school || !lesson) {
    navigate('/academy');
    return null;
  }

  const Icon = iconMap[school.icon] || BookOpen;
  const lessonData = lesson[lang] || lesson.en;
  const schoolName = schoolTranslations[schoolId]?.[lang] || schoolTranslations[schoolId]?.en;

  // Get diagram type
  const diagramKey = diagramTypes[lesson.diagram] || lesson.diagram;

  const uiTexts = {
    en: { steps: 'Step-by-Step Guide', example: 'Practical Example', takeaways: 'Key Takeaways', prev: 'Previous Lesson', next: 'Next Lesson', backToSchool: 'Back to School', lessonOf: 'Lesson' },
    ar: { steps: 'دليل خطوة بخطوة', example: 'مثال عملي', takeaways: 'النقاط الرئيسية', prev: 'الدرس السابق', next: 'الدرس التالي', backToSchool: 'العودة للمدرسة', lessonOf: 'الدرس' },
    fr: { steps: 'Guide Étape par Étape', example: 'Exemple Pratique', takeaways: 'Points Clés', prev: 'Leçon Précédente', next: 'Leçon Suivante', backToSchool: 'Retour à l\'École', lessonOf: 'Leçon' },
    es: { steps: 'Guía Paso a Paso', example: 'Ejemplo Práctico', takeaways: 'Puntos Clave', prev: 'Lección Anterior', next: 'Siguiente Lección', backToSchool: 'Volver a la Escuela', lessonOf: 'Lección' }
  };
  const ui = uiTexts[lang] || uiTexts.en;

  // Parse content with markdown bold
  const renderContent = (text) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, i) => {
      if (!paragraph.trim()) return <br key={i} />;
      // Handle **bold** text
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="mb-3 leading-relaxed">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="text-amber-400 font-semibold">{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap"
        >
          <button onClick={() => navigate('/academy')} className="hover:text-amber-500 transition-colors">
            {lang === 'ar' ? 'الأكاديمية' : 'Academy'}
          </button>
          <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <button onClick={() => navigate(`/academy/${schoolId}`)} className="hover:text-amber-500 transition-colors">
            {schoolName}
          </button>
          <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-amber-500">{ui.lessonOf} {lesson.id}</span>
        </motion.div>

        {/* Lesson Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${school.color} flex items-center justify-center text-white font-bold text-sm`}>
              {lesson.id}
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{ui.lessonOf} {lesson.id} / {lessons.length}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            {lessonData?.title}
          </h1>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-secondary rounded-full mt-4">
            <div
              className={`h-full bg-gradient-to-r ${school.color} rounded-full transition-all duration-500`}
              style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 rounded-2xl overflow-hidden border border-border"
        >
          <DiagramSVG type={diagramKey} />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose dark:prose-invert max-w-none mb-10"
        >
          <div className="text-foreground text-base sm:text-lg leading-relaxed">
            {renderContent(lessonData?.content)}
          </div>
        </motion.div>

        {/* Steps */}
        {lessonData?.steps && lessonData.steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10 bg-card rounded-2xl border border-border p-5 sm:p-7"
          >
            <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-amber-500" />
              {ui.steps}
            </h3>
            <div className="space-y-3">
              {lessonData.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br ${school.color} flex items-center justify-center text-white text-xs font-bold mt-0.5`}>
                    {i + 1}
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Example */}
        {lessonData?.example && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10 bg-gradient-to-br from-blue-500/5 to-blue-900/10 rounded-2xl border border-blue-500/20 p-5 sm:p-7"
          >
            <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              {ui.example}
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {lessonData.example}
            </p>
          </motion.div>
        )}

        {/* Key Takeaways */}
        {lessonData?.keyTakeaways && lessonData.keyTakeaways.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12 bg-gradient-to-br from-amber-500/5 to-amber-900/10 rounded-2xl border border-amber-500/20 p-5 sm:p-7"
          >
            <h3 className="text-lg font-bold text-amber-500 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {ui.takeaways}
            </h3>
            <div className="space-y-2.5">
              {lessonData.keyTakeaways.map((takeaway, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground text-sm sm:text-base">{takeaway}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          {prevLesson ? (
            <button
              onClick={() => navigate(`/academy/${schoolId}/lesson/${prevLesson.id}`)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl border border-border hover:border-amber-500/30 transition-all text-sm sm:text-base ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="text-xs text-muted-foreground">{ui.prev}</div>
                <div className="text-foreground font-medium truncate max-w-[120px] sm:max-w-[200px]">
                  {(prevLesson[lang] || prevLesson.en)?.title}
                </div>
              </div>
            </button>
          ) : <div />}

          {nextLesson ? (
            <button
              onClick={() => navigate(`/academy/${schoolId}/lesson/${nextLesson.id}`)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r ${school.color} hover:opacity-90 rounded-xl transition-all text-sm sm:text-base ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                <div className="text-xs text-white/70">{ui.next}</div>
                <div className="text-white font-medium truncate max-w-[120px] sm:max-w-[200px]">
                  {(nextLesson[lang] || nextLesson.en)?.title}
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <button
              onClick={() => navigate(`/academy/${schoolId}`)}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-xl transition-all text-sm sm:text-base font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              {ui.backToSchool}
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LessonPage;
