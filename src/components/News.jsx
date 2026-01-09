import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Newspaper, Clock, ExternalLink, TrendingUp, AlertCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const News = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Using a reliable RSS to JSON converter for Forex Factory / Investing news
      // Forex Factory RSS: https://www.forexfactory.com/ff_calendar_thisweek.xml (Calendar)
      // For news, we can use a general financial news API or RSS feed
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.investing.com/rss/news_285.rss');
      const data = await response.json();
      if (data.status === 'ok') {
        setNews(data.items);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-black uppercase tracking-[0.3em] text-xs">Market Intelligence</span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
                Live <span className="text-yellow-500">Economic</span> News
              </h1>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Data Source</p>
                <p className="text-sm font-bold text-white">Investing.com & Forex Factory</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-white/5 animate-pulse border border-white/5"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-500/50 transition-all duration-500"
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={item.thumbnail || `https://images.unsplash.com/photo-1611974714024-462cd297c8aa?q=80&w=800&auto=format&fit=crop`} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3" />
                        {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {new Date(item.pubDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white mb-4 leading-tight group-hover:text-yellow-500 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-400 mb-6 line-clamp-3 font-medium leading-relaxed">
                      {item.description.replace(/<[^>]*>?/gm, '')}
                    </p>

                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest group/link"
                    >
                      Read Full Story
                      <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                    </a>
                  </div>
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
