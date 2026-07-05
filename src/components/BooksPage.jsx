import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, ShoppingCart, Star, Eye, ArrowRight,
  Sparkles, TrendingUp, Brain, Shield, ChevronLeft
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import PaymentModal from './PaymentModal';
import { useBookAccess } from '../hooks/useBookAccess';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useSEO } from '../hooks/useSEO';

const BOOKS = [
  {
    id: 'sober-trading',
    titleAr: 'التداول الرصين',
    titleEn: 'Sober Trading',
    authorAr: 'Shukritrade',
    authorEn: 'Shukritrade',
    descriptionAr: 'دليل شامل يكشف حقيقة الأسواق المالية بعيداً عن الأوهام — سيكولوجية الخوف والطمع، إدارة رأس المال، بناء الأفضلية الحقيقية، وكيف تتداول كالمحترفين في 21 فصلاً متكاملاً.',
    descriptionEn: 'A comprehensive guide that reveals the truth about financial markets — fear and greed psychology, capital management, building a real edge, and how to trade like professionals across 21 complete chapters.',
    cover: '/book_cover.png',
    price: 11.99,
    originalPrice: 23.98,
    currency: '$',
    rating: 4.8,
    reviews: 342,
    chapters: 21,
    pages: 463,
    language: 'ar',
    tags: [
      { ar: 'سيكولوجية التداول', en: 'Trading Psychology' },
      { ar: 'إدارة المخاطر', en: 'Risk Management' },
      { ar: 'الانضباط', en: 'Discipline' }
    ],
    features: [
      { icon: Brain, ar: 'سيكولوجية الخوف والطمع بعمق علمي', en: 'Fear & Greed Psychology — Scientifically Deep' },
      { icon: Shield, ar: 'إدارة رأس المال والمخاطر الاحترافية', en: 'Professional Capital & Risk Management' },
      { icon: TrendingUp, ar: 'أسرار صناع السوق (SMC) بالتفصيل', en: 'Market Makers Secrets (SMC) in Detail' },
      { icon: Sparkles, ar: '21 فصلاً من الدروس العملية الفورية', en: '21 Chapters of Immediate Practical Lessons' }
    ]
  }
];

const BooksPage = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [hoveredBook, setHoveredBook] = useState(null);
  const [paymentBook, setPaymentBook] = useState(null);
  const isAr = i18n.language === 'ar';

  const bookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    'name': isAr ? 'التداول الرصين' : 'Sober Trading',
    'author': {
      '@type': 'Organization',
      'name': 'Shukritrade'
    },
    'bookFormat': 'https://schema.org/EBook',
    'description': isAr 
      ? 'دليل شامل يكشف حقيقة الأسواق المالية بعيداً عن الأوهام — سيكولوجية الخوف والطمع، إدارة رأس المال، بناء الأفضلية الحقيقية.'
      : 'A comprehensive guide that reveals the truth about financial markets — fear and greed psychology, capital management, building a real edge.',
    'image': 'https://shukritrade.com/book_cover.png',
    'offers': {
      '@type': 'Offer',
      'price': '11.99',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock'
    }
  };

  useSEO({
    title: isAr ? 'كتب التداول والتعليم' : 'Trading Books & Guides',
    description: isAr 
      ? 'اكتشف كتاب التداول الرصين والكتب التعليمية الحصرية على منصة Shukritrade.'
      : 'Discover Sober Trading and other premium educational books and guides on Shukritrade.',
    canonicalPath: '/books',
    ogType: 'book',
    schemaData: bookSchema
  });

  const { hasAccess } = useBookAccess();
  const [bookStats, setBookStats] = useState({ rating: 4.8, reviews: 342, purchases: 1540 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Fetch readersCount from books/sober-trading doc
        const bookRef = doc(db, 'books', 'sober-trading');
        const bookSnap = await getDoc(bookRef);
        let readers = 0;
        if (bookSnap.exists()) {
          readers = bookSnap.data().readersCount || 0;
        }

        // 2. Fetch all reviews from book_reviews collection to aggregate rating
        const reviewsQuery = query(collection(db, 'book_reviews'), where('bookId', '==', 'sober-trading'));
        const reviewsSnap = await getDocs(reviewsQuery);
        
        let totalRating = 0;
        let reviewsCount = 0;
        reviewsSnap.forEach((doc) => {
          totalRating += doc.data().rating || 0;
          reviewsCount++;
        });

        // Blend dynamic reviews with historical baseline
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

  return (
    <>
      <Header />
      <section className="min-h-screen bg-background pt-28 pb-20 relative overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/2 rounded-full blur-[200px]"></div>
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-black uppercase tracking-widest">
                {isAr ? 'مكتبة المتداول' : "Trader's Library"}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground uppercase tracking-tighter mb-6">
              <span className="block">{isAr ? 'الكتب' : 'Books'}</span>
              <span className="block text-primary text-3xl md:text-4xl mt-2 font-bold leading-normal">
                {isAr ? 'المعرفة هي أقوى سلاح في التداول' : 'Knowledge is the Most Powerful Weapon in Trading'}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {isAr
                ? 'اكتشف مجموعة الكتب المختارة بعناية لتطوير مهاراتك في التداول والاستثمار'
                : 'Discover our carefully curated collection of books to develop your trading and investment skills'}
            </p>
          </motion.div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 gap-16">
            {BOOKS.map((book, index) => {
              const discountPct = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.4, duration: 0.8 }}
                  onMouseEnter={() => setHoveredBook(book.id)}
                  onMouseLeave={() => setHoveredBook(null)}
                  className="group cursor-pointer"
                >
                  <div className="relative bg-card backdrop-blur-2xl border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-700 shadow-2xl hover:shadow-primary/5">
                    {/* Inner glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 group-hover:from-primary/2 transition-all duration-700"></div>

                    <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 p-8 md:p-12 lg:p-16">
                      {/* Book Cover with 3D Effect */}
                      <div className="relative flex-shrink-0 w-64 md:w-72 lg:w-80">
                        <motion.div
                          whileHover={{ rotateY: -8, rotateX: 3, scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="relative"
                          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                        >
                          {/* Book shadow */}
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>

                          {/* Book image */}
                          <img src={book.cover}
                            alt={isAr ? book.titleAr : book.titleEn}
                            className="relative z-10 w-full rounded-md shadow-2xl shadow-black/50 group-hover:shadow-primary/20 transition-all duration-700"
                            decoding="async" loading="lazy" />

                          {/* Shine effect */}
                          <div className="absolute inset-0 z-20 rounded-md bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                          {/* Discount badge */}
                          <div className="absolute -top-3 -right-3 z-30">
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="bg-destructive text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-md shadow-lg shadow-red-500/30"
                            >
                              {discountPct}% OFF
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 text-center lg:text-start">
                        {/* Tags */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                          {book.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full bg-secondary border border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                            >
                              {isAr ? tag.ar : tag.en}
                            </span>
                          ))}
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight mb-4 leading-tight">
                          {isAr ? book.titleAr : book.titleEn}
                        </h2>

                        {/* Author */}
                        <p className="text-primary font-bold text-sm uppercase tracking-widest mb-6">
                          {isAr ? book.authorAr : book.authorEn}
                        </p>

                        {/* Description */}
                        <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-2xl">
                          {isAr ? book.descriptionAr : book.descriptionEn}
                        </p>

                        {/* Stats Row */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(bookStats.rating) ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`}
                                />
                              ))}
                            </div>
                            <span className="text-foreground font-bold text-sm">{bookStats.rating}</span>
                            <span className="text-muted-foreground text-xs">({bookStats.reviews} {isAr ? 'تقييم' : 'reviews'})</span>
                          </div>
                          <div className="text-muted-foreground text-xs flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {book.chapters} {isAr ? 'فصل' : 'Chapters'}
                          </div>
                          <div className="text-muted-foreground text-xs flex items-center gap-1">
                            {book.pages} {isAr ? 'صفحة' : 'Pages'}
                          </div>
                          <div className="text-muted-foreground text-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-primary" />
                            {bookStats.purchases} {isAr ? 'قارئ' : 'readers'}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 mb-10">
                          {book.features.map((feature, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + idx * 0.1 }}
                              className="flex items-center gap-3 p-3 rounded-md bg-secondary border border-border"
                            >
                              <feature.icon className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground text-xs font-medium">
                                {isAr ? feature.ar : feature.en}
                              </span>
                            </motion.div>
                          ))}
                        </div>

                        {/* Price & Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* Pricing block */}
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-foreground">
                              {book.currency}{book.price}
                            </span>
                            <span className="text-lg text-muted-foreground/30 line-through">
                              {book.currency}{book.originalPrice}
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-black">
                              -{discountPct}%
                            </span>
                          </div>

                          {/* Buttons */}
                          <div className="flex items-center gap-3 flex-wrap justify-center">
                            {/* Preview button */}
                            <motion.button
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => navigate(`/books/${book.id}`)}
                              className="flex items-center gap-2 px-5 py-3.5 rounded-md bg-secondary border border-border hover:border-primary/30 hover:bg-primary/5 text-foreground hover:text-primary font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              {isAr ? 'معاينة مجانية' : 'Free Preview'}
                            </motion.button>

                            {/* Buy Now or Read Book button */}
                            {hasAccess ? (
                              <motion.button
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/books/${book.id}/read`)}
                                className="flex items-center gap-3 px-8 py-4 rounded-md bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-primary/20 hover:brightness-110 cursor-pointer"
                              >
                                <BookOpen className="w-5 h-5" />
                                {isAr ? 'اقرأ الكتاب' : 'Read Book'}
                                <ArrowRight className="w-4 h-4" />
                              </motion.button>
                            ) : (
                              <motion.button
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setPaymentBook(book)}
                                className="flex items-center gap-3 px-8 py-4 rounded-md bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-primary/20 hover:brightness-110 cursor-pointer"
                              >
                                <ShoppingCart className="w-5 h-5" />
                                {isAr ? 'اشتري الآن' : 'Buy Now'}
                                <ArrowRight className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-24 text-center"
          >
            <div className="relative inline-block p-12 md:p-16 rounded-xl bg-card border border-border backdrop-blur-xl">
              <div className="absolute inset-0 bg-primary/2 rounded-xl"></div>
              <div className="relative">
                <Sparkles className="w-10 h-10 text-primary mx-auto mb-6" />
                <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight mb-4">
                  {isAr ? 'المزيد من الكتب قريباً' : 'More Books Coming Soon'}
                </h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  {isAr
                    ? 'نعمل على إضافة المزيد من الكتب المتخصصة في التداول والاستثمار'
                    : 'We are working on adding more specialized books in trading and investment'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={!!paymentBook}
        onClose={() => setPaymentBook(null)}
        bookTitle={paymentBook ? (isAr ? paymentBook.titleAr : paymentBook.titleEn) : ''}
        price={paymentBook?.price ?? 11.99}
        originalPrice={paymentBook?.originalPrice ?? 23.98}
      />
    </>
  );
};

export default BooksPage;
