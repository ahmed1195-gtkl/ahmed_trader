import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Brain,
  BarChart3,
  Zap,
  Filter,
  Search,
  Bell,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import Header from './Header';
import Footer from './Footer';

export default function MarketIntelligence() {
  const { i18n } = useTranslation();
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    loadAvailableAssets();
  }, []);

  useEffect(() => {
    if (selectedAsset) {
      loadAssetData(selectedAsset);
    }
  }, [selectedAsset]);

  const loadAvailableAssets = async () => {
    try {
      const defaultAssets = [
        { id: 'BTCUSDT', symbol: 'BTC', name: 'Bitcoin', type: 'crypto' },
        { id: 'ETHUSDT', symbol: 'ETH', name: 'Ethereum', type: 'crypto' },
        { id: 'EURUSD', symbol: 'EUR', name: 'Euro', type: 'forex' },
        { id: 'GBPUSD', symbol: 'GBP', name: 'British Pound', type: 'forex' },
        { id: 'XAUUSD', symbol: 'XAU', name: 'Gold', type: 'commodity' }
      ];
      setAssets(defaultAssets);
      setSelectedAsset(defaultAssets[0].id);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };

  const loadAssetData = async (assetId) => {
    setLoading(true);
    try {
      const mockData = {
        news: [
          {
            id: '1',
            title: 'Bitcoin Surges Past $45,000 on Positive Fed Signals',
            source: 'Bloomberg',
            sentiment: 'Bullish',
            sentimentScore: 0.85,
            impact: 'High',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            keyPhrases: ['Fed', 'positive', 'surge']
          },
          {
            id: '2',
            title: 'Ethereum Network Upgrade Scheduled for Q2',
            source: 'CoinDesk',
            sentiment: 'Positive',
            sentimentScore: 0.72,
            impact: 'Medium',
            publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
            keyPhrases: ['upgrade', 'network', 'Q2']
          },
          {
            id: '3',
            title: 'Regulatory Concerns Weigh on Crypto Markets',
            source: 'Reuters',
            sentiment: 'Bearish',
            sentimentScore: -0.65,
            impact: 'High',
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
            keyPhrases: ['regulation', 'concerns', 'crypto']
          }
        ],
        analytics: {
          assetId: assetId,
          totalNews: 3,
          bullishNews: 1,
          bearishNews: 1,
          neutralNews: 1,
          averageSentimentScore: 0.31,
          sentimentTrend: 'Bullish',
          volatilityLevel: 'Medium',
          predictedMove: 2.5,
          timeframe: '4h',
          confidence: 78
        }
      };

      setNewsData(mockData.news);
      setAnalytics(mockData.analytics);
    } catch (error) {
      console.error('Error loading asset data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAssetData(selectedAsset);
    setRefreshing(false);
  };

  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || news.sentiment === filterType;
    return matchesSearch && matchesFilter;
  });

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Bullish':
      case 'Positive':
        return 'text-green-500';
      case 'Bearish':
      case 'Negative':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSentimentBgColor = (sentiment) => {
    switch (sentiment) {
      case 'Bullish':
      case 'Positive':
        return 'bg-green-500/10 border-green-500/20';
      case 'Bearish':
      case 'Negative':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-secondary border-border';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Bullish':
      case 'Positive':
        return <TrendingUp className="w-4 h-4" />;
      case 'Bearish':
      case 'Negative':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">
                  {isRTL ? 'ذكاء السوق' : 'Market Intelligence'}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {isRTL
                    ? 'تحليل الأخبار المالية والمشاعر والتنبؤ بالأثر'
                    : 'Financial News Analysis, Sentiment Scoring & Impact Prediction'
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            {/* Asset Selector */}
            <div>
              <label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-2 block">
                {isRTL ? 'اختر الأصل' : 'Select Asset'}
              </label>
              <select
                value={selectedAsset || ''}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:border-primary/50 transition-all"
              >
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id} className="bg-card">
                    {asset.symbol} - {asset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-2 block">
                {isRTL ? 'البحث' : 'Search'}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder={isRTL ? 'ابحث عن الأخبار...' : 'Search news...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-md bg-secondary border border-border text-foreground text-sm placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Sentiment Filter */}
            <div>
              <label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-2 block">
                {isRTL ? 'المشاعر' : 'Sentiment'}
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="all" className="bg-card">{isRTL ? 'الكل' : 'All'}</option>
                <option value="Bullish" className="bg-card">{isRTL ? 'صعودي' : 'Bullish'}</option>
                <option value="Positive" className="bg-card">{isRTL ? 'إيجابي' : 'Positive'}</option>
                <option value="Bearish" className="bg-card">{isRTL ? 'هبوطي' : 'Bearish'}</option>
              </select>
            </div>

            {/* Refresh */}
            <div className="flex items-end">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full h-12 bg-primary text-primary-foreground hover:brightness-110 font-black uppercase tracking-widest rounded-md transition-all disabled:opacity-50 border-0 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {isRTL ? 'تحديث' : 'Refresh'}
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: News */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-card border-border rounded-xl overflow-hidden">
                  <CardHeader className="p-8 border-b border-border">
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                      <Zap className="w-6 h-6 text-primary" />
                      {isRTL ? 'أحدث الأخبار' : 'Latest News'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="flex items-center justify-center p-12">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
                          <p className="text-muted-foreground/60 text-sm font-black uppercase tracking-widest">
                            {isRTL ? 'جاري التحميل...' : 'Loading...'}
                          </p>
                        </div>
                      </div>
                    ) : filteredNews.length === 0 ? (
                      <div className="flex items-center justify-center p-12 text-muted-foreground">
                        <p className="text-sm font-semibold">
                          {isRTL ? 'لا توجد أخبار' : 'No news found'}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        <AnimatePresence>
                          {filteredNews.map((news, idx) => (
                            <motion.div
                              key={news.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-6 hover:bg-secondary/40 transition-all group"
                            >
                              <div className="flex items-start gap-4">
                                {/* Sentiment icon */}
                                <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 border ${getSentimentBgColor(news.sentiment)}`}>
                                  <span className={getSentimentColor(news.sentiment)}>
                                    {getSentimentIcon(news.sentiment)}
                                  </span>
                                </div>

                                {/* News content */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                    {news.title}
                                  </h3>

                                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                                      {news.source}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${getSentimentBgColor(news.sentiment)} ${getSentimentColor(news.sentiment)}`}>
                                      {news.sentiment}
                                    </span>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                      {news.impact} {isRTL ? 'تأثير' : 'Impact'}
                                    </span>
                                  </div>

                                  {/* Key phrases */}
                                  {news.keyPhrases && news.keyPhrases.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                      {news.keyPhrases.map((phrase, i) => (
                                        <span
                                          key={i}
                                          className="text-[8px] font-black bg-secondary border border-border text-muted-foreground px-2 py-1 rounded-md"
                                        >
                                          {phrase}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Timestamp */}
                                <div className="text-right flex-shrink-0">
                                  <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                                    {news.publishedAt.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right: Analytics */}
            <div className="space-y-6">
              {analytics && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-card border-border rounded-xl overflow-hidden">
                    <CardHeader className="p-8 border-b border-border">
                      <CardTitle className="text-lg font-black uppercase tracking-tighter">
                        {isRTL ? 'التحليلات' : 'Analytics'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      {/* Overall Trend */}
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-3">
                          {isRTL ? 'الاتجاه العام' : 'Overall Trend'}
                        </p>
                        <div className={`text-3xl font-black uppercase tracking-tighter ${
                          analytics.sentimentTrend === 'Bullish'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}>
                          {analytics.sentimentTrend}
                        </div>
                      </div>

                      {/* News Distribution */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                          {isRTL ? 'توزيع الأخبار' : 'News Distribution'}
                        </p>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-[10px] font-black text-green-500 uppercase">
                                {isRTL ? 'صعودي' : 'Bullish'}
                              </span>
                              <span className="text-[10px] font-black text-foreground/60">
                                {analytics.bullishNews}
                              </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                  width: `${(analytics.bullishNews / analytics.totalNews) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-[10px] font-black text-muted-foreground uppercase">
                                {isRTL ? 'محايد' : 'Neutral'}
                              </span>
                              <span className="text-[10px] font-black text-foreground/60">
                                {analytics.neutralNews}
                              </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-muted-foreground rounded-full"
                                style={{
                                  width: `${(analytics.neutralNews / analytics.totalNews) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-[10px] font-black text-red-500 uppercase">
                                {isRTL ? 'هبوطي' : 'Bearish'}
                              </span>
                              <span className="text-[10px] font-black text-foreground/60">
                                {analytics.bearishNews}
                              </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{
                                  width: `${(analytics.bearishNews / analytics.totalNews) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Prediction */}
                      <div className="pt-4 border-t border-border space-y-3">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">
                            {isRTL ? 'الحركة المتوقعة' : 'Predicted Move'}
                          </p>
                          <p className={`text-2xl font-black ${
                            analytics.predictedMove > 0
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}>
                            {analytics.predictedMove > 0 ? '+' : ''}{analytics.predictedMove}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">
                            {isRTL ? 'الإطار الزمني' : 'Timeframe'}
                          </p>
                          <p className="text-lg font-black text-primary">
                            {analytics.timeframe}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">
                            {isRTL ? 'درجة الثقة' : 'Confidence'}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${analytics.confidence}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-primary">
                              {analytics.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Create Alert Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button className="w-full h-12 bg-primary text-primary-foreground hover:brightness-110 font-black uppercase tracking-widest rounded-md transition-all border-0 cursor-pointer shadow-lg shadow-primary/20">
                  <Bell className="w-4 h-4 mr-2" />
                  {isRTL ? 'إنشاء تنبيه' : 'Create Alert'}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
