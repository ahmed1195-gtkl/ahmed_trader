import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGlobalNews } from '@/lib/bot/analysis/market_intelligence';
import { useTranslation } from 'react-i18next';

export default function NewsPage() {
  const { t } = useTranslation();
  const [newsEvents, setNewsEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('daily'); // daily or weekly
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const newsIntervalRef = useRef(null);

  // الأصول المتاحة
  const assets = [
    'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'DOT', 'LINK',
    'MATIC', 'SHIB', 'LTC', 'BCH', 'UNI', 'ATOM', 'NEAR', 'APT', 'OP', 'ARB'
  ];

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const gNewsData = await fetchGlobalNews(selectedAsset);
      
      const now = new Date();
      const formattedNews = gNewsData.map(n => ({
        id: Math.random().toString(36).substr(2, 9),
        title: n.title,
        source: n.source,
        sentiment: n.sentiment,
        publishedAt: new Date(n.publishedAt),
        description: n.description,
        url: n.url || '#'
      }));

      setNewsEvents(formattedNews);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    newsIntervalRef.current = setInterval(fetchNews, 120000); // تحديث كل دقيقتين
    return () => clearInterval(newsIntervalRef.current);
  }, [selectedAsset]);

  // تصفية الأخبار حسب الفترة الزمنية
  const filterNewsByPeriod = () => {
    const now = new Date();
    if (activeTab === 'daily') {
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return newsEvents.filter(n => n.publishedAt > oneDayAgo);
    } else {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return newsEvents.filter(n => n.publishedAt > oneWeekAgo);
    }
  };

  const filteredNews = filterNewsByPeriod();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* الرأس */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                {t('nav.news') || 'News & Events'}
              </h1>
            </div>
            <Button
              onClick={fetchNews}
              disabled={isLoading}
              variant="ghost"
              className="p-2 hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-yellow-500 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* اختيار الأصل */}
          <div className="flex flex-wrap gap-2 mb-6">
            {assets.map(asset => (
              <Button
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                variant={selectedAsset === asset ? 'default' : 'outline'}
                className={`px-3 py-1 text-xs font-black uppercase tracking-widest ${
                  selectedAsset === asset
                    ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                    : 'border-white/20 text-white hover:bg-white/5'
                }`}
              >
                {asset}
              </Button>
            ))}
          </div>

          {/* تبويبات الفترة الزمنية */}
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab('daily')}
              variant={activeTab === 'daily' ? 'default' : 'outline'}
              className={`px-4 py-2 font-black uppercase tracking-widest ${
                activeTab === 'daily'
                  ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                  : 'border-white/20 text-white hover:bg-white/5'
              }`}
            >
              Daily News
            </Button>
            <Button
              onClick={() => setActiveTab('weekly')}
              variant={activeTab === 'weekly' ? 'default' : 'outline'}
              className={`px-4 py-2 font-black uppercase tracking-widest ${
                activeTab === 'weekly'
                  ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                  : 'border-white/20 text-white hover:bg-white/5'
              }`}
            >
              Weekly News
            </Button>
          </div>
        </motion.div>

        {/* جدول الأخبار */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-6 md:p-8 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg md:text-xl font-black uppercase tracking-tight">
                  {activeTab === 'daily' ? 'Today\'s News' : 'This Week\'s News'} ({selectedAsset})
                </CardTitle>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black uppercase tracking-widest">
                  <RefreshCw className="w-3 h-3 animate-spin-slow" /> LIVE UPDATING
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-full">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="p-4 md:p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Time</th>
                      <th className="p-4 md:p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Title</th>
                      <th className="p-4 md:p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Source</th>
                      <th className="p-4 md:p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Sentiment</th>
                      <th className="p-4 md:p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredNews.length > 0 ? (
                        filteredNews.map((news, idx) => (
                          <motion.tr
                            key={news.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="p-4 md:p-6 text-xs font-black tabular-nums text-gray-400">
                              {news.publishedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-4 md:p-6 text-xs text-gray-300 max-w-xs md:max-w-md truncate">
                              <a href={news.url} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors">
                                {news.title}
                              </a>
                            </td>
                            <td className="p-4 md:p-6 text-xs font-black text-blue-400">{news.source}</td>
                            <td className="p-4 md:p-6">
                              <div className="flex items-center gap-2">
                                {news.sentiment === 'Positive' ? (
                                  <>
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    <span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-green-500/20 text-green-500">
                                      Positive
                                    </span>
                                  </>
                                ) : news.sentiment === 'Negative' ? (
                                  <>
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                    <span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-red-500/20 text-red-500">
                                      Negative
                                    </span>
                                  </>
                                ) : (
                                  <span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-yellow-500/20 text-yellow-500">
                                    Neutral
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 md:p-6">
                              <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                news.sentiment === 'Positive'
                                  ? 'bg-green-500/20 text-green-500'
                                  : news.sentiment === 'Negative'
                                  ? 'bg-red-500/20 text-red-500'
                                  : 'bg-yellow-500/20 text-yellow-500'
                              }`}>
                                {news.sentiment === 'Positive' ? 'High' : news.sentiment === 'Negative' ? 'High' : 'Medium'}
                              </span>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-gray-400">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm"
                            >
                              No news available for {selectedAsset} in this period
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* إحصائيات سريعة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
        >
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Positive News</p>
                <p className="text-2xl font-black text-green-500">
                  {filteredNews.filter(n => n.sentiment === 'Positive').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </Card>
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Neutral News</p>
                <p className="text-2xl font-black text-yellow-500">
                  {filteredNews.filter(n => n.sentiment === 'Neutral').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500 opacity-20" />
            </div>
          </Card>
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Negative News</p>
                <p className="text-2xl font-black text-red-500">
                  {filteredNews.filter(n => n.sentiment === 'Negative').length}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500 opacity-20" />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
