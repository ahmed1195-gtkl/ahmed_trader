import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Clock, ExternalLink, TrendingUp, RefreshCw, AlertCircle, MessageCircle, X, User } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Header from './Header';
import Footer from './Footer';
import Comments from './Comments';

const GlobalNews = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // 1. Fetch Admin Posts from Firestore (if exists)
      let adminPosts = [];
      try {
        const adminPostsSnap = await getDocs(query(collection(db, 'admin_posts'), orderBy('createdAt', 'desc')));
        adminPosts = adminPostsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isAdminPost: true,
          pubDate: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
          thumbnail: doc.data().image
        }));
      } catch (e) {
        console.warn("Admin posts collection not found or inaccessible", e);
      }

      // 2. Fetch RSS News
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.investing.com/rss/news_25.rss');
      const data = await response.json();
      
      let rssItems = [];
      if (data.status === 'ok') {
        rssItems = data.items.map(item => ({
          id: btoa(item.link).substring(0, 20),
          title: item.title,
          link: item.link,
          description: item.description,
          pubDate: item.pubDate,
          thumbnail: item.thumbnail || item.enclosure?.link,
          isAdminPost: false
        }));
      }
      
      // Combine and sort by date
      const combined = [...adminPosts, ...rssItems].sort((a, b) => 
        new Date(b.pubDate) - new Date(a.pubDate)
      );
      
      setNews(combined.slice(0, 20));
    } catch (err) {
      console.error('News fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, [fetchNews]);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t('news.liveIntelligence') || 'Global Intelligence'}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                {t('news.titlePart1') || 'Global'} <span className="text-amber-500">{t('news.titlePart2') || 'News'}</span>
              </h1>
            </div>
            <button 
              onClick={fetchNews} 
              disabled={loading}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-amber-500 hover:text-black transition-all group disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="text-xs font-black uppercase tracking-widest">Refresh Feed</span>
            </button>
          </div>

          {error ? (
            <div className="text-center py-24 bg-zinc-900/50 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
              <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{t('news.error') || 'Error'}</h3>
              <p className="text-gray-500 font-medium mb-8">Please check your connection or try again later.</p>
              <button onClick={fetchNews} className="px-8 py-4 bg-amber-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-all">
                {t('news.tryAgain') || 'Try Again'}
              </button>
            </div>
          ) : loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[400px] rounded-[2rem] bg-white/5 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden hover:border-amber-500/30 transition-all duration-500 flex flex-col"
                >
                  <div className="relative p-4">
                    <div className="aspect-[16/10] overflow-hidden relative rounded-[2rem] border border-white/10">
                      {item.mediaType === 'video' ? (
                        <video src={item.thumbnail} className="w-full h-full object-cover" muted preload="none" onMouseOver={(e) => e.target.play()} onMouseOut={(e) => e.target.pause()} />
                      ) : item.mediaType === 'audio' ? (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-black" />
                          </div>
                        </div>
                      ) : (
                        <img src={item.thumbnail || `https://images.unsplash.com/photo-1611974714024-462cd297c8aa?q=80&w=800&auto=format&fit=crop`} 
                          alt=""
                          className="w-full h-full object-contain bg-black/20 group-hover:scale-105 transition-transform duration-700"
                        decoding="async" loading="lazy" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-60" />
                    </div>
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">
                          {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {item.isAdminPost && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 rounded-lg border border-amber-600 shadow-lg">
                          <User className="w-3 h-3 text-black" />
                          <span className="text-[9px] font-black text-black uppercase tracking-widest">Admin Post</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-white mb-4 leading-tight group-hover:text-amber-500 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-8 line-clamp-3 font-medium leading-relaxed flex-1">
                      {item.isAdminPost ? item.content : item.description?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                    </p>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        {new Date(item.pubDate).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setSelectedPost(item)}
                          className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-amber-500 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          {t('news.comments', 'Comments')}
                        </button>
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors group/link"
                        >
                          {t('news.readMore') || 'Read More'}
                          <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedPost && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPost(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
              >
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-amber-500 hover:text-black transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="overflow-y-auto p-8 md:p-12">
                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-amber-500 mb-4">
                      <Clock className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {new Date(selectedPost.pubDate).toLocaleString()}
                      </span>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-6 leading-tight">
                      {selectedPost.title}
                    </h2>
                    
                    {selectedPost.isAdminPost && (
                      <div className="mb-8 rounded-2xl overflow-hidden bg-black border border-white/5">
                        {selectedPost.mediaType === 'video' ? (
                          <video src={selectedPost.thumbnail} controls className="w-full aspect-video" preload="none" />
                        ) : selectedPost.mediaType === 'audio' ? (
                          <div className="p-8 bg-zinc-800/50">
                            <audio src={selectedPost.thumbnail} controls className="w-full" />
                          </div>
                        ) : (
                          <img src={selectedPost.thumbnail} alt="" className="w-full object-cover" decoding="async" loading="lazy" />
                        )}
                      </div>
                    )}

                    <p className="text-gray-400 leading-relaxed mb-8 whitespace-pre-wrap">
                      {selectedPost.isAdminPost ? selectedPost.content : selectedPost.description?.replace(/<[^>]*>?/gm, '')}
                    </p>
                    {!selectedPost.isAdminPost && (
                      <a 
                        href={selectedPost.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all"
                      >
                        {t('news.readFullArticle', 'Read Full Article')}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <Comments postId={selectedPost.id} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default GlobalNews;
