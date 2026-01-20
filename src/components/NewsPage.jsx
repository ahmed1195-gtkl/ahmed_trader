import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw, TrendingUp, TrendingDown, Globe, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGlobalNews } from '@/lib/bot/analysis/market_intelligence';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';

export default function NewsPage() {
  const { t, i18n } = useTranslation();
  const [newsEvents, setNewsEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('daily'); // daily or weekly
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [searchQuery, setSearchQuery] = useState('');
  const newsIntervalRef = useRef(null);

  // قائمة الأصول المدمجة (عملات رقمية + فوركس)
  const cryptoAssets = [
    'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'DOT', 'LINK'
  ];
  
  const forexAssets = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'XAUUSD'
  ];

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      // تنظيف الرمز للبحث (إزالة USDT إذا وجد)
      const query = selectedAsset.replace('USDT', '');
      const gNewsData = await fetchGlobalNews(query);
      
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

  // تصفية الأخبار حسب الفترة الزمنية والبحث
  const getFilteredNews = () => {
    const now = new Date();
    let filtered = newsEvents;

    // تصفية حسب الفترة
    if (activeTab === 'daily') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(n => n.publishedAt >= startOfDay);
    } else {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(n => n.publishedAt >= oneWeekAgo);
    }

    // تصفية حسب البحث
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredNews = getFilteredNews();

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto">
          
          {/* الرأس والتحكم */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-yellow-500">
                  <Globe className="w-5 h-5 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    {i18n.language === 'ar' ? 'ذكاء السوق اللحظي' : 'Real-time Market Intelligence'}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                  {i18n.language === 'ar' ? 'مركز' : 'Market'} <span className="text-yellow-500">{i18n.language === 'ar' ? 'الأخبار' : 'News'}</span>
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                  <input 
                    type="text"
                    placeholder={i18n.language === 'ar' ? 'بحث في الأخبار...' : 'Search news...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all w-full md:w-64"
                  />
                </div>
                <Button
                  onClick={fetchNews}
                  disabled={isLoading}
                  className="h-12 w-12 rounded-2xl bg-yellow-500 text-black hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* اختيار الأصول - تصميم محسن */}
            <div className="space-y-6 bg-zinc-900/30 p-6 md:p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl mb-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                  {i18n.language === 'ar' ? 'العملات الرقمية' : 'Cryptocurrencies'}
                </p>
                <div className="flex flex-wrap gap-3">
                  {cryptoAssets.map(asset => (
                    <button
                      key={asset}
                      onClick={() => setSelectedAsset(asset)}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        selectedAsset === asset
                          ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                  {i18n.language === 'ar' ? 'سوق الفوركس والذهب' : 'Forex & Gold Market'}
                </p>
                <div className="flex flex-wrap gap-3">
                  {forexAssets.map(asset => (
                    <button
                      key={asset}
                      onClick={() => setSelectedAsset(asset)}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        selectedAsset === asset
                          ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* تبويبات الفترة الزمنية */}
            <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'daily'
                    ? 'bg-yellow-500 text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {i18n.language === 'ar' ? 'أخبار اليوم' : 'Daily News'}
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'weekly'
                    ? 'bg-yellow-500 text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {i18n.language === 'ar' ? 'أخبار الأسبوع' : 'Weekly News'}
              </button>
            </div>
          </motion.div>

          {/* جدول الأخبار - تصميم متناسق مع الموقع */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[3rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8 md:p-10 border-b border-white/5 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">
                      {activeTab === 'daily' 
                        ? (i18n.language === 'ar' ? 'أخبار اليوم' : "Today's News") 
                        : (i18n.language === 'ar' ? 'أخبار الأسبوع' : "This Week's News")}
                    </CardTitle>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                      {selectedAsset} Market Analysis
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest">
                  <RefreshCw className="w-3 h-3 animate-spin-slow" /> LIVE UPDATING
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5">
                        <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">{i18n.language === 'ar' ? 'الوقت' : 'Time'}</th>
                        <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">{i18n.language === 'ar' ? 'الخبر' : 'Event / Title'}</th>
                        <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">{i18n.language === 'ar' ? 'المصدر' : 'Source'}</th>
                        <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">{i18n.language === 'ar' ? 'المشاعر' : 'Sentiment'}</th>
                        <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">{i18n.language === 'ar' ? 'التأثير' : 'Impact'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredNews.length > 0 ? (
                          filteredNews.map((news, idx) => (
                            <motion.tr
                              key={news.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className="border-b border-white/5 hover:bg-white/[0.02] transition-all group"
                            >
                              <td className="p-8 text-xs font-black tabular-nums text-gray-400 group-hover:text-white transition-colors">
                                <div className="flex flex-col">
                                  <span>{news.publishedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  <span className="text-[8px] opacity-50">{news.publishedAt.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                </div>
                              </td>
                              <td className="p-8 max-w-md">
                                <a 
                                  href={news.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-sm font-bold text-gray-200 hover:text-yellow-500 transition-colors leading-relaxed block"
                                >
                                  {news.title}
                                </a>
                              </td>
                              <td className="p-8">
                                <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                  {news.source}
                                </span>
                              </td>
                              <td className="p-8">
                                <div className="flex items-center gap-2">
                                  {news.sentiment === 'Positive' ? (
                                    <div className="flex items-center gap-2 text-green-500">
                                      <TrendingUp className="w-4 h-4" />
                                      <span className="text-[10px] font-black uppercase tracking-widest">Bullish</span>
                                    </div>
                                  ) : news.sentiment === 'Negative' ? (
                                    <div className="flex items-center gap-2 text-red-500">
                                      <TrendingDown className="w-4 h-4" />
                                      <span className="text-[10px] font-black uppercase tracking-widest">Bearish</span>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">Neutral</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-8">
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
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
                            <td colSpan="5" className="p-20 text-center">
                              <div className="flex flex-col items-center gap-4 opacity-20">
                                <Search className="w-12 h-12 text-white" />
                                <p className="text-sm font-black uppercase tracking-widest text-white">
                                  No news found for {selectedAsset}
                                </p>
                              </div>
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

          {/* إحصائيات سريعة - تصميم محسن */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { label: i18n.language === 'ar' ? 'أخبار إيجابية' : 'Positive News', count: filteredNews.filter(n => n.sentiment === 'Positive').length, color: 'text-green-500', icon: <TrendingUp /> },
              { label: i18n.language === 'ar' ? 'أخبار محايدة' : 'Neutral News', count: filteredNews.filter(n => n.sentiment === 'Neutral').length, color: 'text-yellow-500', icon: <Calendar /> },
              { label: i18n.language === 'ar' ? 'أخبار سلبية' : 'Negative News', count: filteredNews.filter(n => n.sentiment === 'Negative').length, color: 'text-red-500', icon: <TrendingDown /> }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-white/20 transition-all"
              >
                <div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className={`text-4xl font-black ${stat.color}`}>{stat.count}</p>
                </div>
                <div className={`${stat.color} opacity-20 group-hover:opacity-40 transition-opacity`}>
                  {React.cloneElement(stat.icon, { className: "w-12 h-12" })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
