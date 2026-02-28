import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw, TrendingUp, TrendingDown, Globe, Search, Zap, AlertCircle, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGlobalNews } from '@/lib/bot/analysis/market_intelligence';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import AuthGuardPopup from './AuthGuardPopup';
import { auth } from '@/lib/firebase';

export default function NewsPage() {
  const { t, i18n } = useTranslation();
  const [newsEvents, setNewsEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('daily'); // daily or weekly
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
  const [marketStats, setMarketStats] = useState({ bullish: 0, bearish: 0, neutral: 0 });
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
      
      // جلب الأخبار من محرك ذكاء السوق المطور
      const gNewsData = await fetchGlobalNews(query);
      
      const formattedNews = gNewsData.map(n => ({
        id: n.id || Math.random().toString(36).substr(2, 9),
        title: n.title,
        source: n.source,
        sentiment: n.sentiment || 'Neutral',
        publishedAt: new Date(n.publishedAt),
        description: n.description,
        url: n.url || '#',
        impact: calculateImpact(n.title + " " + n.description)
      }));

      setNewsEvents(formattedNews);
      
      // تحديث الإحصائيات
      const stats = formattedNews.reduce((acc, curr) => {
        if (curr.sentiment === 'Positive') acc.bullish++;
        else if (curr.sentiment === 'Negative') acc.bearish++;
        else acc.neutral++;
        return acc;
      }, { bullish: 0, bearish: 0, neutral: 0 });
      setMarketStats(stats);

    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateImpact = (text) => {
    const highImpact = ['fed', 'interest rate', 'inflation', 'cpi', 'war', 'crash', 'etf', 'sec', 'regulation'];
    const lowerText = text.toLowerCase();
    if (highImpact.some(word => lowerText.includes(word))) return 'High';
    return 'Medium';
  };

  useEffect(() => {
    fetchNews();
    newsIntervalRef.current = setInterval(fetchNews, 120000); // تحديث كل دقيقتين
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsUserAuthenticated(!!user);
    });

    return () => {
      if (newsIntervalRef.current) clearInterval(newsIntervalRef.current);
      unsubscribe();
    };
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
    <div className="min-h-screen flex flex-col bg-[#050505] text-white selection:bg-yellow-500/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto">
          
          {/* الرأس والتحكم */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">
                      {i18n.language === 'ar' ? 'ذكاء اصطناعي لحظي' : 'AI REAL-TIME INTELLIGENCE'}
                    </span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                  {i18n.language === 'ar' ? 'رادار' : 'Market'} <span className="text-yellow-500">{i18n.language === 'ar' ? 'الأسواق' : 'Radar'}</span>
                </h1>
                <p className="text-gray-500 text-sm md:text-base max-w-xl font-medium leading-relaxed">
                  {i18n.language === 'ar' 
                    ? 'تحليل لحظي للأخبار العالمية باستخدام الذكاء الاصطناعي لتحديد اتجاهات السوق بدقة.' 
                    : 'Real-time global news analysis using AI to accurately identify market trends and sentiment.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                  <input 
                    type="text"
                    placeholder={i18n.language === 'ar' ? 'ابحث عن خبر...' : 'Search intelligence...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10 transition-all w-full md:w-80 backdrop-blur-xl"
                  />
                </div>
                <Button
                  onClick={fetchNews}
                  disabled={isLoading}
                  className="h-14 px-6 rounded-2xl bg-yellow-500 text-black hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/20 disabled:opacity-50 font-black uppercase tracking-widest text-xs"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {i18n.language === 'ar' ? 'تحديث' : 'Sync'}
                </Button>
              </div>
            </div>

            {/* اختيار الأصول - تصميم احترافي */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-12">
              <div className="xl:col-span-3 space-y-6 bg-zinc-900/20 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                      {i18n.language === 'ar' ? 'الأصول الرقمية' : 'Digital Assets'}
                    </p>
                    <div className="h-px flex-1 mx-4 bg-white/5" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cryptoAssets.map(asset => (
                      <button
                        key={asset}
                        onClick={() => setSelectedAsset(asset)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          selectedAsset === asset
                            ? 'bg-yellow-500 border-yellow-500 text-black shadow-2xl shadow-yellow-500/40 scale-105'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {asset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-6 relative">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                      {i18n.language === 'ar' ? 'الفوركس والسلع' : 'Forex & Commodities'}
                    </p>
                    <div className="h-px flex-1 mx-4 bg-white/5" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {forexAssets.map(asset => (
                      <button
                        key={asset}
                        onClick={() => setSelectedAsset(asset)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          selectedAsset === asset
                            ? 'bg-yellow-500 border-yellow-500 text-black shadow-2xl shadow-yellow-500/40 scale-105'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {asset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500 p-8 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-yellow-500/20">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <BarChart3 className="w-24 h-24 text-black" />
                </div>
                <div className="relative">
                  <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mb-1">Market Sentiment</p>
                  <h3 className="text-black text-3xl font-black uppercase tracking-tighter">
                    {marketStats.bullish > marketStats.bearish ? 'Bullish' : marketStats.bearish > marketStats.bullish ? 'Bearish' : 'Neutral'}
                  </h3>
                </div>
                <div className="space-y-2 relative">
                  <div className="flex justify-between text-[10px] font-black text-black/60 uppercase">
                    <span>Bullish</span>
                    <span>{Math.round((marketStats.bullish / (filteredNews.length || 1)) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black transition-all duration-1000" 
                      style={{ width: `${(marketStats.bullish / (filteredNews.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* تبويبات الفترة الزمنية */}
            <div className="flex p-2 bg-white/5 border border-white/10 rounded-[1.5rem] w-fit backdrop-blur-xl">
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  activeTab === 'daily'
                    ? 'bg-white text-black shadow-2xl'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {i18n.language === 'ar' ? 'تغطية اليوم' : 'Daily Coverage'}
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  activeTab === 'weekly'
                    ? 'bg-white text-black shadow-2xl'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {i18n.language === 'ar' ? 'تغطية الأسبوع' : 'Weekly Coverage'}
              </button>
            </div>
          </motion.div>

          {/* جدول الأخبار - تصميم فائق الاحترافية */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-zinc-900/20 backdrop-blur-3xl border-white/5 text-white rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
              <CardHeader className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-inner">
                    <Globe className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter">
                      {activeTab === 'daily' 
                        ? (i18n.language === 'ar' ? 'الأخبار العاجلة' : "Breaking Intelligence") 
                        : (i18n.language === 'ar' ? 'ملخص الأسبوع' : "Weekly Intelligence")}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                        Monitoring {selectedAsset} / {filteredNews.length} Events Detected
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
                  <RefreshCw className="w-3 h-3 animate-spin-slow" /> Auto-Sync Active
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-white/[0.01] border-b border-white/5">
                        <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{i18n.language === 'ar' ? 'التوقيت' : 'Timestamp'}</th>
                        <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{i18n.language === 'ar' ? 'الحدث التحليلي' : 'Intelligence Event'}</th>
                        <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{i18n.language === 'ar' ? 'المصدر' : 'Source'}</th>
                        <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{i18n.language === 'ar' ? 'المشاعر' : 'Sentiment'}</th>
                        <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{i18n.language === 'ar' ? 'التأثير' : 'Impact'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <AnimatePresence mode="popLayout">
                        {filteredNews.length > 0 ? (
                          filteredNews.map((news, idx) => (
                            <motion.tr
                              key={news.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ delay: idx * 0.05 }}
                              className="hover:bg-white/[0.03] transition-all group relative"
                            >
                              <td className="p-10 text-xs font-black tabular-nums text-gray-500 group-hover:text-white transition-colors">
                                <div className="flex flex-col gap-1">
                                  <span className="text-white">{news.publishedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                  <span className="text-[9px] opacity-40 uppercase tracking-tighter">{news.publishedAt.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                </div>
                              </td>
                              <td className="p-10 max-w-xl">
                                <a 
                                  href={news.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-base font-bold text-gray-300 group-hover:text-yellow-500 transition-all leading-relaxed block decoration-yellow-500/30 underline-offset-8 hover:underline"
                                >
                                  {news.title}
                                </a>
                                <p className="text-[10px] text-gray-600 mt-3 line-clamp-1 font-medium uppercase tracking-wider group-hover:text-gray-400 transition-colors">
                                  {news.description}
                                </p>
                              </td>
                              <td className="p-10">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">
                                    {news.source}
                                  </span>
                                </div>
                              </td>
                              <td className="p-10">
                                <div className="flex items-center gap-3">
                                  {news.sentiment === 'Positive' ? (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500">
                                      <TrendingUp className="w-3 h-3" />
                                      <span className="text-[9px] font-black uppercase tracking-widest">Bullish</span>
                                    </div>
                                  ) : news.sentiment === 'Negative' ? (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                                      <TrendingDown className="w-3 h-3" />
                                      <span className="text-[9px] font-black uppercase tracking-widest">Bearish</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-500/10 border border-gray-500/20 text-gray-400">
                                      <span className="text-[9px] font-black uppercase tracking-widest">Neutral</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-10">
                                <div className={`flex items-center gap-2 ${news.impact === 'High' ? 'text-yellow-500' : 'text-gray-500'}`}>
                                  <AlertCircle className={`w-3 h-3 ${news.impact === 'High' ? 'animate-pulse' : ''}`} />
                                  <span className="text-[9px] font-black uppercase tracking-widest">
                                    {news.impact}
                                  </span>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="p-32 text-center">
                              <div className="flex flex-col items-center gap-6 opacity-20">
                                <div className="w-24 h-24 rounded-full border-2 border-dashed border-white flex items-center justify-center">
                                  <Search className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-sm font-black uppercase tracking-[0.4em] text-white">
                                  No intelligence data for {selectedAsset}
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

          {/* إحصائيات سفلية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { label: i18n.language === 'ar' ? 'إشارات صعودية' : 'Bullish Signals', count: marketStats.bullish, color: 'text-green-500', icon: <TrendingUp />, bg: 'bg-green-500/5' },
              { label: i18n.language === 'ar' ? 'إشارات محايدة' : 'Neutral Signals', count: marketStats.neutral, color: 'text-gray-400', icon: <Globe />, bg: 'bg-white/5' },
              { label: i18n.language === 'ar' ? 'إشارات هبوطية' : 'Bearish Signals', count: marketStats.bearish, color: 'text-red-500', icon: <TrendingDown />, bg: 'bg-red-500/5' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className={`${stat.bg} backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 flex items-center justify-between group hover:border-white/10 transition-all relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{stat.label}</p>
                  <p className={`text-5xl font-black tracking-tighter ${stat.color}`}>{stat.count}</p>
                </div>
                <div className={`${stat.color} opacity-10 group-hover:opacity-20 transition-all duration-500 group-hover:scale-110`}>
                  {React.cloneElement(stat.icon, { className: "w-16 h-16" })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
      <AuthGuardPopup isOpen={!isUserAuthenticated} />
    </div>
  );
}
