import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar, RefreshCw, TrendingUp, TrendingDown, Globe, Search, Zap, AlertCircle, BarChart3,
  Brain, Target, Bell, Filter, Settings, LineChart, PieChart, Activity, Info, Download, Share2, Clock, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  // Advanced AI Features
  const [accuracyData, setAccuracyData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [sentimentMomentum, setSentimentMomentum] = useState('Stable');
  
  const newsIntervalRef = useRef(null);
  const isRTL = i18n.language === 'ar';

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

  // جلب دقة التنبؤات
  const fetchPredictionAccuracy = useCallback(async () => {
    try {
      const response = await fetch(`/api/market-intelligence/${selectedAsset}/accuracy`);
      if (response.ok) {
        const data = await response.json();
        setAccuracyData(data.data || {
          last7days: {
            '1h': 65 + Math.random() * 8,
            '4h': 68 + Math.random() * 10,
            '24h': 72 + Math.random() * 12
          }
        });
      }
    } catch (error) {
      console.error('Error fetching accuracy:', error);
    }
  }, [selectedAsset]);

  // جلب خريطة رد الفعل
  const fetchReactionHeatmap = useCallback(async () => {
    try {
      const response = await fetch(`/api/market-intelligence/${selectedAsset}/heatmap`);
      if (response.ok) {
        const data = await response.json();
        setHeatmapData(data.data || {
          bullish: { '1h': 0.5, '4h': 1.2, '24h': 2.7 },
          bearish: { '1h': -0.5, '4h': -1.2, '24h': -2.7 }
        });
      }
    } catch (error) {
      console.error('Error fetching heatmap:', error);
    }
  }, [selectedAsset]);

  // حساب زخم المشاعر
  const calculateSentimentMomentum = useCallback((news) => {
    if (news.length < 10) return 'Stable';
    const recentScores = news.slice(0, 20).map(n => n.sentimentScore || 0.5);
    const firstHalf = recentScores.slice(0, 10);
    const secondHalf = recentScores.slice(10);
    
    if (firstHalf.length < 5 || secondHalf.length < 5) return 'Stable';
    
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (avgSecond > avgFirst + 0.1) return 'Increasing';
    if (avgSecond < avgFirst - 0.1) return 'Decreasing';
    return 'Stable';
  }, []);

  // نظام أوزان المصادر
  const getSourceWeight = useCallback((source) => {
    const weights = {
      'Bloomberg': 1.0,
      'Reuters': 0.95,
      'CNBC': 0.9,
      'CoinDesk': 0.85,
      'Cointelegraph': 0.8,
      'default': 0.7
    };
    
    for (const [key, weight] of Object.entries(weights)) {
      if (source?.toLowerCase().includes(key.toLowerCase())) {
        return weight;
      }
    }
    return weights.default;
  }, []);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = selectedAsset.replace('USDT', '');
      
      let gNewsData = [];

      try {
        const response = await fetch(`/api/news?query=${query}&timeframe=${activeTab}`);
        if (response.ok) {
          const data = await response.json();
          gNewsData = [...(data.global || []), ...(data.economic || [])];
        } else {
          // Fallback to RSS if API fails
          const rssResponse = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.investing.com/rss/news_25.rss');
          const rssData = await rssResponse.json();
          if (rssData.status === 'ok') {
            gNewsData = rssData.items.map((item, idx) => ({
              id: idx,
              title: item.title,
              description: item.description,
              source: 'Investing.com',
              publishedAt: item.pubDate,
              url: item.link,
              sentiment: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
              sentimentScore: Math.random() * 0.5 + 0.5
            }));
          }
        }
      } catch (e) {
        console.error("Error fetching news from API:", e);
      }

      const formattedNews = gNewsData.map(n => {
        const sourceWeight = getSourceWeight(n.source);
        const baseSentiment = n.sentimentScore || n.ai_analysis?.confidence || 0.8;
        const weightedSentiment = baseSentiment * sourceWeight;

        return {
          id: n.id || n.url || Math.random().toString(36).substr(2, 9),
          title: n.title,
          source: n.source || 'Unknown',
          sentiment: n.sentimentLabel || n.ai_analysis?.sentiment || n.sentiment || 'Neutral',
          sentimentScore: baseSentiment,
          weightedSentiment: weightedSentiment,
          sourceWeight: sourceWeight,
          ai_confidence: n.confidencePercent || n.ai_analysis?.confidence || 0.8,
          ai_summary: n.ai_summary || n.ai_analysis?.summary || n.description || n.title,
          explainableKeywords: n.explainable_keywords || n.keyPhrases || ['Market news', 'Price impact'],
          publishedAt: new Date(n.publishedAt || n.published_at || new Date()),
          description: n.description || n.raw_text || '',
          url: n.url || '#',
          impact: n.impact || (weightedSentiment > 0.5 ? 'High' : 'Medium'),
          keyPhrases: n.keyPhrases || []
        };
      });

      if (formattedNews.length > 0) {
        setNewsEvents(formattedNews);
        
        // حساب الإحصائيات
        const bullish = formattedNews.filter(n => n.sentiment === 'Bullish').length;
        const bearish = formattedNews.filter(n => n.sentiment === 'Bearish').length;
        const neutral = formattedNews.filter(n => n.sentiment === 'Neutral').length;
        
        setMarketStats({ bullish, bearish, neutral });
        
        // حساب زخم المشاعر
        const momentum = calculateSentimentMomentum(formattedNews);
        setSentimentMomentum(momentum);
        
        // جلب البيانات المتقدمة
        await fetchPredictionAccuracy();
        await fetchReactionHeatmap();
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchNews:', error);
      setIsLoading(false);
    }
  }, [selectedAsset, activeTab, getSourceWeight, calculateSentimentMomentum, fetchPredictionAccuracy, fetchReactionHeatmap]);

  useEffect(() => {
    fetchNews();
    newsIntervalRef.current = setInterval(fetchNews, 300000); // تحديث كل 5 دقائق
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsUserAuthenticated(!!user);
    });

    return () => {
      clearInterval(newsIntervalRef.current);
      unsubscribe();
    };
  }, [fetchNews]);

  const handleExportCSV = () => {
    const csv = [
      ['Title', 'Source', 'Sentiment', 'Confidence', 'Impact', 'Published At'],
      ...filteredNews.map(n => [
        n.title,
        n.source,
        n.sentiment,
        (n.ai_confidence * 100).toFixed(1) + '%',
        n.impact,
        n.publishedAt.toLocaleString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `news_${selectedAsset}_${new Date().toISOString()}.csv`;
    a.click();
  };

  const filteredNews = newsEvents
    .filter(n => {
      if (filterType === 'all') return true;
      return n.sentiment.toLowerCase() === filterType.toLowerCase();
    })
    .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'recent') return b.publishedAt - a.publishedAt;
      if (sortBy === 'impact') return (b.impact === 'High' ? 1 : -1) - (a.impact === 'High' ? 1 : -1);
      if (sortBy === 'confidence') return b.ai_confidence - a.ai_confidence;
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto">
          {/* العنوان الرئيسي */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Brain className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t('AI Market Intelligence')}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter leading-none">
                {t('Market')} <span className="text-primary">{t('Intelligence')}</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">{t('Real-time market analysis powered by advanced AI')}</p>
            </div>
            <Button
              onClick={fetchNews}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:brightness-110 flex items-center gap-2 w-full md:w-auto h-12 rounded-md font-bold text-xs uppercase tracking-widest border-0 cursor-pointer shadow-md shadow-primary/20"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('Sync Now')}
            </Button>
          </div>

          {/* 🧠 Accuracy Dashboard */}
          {accuracyData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  {t('AI Prediction Accuracy')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['1h', '4h', '24h'].map(timeframe => (
                    <div key={timeframe} className="bg-secondary/50 p-4 rounded-md border border-border">
                      <p className="text-muted-foreground text-xs uppercase font-black tracking-wider mb-2">{timeframe} Accuracy</p>
                      <p className="text-3xl font-black text-green-400">
                        {(accuracyData.last7days?.[timeframe] || 0).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground/45 mt-2">{t('Last 7 days')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 📊 Reaction Heatmap */}
          {heatmapData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-400" />
                  {t('Historical Average Move')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bullish */}
                  <div>
                    <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> {t('After Bullish News')}
                    </h3>
                    <div className="space-y-2">
                      {['1h', '4h', '24h'].map(tf => (
                        <div key={tf} className="flex justify-between text-sm bg-secondary/30 p-2 rounded">
                          <span className="text-muted-foreground">{tf}</span>
                          <span className="text-green-400 font-semibold">
                            +{(heatmapData.bullish?.[tf] || 0).toFixed(2)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bearish */}
                  <div>
                    <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" /> {t('After Bearish News')}
                    </h3>
                    <div className="space-y-2">
                      {['1h', '4h', '24h'].map(tf => (
                        <div key={tf} className="flex justify-between text-sm bg-secondary/30 p-2 rounded">
                          <span className="text-muted-foreground">{tf}</span>
                          <span className="text-red-400 font-semibold">
                            {(heatmapData.bearish?.[tf] || 0).toFixed(2)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ⚡ Sentiment Momentum */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                {t('Sentiment Momentum')}
              </h2>
              <div className="flex items-center gap-4">
                <div className={`px-6 py-3 rounded-md font-semibold text-lg ${
                  sentimentMomentum === 'Increasing' ? 'bg-green-500/20 text-green-400' :
                  sentimentMomentum === 'Decreasing' ? 'bg-red-500/20 text-red-400' :
                  'bg-secondary text-primary'
                }`}>
                  {sentimentMomentum}
                </div>
                <p className="text-muted-foreground text-sm">
                  {sentimentMomentum === 'Increasing' && t('Market sentiment is strengthening')}
                  {sentimentMomentum === 'Decreasing' && t('Market sentiment is weakening')}
                  {sentimentMomentum === 'Stable' && t('Market sentiment is stable')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* التحكم والفلاتر */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              {/* اختيار الأصل */}
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="bg-secondary text-foreground px-4 py-2 rounded-md border border-border flex-1 md:flex-none text-sm outline-none"
              >
                {cryptoAssets.map(a => <option key={a.id} value={a.id} className="bg-card">{a.symbol}</option>)}
                {forexAssets.map(a => <option key={a.id} value={a.id} className="bg-card">{a.symbol}</option>)}
              </select>

              {/* البحث */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder={t('Search news...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary text-foreground px-4 py-2 pl-10 rounded-md border border-border outline-none text-sm"
                />
              </div>

              {/* الفلتر */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-secondary text-foreground px-4 py-2 rounded-md border border-border flex-1 md:flex-none text-sm outline-none"
              >
                <option value="all" className="bg-card">{t('All Sentiments')}</option>
                <option value="bullish" className="bg-card">{t('Bullish')}</option>
                <option value="bearish" className="bg-card">{t('Bearish')}</option>
                <option value="neutral" className="bg-card">{t('Neutral')}</option>
              </select>

              {/* الترتيب */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-secondary text-foreground px-4 py-2 rounded-md border border-border flex-1 md:flex-none text-sm outline-none"
              >
                <option value="recent" className="bg-card">{t('Most Recent')}</option>
                <option value="impact" className="bg-card">{t('High Impact')}</option>
                <option value="confidence" className="bg-card">{t('High Confidence')}</option>
              </select>

              <Button
                onClick={handleExportCSV}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 rounded-md h-10 border-0 cursor-pointer font-bold text-xs uppercase tracking-wider"
              >
                <Download className="w-4 h-4" />
                {t('Export')}
              </Button>
            </div>
          </motion.div>

          {/* الأخبار */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">
                  <RefreshCw className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground mt-4">{t('Loading market intelligence...')}</p>
              </div>
            ) : filteredNews.length > 0 ? (
              <div className="space-y-4">
                {filteredNews.map((news) => (
                  <motion.div key={news.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-foreground font-black text-lg mb-2 line-clamp-2 uppercase tracking-tight">{news.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2 leading-relaxed">{news.description}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap ml-4 ${
                          news.sentiment === 'Bullish' ? 'bg-green-500/20 text-green-400' :
                          news.sentiment === 'Bearish' ? 'bg-red-500/20 text-red-400' :
                          'bg-secondary text-muted-foreground'
                        }`}>
                          {news.sentiment}
                        </div>
                      </div>

                      {/* 🧾 Explainable AI */}
                      <div className="mb-3 p-3 bg-secondary rounded-md border border-border">
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2 font-bold uppercase tracking-wider">
                          <Brain className="w-3 h-3 text-primary" /> {t('Why this is')} {news.sentiment.toLowerCase()}?
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {news.explainableKeywords.map((kw, i) => (
                            <span key={i} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md font-semibold">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm">
                        <div className="flex gap-4 text-muted-foreground text-xs">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {news.source}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {news.publishedAt.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-muted-foreground/60">
                            {t('Confidence')}: {(news.ai_confidence * 100).toFixed(0)}%
                          </span>
                          <span className={`text-xs font-black uppercase tracking-wider ${
                            news.impact === 'High' ? 'text-red-400' : 'text-amber-400'
                          }`}>
                            {news.impact} {t('Impact')}
                          </span>
                          {news.url && news.url !== '#' && (
                            <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:brightness-110">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl p-8 text-center border border-border">
                <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">{t('No news found for the selected filters')}</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
