import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw, TrendingUp, TrendingDown, Globe, Search, Zap, AlertCircle, BarChart3, Brain, Target, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGlobalNews } from '@/lib/bot/analysis/market_intelligence';
import { marketIntelligenceClient } from '@/lib/marketIntelligenceClient';
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
  const [dailyReport, setDailyReport] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const newsIntervalRef = useRef(null);

  const isRTL = i18n.language === 'ar';

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
      const query = selectedAsset.replace('USDT', '');
      
      // 1. جلب البيانات من محرك ذكاء السوق الجديد
      let intelligenceData = null;
      try {
        intelligenceData = await marketIntelligenceClient.getAssetData(query);
      } catch (e) {
        console.warn("Market Intelligence Client failed, falling back to legacy fetch");
      }

      let gNewsData = [];
      let report = '';
      
      if (intelligenceData) {
        gNewsData = intelligenceData.news || [];
        setAnalytics(intelligenceData.analytics);
      } else {
        // Fallback to legacy API
        try {
          const response = await fetch(`/api/news?query=${query}&timeframe=${activeTab}`);
          if (response.ok) {
            const data = await response.json();
            gNewsData = [...(data.global || []), ...(data.economic || [])];
            report = data.dailyReport || '';
          }
        } catch (e) {
          console.warn("Backend news fetch failed, falling back to local engine");
        }

        if (gNewsData.length === 0) {
          gNewsData = await fetchGlobalNews(query, activeTab);
        }
      }
      
      const formattedNews = gNewsData.map(n => ({
        id: n.id || Math.random().toString(36).substr(2, 9),
        title: n.title,
        source: n.source,
        sentiment: n.sentimentLabel || n.ai_analysis?.sentiment || n.sentiment || 'Neutral',
        ai_confidence: n.confidencePercent || n.ai_analysis?.confidence || 0.8,
        ai_summary: n.ai_summary || n.ai_analysis?.summary || n.description || n.title,
        correlation: n.correlation || null,
        publishedAt: new Date(n.publishedAt || n.published_at),
        description: n.description || n.raw_text,
        url: n.url || '#',
        impact: n.impact || calculateImpact(n.title + " " + (n.description || ""))
      }));

      setNewsEvents(formattedNews);
      if (report) setDailyReport(report);
      
      const stats = formattedNews.reduce((acc, curr) => {
        const s = curr.sentiment.toLowerCase();
        if (s.includes('bull') || s.includes('pos')) acc.bullish++;
        else if (s.includes('bear') || s.includes('neg')) acc.bearish++;
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
    newsIntervalRef.current = setInterval(fetchNews, 120000);
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsUserAuthenticated(!!user);
    });

    return () => {
      if (newsIntervalRef.current) clearInterval(newsIntervalRef.current);
      unsubscribe();
    };
  }, [selectedAsset, activeTab]);

  const getFilteredNews = () => {
    let filtered = newsEvents;
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredNews = getFilteredNews();

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return isRTL ? 'الآن' : 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return isRTL ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return isRTL ? `منذ ${hours} ساعة` : `${hours}h ago`;
    return date.toLocaleDateString();
  };

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
                    <Brain className="w-3 h-3 text-yellow-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">
                      {isRTL ? 'ذكاء اصطناعي فائق' : 'AI SUPER INTELLIGENCE'}
                    </span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                  {isRTL ? 'رادار' : 'Market'} <span className="text-yellow-500">{isRTL ? 'الأسواق' : 'Radar'}</span>
                </h1>
                <p className="text-gray-500 text-sm md:text-base max-w-xl font-medium leading-relaxed">
                  {isRTL 
                    ? 'منصة ذكاء السوق المتكاملة: تحليل المشاعر، التنبؤ بالأثر، والتقارير الذكية المدعومة بالذكاء الاصطناعي.' 
                    : 'Integrated market intelligence platform: sentiment analysis, impact prediction, and AI-powered smart reports.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                  <input 
                    type="text"
                    placeholder={isRTL ? 'ابحث عن خبر...' : 'Search intelligence...'}
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
                  {isRTL ? 'تحديث' : 'Sync'}
                </Button>
              </div>
            </div>

            {/* تقرير الرادار اليومي أو ملخص الذكاء الاصطناعي */}
            {(dailyReport || (analytics && analytics.sentimentTrend)) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 backdrop-blur-3xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Zap className="w-20 h-20 text-yellow-500" />
                </div>
                <div className="relative space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-yellow-500">
                      {isRTL ? 'ملخص الذكاء الاصطناعي' : 'AI INTELLIGENCE SUMMARY'}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <p className="text-lg md:text-xl font-bold text-gray-200 leading-relaxed">
                        {dailyReport || (isRTL 
                          ? `الاتجاه الحالي لـ ${selectedAsset} هو ${analytics.sentimentTrend === 'Bullish' ? 'صعودي' : 'هبوطي'} بناءً على تحليل ${analytics.totalNews} خبراً حديثاً.`
                          : `Current trend for ${selectedAsset} is ${analytics.sentimentTrend} based on ${analytics.totalNews} recent news events.`)}
                      </p>
                    </div>
                    {analytics && (
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-gray-500 uppercase">{isRTL ? 'الحركة المتوقعة' : 'PREDICTED MOVE'}</span>
                          <span className={`text-lg font-black ${analytics.predictedMove >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {analytics.predictedMove >= 0 ? '+' : ''}{analytics.predictedMove}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-500 uppercase">{isRTL ? 'درجة الثقة' : 'CONFIDENCE'}</span>
                          <span className="text-lg font-black text-yellow-500">{analytics.confidence}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* اختيار الأصول والتحليلات */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-12">
              <div className="xl:col-span-3 space-y-6 bg-zinc-900/20 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                      {isRTL ? 'الأصول الرقمية' : 'Digital Assets'}
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
                      {isRTL ? 'الفوركس والسلع' : 'Forex & Commodities'}
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
                {isRTL ? 'تغطية اليوم' : 'Daily Coverage'}
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  activeTab === 'weekly'
                    ? 'bg-white text-black shadow-2xl'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {isRTL ? 'تغطية الأسبوع' : 'Weekly Coverage'}
              </button>
            </div>
          </motion.div>

          {/* جدول الأخبار */}
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
                        ? (isRTL ? 'الأخبار العاجلة' : "Breaking Intelligence") 
                        : (isRTL ? 'ملخص الأسبوع' : "Weekly Intelligence")}
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
                        <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{isRTL ? 'التوقيت' : 'Timestamp'}</th>
                        <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{isRTL ? 'الحدث التحليلي' : 'Intelligence Event'}</th>
                        <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{isRTL ? 'المصدر' : 'Source'}</th>
                        <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{isRTL ? 'المشاعر' : 'Sentiment'}</th>
                        <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{isRTL ? 'التأثير' : 'Impact'}</th>
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
                                  <span className="text-white whitespace-nowrap">{getTimeAgo(news.publishedAt)}</span>
                                  <span className="text-[9px] opacity-40 uppercase tracking-tighter">{news.publishedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5 mt-3 mb-2">
                                  <p className="text-yellow-500/80 text-[8px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> AI Insight
                                  </p>
                                  <p className="text-gray-400 text-xs font-medium leading-relaxed italic">
                                    "{news.ai_summary}"
                                  </p>
                                </div>
                                {news.correlation && news.correlation.current_price && (
                                  <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-500 mt-2">
                                    <div className="flex items-center gap-1.5">
                                      <Globe className="w-3 h-3" />
                                      {news.correlation.symbol}: <span className="text-white">${news.correlation.current_price.toLocaleString()}</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${news.correlation.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                      {news.correlation.price_change_24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                      {news.correlation.price_change_24h}%
                                    </div>
                                  </div>
                                )}
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
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-3">
                                    {news.sentiment.toLowerCase().includes('bull') || news.sentiment.toLowerCase().includes('pos') ? (
                                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500">
                                        <TrendingUp className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Bullish</span>
                                      </div>
                                    ) : news.sentiment.toLowerCase().includes('bear') || news.sentiment.toLowerCase().includes('neg') ? (
                                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                                        <TrendingDown className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Bearish</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400">
                                        <span className="text-[9px] font-black uppercase tracking-widest">Neutral</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 px-2">
                                    <div className="w-1 h-1 rounded-full bg-yellow-500 animate-pulse" />
                                    <span className="text-[8px] font-bold text-yellow-500/60 uppercase tracking-tighter">
                                      AI Confidence: {Math.round(news.ai_confidence * 100)}%
                                    </span>
                                  </div>
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
              { label: isRTL ? 'إشارات صعودية' : 'Bullish Signals', count: marketStats.bullish, color: 'text-green-500', icon: <TrendingUp />, bg: 'bg-green-500/5' },
              { label: isRTL ? 'إشارات محايدة' : 'Neutral Signals', count: marketStats.neutral, color: 'text-gray-400', icon: <Globe />, bg: 'bg-white/5' },
              { label: isRTL ? 'إشارات هبوطية' : 'Bearish Signals', count: marketStats.bearish, color: 'text-red-500', icon: <TrendingDown />, bg: 'bg-red-500/5' }
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
