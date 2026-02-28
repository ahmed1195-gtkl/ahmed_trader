import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar, RefreshCw, TrendingUp, TrendingDown, Globe, Search, Zap, AlertCircle, BarChart3,
  Brain, Target, Bell, Filter, Settings, LineChart, PieChart, Activity
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
  const [marketStats, setMarketStats] = useState({ bullish: 0, bearish: 0, neutral: 0 });
  const [dailyReport, setDailyReport] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // table or cards
  const [sortBy, setSortBy] = useState('recent'); // recent, impact, confidence
  const newsIntervalRef = useRef(null);

  const isRTL = i18n.language === 'ar';

  // قائمة الأصول المدمجة
  const cryptoAssets = [
    { id: 'BTC', symbol: 'BTC', name: 'Bitcoin', type: 'crypto' },
    { id: 'ETH', symbol: 'ETH', name: 'Ethereum', type: 'crypto' },
    { id: 'BNB', symbol: 'BNB', name: 'Binance Coin', type: 'crypto' },
    { id: 'SOL', symbol: 'SOL', name: 'Solana', type: 'crypto' },
    { id: 'XRP', symbol: 'XRP', name: 'Ripple', type: 'crypto' },
    { id: 'ADA', symbol: 'ADA', name: 'Cardano', type: 'crypto' },
    { id: 'AVAX', symbol: 'AVAX', name: 'Avalanche', type: 'crypto' },
    { id: 'DOGE', symbol: 'DOGE', name: 'Dogecoin', type: 'crypto' },
    { id: 'DOT', symbol: 'DOT', name: 'Polkadot', type: 'crypto' },
    { id: 'LINK', symbol: 'LINK', name: 'Chainlink', type: 'crypto' }
  ];
  
  const forexAssets = [
    { id: 'EURUSD', symbol: 'EUR/USD', name: 'Euro', type: 'forex' },
    { id: 'GBPUSD', symbol: 'GBP/USD', name: 'British Pound', type: 'forex' },
    { id: 'USDJPY', symbol: 'USD/JPY', name: 'Japanese Yen', type: 'forex' },
    { id: 'AUDUSD', symbol: 'AUD/USD', name: 'Australian Dollar', type: 'forex' },
    { id: 'USDCAD', symbol: 'USD/CAD', name: 'Canadian Dollar', type: 'forex' },
    { id: 'XAUUSD', symbol: 'XAU/USD', name: 'Gold', type: 'commodity' }
  ];

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const query = selectedAsset.replace('USDT', '');
      
      let gNewsData = [];
      let report = '';
      let analyticsData = null;

      // جلب البيانات من الخادم (API الحقيقي)
      try {
        const response = await fetch(`/api/news?query=${query}&timeframe=${activeTab}`);
        if (response.ok) {
          const data = await response.json();
          gNewsData = [...(data.global || []), ...(data.economic || [])];
          report = data.dailyReport || '';
        } else {
          throw new Error(`API returned status ${response.status}`);
        }
      } catch (e) {
        console.error("Error fetching news from API:", e);
        setIsLoading(false);
        return; // توقف إذا فشل جلب البيانات الحقيقية
      }

      // تنسيق البيانات من API الحقيقي
      const formattedNews = gNewsData.map(n => ({
        id: n.id || n.url || Math.random().toString(36).substr(2, 9),
        title: n.title,
        source: n.source,
        sentiment: n.sentimentLabel || n.ai_analysis?.sentiment || n.sentiment || 'Neutral',
        sentimentScore: n.sentimentScore || n.ai_analysis?.confidence || 0.8,
        ai_confidence: n.confidencePercent || n.ai_analysis?.confidence || 0.8,
        ai_summary: n.ai_summary || n.ai_analysis?.summary || n.description || n.title,
        correlation: n.correlation || null,
        publishedAt: new Date(n.publishedAt || n.published_at),
        description: n.description || n.raw_text,
        url: n.url || '#',
        impact: n.impact || (n.ai_analysis?.impact_score > 0.5 ? 'High' : 'Medium'),
        keyPhrases: n.keyPhrases || []
      }));

      // التحقق من وجود بيانات
      if (formattedNews.length === 0) {
        console.warn('No news data received from API');
        setNewsEvents([]);
        setMarketStats({ bullish: 0, bearish: 0, neutral: 0 });
        setIsLoading(false);
        return;
      }

      setNewsEvents(formattedNews);
      if (report) setDailyReport(report);

      // حساب الإحصائيات من البيانات الحقيقية
      const stats = formattedNews.reduce((acc, curr) => {
        const s = curr.sentiment.toLowerCase();
        if (s.includes('bull') || s.includes('pos')) acc.bullish++;
        else if (s.includes('bear') || s.includes('neg')) acc.bearish++;
        else acc.neutral++;
        return acc;
      }, { bullish: 0, bearish: 0, neutral: 0 });
      setMarketStats(stats);

      // حساب التحليلات
      if (formattedNews.length > 0) {
        const avgSentiment = formattedNews.reduce((sum, n) => sum + n.sentimentScore, 0) / formattedNews.length;
        const avgConfidence = formattedNews.reduce((sum, n) => sum + n.ai_confidence, 0) / formattedNews.length;
        
        analyticsData = {
          assetId: selectedAsset,
          totalNews: formattedNews.length,
          bullishNews: stats.bullish,
          bearishNews: stats.bearish,
          neutralNews: stats.neutral,
          averageSentimentScore: avgSentiment,
          sentimentTrend: avgSentiment > 0.3 ? 'Bullish' : avgSentiment < -0.3 ? 'Bearish' : 'Neutral',
          volatilityLevel: Math.abs(avgSentiment) > 0.6 ? 'High' : Math.abs(avgSentiment) > 0.3 ? 'Medium' : 'Low',
          predictedMove: avgSentiment * 5,
          timeframe: activeTab === 'daily' ? '4h' : '24h',
          confidence: Math.round(avgConfidence * 100)
        };
        setAnalytics(analyticsData);
      }

    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateImpact = (text) => {
    const highImpact = ['fed', 'interest rate', 'inflation', 'cpi', 'war', 'crash', 'etf', 'sec', 'regulation', 'earnings', 'merger'];
    const lowerText = text.toLowerCase();
    if (highImpact.some(word => lowerText.includes(word))) return 'High';
    return 'Medium';
  };

  const extractKeyPhrases = (text) => {
    const words = text.split(' ').filter(w => w.length > 5);
    return words.slice(0, 3);
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

  const getFilteredAndSortedNews = () => {
    let filtered = newsEvents;

    // تطبيق البحث
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // تطبيق تصفية المشاعر
    if (filterType !== 'all') {
      filtered = filtered.filter(n => {
        const sentiment = n.sentiment.toLowerCase();
        if (filterType === 'bullish') return sentiment.includes('bull') || sentiment.includes('pos');
        if (filterType === 'bearish') return sentiment.includes('bear') || sentiment.includes('neg');
        return sentiment.includes('neutral');
      });
    }

    // تطبيق الترتيب
    if (sortBy === 'impact') {
      filtered.sort((a, b) => (b.impact === 'High' ? 1 : -1));
    } else if (sortBy === 'confidence') {
      filtered.sort((a, b) => b.ai_confidence - a.ai_confidence);
    } else {
      filtered.sort((a, b) => b.publishedAt - a.publishedAt);
    }

    return filtered;
  };

  const filteredNews = getFilteredAndSortedNews();

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return isRTL ? 'الآن' : 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return isRTL ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return isRTL ? `منذ ${hours} ساعة` : `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getSentimentColor = (sentiment) => {
    const s = sentiment.toLowerCase();
    if (s.includes('bull') || s.includes('pos')) return 'text-green-500';
    if (s.includes('bear') || s.includes('neg')) return 'text-red-500';
    return 'text-gray-500';
  };

  const getSentimentBgColor = (sentiment) => {
    const s = sentiment.toLowerCase();
    if (s.includes('bull') || s.includes('pos')) return 'bg-green-500/10 border-green-500/20';
    if (s.includes('bear') || s.includes('neg')) return 'bg-red-500/10 border-red-500/20';
    return 'bg-gray-500/10 border-gray-500/20';
  };

  const getSentimentIcon = (sentiment) => {
    const s = sentiment.toLowerCase();
    if (s.includes('bull') || s.includes('pos')) return <TrendingUp className="w-4 h-4" />;
    if (s.includes('bear') || s.includes('neg')) return <TrendingDown className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white selection:bg-yellow-500/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto">
          
          {/* الرأس الرئيسي */}
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
                      {isRTL ? 'ذكاء السوق المتقدم' : 'ADVANCED MARKET INTELLIGENCE'}
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

            {/* ملخص الذكاء الاصطناعي */}
            {(dailyReport || analytics) && (
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
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-2">
                      <p className="text-lg md:text-xl font-bold text-gray-200 leading-relaxed">
                        {dailyReport || (analytics && isRTL 
                          ? `الاتجاه الحالي لـ ${selectedAsset} هو ${analytics.sentimentTrend === 'Bullish' ? 'صعودي' : 'هبوطي'} بناءً على تحليل ${analytics.totalNews} خبراً حديثاً.`
                          : `Current trend for ${selectedAsset} is ${analytics.sentimentTrend} based on ${analytics.totalNews} recent news events.`)}
                      </p>
                    </div>
                    {analytics && (
                      <>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-gray-500 uppercase">{isRTL ? 'الحركة المتوقعة' : 'PREDICTED MOVE'}</span>
                            <span className={`text-lg font-black ${analytics.predictedMove >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {analytics.predictedMove >= 0 ? '+' : ''}{analytics.predictedMove.toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-500 uppercase">{isRTL ? 'الإطار الزمني' : 'TIMEFRAME'}</span>
                            <span className="text-lg font-black text-yellow-500">{analytics.timeframe}</span>
                          </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-gray-500 uppercase">{isRTL ? 'درجة الثقة' : 'CONFIDENCE'}</span>
                            <span className="text-lg font-black text-yellow-500">{analytics.confidence}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-500 uppercase">{isRTL ? 'التقلب' : 'VOLATILITY'}</span>
                            <span className={`text-lg font-black ${
                              analytics.volatilityLevel === 'High' ? 'text-red-500' : 
                              analytics.volatilityLevel === 'Medium' ? 'text-yellow-500' : 
                              'text-green-500'
                            }`}>
                              {analytics.volatilityLevel}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* اختيار الأصول */}
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
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset.id)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          selectedAsset === asset.id
                            ? 'bg-yellow-500 border-yellow-500 text-black shadow-2xl shadow-yellow-500/40 scale-105'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {asset.symbol}
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
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset.id)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          selectedAsset === asset.id
                            ? 'bg-yellow-500 border-yellow-500 text-black shadow-2xl shadow-yellow-500/40 scale-105'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {asset.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* بطاقة المشاعر */}
              <div className="bg-yellow-500 p-8 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-yellow-500/20">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <BarChart3 className="w-24 h-24 text-black" />
                </div>
                <div className="relative">
                  <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mb-1">{isRTL ? 'مشاعر السوق' : 'Market Sentiment'}</p>
                  <h3 className="text-black text-3xl font-black uppercase tracking-tighter">
                    {marketStats.bullish > marketStats.bearish ? 'Bullish' : marketStats.bearish > marketStats.bullish ? 'Bearish' : 'Neutral'}
                  </h3>
                </div>
                <div className="space-y-2 relative">
                  <div className="flex justify-between text-[10px] font-black text-black/60 uppercase">
                    <span>{isRTL ? 'صعودي' : 'Bullish'}</span>
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

            {/* التبويبات والفلاتر */}
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              {/* التبويبات الزمنية */}
              <div className="flex p-2 bg-white/5 border border-white/10 rounded-[1.5rem] w-fit backdrop-blur-xl">
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    activeTab === 'daily'
                      ? 'bg-white text-black shadow-2xl'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {isRTL ? 'يومي' : 'Daily'}
                </button>
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    activeTab === 'weekly'
                      ? 'bg-white text-black shadow-2xl'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {isRTL ? 'أسبوعي' : 'Weekly'}
                </button>
              </div>

              {/* تصفية المشاعر */}
              <div className="flex p-2 bg-white/5 border border-white/10 rounded-[1.5rem] w-fit backdrop-blur-xl">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    filterType === 'all'
                      ? 'bg-white text-black shadow-2xl'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {isRTL ? 'الكل' : 'All'}
                </button>
                <button
                  onClick={() => setFilterType('bullish')}
                  className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-green-500 ${
                    filterType === 'bullish'
                      ? 'bg-green-500/20 shadow-2xl'
                      : 'hover:bg-green-500/10'
                  }`}
                >
                  {isRTL ? 'صعودي' : 'Bullish'}
                </button>
                <button
                  onClick={() => setFilterType('bearish')}
                  className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-red-500 ${
                    filterType === 'bearish'
                      ? 'bg-red-500/20 shadow-2xl'
                      : 'hover:bg-red-500/10'
                  }`}
                >
                  {isRTL ? 'هبوطي' : 'Bearish'}
                </button>
              </div>

              {/* الترتيب */}
              <div className="flex p-2 bg-white/5 border border-white/10 rounded-[1.5rem] w-fit backdrop-blur-xl">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-transparent text-gray-400 focus:outline-none focus:text-white transition-all"
                >
                  <option value="recent">{isRTL ? 'الأحدث' : 'Recent'}</option>
                  <option value="impact">{isRTL ? 'الأثر' : 'Impact'}</option>
                  <option value="confidence">{isRTL ? 'الثقة' : 'Confidence'}</option>
                </select>
              </div>

              {/* تبديل طريقة العرض */}
              <div className="flex p-2 bg-white/5 border border-white/10 rounded-[1.5rem] w-fit backdrop-blur-xl ml-auto">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    viewMode === 'table'
                      ? 'bg-white text-black shadow-2xl'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {isRTL ? 'جدول' : 'Table'}
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    viewMode === 'cards'
                      ? 'bg-white text-black shadow-2xl'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {isRTL ? 'بطاقات' : 'Cards'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* عرض الأخبار - جدول */}
          {viewMode === 'table' && (
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
                        {isRTL ? 'الأخبار العاجلة' : "Breaking Intelligence"}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                          {isRTL ? `مراقبة ${selectedAsset} / ${filteredNews.length} حدث مكتشف` : `Monitoring ${selectedAsset} / ${filteredNews.length} Events Detected`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
                    <RefreshCw className="w-3 h-3 animate-spin-slow" /> {isRTL ? 'المزامنة نشطة' : 'Auto-Sync Active'}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-white/[0.01] border-b border-white/5">
                          <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{isRTL ? 'التوقيت' : 'Timestamp'}</th>
                          <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{isRTL ? 'الحدث' : 'Event'}</th>
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
                                      <Zap className="w-3 h-3" /> {isRTL ? 'رؤية ذكية' : 'AI Insight'}
                                    </p>
                                    <p className="text-gray-400 text-xs font-medium leading-relaxed italic">
                                      "{news.ai_summary}"
                                    </p>
                                  </div>
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
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border w-fit ${getSentimentBgColor(news.sentiment)} ${getSentimentColor(news.sentiment)}`}>
                                      {getSentimentIcon(news.sentiment)}
                                      <span className="text-[9px] font-black uppercase tracking-widest">
                                        {news.sentiment}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2">
                                      <div className="w-1 h-1 rounded-full bg-yellow-500 animate-pulse" />
                                      <span className="text-[8px] font-bold text-yellow-500/60 uppercase tracking-tighter">
                                        {isRTL ? 'ثقة' : 'Confidence'}: {Math.round(news.ai_confidence * 100)}%
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
                                    {isRTL ? 'لا توجد بيانات' : 'No intelligence data'}
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
          )}

          {/* عرض الأخبار - بطاقات */}
          {viewMode === 'cards' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredNews.length > 0 ? (
                  filteredNews.map((news, idx) => (
                    <motion.div
                      key={news.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-zinc-900/20 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-6 hover:border-white/10 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getSentimentBgColor(news.sentiment)}`}>
                          <span className={getSentimentColor(news.sentiment)}>
                            {getSentimentIcon(news.sentiment)}
                          </span>
                        </div>
                        <span className={`text-[8px] font-black px-2 py-1 rounded-lg border ${getSentimentBgColor(news.sentiment)} ${getSentimentColor(news.sentiment)}`}>
                          {news.sentiment}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-300 group-hover:text-yellow-500 transition-colors mb-3 line-clamp-2">
                        {news.title}
                      </h3>

                      <p className="text-gray-400 text-xs font-medium mb-4 line-clamp-2">
                        {news.ai_summary}
                      </p>

                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                        <span className="text-[10px] font-black text-gray-500 uppercase">
                          {news.source}
                        </span>
                        <span className="text-[10px] font-black text-gray-500">
                          {getTimeAgo(news.publishedAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`w-3 h-3 ${news.impact === 'High' ? 'text-yellow-500 animate-pulse' : 'text-gray-500'}`} />
                          <span className="text-[9px] font-black text-gray-400 uppercase">
                            {news.impact}
                          </span>
                        </div>
                        <span className="text-[8px] font-bold text-yellow-500/60 uppercase">
                          {Math.round(news.ai_confidence * 100)}%
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full flex items-center justify-center p-20 opacity-20">
                    <div className="text-center">
                      <Search className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-sm font-black uppercase tracking-[0.2em]">
                        {isRTL ? 'لا توجد أخبار' : 'No news found'}
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* الإحصائيات السفلية */}
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
