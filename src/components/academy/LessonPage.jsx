import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, CheckCircle, Lightbulb, Target, ListOrdered, Brain,
  GraduationCap, ZoomIn, X, ChevronRight, ChevronLeft, Clock,
  Award, ArrowRight, ArrowLeft, Play
} from 'lucide-react';
import { schools, lessonsData } from '../../data/academy/academyData';
import { smcLessons, ictLessons, skLessons } from '../../data/academy/schoolsData';
import Header from '../Header';
import Footer from '../Footer';
import AssessmentModal from './ui/AssessmentModal';

// ─── Lesson Progress Bar ───────────────────────────────────────────────────────
const LessonProgressBar = ({ current, total, color, isRTL }) => {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[11px] font-mono text-muted-foreground">
        <span>{isRTL ? `الدرس ${current + 1} من ${total}` : `Lesson ${current + 1} of ${total}`}</span>
        <span className="text-amber-500 font-bold">{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${color || 'from-amber-500 to-yellow-500'} rounded-full`}
        />
      </div>
    </div>
  );
};

// ─── School name lookup ────────────────────────────────────────────────────────
const schoolNames = {
  foundation: { ar: 'أساسيات الأسواق المالية', en: 'Market Foundations' },
  classical:  { ar: 'التحليل الفني الكلاسيكي', en: 'Classical Technical Analysis' },
  smc:        { ar: 'مفاهيم المال الذكي', en: 'Smart Money Concepts' },
  ict:        { ar: 'منهجية ICT', en: 'ICT Method' },
  sk:         { ar: 'نظام SK', en: 'SK System' },
};

// ─── Inline Markdown Parser (Bold + Code) ─────────────────────────────────────
const parseInline = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={j} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={j} className="text-amber-600 dark:text-amber-400 font-mono text-[0.85em] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={j}>{part}</span>;
  });
};

// ─── Rich Content Renderer — NO ASCII / NO code-block diagrams ─────────────────
const renderContent = (text, onZoom, isRTL) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let tableBuffer = [];
  let inCodeBlock = false;

  const flushTable = (key) => {
    if (tableBuffer.length < 2) { tableBuffer = []; return null; }

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
      <div key={key} className="my-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-secondary/60 border-b border-border">
            <tr>
              {headers.map((h, ci) => (
                <th key={ci} className="px-4 py-3 text-start text-xs font-bold text-amber-500 uppercase tracking-wide">
                  {parseInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rows.map((row, ri) => (
              <tr key={ri} className="hover:bg-secondary/30 transition-colors">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 text-foreground/90 text-xs sm:text-sm leading-relaxed">
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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip code blocks entirely — replace with nothing (they were ASCII diagrams)
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (tableBuffer.length > 0) { elements.push(flushTable(`table-${i}`)); }
      continue;
    }
    if (inCodeBlock) continue; // skip code block content

    // Tables
    if (trimmed.startsWith('|') && trimmed.includes('|')) {
      tableBuffer.push(line);
      continue;
    } else if (tableBuffer.length > 0) {
      elements.push(flushTable(`table-${i}`));
    }

    // Images  ![alt](url)
    if (trimmed.startsWith('![') && trimmed.includes('](')) {
      const match = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (match) {
        const alt = match[1];
        const src = match[2];
        elements.push(
          <motion.div
            key={`img-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            className="my-10 group"
          >
            <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/40">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  {alt || (isRTL ? 'إنفوجرافيك تعليمي' : 'Educational Infographic')}
                </span>
                <button
                  onClick={() => onZoom && onZoom(src)}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-amber-500 transition-colors font-medium"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'تكبير' : 'Zoom'}</span>
                </button>
              </div>
              <div
                className="relative cursor-zoom-in bg-slate-950/60 flex items-center justify-center overflow-hidden"
                onClick={() => onZoom && onZoom(src)}
              >
                <img
                  src={src}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain max-h-[520px] group-hover:scale-[1.015] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-sm font-semibold">
                  <ZoomIn className="w-5 h-5 text-amber-400" />
                  <span>{isRTL ? 'عرض بجودة HD' : 'View HD'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
        continue;
      }
    }

    // Blockquotes
    if (trimmed.startsWith('>')) {
      const qText = trimmed.replace(/^>\s*/, '');
      // Skip comment-only blockquotes that start with # (these are headers in code format)
      if (qText.startsWith('#')) continue;
      elements.push(
        <div key={`bq-${i}`} className="my-5 p-4 rounded-xl bg-amber-500/8 border-s-[3px] border-amber-500 text-foreground/90 text-sm sm:text-base leading-relaxed font-medium">
          {parseInline(qText)}
        </div>
      );
      continue;
    }

    // Skip pure comment header lines (# === lines)
    if (trimmed.startsWith('# ===') || trimmed.startsWith('# ---')) continue;

    // H3
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-base sm:text-lg font-bold text-foreground mt-8 mb-3 flex items-center gap-2.5">
          <span className="w-1 h-4 rounded-full bg-amber-500 inline-block flex-shrink-0" />
          {parseInline(trimmed.replace(/^###\s*/, ''))}
        </h3>
      );
      continue;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-black text-foreground mt-10 mb-4 pb-2.5 border-b border-border/60">
          {parseInline(trimmed.replace(/^##\s*/, ''))}
        </h2>
      );
      continue;
    }

    // H1 — skip the big title lines from content (they duplicate the header)
    if (trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#\s*/, '');
      // Only render if it's a meaningful section heading
      if (!headingText.includes('===') && !headingText.includes('---') && headingText.length > 3) {
        elements.push(
          <h2 key={`h1-${i}`} className="text-xl sm:text-2xl font-black text-foreground mt-10 mb-4 pb-2.5 border-b border-border/60">
            {parseInline(headingText)}
          </h2>
        );
      }
      continue;
    }

    // Bullet lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.replace(/^[-*]\s*/, '');
      // Skip empty or separator lines
      if (!content || content.match(/^[-=]+$/)) continue;
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-3 my-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
          <p className="text-foreground/90 text-sm sm:text-base leading-relaxed">{parseInline(content)}</p>
        </div>
      );
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)\.\s/)[1];
      const content = trimmed.replace(/^\d+\.\s/, '');
      elements.push(
        <div key={`nl-${i}`} className="flex items-start gap-3 my-2.5">
          <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-500 font-bold text-xs flex items-center justify-center border border-amber-500/25 flex-shrink-0 mt-0.5">
            {num}
          </span>
          <p className="text-foreground/90 text-sm sm:text-base leading-relaxed">{parseInline(content)}</p>
        </div>
      );
      continue;
    }

    // Horizontal rules
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(<div key={`hr-${i}`} className="my-8 border-t border-border/50" />);
      continue;
    }

    // Empty lines
    if (!trimmed) {
      elements.push(<div key={`sp-${i}`} className="h-2" />);
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-foreground/85 text-sm sm:text-base leading-relaxed mb-3">
        {parseInline(line)}
      </p>
    );
  }

  if (tableBuffer.length > 0) elements.push(flushTable('table-end'));

  return elements;
};

// ─── Active Recall Screen ──────────────────────────────────────────────────────
const ActiveRecallScreen = ({ school, lessonData, ui, lang, onStart }) => {
  const isRTL = lang === 'ar';
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-secondary/50 border-b border-border p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-7 h-7 text-amber-500" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">{ui.activeRecallTitle}</h1>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed max-w-lg mx-auto">{ui.activeRecallDesc}</p>
          </div>

          {/* Questions */}
          <div className="p-6 sm:p-8 space-y-3">
            {lessonData.activeRecall.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-4 p-4 rounded-xl bg-secondary/40 border border-border/60"
              >
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${school?.color || 'from-amber-500 to-amber-600'} text-white font-bold text-xs flex items-center justify-center flex-shrink-0`}>
                  {i + 1}
                </div>
                <p className="text-foreground text-sm sm:text-base font-medium leading-relaxed">{q}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <button
              onClick={onStart}
              className={`w-full py-4 rounded-xl bg-gradient-to-r ${school?.color || 'from-amber-500 to-yellow-500'} text-white font-bold text-base shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer`}
            >
              <Play className="w-5 h-5 fill-white" />
              {ui.startLesson}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main LessonPage Component ─────────────────────────────────────────────────
const LessonPage = () => {
  const { schoolId, lessonId } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const lang = i18n.language?.startsWith('ar') ? 'ar'
    : i18n.language?.startsWith('fr') ? 'fr'
    : i18n.language?.startsWith('es') ? 'es'
    : 'en';
  const isRTL = lang === 'ar';

  const school = schools.find(s => s.id === schoolId);

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

  const [activeRecallStarted, setActiveRecallStarted] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setActiveRecallStarted(false);
    setZoomImage(null);
    setIsAssessmentOpen(false);
  }, [lessonId]);

  if (!school || !lesson) {
    navigate('/academy');
    return null;
  }

  const lessonData = lesson[lang] || lesson.en;
  const schoolLabel = schoolNames[schoolId]?.[lang] || schoolNames[schoolId]?.en || schoolId;

  const ui = {
    ar: {
      activeRecallTitle: 'التحضير الذهني',
      activeRecallDesc: 'قبل البدء، فكّر في هذه الأسئلة لتنشيط ذاكرتك وتحقيق أقصى استفادة من الدرس:',
      startLesson: 'ابدأ الدرس الآن',
      prevLesson: 'الدرس السابق',
      nextLesson: 'الدرس التالي',
      completeModule: 'إكمال المحور',
      assessment: 'اختبار الكفاءة',
      assessmentDesc: 'اختبر فهمك وسجّل تقدمك في الأكاديمية',
      startAssessment: 'ابدأ الاختبار',
      readTime: 'دقيقة قراءة',
      academy: 'الأكاديمية',
    },
    en: {
      activeRecallTitle: 'Mental Warm-Up',
      activeRecallDesc: 'Before we begin, reflect on these questions to activate your memory and maximize learning:',
      startLesson: 'Start Lesson Now',
      prevLesson: 'Previous Lesson',
      nextLesson: 'Next Lesson',
      completeModule: 'Complete Module',
      assessment: 'Competency Test',
      assessmentDesc: 'Test your understanding and record your progress in the academy',
      startAssessment: 'Start Assessment',
      readTime: 'min read',
      academy: 'Academy',
    }
  }[lang] || {
    activeRecallTitle: 'Mental Warm-Up',
    activeRecallDesc: 'Before we begin, reflect on these questions:',
    startLesson: 'Start Lesson',
    prevLesson: 'Previous',
    nextLesson: 'Next',
    completeModule: 'Complete',
    assessment: 'Assessment',
    assessmentDesc: 'Test your understanding',
    startAssessment: 'Start',
    readTime: 'min read',
    academy: 'Academy',
  };

  // Active Recall gate
  if (lessonData?.activeRecall?.length > 0 && !activeRecallStarted) {
    return (
      <div className={`min-h-screen bg-background text-foreground flex flex-col ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Header />
        <div className="pt-20 flex-1 flex flex-col">
          <ActiveRecallScreen
            school={school}
            lessonData={lessonData}
            ui={ui}
            lang={lang}
            onStart={() => setActiveRecallStarted(true)}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      <main className="pt-20 pb-24 max-w-4xl mx-auto px-4 sm:px-6">

        {/* ── Breadcrumb ── */}
        <motion.nav
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground mt-6 mb-8 flex-wrap font-medium"
          aria-label="breadcrumb"
        >
          <button onClick={() => navigate('/academy')} className="hover:text-amber-500 transition-colors">
            {ui.academy}
          </button>
          <ChevronRight className={`w-3.5 h-3.5 opacity-40 ${isRTL ? 'rotate-180' : ''}`} />
          <button onClick={() => navigate(`/academy/${schoolId}`)} className="hover:text-amber-500 transition-colors">
            {schoolLabel}
          </button>
          <ChevronRight className={`w-3.5 h-3.5 opacity-40 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-amber-500 font-bold">{isRTL ? `الدرس ${lesson.id}` : `Lesson ${lesson.id}`}</span>
        </motion.nav>

        {/* ── Lesson Title Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Badge row */}
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${school.color} flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0`}>
                {lesson.id}
              </div>
              <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                {isRTL ? `الدرس ${currentIndex + 1} من ${lessons.length}` : `Lesson ${currentIndex + 1} of ${lessons.length}`}
              </span>
              <div className="flex items-center gap-1.5 ms-auto">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs text-muted-foreground font-medium">80 {ui.readTime}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-5">
              {lessonData?.title}
            </h1>

            {/* Progress */}
            <LessonProgressBar
              current={currentIndex}
              total={lessons.length}
              color={school.color}
              isRTL={isRTL}
            />
          </div>
        </motion.div>

        {/* ── Main Lesson Content ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-foreground leading-relaxed space-y-1"
        >
          {renderContent(lessonData?.content, setZoomImage, isRTL)}
        </motion.div>

        {/* ── Key Takeaways ── */}
        {lessonData?.keyTakeaways?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 sm:p-7"
          >
            <h3 className="text-base font-bold text-amber-500 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {isRTL ? 'النقاط الرئيسية' : 'Key Takeaways'}
            </h3>
            <div className="space-y-2.5">
              {lessonData.keyTakeaways.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-foreground/85 text-sm sm:text-base leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Assessment Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="flex items-start justify-between gap-5 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{ui.assessment}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{ui.assessmentDesc}</p>
                </div>
              </div>
              <button
                id="start-assessment-btn"
                onClick={() => setIsAssessmentOpen(true)}
                className={`px-6 py-3 rounded-xl bg-gradient-to-r ${school.color} text-white font-bold text-sm shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer flex-shrink-0`}
              >
                <Award className="w-4 h-4" />
                {ui.startAssessment}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Lesson Navigation ── */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-border">
          {prevLesson ? (
            <button
              onClick={() => navigate(`/academy/${schoolId}/lesson/${prevLesson.id}`)}
              className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/70 border border-border hover:border-amber-500/30 transition-all text-sm font-semibold cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{ui.prevLesson}</div>
                <div className="text-foreground font-bold truncate max-w-[130px] sm:max-w-[200px] text-xs">
                  {(prevLesson[lang] || prevLesson.en)?.title}
                </div>
              </div>
            </button>
          ) : <div />}

          {nextLesson ? (
            <button
              onClick={() => navigate(`/academy/${schoolId}/lesson/${nextLesson.id}`)}
              className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r ${school.color} text-white hover:opacity-90 transition-all text-sm font-bold shadow-md cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className={isRTL ? 'text-left' : 'text-right'}>
                <div className="text-[10px] text-white/70 uppercase tracking-wider mb-0.5">{ui.nextLesson}</div>
                <div className="text-white font-bold truncate max-w-[130px] sm:max-w-[200px] text-xs">
                  {(nextLesson[lang] || nextLesson.en)?.title}
                </div>
              </div>
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <button
              onClick={() => navigate(`/academy/${schoolId}`)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              {ui.completeModule}
            </button>
          )}
        </div>
      </main>

      {/* ── Assessment Modal ── */}
      <AssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        schoolId={schoolId}
        lesson={lesson}
        school={school}
        lang={lang}
        onCompleted={() => {}}
      />

      {/* ── HD Image Lightbox ── */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomImage(null)}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <button
              onClick={() => setZoomImage(null)}
              aria-label="Close"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              src={zoomImage}
              alt="Zoomed infographic"
              onClick={e => e.stopPropagation()}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10 cursor-default"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default LessonPage;
