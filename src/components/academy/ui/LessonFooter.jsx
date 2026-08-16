import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, GraduationCap, CheckCircle } from 'lucide-react';

export const LessonFooter = ({ schoolId, school, prevLesson, nextLesson, onOpenAssessment, lang = 'ar' }) => {
  const navigate = useNavigate();
  const isRTL = lang === 'ar';

  return (
    <div className="mt-12 pt-8 border-t border-border space-y-6">
      {/* Assessment Trigger Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center justify-between gap-4 flex-wrap shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {isRTL ? 'جاهز لاختبار معلوماتك لهذا الدرس؟' : 'Ready to test your knowledge for this lesson?'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isRTL ? 'خض اختبار الكفاءة لحفظ مستواك وتوثيق إنجازك في الأكاديمية' : 'Take the competency test to verify your learning and track progress.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAssessment}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-xs sm:text-sm shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <GraduationCap className="w-4 h-4" />
          <span>{isRTL ? 'بدء اختبار الكفاءة' : 'Start Lesson Assessment'}</span>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        {prevLesson ? (
          <button
            onClick={() => navigate(`/academy/${schoolId}/lesson/${prevLesson.id}`)}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl border border-border hover:border-amber-500/30 transition-all text-xs sm:text-sm font-semibold cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-[10px] text-muted-foreground uppercase">{isRTL ? 'الدرس السابق' : 'Previous Lesson'}</div>
              <div className="text-foreground font-bold truncate max-w-[120px] sm:max-w-[200px]">
                {(prevLesson[lang] || prevLesson.en)?.title}
              </div>
            </div>
          </button>
        ) : <div />}

        {nextLesson ? (
          <button
            onClick={() => navigate(`/academy/${schoolId}/lesson/${nextLesson.id}`)}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r ${school?.color || 'from-amber-500 to-amber-600'} hover:opacity-95 text-white rounded-xl transition-all text-xs sm:text-sm font-bold shadow-md cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
              <div className="text-[10px] text-white/80 uppercase">{isRTL ? 'الدرس التالي' : 'Next Lesson'}</div>
              <div className="text-white font-bold truncate max-w-[120px] sm:max-w-[200px]">
                {(nextLesson[lang] || nextLesson.en)?.title}
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <button
            onClick={() => navigate(`/academy/${schoolId}`)}
            className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-xl transition-all text-xs sm:text-sm font-bold shadow-md cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isRTL ? 'إكمال المحور والعودة' : 'Complete Module'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonFooter;
