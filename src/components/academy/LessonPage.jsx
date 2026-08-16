import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, BookOpen, CheckCircle, 
  Lightbulb, Target, ListOrdered, BarChart3, Brain, Zap, 
  GraduationCap, Image as ImageIcon, ZoomIn, X 
} from 'lucide-react';
import { schools, lessonsData, diagramTypes } from '../../data/academy/academyData';
import { smcLessons, ictLessons, skLessons } from '../../data/academy/schoolsData';
import DiagramSVG from './TradingDiagrams';
import Header from '../Header';
import Footer from '../Footer';

const iconMap = { BarChart3, Brain, Target, Zap, BookOpen };

const schoolTranslations = {
  foundation: { en: 'Foundation of Trading', ar: 'المحور الأول: التأسيس', fr: 'Fondation du Trading', es: 'Fundación de Trading' },
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

  // Get lessons list
  let lessons = [];
  if (schoolId === 'foundation') lessons = lessonsData.foundation || [];
  else if (schoolId === 'classical') lessons = lessonsData.classical || [];
  else if (schoolId === 'smc') lessons = smcLessons || [];
  else if (schoolId === 'ict') lessons = ictLessons || [];
  else if (schoolId === 'sk') lessons = skLessons || [];

  const currentIndex = lessons.findIndex(l => l.id === parseInt(lessonId));
  const lesson = lessons[currentIndex];
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  // UI States for Active Learning & HD Image Modal
  const [activeRecallStarted, setActiveRecallStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveRecallStarted(false);
    setUserAnswers({});
    setQuizRevealed(false);
    setZoomImage(null);
  }, [lessonId]);

  if (!school || !lesson) {
    navigate('/academy');
    return null;
  }

  const Icon = iconMap[school.icon] || BookOpen;
  const lessonData = lesson[lang] || lesson.en;
  const schoolName = schoolTranslations[schoolId]?.[lang] || schoolTranslations[schoolId]?.en;
  const imageSrc = lesson?.image || lessonData?.image;

  // Get diagram type key
  const diagramKey = diagramTypes[lesson.diagram] || lesson.diagram;

  const uiTexts = {
    en: {
      steps: 'Step-by-Step Guide',
      example: 'Practical Example',
      takeaways: 'Key Takeaways',
      prev: 'Previous Lesson',
      next: 'Next Lesson',
      backToSchool: 'Back to School',
      lessonOf: 'Lesson',
      activeRecallTitle: 'Active Recall',
      activeRecallDesc: 'Before we begin, try to answer these questions in your head to activate your memory and improve learning retention:',
      startLesson: 'Start Lesson Now',
      quizTitle: 'Competency Test',
      quizDesc: 'Test your understanding of the concepts covered in this lesson. Write down your answers and check them against the model answers below:',
      placeholderAnswer: 'Type your answer here...',
      checkQuiz: 'Reveal Model Answers',
      modelAnswer: 'Model Answer',
      feedbackLoopTitle: 'Feedback & Review Guide'
    },
    ar: {
      steps: 'دليل خطوة بخطوة',
      example: 'مثال عملي',
      takeaways: 'النقاط الرئيسية',
      prev: 'الدرس السابق',
      next: 'الدرس التالي',
      backToSchool: 'العودة للمدرسة',
      lessonOf: 'الدرس',
      activeRecallTitle: 'التذكير النشط (Active Recall)',
      activeRecallDesc: 'قبل البدء، حاول التفكير في هذه الأسئلة وإجابتها في ذهنك لتنشيط ذاكرتك وتحقيق أقصى استفادة من الدرس:',
      startLesson: 'ابدأ الدرس الآن',
      quizTitle: 'اختبار الكفاءة (Competency Test)',
      quizDesc: 'اختبر فهمك للمفاهيم التي تم تغطيتها في هذا الدرس. اكتب إجاباتك ثم قارنها بالإجابات النموذجية:',
      placeholderAnswer: 'اكتب إجابتك هنا...',
      checkQuiz: 'إظهار الإجابات النموذجية',
      modelAnswer: 'الإجابة النموذجية',
      feedbackLoopTitle: 'دليل التغذية الراجعة والمراجعة'
    },
    fr: {
      steps: 'Guide Étape par Étape',
      example: 'Exemple Pratique',
      takeaways: 'Points Clés',
      prev: 'Leçon Précédente',
      next: 'Leçon Suivante',
      backToSchool: 'Retour à l\'École',
      lessonOf: 'Leçon',
      activeRecallTitle: 'Rappel Actif',
      activeRecallDesc: 'Avant de commencer, essayez de répondre à ces questions dans votre tête pour stimuler votre mémoire :',
      startLesson: 'Commencer la Leçon',
      quizTitle: 'Test de Compétence',
      quizDesc: 'Testez votre compréhension. Écrivez vos réponses et comparez-les aux réponses modèles :',
      placeholderAnswer: 'Écrivez votre réponse ici...',
      checkQuiz: 'Révéler les Réponses Modèles',
      modelAnswer: 'Réponse Modèle',
      feedbackLoopTitle: 'Guide de Révision et Feedback'
    },
    es: {
      steps: 'Guía Paso a Paso',
      example: 'Ejemplo Práctico',
      takeaways: 'Puntos Clave',
      prev: 'Lección Anterior',
      next: 'Siguiente Lección',
      backToSchool: 'Volver a la Escuela',
      lessonOf: 'Lección',
      activeRecallTitle: 'Recuerdo Activo',
      activeRecallDesc: 'Antes de comenzar, intenta responder estas preguntas en tu mente para activar tu memoria:',
      startLesson: 'Iniciar Lección',
      quizTitle: 'Prueba de Competencia',
      quizDesc: 'Prueba tu comprensión. Escribe tus respuestas y compáralas con las respuestas modelo:',
      placeholderAnswer: 'Escribe tu respuesta aquí...',
      checkQuiz: 'Revelar Respuestas Modelo',
      modelAnswer: 'Respuesta Modelo',
      feedbackLoopTitle: 'Guía de Revisión y Retroalimentación'
    }
  };
  const ui = uiTexts[lang] || uiTexts.en;

  // UI UX Pro Max Rich Content Parser (Headings, Tables, Images, Blockquotes, Lists, Code Blocks, Bold)
  const renderContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer = [];
    let tableBuffer = [];

    const flushCodeBuffer = (key) => {
      if (codeBuffer.length > 0) {
        const codeText = codeBuffer.join('\n');
        codeBuffer = [];
        return (
          <div key={key} className="my-6 p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-300 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner dir-ltr text-left">
            <pre className="whitespace-pre-wrap">{codeText}</pre>
          </div>
        );
      }
      return null;
    };

    const flushTableBuffer = (key) => {
      if (tableBuffer.length < 2) {
        tableBuffer = [];
        return null;
      }
      const headerLine = tableBuffer[0];
      const dataLines = tableBuffer.slice(1).filter(l => !/^[|:\s\-]+$/.test(l.trim()));
      
      const parseRow = (str) => {
        const cells = str.split('|').map(s => s.trim());
        if (cells[0] === '') cells.shift();
        if (cells[cells.length - 1] === '') cells.pop();
        return cells;
      };

      const headers = parseRow(headerLine);
      const rows = dataLines.map(parseRow);
      tableBuffer = [];

      return (
        <div key={key} className="my-8 overflow-x-auto rounded-2xl border border-border/80 bg-card/70 shadow-lg backdrop-blur-sm">
          <table className="w-full text-start text-sm border-collapse">
            <thead className="bg-secondary/80 border-b border-border text-amber-500 font-bold uppercase tracking-wider text-xs">
              <tr>
                {headers.map((h, colIdx) => (
                  <th key={colIdx} className="px-4 py-3.5 text-start font-bold">
                    {parseInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-amber-500/5 transition-colors">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-3.5 text-foreground/90 text-start text-xs sm:text-sm font-medium">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    const parseInline = (lineStr) => {
      const parts = lineStr.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      return parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={j} className="text-cyan-600 dark:text-cyan-400 font-mono text-xs bg-secondary/80 px-1.5 py-0.5 rounded border border-cyan-500/20">{part.slice(1, -1)}</code>;
        }
        return <span key={j}>{part}</span>;
      });
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code Block Toggle
      if (trimmed.startsWith('```')) {
        if (tableBuffer.length > 0) elements.push(flushTableBuffer(`table-${i}`));
        if (inCodeBlock) {
          elements.push(flushCodeBuffer(`code-${i}`));
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Markdown Tables (| header | header |)
      if (trimmed.startsWith('|') && trimmed.includes('|')) {
        tableBuffer.push(line);
        continue;
      } else if (tableBuffer.length > 0) {
        elements.push(flushTableBuffer(`table-${i}`));
      }

      // Markdown Images (![alt](url))
      if (trimmed.startsWith('![') && trimmed.includes('](')) {
        const match = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (match) {
          const altText = match[1];
          const imgUrl = match[2];
          elements.push(
            <motion.div
              key={`img-${i}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="my-8 rounded-2xl overflow-hidden glass-card border border-amber-500/30 p-3 sm:p-5 bg-card/80 relative group shadow-xl"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  {altText || (isRTL ? 'إنفوجرافيك توضيحي' : 'Educational Infographic')}
                </span>
                <span className="text-[11px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-md border border-border font-medium flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-500" />
                  {isRTL ? 'عرض بحجم HD' : 'HD Zoom'}
                </span>
              </div>

              <div
                onClick={() => setZoomImage(imgUrl)}
                className="relative cursor-pointer overflow-hidden rounded-xl bg-slate-950/80 flex items-center justify-center min-h-[220px] max-h-[520px]"
              >
                <img
                  src={imgUrl}
                  alt={altText}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain max-h-[520px] group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm backdrop-blur-[2px]">
                  <ZoomIn className="w-6 h-6 text-amber-400" />
                  <span>{isRTL ? 'انقر لعرض الصورة بدقة عالية (HD Zoom)' : 'Click to view full HD image'}</span>
                </div>
              </div>
            </motion.div>
          );
          continue;
        }
      }

      // Blockquotes / Callouts
      if (trimmed.startsWith('>')) {
        const quoteText = trimmed.replace(/^>\s*/, '');
        elements.push(
          <div key={`quote-${i}`} className="my-4 p-4 rounded-xl bg-amber-500/10 border-s-4 border-amber-500 text-foreground font-medium text-sm sm:text-base leading-relaxed shadow-sm">
            {parseInline(quoteText)}
          </div>
        );
        continue;
      }

      // Headings
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-lg sm:text-xl font-bold text-amber-500 dark:text-amber-400 mt-6 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            {parseInline(trimmed.replace(/^###\s*/, ''))}
          </h3>
        );
        continue;
      }

      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-black text-foreground mt-8 mb-4 pb-2 border-b border-border/80 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 dark:from-amber-400 dark:via-amber-500 dark:to-yellow-500 bg-clip-text text-transparent">
            {parseInline(trimmed.replace(/^##\s*/, ''))}
          </h2>
        );
        continue;
      }

      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-2xl sm:text-3xl font-black text-foreground mt-8 mb-4">
            {parseInline(trimmed.replace(/^#\s*/, ''))}
          </h1>
        );
        continue;
      }

      // Bullet Lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={`li-${i}`} className="flex items-start gap-2.5 my-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
            <p className="text-foreground text-sm sm:text-base leading-relaxed">{parseInline(trimmed.replace(/^[-*]\s*/, ''))}</p>
          </div>
        );
        continue;
      }

      // Numbered Lists
      if (/^\d+\.\s/.test(trimmed)) {
        const num = trimmed.match(/^(\d+)\.\s/)[1];
        const itemText = trimmed.replace(/^\d+\.\s/, '');
        elements.push(
          <div key={`numli-${i}`} className="flex items-start gap-3 my-2.5">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-500 dark:text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30 flex-shrink-0 mt-0.5">
              {num}
            </span>
            <p className="text-foreground text-sm sm:text-base leading-relaxed">{parseInline(itemText)}</p>
          </div>
        );
        continue;
      }

      // Empty Lines
      if (!trimmed) {
        elements.push(<div key={`blank-${i}`} className="h-3" />);
        continue;
      }

      // Regular Paragraphs
      elements.push(
        <p key={`p-${i}`} className="mb-3 text-foreground text-sm sm:text-base leading-relaxed">
          {parseInline(line)}
        </p>
      );
    }

    if (tableBuffer.length > 0) elements.push(flushTableBuffer('table-end'));
    return elements;
  };

  // Active Recall Phase Screen
  if (lessonData?.activeRecall && !activeRecallStarted) {
    return (
      <div className={`min-h-screen bg-background text-foreground flex flex-col justify-between ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Header />
        
        <div className="flex-1 flex items-center justify-center pt-28 pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl glass-card border border-border p-6 sm:p-10 relative overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
                <Brain className="w-8 h-8 text-amber-500 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-3">
                {ui.activeRecallTitle}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-lg leading-relaxed">
                {ui.activeRecallDesc}
              </p>
            </div>

            <div className="space-y-4 mb-10">
              {lessonData.activeRecall.map((question, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${school.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {i + 1}
                  </div>
                  <p className="text-foreground font-semibold text-sm sm:text-base leading-relaxed text-start self-center">
                    {question}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveRecallStarted(true)}
                className={`px-8 py-4 bg-gradient-to-r ${school.color} hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-lg text-sm sm:text-base cursor-pointer`}
              >
                {ui.startLesson}
              </motion.button>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    );
  }

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

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-secondary rounded-full mt-4">
            <div
              className={`h-full bg-gradient-to-r ${school.color} rounded-full transition-all duration-500`}
              style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Real Chapter Image Display (High Quality Foundation Visuals) */}
        {imageSrc && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 rounded-2xl overflow-hidden glass-card border border-amber-500/30 p-3 sm:p-5 bg-secondary/30 relative group shadow-xl"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                {isRTL ? 'الشكل التوضيحي من المحور الأساسي' : 'Foundation Chapter High Resolution Visual'}
              </span>
              <span className="text-[11px] text-muted-foreground bg-background/80 px-2.5 py-1 rounded-md border border-border font-medium">
                {isRTL ? 'انقر لتكبير الصورة HD' : 'Click HD Zoom'}
              </span>
            </div>

            <div
              onClick={() => setZoomImage(imageSrc)}
              className="relative cursor-pointer overflow-hidden rounded-xl bg-black/40 flex items-center justify-center min-h-[240px] max-h-[500px]"
            >
              <img
                src={imageSrc}
                alt={lessonData?.title || 'Chapter visual'}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain max-h-[500px] group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm backdrop-blur-[2px]">
                <ZoomIn className="w-6 h-6 text-amber-400" />
                <span>{isRTL ? 'عرض بحجم كامل (HD Zoom)' : 'View Full HD Image'}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Interactive SVG Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 rounded-2xl overflow-hidden border border-border"
        >
          <DiagramSVG type={diagramKey} />
        </motion.div>

        {/* Lesson Content */}
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

        {/* Step-by-Step Guide */}
        {lessonData?.steps && lessonData.steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10 bg-card rounded-2xl border border-border p-5 sm:p-7 shadow-sm"
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

        {/* Practical Example */}
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
            className="mb-10 bg-gradient-to-br from-amber-500/5 to-amber-900/10 rounded-2xl border border-amber-500/20 p-5 sm:p-7"
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

        {/* Competency Test / Quiz */}
        {lessonData?.quiz && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12 bg-card rounded-2xl border border-border p-5 sm:p-8 shadow-sm"
          >
            <h3 className="text-xl font-black bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-amber-500" />
              {ui.quizTitle}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {ui.quizDesc}
            </p>

            <div className="space-y-6">
              {lessonData.quiz.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex gap-2">
                    <span className="text-amber-500 font-bold">Q{i + 1}:</span>
                    <h4 className="text-foreground font-semibold text-sm sm:text-base">{item.q}</h4>
                  </div>
                  <textarea
                    disabled={quizRevealed}
                    placeholder={ui.placeholderAnswer}
                    value={userAnswers[i] || ''}
                    onChange={(e) => setUserAnswers({ ...userAnswers, [i]: e.target.value })}
                    className="w-full h-24 p-3 rounded-xl bg-background border border-border text-foreground text-sm focus:border-amber-500/50 focus:outline-none resize-none transition-colors"
                  />
                  
                  {quizRevealed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 mt-2"
                    >
                      <h5 className="text-green-400 text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {ui.modelAnswer}
                      </h5>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {!quizRevealed ? (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setQuizRevealed(true)}
                  className="px-6 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black transition-all text-sm font-bold cursor-pointer"
                >
                  {ui.checkQuiz}
                </button>
              </div>
            ) : (
              lessonData?.feedbackLoop && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"
                >
                  <h4 className="text-amber-500 text-sm font-bold mb-1.5 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    {ui.feedbackLoopTitle}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {lessonData.feedbackLoop}
                  </p>
                </motion.div>
              )
            )}
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          {prevLesson ? (
            <button
              onClick={() => navigate(`/academy/${schoolId}/lesson/${prevLesson.id}`)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl border border-border hover:border-amber-500/30 transition-all text-sm sm:text-base cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
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
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r ${school.color} hover:opacity-90 rounded-xl transition-all text-sm sm:text-base cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
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
              className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-xl transition-all text-sm sm:text-base font-medium cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              {ui.backToSchool}
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen HD Lightbox Modal */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={zoomImage}
              alt="Full resolution chapter visual"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default LessonPage;
