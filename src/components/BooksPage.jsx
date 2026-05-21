import React, { useState } from 'react';
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

const BOOKS = [
  {
    id: 'sober-trading',
    titleAr: 'التداول الرصين: كيف تتداول بعد قرون من الأخطاء',
    titleEn: 'Sober Trading: How to Trade After Centuries of Mistakes',
    authorAr: 'Shukritrade',
    authorEn: 'Shukritrade',
    descriptionAr: 'استخلص دروساً من 400 عام من انتصارات وانهيارات الأسواق في منهجية عملية: دليلك لاكتساب عقلية المتداول المنضبط الذي يحافظ على رأس المال ويبني الثروة.',
    descriptionEn: 'Draw lessons from 400 years of market triumphs and crashes into a practical methodology: your guide to acquiring the mindset of a disciplined trader who preserves capital and builds wealth.',
    cover: '/book_cover.png',
    price: 11.99,
    originalPrice: 23.98,
    currency: '$',
    rating: 4.8,
    reviews: 342,
    chapters: 12,
    pages: 380,
    language: 'ar',
    tags: [
      { ar: 'سيكولوجية التداول', en: 'Trading Psychology' },
      { ar: 'إدارة المخاطر', en: 'Risk Management' },
      { ar: 'الانضباط', en: 'Discipline' }
    ],
    features: [
      { icon: Brain, ar: 'سيكولوجية التداول العميقة', en: 'Deep Trading Psychology' },
      { icon: Shield, ar: 'استراتيجيات إدارة المخاطر', en: 'Risk Management Strategies' },
      { icon: TrendingUp, ar: 'دروس من 400 عام من التاريخ', en: 'Lessons from 400 Years of History' },
      { icon: Sparkles, ar: 'تطبيقات عملية فورية', en: 'Immediate Practical Applications' }
    ]
  }
];

const BooksPage = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [hoveredBook, setHoveredBook] = useState(null);
  const [paymentBook, setPaymentBook] = useState(null);
  const isAr = i18n.language === 'ar';

  return (
    <>
      <Header />
      <section className="min-h-screen bg-black pt-28 pb-20 relative overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-600/3 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/2 rounded-full blur-[200px]"></div>
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/20 rounded-full"
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8"
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span className="text-amber-500 text-xs font-black uppercase tracking-widest">
                {isAr ? 'مكتبة المتداول' : "Trader's Library"}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-6">
              <span className="block">{isAr ? 'الكتب' : 'Books'}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-3xl md:text-4xl mt-2">
                {isAr ? 'المعرفة هي أقوى سلاح في التداول' : 'Knowledge is the Most Powerful Weapon in Trading'}
              </span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
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
                  <div className="relative bg-zinc-900/30 backdrop-blur-2xl border border-white/5 rounded-[3rem] overflow-hidden hover:border-amber-500/30 transition-all duration-700 shadow-2xl hover:shadow-amber-500/10">
                    {/* Inner glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-amber-600/0 group-hover:from-amber-500/5 group-hover:to-amber-600/5 transition-all duration-700"></div>

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
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-amber-500/10 blur-3xl rounded-full group-hover:bg-amber-500/20 transition-all duration-700"></div>

                          {/* Book image */}
                          <img src={book.cover}
                            alt={isAr ? book.titleAr : book.titleEn}
                            className="relative z-10 w-full rounded-2xl shadow-2xl shadow-black/50 group-hover:shadow-amber-500/20 transition-all duration-700"
                          decoding="async" loading="lazy" />

                          {/* Shine effect */}
                          <div className="absolute inset-0 z-20 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                          {/* Discount badge */}
                          <div className="absolute -top-3 -right-3 z-30">
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg shadow-red-500/30"
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
                              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-zinc-400"
                            >
                              {isAr ? tag.ar : tag.en}
                            </span>
                          ))}
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
                          {isAr ? book.titleAr : book.titleEn}
                        </h2>

                        {/* Author */}
                        <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-6">
                          {isAr ? book.authorAr : book.authorEn}
                        </p>

                        {/* Description */}
                        <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-2xl">
                          {isAr ? book.descriptionAr : book.descriptionEn}
                        </p>

                        {/* Stats Row */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'text-amber-500 fill-amber-500' : 'text-zinc-700'}`}
                                />
                              ))}
                            </div>
                            <span className="text-white font-bold text-sm">{book.rating}</span>
                            <span className="text-zinc-500 text-xs">({book.reviews})</span>
                          </div>
                          <div className="text-zinc-500 text-xs flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {book.chapters} {isAr ? 'فصل' : 'Chapters'}
                          </div>
                          <div className="text-zinc-500 text-xs flex items-center gap-1">
                            {book.pages} {isAr ? 'صفحة' : 'Pages'}
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
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                            >
                              <feature.icon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                              <span className="text-zinc-400 text-xs font-medium">
                                {isAr ? feature.ar : feature.en}
                              </span>
                            </motion.div>
                          ))}
                        </div>

                        {/* Price & Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* Pricing block */}
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-white">
                              {book.currency}{book.price}
                            </span>
                            <span className="text-lg text-zinc-600 line-through">
                              {book.currency}{book.originalPrice}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-black">
                              -{discountPct}%
                            </span>
                          </div>

                          {/* Buttons */}
                          <div className="flex items-center gap-3 flex-wrap justify-center">
                            {/* Preview button */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => navigate(`/books/${book.id}`)}
                              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5 text-zinc-300 hover:text-amber-400 font-bold text-sm uppercase tracking-widest transition-all cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              {isAr ? 'معاينة مجانية' : 'Free Preview'}
                            </motion.button>

                            {/* Buy Now button */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setPaymentBook(book)}
                              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 cursor-pointer"
                            >
                              <ShoppingCart className="w-5 h-5" />
                              {isAr ? 'اشتري الآن' : 'Buy Now'}
                              <ArrowRight className="w-4 h-4" />
                            </motion.button>
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
            <div className="relative inline-block p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-white/5 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-amber-600/5 rounded-[3rem]"></div>
              <div className="relative">
                <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-6" />
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4">
                  {isAr ? 'المزيد من الكتب قريباً' : 'More Books Coming Soon'}
                </h3>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
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
