import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, X, CheckCircle2, XCircle, Award, RotateCcw,
  ChevronLeft, ChevronRight, Check, Loader2, Trophy, BookOpen, AlertCircle, Sparkles
} from 'lucide-react';
import { saveAssessmentResult } from '../../../services/assessmentService';

// ─── Assessment Modal ─────────────────────────────────────────────────────────
export const AssessmentModal = ({ isOpen, onClose, schoolId, lesson, school, lang = 'ar', onCompleted }) => {
  const isRTL = lang === 'ar';
  const quiz = lesson?.[lang]?.quiz || lesson?.en?.quiz || lesson?.ar?.quiz || [];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  // Reset state on modal open
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setAnswers({});
      setSubmitted(false);
      setSaving(false);
      setResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (quiz.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
          <BookOpen className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">
            {isRTL ? 'لا توجد أسئلة بعد' : 'No questions yet'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {isRTL ? 'سيتم إضافة أسئلة تقييمية لهذا الدرس قريباً.' : 'Assessment questions for this lesson will be added soon.'}
          </p>
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm cursor-pointer transition-colors">
            {isRTL ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  const current = quiz[step];
  const totalQ = quiz.length;
  const progress = Math.round(((step + 1) / totalQ) * 100);

  const handleAnswer = (qIdx, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: val }));
  };

  const handleNext = () => { if (step < totalQ - 1) setStep(s => s + 1); };
  const handlePrev = () => { if (step > 0) setStep(s => s - 1); };

  const handleSubmit = async () => {
    setSaving(true);
    let score = 0;
    quiz.forEach((q, idx) => {
      const sel = answers[idx];
      if (q.correctIndex !== undefined) {
        if (sel === q.correctIndex) score++;
      } else {
        if (sel !== undefined && sel !== null && sel !== '') score++;
      }
    });

    const res = await saveAssessmentResult({
      schoolId,
      lessonId: lesson.id,
      score,
      totalQuestions: totalQ,
      answers,
      timeSpentSeconds: 0
    });

    const pct = Math.round((score / totalQ) * 100);
    setResult({
      score,
      total: totalQ,
      pct: res.percentage ?? pct,
      passed: res.passed ?? pct >= 70
    });
    setSubmitted(true);
    setSaving(false);
    if (onCompleted) onCompleted(res);
  };

  const handleRetake = () => {
    setStep(0);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assessment-title"
          dir={isRTL ? 'rtl' : 'ltr'}
          className={`w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden relative my-6 ${isRTL ? 'rtl' : 'ltr'}`}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border bg-secondary/40">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${school?.color || 'from-amber-500 to-amber-600'} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 id="assessment-title" className="text-base font-bold text-foreground">
                  {isRTL ? 'اختبار كفاءة الدرس' : 'Lesson Assessment'}
                </h2>
                <p className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-md">
                  {isRTL
                    ? `الدرس ${lesson.id}: ${lesson[lang]?.title || lesson.en?.title || ''}`
                    : `Lesson ${lesson.id}: ${lesson.en?.title || lesson.ar?.title || ''}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/70 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="p-5 sm:p-7">
            {!submitted ? (
              <>
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-muted-foreground font-mono mb-2">
                    <span>{isRTL ? `السؤال ${step + 1} من ${totalQ}` : `Question ${step + 1} of ${totalQ}`}</span>
                    <span className="text-amber-500 font-bold">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mb-6 space-y-4">
                  <h3 className="text-sm sm:text-base font-bold text-foreground leading-relaxed">
                    {step + 1}. {current.q}
                  </h3>

                  {/* Multiple choice */}
                  {current.options ? (
                    <div className="space-y-2.5">
                      {current.options.map((opt, oi) => {
                        const sel = answers[step] === oi;
                        return (
                          <button
                            key={oi}
                            onClick={() => handleAnswer(step, oi)}
                            className={`w-full px-4 py-3.5 rounded-xl text-start border text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${
                              sel
                                ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shadow-sm'
                                : 'border-border bg-secondary/30 text-foreground hover:bg-secondary/60 hover:border-amber-500/30'
                            }`}
                          >
                            <span className="leading-relaxed">{opt}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              sel ? 'border-amber-500 bg-amber-500' : 'border-border'
                            }`}>
                              {sel && <Check className="w-3 h-3 text-white stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Open-ended with model answer */
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 'فكّر في الإجابة وسجّل ملاحظتك:' : 'Reflect and note your answer:'}
                      </p>
                      <textarea
                        value={answers[step] || ''}
                        onChange={e => handleAnswer(step, e.target.value)}
                        placeholder={isRTL ? 'اكتب إجابتك هنا...' : 'Write your answer here...'}
                        className="w-full h-28 p-3.5 rounded-xl bg-secondary/30 border border-border text-foreground text-sm focus:border-amber-500 focus:outline-none resize-none transition-colors"
                      />
                      {current.a && (
                        <div className="p-4 rounded-xl bg-secondary/60 border border-border">
                          <p className="text-xs font-bold text-amber-500 mb-1.5">
                            {isRTL ? 'الإجابة النموذجية:' : 'Model Answer:'}
                          </p>
                          <p className="text-sm text-foreground/90 leading-relaxed">{current.a}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                  <button
                    onClick={handlePrev}
                    disabled={step === 0}
                    className="px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/70 text-foreground disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    {isRTL ? 'السابق' : 'Back'}
                  </button>

                  {step < totalQ - 1 ? (
                    <button
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      {isRTL ? 'التالي' : 'Next'}
                      {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {saving ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>{isRTL ? 'جاري الحفظ...' : 'Saving...'}</span></>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /><span>{isRTL ? 'إنهاء الاختبار' : 'Submit'}</span></>
                      )}
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* ── Educational Results & Feedback Screen ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 py-2"
              >
                {/* Score Banner */}
                <div className={`p-6 rounded-2xl border text-center relative overflow-hidden ${
                  result.passed
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-amber-500/10 border-amber-500/30'
                }`}>
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg ${
                    result.passed ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-black'
                  }`}>
                    {result.passed ? <Trophy className="w-8 h-8" /> : <Award className="w-8 h-8" />}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-foreground">
                    {result.passed
                      ? (isRTL ? 'ممتاز! تم اجتياز التقييم بنجاح 🎉' : 'Assessment Passed Successfully 🎉')
                      : (isRTL ? 'مراجعة موصى بها قبل الانتقال' : 'Review Recommended Before Continuing')}
                  </h3>

                  <p className="text-sm font-bold mt-1 text-muted-foreground">
                    {isRTL
                      ? `النتيجة النهائية: ${result.pct}% (${result.score} من أصل ${result.total} إجابات صحيحة)`
                      : `Final Score: ${result.pct}% (${result.score} of ${result.total} correct)`}
                  </p>

                  <div className="inline-flex items-center gap-2 mt-3 px-3.5 py-1.5 rounded-full bg-background/80 border border-border text-xs font-mono font-bold">
                    {result.passed
                      ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">{isRTL ? 'تم حفظ التقديم في Firebase' : 'Synced to Firebase'}</span></>
                      : <><AlertCircle className="w-3.5 h-3.5 text-amber-500" /><span className="text-amber-500">{isRTL ? 'مطلوب درجة 70% للاجتياز' : '70% Required to Pass'}</span></>}
                  </div>
                </div>

                {/* Educational Feedback Summary Card */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    {isRTL ? 'التوجيه والأداء الأكاديمي' : 'Educational Guidance'}
                  </h4>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    {result.passed
                      ? (isRTL
                          ? 'أظهرت استيعاباً ممتازاً لمفاهيم آلية نشوء السعر، أنواع الأوامر، الفوارق السعرية (Spreads)، ودراسة حالة الفرنك السويسري. يمكنك الآن الانتقال للدرس التالي بثقة.'
                          : 'You demonstrated an excellent grasp of Price Formation, Order Types, Spreads, and market execution mechanics. You are ready for the next lesson.')
                      : (isRTL
                          ? `حصلت على ${result.pct}%. نوصي بمراجعة ورقة عمل حساب السبريد والمثال التطبيقي لأمر المحدد مقابل أمر السوق في الدرس لترسيخ المفاهيم قبل إعادة المحاولة.`
                          : `You scored ${result.pct}%. We recommend reviewing the Spread Worksheet and Order Types sections in this lesson before retaking.`)}
                  </p>
                </div>

                {/* Question-by-Question Detailed Review */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                    {isRTL ? 'مراجعة الأسئلة وتفسير الإجابات:' : 'Question Review & Explanations:'}
                  </h4>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                    {quiz.map((q, idx) => {
                      const userSel = answers[idx];
                      const isCorrect = q.correctIndex !== undefined ? userSel === q.correctIndex : (userSel !== undefined && userSel !== '');

                      return (
                        <div key={idx} className={`p-4 rounded-xl border text-xs space-y-2 ${
                          isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
                        }`}>
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-foreground leading-relaxed text-sm">
                              {idx + 1}. {q.q}
                            </p>
                            {isCorrect ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {isRTL ? 'صحيحة' : 'Correct'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold flex items-center gap-1 shrink-0">
                                <XCircle className="w-3.5 h-3.5" />
                                {isRTL ? 'خطأ' : 'Incorrect'}
                              </span>
                            )}
                          </div>

                          {q.options && (
                            <div className="space-y-1 pt-1">
                              <p className="text-muted-foreground">
                                <span className="font-bold">{isRTL ? 'إجابتك: ' : 'Your answer: '}</span>
                                <span className={isCorrect ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                                  {userSel !== undefined ? q.options[userSel] : (isRTL ? 'لم تجب' : 'Not answered')}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-emerald-400 font-medium">
                                  <span className="font-bold">{isRTL ? 'الإجابة الصحيحة: ' : 'Correct answer: '}</span>
                                  {q.options[q.correctIndex]}
                                </p>
                              )}
                            </div>
                          )}

                          {q.a && (
                            <div className="pt-1.5 border-t border-border/40 text-muted-foreground leading-relaxed">
                              <span className="font-bold text-amber-500">{isRTL ? 'التفسير الأكاديمي: ' : 'Explanation: '}</span>
                              {q.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                  <button
                    onClick={handleRetake}
                    className="px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/70 text-foreground text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {isRTL ? 'إعادة المحاولة' : 'Retake Assessment'}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold cursor-pointer transition-colors shadow-md"
                  >
                    {isRTL ? 'متابعة الدرس' : 'Continue'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AssessmentModal;
