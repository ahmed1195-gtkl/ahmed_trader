import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, BookOpen, ShoppingCart, Star, ChevronDown, ChevronUp, Lock, Eye } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import PaymentModal from './PaymentModal';

const CHAPTER_1 = {
  titleAr: 'الفصل الأول: لماذا يخسر أغلب الناس؟',
  titleEn: 'Chapter 1: Why Do Most People Lose?',
  sections: [
    {
      titleAr: 'الافتتاحية: وهم المعرفة المسبقة',
      titleEn: 'Opening: The Illusion of Prior Knowledge',
      contentAr: `تخيل معي للحظة أنني أعطيتك القدرة على رؤية المستقبل. تحديداً، أعطيتك صحيفة وول ستريت جورنال قبل 24 ساعة من نشرها. أنت تعرف ماذا سيكتبون غداً.

هل تعتقد أنك ستجني أرباحاً خيالية؟

هذه تجربة حقيقية أجرتها شركة Elm Wealth الاستشارية. أعطوا 118 طالباً في كلية المال والأعمال صفحة الجريدة الأولى قبل 24 ساعة من نشرها.

النتائج صدمت الجميع: نصف المشاركين خسروا أموالهم. و16% منهم خسروا كل شيء - تم محو حساباتهم بالكامل.

هؤلاء الطلاب توقعوا الاتجاه الصحيح في 51.5% من الحالات. إذا كانوا يعرفون المستقبل… لماذا خسروا؟

لأن التداول ليس مجرد معرفة أين سيتحرك السوق. التداول هو معرفة كم يجب أن تراهن، ومتى تتوقف، وكيف تحمي نفسك عندما تكون مخطئاً.`,
    },
    {
      titleAr: 'الدرس الأول: وهم الثراء السريع',
      titleEn: 'Lesson 1: The Illusion of Quick Wealth',
      contentAr: `كارلوس، شاب في التاسعة والعشرين من عمره، كان يعمل مهندساً. في أحد الأيام، ظهر له إعلان بعنوان "كيف حولت 500 دولار إلى 50,000 دولار في شهر واحد".

أودع 3000 دولار. في الأسبوع الأول، ربح 400 دولار. زاد حجم صفقاته. في الأسبوع الثاني، خسر 2500 دولار. بدأ يدخل صفقات عشوائية "لتعويض" ما خسره.

بعد شهر واحد فقط، كان حسابه صفراً.

لماذا وهم الثراء السريع قوي جداً؟ عندما ترى صورة لشخص حقق أرباحاً خيالية، يفرز دماغك مادة الدوبامين. هذه المادة تقلل من قدرتك على تقييم المخاطر بشكل موضوعي.

يقول مارك دوغلاس: "السوق لا يكافئ الأذكياء. السوق يكافئ المنضبطين."`,
    },
    {
      titleAr: 'الدرس الثاني: تأثير السوشيال ميديا',
      titleEn: 'Lesson 2: Social Media Effect',
      contentAr: `محمد، شاب في الثانية والعشرين، كان يتابع أحد "المؤثرين" الماليين. دفع 200 دولار شهرياً للانضمام لمجموعته. تلقى إشارات تداول. خسر كل مرة.

محمد لم يكن يعلم أن هذا "المؤثر" لم يكن يتداول أصلاً. كان يكسب ماله من الاشتراكات الشهرية.

بحسب التقارير: 1 من كل 3 متداولين جدد ينسحبون تماماً خلال 6 أشهر. و58% من المبتدئين يخسرون كل أموالهم تقريباً خلال عامهم الأول.

الأسباب الأكثر شيوعاً:
• ضعف البحث وفهم السوق - 55%
• الخوف من تفويت الفرصة (FOMO) - 44%`,
    },
    {
      titleAr: 'الدرس الثالث: لماذا يربح القليل فقط؟',
      titleEn: 'Lesson 3: Why Do Only Few Win?',
      contentAr: `هناك ثلاث فئات في السوق:

الفئة الأولى - المؤسسات والبنوك: 85% منهم يربحون. لديهم فرق كاملة وأنظمة صارمة.

الفئة الثانية - المتداولون المنضبطون: 45% منهم يحققون أرباحاً. يلتزمون بإدارة المخاطر، لديهم خطة مكتوبة، يتوقفون عند التعب النفسي.

الفئة الثالثة - "المحظوظون" المؤقتون: أقل من 2% يستمرون في الربح بعد 5-10 سنوات.

الفرق الحقيقي: الناجح يحدد مسبقاً كم سيخسر. الخاسر لا يحدد أو يخالف قاعدته. الناجح يدخل فقط عندما تتوفر شروط خطته. الخاسر يدخل لأن "السوق يبدو صاعداً".`,
    },
    {
      titleAr: 'الدرس الرابع: المقامر والمتداول',
      titleEn: 'Lesson 4: Gambler vs Trader',
      contentAr: `المقامر لا يعرف متى يتوقف. المقامر يخاطر بأكثر مما يستطيع تحمل خسارته. يلاحق الخسارة محاولاً "تعويضها".

المتداول الحقيقي يعرف بالضبط كم سيخسر قبل أن يدخل الصفقة. يعرف أن الخسارة جزء من اللعبة.

اختبار بسيط لنفسك:
• هل تترك صفقاتك الخاسرة مفتوحة بعد وقف الخسارة؟
• هل تتداول أكثر بعد سلسلة خسائر؟
• هل تشعر بالنشوة عند الربح والاكتئاب عند الخسارة؟

إذا أجبت بنعم على 3 أو أكثر، فأنت تتداول بعقلية المقامر.`,
    },
    {
      titleAr: 'ماذا تعلمت في هذا الفصل؟',
      titleEn: 'What Did You Learn?',
      contentAr: `ثلاث نقاط أساسية:

أولاً: وهم الثراء السريع فخ كيميائي حقيقي في دماغك. الدوبامين يقلل من قدرتك على تقييم المخاطر.

ثانياً: صناع المحتوى المالي نموذج أعمالهم لا يعتمد على نجاحك. يعتمد على مشاركتك.

ثالثاً: الفرق بين الخاسر والناجح ليس في الذكاء. الفرق في الانضباط وإدارة المخاطر واحترام الخسارة.

"السوق لا يدمر الناس… الناس يدمرون أنفسهم داخل السوق."`,
    }
  ]
};

const CHAPTERS_LIST = [
  { num: 1, ar: 'لماذا يخسر أغلب الناس؟', en: 'Why Do Most People Lose?', free: true },
  { num: 2, ar: 'سيكولوجية الخوف والطمع', en: 'Psychology of Fear & Greed', free: false },
  { num: 3, ar: 'إدارة رأس المال', en: 'Capital Management', free: false },
  { num: 4, ar: 'بناء خطة التداول', en: 'Building a Trading Plan', free: false },
  { num: 5, ar: 'التحليل الفني الأساسي', en: 'Basic Technical Analysis', free: false },
  { num: 6, ar: 'الشموع اليابانية', en: 'Japanese Candlesticks', free: false },
  { num: 7, ar: 'مستويات الدعم والمقاومة', en: 'Support & Resistance Levels', free: false },
  { num: 8, ar: 'المؤشرات الفنية', en: 'Technical Indicators', free: false },
  { num: 9, ar: 'استراتيجيات الدخول والخروج', en: 'Entry & Exit Strategies', free: false },
  { num: 10, ar: 'التداول في الأخبار', en: 'News Trading', free: false },
  { num: 11, ar: 'بناء الروتين اليومي', en: 'Building Daily Routine', free: false },
  { num: 12, ar: 'الطريق إلى الاحتراف', en: 'Path to Professionalism', free: false },
];

const BookDetail = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [showChapters, setShowChapters] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const isAr = i18n.language === 'ar';

  const PRICE = 11.99;
  const ORIGINAL_PRICE = 23.98;
  const DISCOUNT_PCT = Math.round(((ORIGINAL_PRICE - PRICE) / ORIGINAL_PRICE) * 100);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black relative">
        {/* Hero Section with Background */}
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            {isDesktop ? (
              <video
                src="https://Shukritrade.b-cdn.net/0520.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <img src="/book_background.png" alt="" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_85%)]"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 max-w-7xl h-full flex items-end pb-16 pt-28">
            <div className="flex flex-col md:flex-row items-end gap-8 w-full">
              {/* Back Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/books')}
                className="absolute top-28 left-4 md:left-8 flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">
                  {isAr ? 'العودة للكتب' : 'Back to Books'}
                </span>
              </motion.button>

              {/* Book Cover */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-shrink-0 w-48 md:w-56"
              >
                <img
                  src="/book_cover.png"
                  alt="Sober Trading"
                  className="w-full rounded-xl shadow-2xl shadow-black/80 border border-white/10"
                />
              </motion.div>

              {/* Book Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex-1 pb-2"
              >
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-3 leading-tight">
                  {isAr ? 'التداول الرصين' : 'Sober Trading'}
                </h1>
                <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-4">
                  Shukritrade
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 5 ? 'text-amber-500 fill-amber-500' : 'text-zinc-700'}`} />
                    ))}
                  </div>
                  <span className="text-white font-bold text-sm">4.8</span>
                  <span className="text-zinc-500 text-xs">(342 {isAr ? 'تقييم' : 'reviews'})</span>
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-black text-white">${PRICE}</span>
                  <span className="text-lg text-zinc-600 line-through">${ORIGINAL_PRICE}</span>
                  <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold">-{DISCOUNT_PCT}%</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentOpen(true)}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isAr ? 'اشتري الآن' : 'Buy Now'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/books/sober-trading/read')}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-amber-500/30 hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 font-black text-sm uppercase tracking-widest transition-all cursor-pointer"
                  >
                    <BookOpen className="w-5 h-5" />
                    {isAr ? 'ابدأ القراءة' : 'Start Reading'}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Chapters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:w-80 flex-shrink-0"
            >
              <div className="sticky top-28 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                <button
                  onClick={() => setShowChapters(!showChapters)}
                  className="flex items-center justify-between w-full mb-4 cursor-pointer"
                >
                  <h3 className="text-white font-black uppercase tracking-widest text-sm">
                    {isAr ? 'الفصول' : 'Chapters'}
                  </h3>
                  <div className="lg:hidden">
                    {showChapters ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </div>
                </button>

                <div className={`space-y-1 ${showChapters ? 'block' : 'hidden lg:block'}`}>
                  {CHAPTERS_LIST.map((ch) => (
                    <div
                      key={ch.num}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                        ch.free
                          ? 'hover:bg-amber-500/10 text-white'
                          : 'text-zinc-600 hover:bg-white/5'
                      } ${ch.num === 1 ? 'bg-amber-500/10 border border-amber-500/20' : ''}`}
                      onClick={() => ch.free && setActiveSection(0)}
                    >
                      <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black ${
                        ch.num === 1 ? 'bg-amber-500 text-black' : 'bg-white/5 text-zinc-500'
                      }`}>
                        {ch.num}
                      </span>
                      <span className="text-xs font-bold flex-1 truncate">
                        {isAr ? ch.ar : ch.en}
                      </span>
                      {!ch.free && <Lock className="w-3 h-3 text-zinc-600 flex-shrink-0" />}
                      {ch.free && <Eye className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                  <p className="text-amber-500 text-xs font-bold mb-2">
                    {isAr ? 'الفصل الأول مجاني!' : 'First Chapter is Free!'}
                  </p>
                  <p className="text-zinc-500 text-[10px]">
                    {isAr ? 'اشتر الكتاب لقراءة جميع الفصول' : 'Buy the book to read all chapters'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Chapter Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 min-w-0"
            >
              <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                      {isAr ? CHAPTER_1.titleAr : CHAPTER_1.titleEn}
                    </h2>
                    <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                      {isAr ? 'معاينة مجانية' : 'Free Preview'}
                    </p>
                  </div>
                </div>

                {/* Section Navigation */}
                <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-white/5">
                  {CHAPTER_1.sections.map((section, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSection(idx)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeSection === idx
                          ? 'bg-amber-500 text-black'
                          : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      {isAr ? section.titleAr.substring(0, 30) + '...' : section.titleEn}
                    </button>
                  ))}
                </div>

                {/* Active Section Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-black text-amber-500 mb-6">
                      {isAr
                        ? CHAPTER_1.sections[activeSection].titleAr
                        : CHAPTER_1.sections[activeSection].titleEn}
                    </h3>
                    <div className="prose prose-invert max-w-none">
                      {CHAPTER_1.sections[activeSection].contentAr.split('\n\n').map((paragraph, idx) => (
                        <motion.p
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="text-zinc-300 leading-[2] text-base mb-4"
                          dir="rtl"
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation between sections */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                  <button
                    onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                    disabled={activeSection === 0}
                    className="px-6 py-3 rounded-xl bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    {isAr ? 'السابق' : 'Previous'}
                  </button>

                  <span className="text-zinc-600 text-xs">
                    {activeSection + 1} / {CHAPTER_1.sections.length}
                  </span>

                  {activeSection < CHAPTER_1.sections.length - 1 ? (
                    <button
                      onClick={() => setActiveSection(activeSection + 1)}
                      className="px-6 py-3 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
                    >
                      {isAr ? 'التالي' : 'Next'}
                    </button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentOpen(true)}
                      className="px-6 py-3 rounded-xl bg-amber-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-all cursor-pointer"
                    >
                      {isAr ? 'اشتر الكتاب كاملاً' : 'Buy Full Book'}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        bookTitle={isAr ? 'التداول الرصين' : 'Sober Trading'}
        price={PRICE}
        originalPrice={ORIGINAL_PRICE}
      />
    </>
  );
};

export default BookDetail;
