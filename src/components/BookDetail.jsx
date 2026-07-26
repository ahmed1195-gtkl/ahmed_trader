import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, BookOpen, ShoppingCart, Star, ChevronDown, ChevronUp, Lock, Eye, AlertTriangle, Download, Shield, FileText, Maximize2 } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import PaymentModal from './PaymentModal';
import { useBookAccess } from '../hooks/useBookAccess';
import { db, storage } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

const CHAPTER_1_STUB = {
  titleAr: 'الفصل الأول: لماذا يخسر أغلب الناس؟',
  titleEn: 'Chapter 1: Why Do Most People Lose?',
};

const CHAPTERS_LIST = [
  { num: 1, ar: 'لماذا يخسر أغلب الناس؟', en: 'Why Do Most People Lose?', free: true },
  { num: 2, ar: 'سيكولوجية الخوف والطمع', en: 'Psychology of Fear & Greed', free: false },
  { num: 3, ar: 'عقلية المؤسسات ضد عقلية الأفراد', en: 'Institutions vs Individual Mindset', free: false },
  { num: 4, ar: 'أشهر الأخطاء التاريخية في التداول', en: 'Famous Historical Trading Mistakes', free: false },
  { num: 5, ar: 'ما الذي يحرك السعر؟', en: 'What Moves the Price?', free: false },
  { num: 6, ar: 'أنواع الأسواق — أيها مناسب لك؟', en: 'Types of Markets — Which Suits You?', free: false },
  { num: 7, ar: 'كيف تقرأ الرسم البياني؟', en: 'How to Read Charts?', free: false },
  { num: 8, ar: 'فهم دور صناع السوق', en: 'Understanding Market Makers', free: false },
  { num: 9, ar: 'إدارة رأس المال — لماذا أهم من الاستراتيجية', en: 'Capital Management — More Important Than Strategy', free: false },
  { num: 10, ar: 'بناء خطة تداول', en: 'Building a Trading Plan', free: false },
  { num: 11, ar: 'كيفية إدارة الصفقة أثناء تشغيلها', en: 'Managing a Trade While Active', free: false },
  { num: 12, ar: 'الانضباط والروتين اليومي', en: 'Discipline & Daily Routine', free: false },
  { num: 13, ar: 'كيف تتعافى من خسارة كبيرة', en: 'Recovering from a Major Loss', free: false },
  { num: 14, ar: 'كيف تختار أسلوبك واستراتيجيتك؟', en: 'Choosing Your Style & Strategy', free: false },
  { num: 15, ar: 'كيف يفكر صناع السوق (SMC ببساطة)', en: 'How Market Makers Think (SMC Simply)', free: false },
  { num: 16, ar: 'التحليل الفني ضد التحليل الأساسي', en: 'Technical vs Fundamental Analysis', free: false },
  { num: 17, ar: 'بناء أفضلية حقيقية في السوق', en: 'Building a Real Edge in the Market', free: false },
  { num: 18, ar: 'الجانب المظلم للتداول', en: 'The Dark Side of Trading', free: false },
  { num: 19, ar: 'كيف تبني مسيرة طويلة؟', en: 'How to Build a Long Career?', free: false },
  { num: 20, ar: 'التكنولوجيا والذكاء الاصطناعي — هل سيختفي المتداول الفردي؟', en: 'AI & Technology — Will the Individual Trader Disappear?', free: false },
  { num: 21, ar: 'النهاية الحقيقية — فلسفة الختام', en: 'The Real End — Philosophy of the Conclusion', free: false },
];

const BookDetail = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { hasAccess } = useBookAccess();
  const [showChapters, setShowChapters] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFullscreen, setPdfFullscreen] = useState(false);
  const isAr = i18n.language === 'ar';

  const PRICE = 11.99;
  const ORIGINAL_PRICE = 23.98;
  const DISCOUNT_PCT = Math.round(((ORIGINAL_PRICE - PRICE) / ORIGINAL_PRICE) * 100);


  const [bookStats, setBookStats] = useState({ rating: 4.8, reviews: 342, purchases: 1540 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookRef = doc(db, 'books', 'sober-trading');
        const bookSnap = await getDoc(bookRef);
        let readers = 0;
        if (bookSnap.exists()) {
          readers = bookSnap.data().readersCount || 0;
        }

        const reviewsQuery = query(collection(db, 'book_reviews'), where('bookId', '==', 'sober-trading'));
        const reviewsSnap = await getDocs(reviewsQuery);
        
        let totalRating = 0;
        let reviewsCount = 0;
        reviewsSnap.forEach((doc) => {
          totalRating += doc.data().rating || 0;
          reviewsCount++;
        });

        const baseReviews = 342;
        const baseRating = 4.8;
        const basePurchases = 1540;

        const finalReviewsCount = baseReviews + reviewsCount;
        const finalRating = Number(((baseReviews * baseRating + totalRating) / finalReviewsCount).toFixed(1));
        const finalPurchases = basePurchases + readers;

        setBookStats({
          rating: finalRating,
          reviews: finalReviewsCount,
          purchases: finalPurchases
        });
      } catch (err) {
        console.warn('Could not fetch book stats dynamically:', err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Fetch secure PDF download URL from Firebase Storage when user has access ──
  useEffect(() => {
    if (hasAccess) {
      const fetchPdfUrl = async () => {
        try {
          const bookRef = ref(storage, 'books/sober-trading/sober_book.pdf');
          const url = await getDownloadURL(bookRef);
          setPdfUrl(url);
        } catch (err) {
          console.warn('Could not fetch PDF download URL:', err);
        }
      };
      fetchPdfUrl();
    }
  }, [hasAccess]);


  return (
    <>
      <Header />
      <div className="min-h-screen bg-background text-foreground relative">
        {/* Hero Section with Background */}
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            {isDesktop ? (
              <video src="https://Shukritrade.b-cdn.net/0520.mp4"
                autoPlay muted loop playsInline
                className="w-full h-full object-cover opacity-60"
                preload="auto" />
            ) : (
              <img src="/book_background.png" alt="" className="w-full h-full object-cover" decoding="async" loading="lazy" />
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
                <img src="/book_cover.png"
                  alt="Sober Trading"
                  className="w-full rounded-xl shadow-2xl shadow-black/80 border border-white/10"
                  decoding="async" loading="lazy" />
              </motion.div>

              {/* Book Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex-1 pb-2"
              >
                <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tight mb-3 leading-tight">
                  {isAr ? 'التداول الرصين' : 'Sober Trading'}
                </h1>
                <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-4">Shukritrade</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(bookStats.rating) ? 'text-amber-500 fill-amber-500' : 'text-zinc-700'}`} />
                    ))}
                  </div>
                  <span className="text-white font-bold text-sm">{bookStats.rating}</span>
                  <span className="text-zinc-500 text-xs">({bookStats.reviews} {isAr ? 'تقييم' : 'reviews'})</span>
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-black text-white">${PRICE}</span>
                  <span className="text-lg text-zinc-600 line-through">${ORIGINAL_PRICE}</span>
                  <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold">-{DISCOUNT_PCT}%</span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {hasAccess ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/books/sober-trading/read')}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        <BookOpen className="w-5 h-5" />
                        {isAr ? 'ابدأ القراءة' : 'Start Reading'}
                      </motion.button>
                      <motion.a
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        href={pdfUrl || '#'}
                        download="Sober_Trading.pdf"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-amber-500/30 hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 font-black text-sm uppercase tracking-widest transition-all cursor-pointer"
                      >
                        <Download className="w-5 h-5" />
                        {isAr ? 'تحميل PDF' : 'Download PDF'}
                      </motion.a>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentOpen(true)}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {isAr ? 'اشتري الآن' : 'Buy Now'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/books/sober-trading/read')}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-amber-500/30 hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 font-black text-sm uppercase tracking-widest transition-all cursor-pointer"
                      >
                        <BookOpen className="w-5 h-5" />
                        {isAr ? 'ابدأ القراءة (معاينة)' : 'Start Reading (Preview)'}
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Money-Back Guarantee */}
                <div className="mt-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3 max-w-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-500 text-xs font-black uppercase tracking-wider mb-1">
                      {isAr ? 'ضمان استرداد الأموال لمدة 7 أيام' : '7-Day Money-Back Guarantee'}
                    </p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {isAr
                        ? 'إذا قرأت الكتاب كاملاً ولم تستفد — أعيد لك المبلغ خلال 7 أيام'
                        : 'If you read the book in full and do not benefit — we will refund your money within 7 days'}
                    </p>
                  </div>
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
              <div className="sticky top-28 glass-card border border-border rounded-3xl p-6">
                <button
                  onClick={() => setShowChapters(!showChapters)}
                  className="flex items-center justify-between w-full mb-4 cursor-pointer"
                >
                  <h3 className="text-foreground font-black uppercase tracking-widest text-sm">
                    {isAr ? 'الفصول' : 'Chapters'}
                  </h3>
                  <div className="lg:hidden">
                    {showChapters ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </div>
                </button>

                <div className={`space-y-1 ${showChapters ? 'block' : 'hidden lg:block'}`}>
                  {CHAPTERS_LIST.map((ch) => {
                    const isUnlocked = ch.free || hasAccess;
                    return (
                      <div
                        key={ch.num}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                          isUnlocked
                            ? 'hover:bg-amber-500/10 text-white'
                            : 'text-zinc-600 hover:bg-white/5'
                        } ${ch.num === 1 ? 'bg-amber-500/10 border border-amber-500/20' : ''}`}
                        onClick={() => {
                          if (isUnlocked) {
                            if (ch.num === 1) setActiveSection(0);
                            else navigate('/books/sober-trading/read');
                          } else {
                            setPaymentOpen(true);
                          }
                        }}
                      >
                        <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black ${
                          ch.num === 1 ? 'bg-amber-500 text-black' : 'bg-white/5 text-zinc-500'
                        }`}>
                          {ch.num}
                        </span>
                        <span className="text-xs font-bold flex-1 truncate">{isAr ? ch.ar : ch.en}</span>
                        {!isUnlocked && <Lock className="w-3 h-3 text-zinc-600 flex-shrink-0" />}
                        {isUnlocked && <Eye className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {!hasAccess ? (
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                    <p className="text-amber-500 text-xs font-bold mb-2">
                      {isAr ? 'أول 3 دروس من الفصل الأول مجانية!' : 'First 3 lessons of Chapter 1 are free!'}
                    </p>
                    <p className="text-zinc-500 text-[10px]">
                      {isAr ? 'اشترِ الكتاب لقراءة جميع الفصول الـ 21' : 'Buy the book to read all 21 chapters'}
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-600/5 border border-green-500/20">
                    <p className="text-green-500 text-xs font-bold mb-2">
                      {isAr ? 'تم فتح جميع الفصول!' : 'All chapters unlocked!'}
                    </p>
                    <p className="text-zinc-500 text-[10px]">
                      {isAr ? 'يمكنك الآن قراءة الكتاب كاملاً وتحميله.' : 'You can read the entire book and download it.'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Chapter 1 — PDF Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 min-w-0"
            >
              <div className="glass-card border border-border rounded-3xl p-6 md:p-8">

                {/* Chapter Header */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight">
                        {isAr ? CHAPTER_1_STUB.titleAr : CHAPTER_1_STUB.titleEn}
                      </h2>
                      <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {isAr ? 'معاينة مجانية — الفصل الأول كاملاً' : 'Free Preview — Full Chapter 1'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPdfFullscreen(!pdfFullscreen)}
                    title={pdfFullscreen ? (isAr ? 'تصغير' : 'Exit Fullscreen') : (isAr ? 'تكبير' : 'Fullscreen')}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black transition-all flex-shrink-0 cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* PDF Viewer */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pdfFullscreen ? 'full' : 'normal'}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className={`relative rounded-2xl overflow-hidden border border-border bg-zinc-900/30 ${
                      pdfFullscreen
                        ? 'fixed inset-4 z-[200] rounded-2xl shadow-2xl'
                        : ''
                    }`}
                  >
                    {pdfFullscreen && (
                      <button
                        onClick={() => setPdfFullscreen(false)}
                        className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-xl bg-black/70 border border-white/10 text-foreground hover:bg-black transition-all cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    )}
                    <iframe
                      src="/chapter1_sample.pdf#toolbar=1&navpanes=0&scrollbar=1&view=FitH"
                      title={isAr ? 'الفصل الأول — التداول الرصين' : 'Chapter 1 — Sober Trading'}
                      className="w-full border-0"
                      style={{ height: pdfFullscreen ? '100%' : '75vh', minHeight: '500px' }}
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* CTA below PDF */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
                  <p className="text-muted-foreground text-xs text-center sm:text-start">
                    {isAr
                      ? 'أعجبك الفصل الأول؟ احصل على الكتاب كاملاً مع جميع الفصول الـ 21'
                      : 'Enjoyed Chapter 1? Get the complete book with all 21 chapters'}
                  </p>
                  {!hasAccess ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isAr ? 'اشترِ الكتاب كاملاً — ${PRICE}' : `Buy Full Book — $${PRICE}`}
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/books/sober-trading/read')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      <BookOpen className="w-4 h-4" />
                      {isAr ? 'اقرأ الكتاب كاملاً' : 'Read Full Book'}
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
