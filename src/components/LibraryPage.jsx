import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  Download, 
  X, 
  Star, 
  Book
} from 'lucide-react';

const dummyBooks = [
  {
    id: '1',
    title: 'Sober Trading: How to Trade After Centuries of Mistakes',
    author: 'Ahmed Trader',
    category: 'Psychology',
    cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800',
    description: 'Draw lessons from 400 years of market triumphs and crashes into a practical methodology: your guide to acquiring the mindset of a disciplined trader who preserves capital and builds wealth.',
    pages: 320,
    readingLevel: 'Beginner to Advanced',
  },
  {
    id: '2',
    title: 'The Intelligent Investor',
    author: 'Benjamin Graham',
    category: 'Value Investing',
    cover: 'https://images.unsplash.com/photo-1611974714658-75d4f11a8117?auto=format&fit=crop&q=80&w=800',
    description: 'The Intelligent Investor by Benjamin Graham, first published in 1949, is a widely acclaimed book on value investing. It teaches the philosophy of "investment" versus "speculation" and advocates for a long-term approach to the stock market.',
    pages: 640,
    readingLevel: 'Intermediate',
  },
  {
    id: '3',
    title: 'Trading in the Zone',
    author: 'Mark Douglas',
    category: 'Trading Psychology',
    cover: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=800',
    description: 'Trading in the Zone by Mark Douglas is a classic book on trading psychology. It focuses on the mental discipline required to become a consistently successful trader.',
    pages: 240,
    readingLevel: 'Intermediate',
  },
  {
    id: '4',
    title: 'Reminiscences of a Stock Operator',
    author: 'Edwin Lefèvre',
    category: 'Trading History',
    cover: 'https://images.unsplash.com/photo-1526303328184-9758f57165b8?auto=format&fit=crop&q=80&w=800',
    description: 'Reminiscences of a Stock Operator is a fictionalized biography of Jesse Livermore, a legendary stock trader. It offers timeless insights into market speculation and human psychology.',
    pages: 304,
    readingLevel: 'Beginner',
  },
  {
    id: '5',
    title: 'Market Wizards',
    author: 'Jack D. Schwager',
    category: 'Interviews',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    description: 'Market Wizards features interviews with some of the world\'s most successful traders. It provides valuable lessons on trading strategies, risk management, and market philosophy.',
    pages: 512,
    readingLevel: 'Advanced',
  },
  {
    id: '6',
    title: 'One Up On Wall Street',
    author: 'Peter Lynch',
    category: 'Growth Investing',
    cover: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800',
    description: 'Peter Lynch\'s classic guide to investing, One Up On Wall Street, shows how average investors can become experts in their own field and use that expertise to pick winning stocks.',
    pages: 304,
    readingLevel: 'Beginner',
  },
];

const BookCard = ({ book, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-2xl border border-white/5"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onPreview(book)}
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      style={{ backgroundColor: '#131A29' }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <motion.img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-60" />
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-white/5 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent pointer-events-none" />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-amber-500 text-black p-3 rounded-full shadow-xl"
              >
                <BookOpen className="w-6 h-6" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
            {book.category}
          </span>
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1 line-clamp-1 group-hover:text-amber-500 transition-colors">
          {book.title}
        </h3>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          {book.author}
        </p>
      </div>
    </motion.div>
  );
};

const PreviewModal = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      
      <motion.div
        className="relative bg-[#131A29] rounded-[2.5rem] overflow-hidden max-w-5xl w-full shadow-2xl border border-white/10 flex flex-col md:flex-row"
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 rounded-2xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full md:w-2/5 relative aspect-[3/4] md:aspect-auto">
          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" decoding="async" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131A29] via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-6">
              {book.category}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
              {book.title}
            </h2>
            <p className="text-lg text-amber-500/80 font-bold uppercase tracking-widest mb-8">
              By {book.author}
            </p>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              {book.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pages</p>
                <p className="text-xl font-black text-white">{book.pages}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Level</p>
                <p className="text-xl font-black text-white">{book.readingLevel}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              className="flex-1 py-5 rounded-2xl bg-amber-500 text-black font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02, backgroundColor: '#f0bf52' }}
              whileTap={{ scale: 0.98 }}
            >
              <BookOpen className="w-5 h-5" /> Read Online
            </motion.button>
            <motion.button
              className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5" /> Download PDF
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Psychology', 'Value Investing', 'Trading Psychology', 'Trading History', 'Growth Investing', 'Interviews'];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredBooks = dummyBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-amber-500/30">
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(240,191,82,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container mx-auto max-w-7xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none">
              ShukriTrade <span className="text-amber-500">Library</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto uppercase tracking-widest">
              Trading knowledge, psychology, and market mastery.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 mb-16">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="SEARCH BOOKS, AUTHORS, OR TOPICS..."
                className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-[#131A29] border border-white/5 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-8 py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border ${
                    selectedCategory === category 
                    ? 'bg-amber-500 text-black border-amber-500 shadow-xl shadow-amber-500/10' 
                    : 'bg-[#131A29] text-gray-500 border-white/5 hover:border-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl bg-[#131A29] animate-pulse border border-white/5" />
                ))
              ) : (
                filteredBooks.map(book => (
                  <BookCard key={book.id} book={book} onPreview={setSelectedBook} />
                ))
              )}
            </AnimatePresence>
          </div>

          {!isLoading && filteredBooks.length === 0 && (
            <div className="py-32 text-center">
              <p className="text-gray-500 font-black uppercase tracking-[0.3em]">No books found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedBook && <PreviewModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;
