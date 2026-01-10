import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Clock, ExternalLink, TrendingUp, RefreshCw } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const News = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Using a more stable proxy/API for financial news
      // Using a more reliable financial news source and ensuring no API key issues
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.investing.com/rss/news_25.rss');
      const data = await response.json();
      if (data.status === 'ok') {
        setNews(data.items.slice(0, 12)); // Limit to 12 items for performance
      } else {
        throw new Error('Failed to fetch');
      }
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
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('news.liveIntelligence')}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">{t('news.titlePart1')} <span className="text-yellow-500">{t('news.titlePart2')}</span></h1>
            </div>
            <button onClick={fetchNews} className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-yellow-500 hover:text-black transition-all">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {error ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-gray-400 font-bold mb-4">{t('news.error')}</p>
              <button onClick={fetchNews} className="text-yellow-500 font-black uppercase text-xs tracking-widest underline">{t('news.tryAgain')}</button>
            </div>
          ) : loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {news.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-xl md:rounded-2xl p-5 md:p-6 hover:border-yellow-500/30 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" />
                      {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                      {new Date(item.pubDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mb-3 leading-tight group-hover:text-yellow-500 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 mb-6 line-clamp-2 font-medium leading-relaxed">
                    {item.description.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                  </p>

                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    {t('news.readMore')} <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
