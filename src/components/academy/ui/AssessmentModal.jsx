import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, CheckCircle2, XCircle, Award, ArrowRight, RotateCcw, X, HelpCircle, Check, Loader2 } from 'lucide-react';
import { saveAssessmentResult } from '../../../services/assessmentService';

export const AssessmentModal = ({ isOpen, onClose, schoolId, lesson, school, lang = 'ar', onCompleted }) => {
  const isRTL = lang === 'ar';
  const quiz = lesson[lang]?.quiz || lesson.en?.quiz || [];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultData, setResultData] = useState(null);

  if (!isOpen || quiz.length === 0) return null;

  const currentQuestion = quiz[currentStep];

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentStep < quiz.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let calculatedScore = 0;

    quiz.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      // If question has options & correctIndex
      if (q.correctIndex !== undefined) {
        if (selected === q.correctIndex) calculatedScore += 1;
      } else {
        // If simple q & a model answer, count answered as completed
        if (selected !== undefined && selected !== null) calculatedScore += 1;
      }
    });

    const res = await saveAssessmentResult({
      schoolId,
      lessonId: lesson.id,
      score: calculatedScore,
      totalQuestions: quiz.length,
      answers: selectedAnswers,
      timeSpentSeconds: 120
    });

    setResultData({
      score: calculatedScore,
      total: quiz.length,
      percentage: res.percentage || Math.round((calculatedScore / quiz.length) * 100),
      passed: res.passed ?? ((calculatedScore / quiz.length) >= 0.7)
    });

    setIsSubmitted(true);
    setIsSubmitting(false);
    if (onCompleted) onCompleted(res);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setResultData(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assessment-modal-title"
          className={`w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden relative ${isRTL ? 'rtl' : 'ltr'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-secondary/40">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${school?.color || 'from-amber-500 to-amber-600'} flex items-center justify-center text-white shadow-md`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 id="assessment-modal-title" className="text-lg sm:text-xl font-bold text-foreground">
                  {isRTL ? 'اختبار كفاءة الدرس' : 'Lesson Assessment'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? `الدرس ${lesson.id}: ${lesson[lang]?.title || ''}` : `Lesson ${lesson.id}: ${lesson.en?.title || ''}`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-8">
            {!isSubmitted ? (
              <div>
                {/* Progress Header */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 font-mono font-medium">
                  <span>{isRTL ? `السؤال ${currentStep + 1} من ${quiz.length}` : `Question ${currentStep + 1} of ${quiz.length}`}</span>
                  <span>{Math.round(((currentStep + 1) / quiz.length) * 100)}%</span>
                </div>

                <div className="w-full bg-secondary rounded-full h-1.5 mb-6 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentStep + 1) / quiz.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-foreground leading-relaxed">
                    {currentQuestion.q}
                  </h3>

                  {/* Multiple Choice Options or Model Answer Format */}
                  {currentQuestion.options ? (
                    <div className="space-y-2.5">
                      {currentQuestion.options.map((option, optIdx) => {
                        const isSelected = selectedAnswers[currentStep] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(currentStep, optIdx)}
                            className={`w-full p-4 rounded-xl text-start border transition-all flex items-center justify-between gap-3 text-sm font-medium ${
                              isSelected
                                ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold shadow-sm'
                                : 'border-border bg-secondary/30 text-foreground hover:bg-secondary/70'
                            }`}
                          >
                            <span className="leading-relaxed">{option}</span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'border-amber-500 bg-amber-500 text-black' : 'border-border'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Self-evaluated Open Question with Model Answer Reveal */
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 'فكر في الإجابة واكتب مذكرتك القصيرة أدناه، ثم اختر نعم إذا تطابقت مع مفهومك:' : 'Reflect on the answer and type a brief note, then check option below:'}
                      </p>
                      <textarea
                        value={selectedAnswers[currentStep] || ''}
                        onChange={(e) => handleSelectOption(currentStep, e.target.value)}
                        placeholder={isRTL ? 'اكتب ملاحظتك هنا...' : 'Type your note here...'}
                        className="w-full h-28 p-3.5 rounded-xl bg-secondary/30 border border-border text-foreground text-sm focus:border-amber-500 focus:outline-none resize-none"
                      />
                      {currentQuestion.a && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-foreground/90">
                          <strong className="text-amber-500 block mb-1 font-bold">
                            {isRTL ? 'الإجابة النموذجية:' : 'Model Answer:'}
                          </strong>
                          {currentQuestion.a}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold transition-colors"
                  >
                    {isRTL ? 'السابق' : 'Previous'}
                  </button>

                  {currentStep < quiz.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <span>{isRTL ? 'التالي' : 'Next'}</span>
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isRTL ? 'جاري الحفظ...' : 'Saving...'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isRTL ? 'إنهاء وحفظ النتيجة' : 'Submit Assessment'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Results Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-6"
              >
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-amber-500/10 border border-amber-500/30 text-amber-500">
                  <Award className="w-8 h-8 animate-bounce" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-foreground">
                    {resultData.passed
                      ? (isRTL ? 'أحسنت! تم اجتياز الاختبار بنجاح 🎉' : 'Assessment Passed! 🎉')
                      : (isRTL ? 'مراجعة مطلوبة' : 'Review Recommended')}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isRTL ? `حصلت على درجة ${resultData.percentage}% (${resultData.score} من أصل ${resultData.total})` : `You scored ${resultData.percentage}% (${resultData.score} of ${resultData.total})`}
                  </p>
                </div>

                {/* Score badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border text-sm font-bold">
                  <span className={resultData.passed ? 'text-emerald-500' : 'text-amber-500'}>
                    {resultData.passed ? (isRTL ? 'حالة الاعتماد: مكتمل' : 'Status: Passed') : (isRTL ? 'حالة الاعتماد: ينصح بالمراجعة' : 'Status: Review Required')}
                  </span>
                </div>

                {/* Question Feedback List */}
                <div className="text-start space-y-3 max-h-60 overflow-y-auto pr-1 my-4">
                  {quiz.map((q, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-secondary/40 border border-border text-xs space-y-1">
                      <div className="font-bold text-foreground flex items-center justify-between">
                        <span>Q{idx + 1}: {q.q}</span>
                      </div>
                      {q.a && (
                        <p className="text-muted-foreground leading-relaxed">
                          <strong className="text-amber-500">{isRTL ? 'الإجابة:' : 'Answer:'} </strong>
                          {q.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3 pt-4 border-t border-border">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isRTL ? 'إعادة الاختبار' : 'Retake Assessment'}</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs sm:text-sm font-bold transition-all shadow-md"
                  >
                    {isRTL ? 'متابعة التعلم' : 'Continue Learning'}
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
