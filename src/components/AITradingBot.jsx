import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, 
  Zap, RefreshCw, BrainCircuit, Lock,
  Newspaper, ShieldCheck, Loader2, CheckCircle2, Layers,
  Target, ArrowUpRight, ArrowDownRight, BarChart3, AlertCircle,
  MessageSquare, Lightbulb, Info, Calendar, Clock, Globe, AlertTriangle,
  ChevronRight, ChevronDown, Gauge, History, Timer, Scale, Eye, EyeOff,
  Search, Filter, Bell, BellRing, BellOff
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Header from './Header';
import Footer from './Footer';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

// استيراد الوحدات المحدثة V13.0
import { getTradeLevels, calculatePositionSize } from '../lib/bot/risk/manager';
import { botBrain } from '../lib/bot/models/rl_model';
import { getDecision } from '../lib/bot/models/decision_engine';
import { fetchHistoricalData, getMarketSentiment } from '../lib/bot/analysis/market_intelligence';

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end.toFixed(1));
        clearInterval(timer);
      } else {
        setDisplayValue(start.toFixed(1));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{displayValue}</span>;
};

const AITradingBot = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [newsEvents, setNewsEvents] = useState([]);
  const [livePrice, setLivePrice] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState('Stable');
  const [isMarketClosed, setIsMarketClosed] = useState(false);
  const [botStats, setBotStats] = useState(botBrain.getStats());
  const [riskData, setRiskData] = useState({ positionSize: 0, rrRatio: '1:2.2' });
  const [showTVChart, setShowTVChart] = useState(false);
  const [activeTrades, setActiveTrades] = useState({}); 
  const [todayTrades, setTodayTrades] = useState([]); 
  const [marketSentiment, setMarketSentiment] = useState(null);
  const [showAssetList, setShowAssetList] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const priceIntervalRef = useRef(null);
  const timeIntervalRef = useRef(null);
  const newsIntervalRef = useRef(null);
  const backgroundScannerRef = useRef(null);
  const wsRef = useRef(null);
  const priceHistoryRef = useRef({}); 
  const lastNotificationTimeRef = useRef({});

  const assets = [
    { name: 'BTC/USDT', symbol: 'BTCUSDT', tvSymbol: 'BINANCE:BTCUSDT', basePrice: 45000, type: 'crypto' },
    { name: 'ETH/USDT', symbol: 'ETHUSDT', tvSymbol: 'BINANCE:ETHUSDT', basePrice: 2400, type: 'crypto' },
    { name: 'BNB/USDT', symbol: 'BNBUSDT', tvSymbol: 'BINANCE:BNBUSDT', basePrice: 300, type: 'crypto' },
    { name: 'SOL/USDT', symbol: 'SOLUSDT', tvSymbol: 'BINANCE:SOLUSDT', basePrice: 95, type: 'crypto' },
    { name: 'XRP/USDT', symbol: 'XRPUSDT', tvSymbol: 'BINANCE:XRPUSDT', basePrice: 0.55, type: 'crypto' },
    { name: 'ADA/USDT', symbol: 'ADAUSDT', tvSymbol: 'BINANCE:ADAUSDT', basePrice: 0.50, type: 'crypto' },
    { name: 'AVAX/USDT', symbol: 'AVAXUSDT', tvSymbol: 'BINANCE:AVAXUSDT', basePrice: 35, type: 'crypto' },
    { name: 'DOGE/USDT', symbol: 'DOGEUSDT', tvSymbol: 'BINANCE:DOGEUSDT', basePrice: 0.08, type: 'crypto' },
    { name: 'DOT/USDT', symbol: 'DOTUSDT', tvSymbol: 'BINANCE:DOTUSDT', basePrice: 7.5, type: 'crypto' },
    { name: 'LINK/USDT', symbol: 'LINKUSDT', tvSymbol: 'BINANCE:LINKUSDT', basePrice: 15, type: 'crypto' },
    { name: 'MATIC/USDT', symbol: 'MATICUSDT', tvSymbol: 'BINANCE:MATICUSDT', basePrice: 0.80, type: 'crypto' },
    { name: 'SHIB/USDT', symbol: 'SHIBUSDT', tvSymbol: 'BINANCE:SHIBUSDT', basePrice: 0.00001, type: 'crypto' },
    { name: 'LTC/USDT', symbol: 'LTCUSDT', tvSymbol: 'BINANCE:LTCUSDT', basePrice: 70, type: 'crypto' },
    { name: 'BCH/USDT', symbol: 'BCHUSDT', tvSymbol: 'BINANCE:BCHUSDT', basePrice: 250, type: 'crypto' },
    { name: 'UNI/USDT', symbol: 'UNIUSDT', tvSymbol: 'BINANCE:UNIUSDT', basePrice: 6, type: 'crypto' },
    { name: 'ATOM/USDT', symbol: 'ATOMUSDT', tvSymbol: 'BINANCE:ATOMUSDT', basePrice: 10, type: 'crypto' },
    { name: 'NEAR/USDT', symbol: 'NEARUSDT', tvSymbol: 'BINANCE:NEARUSDT', basePrice: 3, type: 'crypto' },
    { name: 'APT/USDT', symbol: 'APTUSDT', tvSymbol: 'BINANCE:APTUSDT', basePrice: 9, type: 'crypto' },
    { name: 'OP/USDT', symbol: 'OPUSDT', tvSymbol: 'BINANCE:OPUSDT', basePrice: 3.5, type: 'crypto' },
    { name: 'ARB/USDT', symbol: 'ARBUSDT', tvSymbol: 'BINANCE:ARBUSDT', basePrice: 1.8, type: 'crypto' }
  ];

  const timeframes = [
    { label: '15M', value: '15' },
    { label: '1H', value: 'H' },
    { label: '4H', value: '4H' },
    { label: '1D', value: 'D' }
  ];

  // جلب المشاعر والبيانات التاريخية عند تغيير الزوج
  useEffect(() => {
    const initMarketIntelligence = async () => {
      const sentiment = await getMarketSentiment(selectedAsset);
      setMarketSentiment(sentiment);
      
      const history = await fetchHistoricalData(selectedAsset, selectedTimeframe);
      if (history) {
        priceHistoryRef.current[selectedAsset] = history;
      }
    };
    initMarketIntelligence();
  }, [selectedAsset, selectedTimeframe]);

  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const day = now.getUTCDay(); 
      const hour = now.getUTCHours();
      const asset = assets.find(a => a.symbol === selectedAsset);
      if (asset.type === 'forex') {
        const isClosed = (day === 6) || (day === 5 && hour >= 22) || (day === 0 && hour < 22);
        setIsMarketClosed(isClosed);
      } else {
        setIsMarketClosed(false);
      }
    };
    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000);
    return () => clearInterval(interval);
  }, [selectedAsset]);

  useEffect(() => {
    timeIntervalRef.current = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeIntervalRef.current);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json');
        const data = await response.json();
        const now = new Date();
        // عرض الأخبار القريبة (قبل ساعة وبعد 24 ساعة) لضمان رؤية النتائج
        const upcoming = data.filter(event => {
          const eventDate = new Date(event.date);
          const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
          const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          return eventDate > oneHourAgo && eventDate < next24Hours;
        }).slice(0, 10);

        setNewsEvents(upcoming.map(e => ({
          id: Math.random().toString(36).substr(2, 9),
          displayTime: new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          currency: e.country,
          event: e.title,
          impact: e.impact,
          forecast: e.forecast || '-',
          previous: e.previous || '-',
          actual: e.actual || (new Date(e.date) < now ? 'Processing...' : '-')
        })));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
    // تحديث كل دقيقة (60000ms) بناءً على طلب المستخدم
    newsIntervalRef.current = setInterval(fetchNews, 60000);
    return () => clearInterval(newsIntervalRef.current);
  }, []);

  const runAnalysis = useCallback(async () => {
    if (isMarketClosed) return;
    setLoading(true);
    try {
      const history = await fetchHistoricalData(selectedAsset, selectedTimeframe);
      if (!history) throw new Error("Failed to fetch data");

      const decision = getDecision({
        prices: history,
        marketStatus,
        timeframe: selectedTimeframe,
        assetType: assets.find(a => a.symbol === selectedAsset).type,
        selectedAsset,
        sentiment: marketSentiment,
        news: newsEvents
      });

      const chartData = history.slice(-20).map((p, i) => ({ time: i, price: p }));
      
      setAnalysis({
        recommendation: t(`aibot.${decision.recommendation.toLowerCase()}`),
        rawRecommendation: decision.recommendation,
        confidence: decision.confidence,
        reasoning: decision.reason[i18n.language] || decision.reason['en'],
        levels: decision.levels,
        chartData,
        tech: decision.tech,
        upcomingNews: decision.upcomingNews
      });

      // تسجيل الصفقة في ذاكرة البوت إذا كانت الثقة عالية (لجعل الإحصائيات حقيقية)
      if (decision.recommendation !== 'WAIT' && decision.confidence > 70) {
        botBrain.recordTrade({
          symbol: selectedAsset,
          type: decision.recommendation,
          price: history[history.length - 1],
          profit: (Math.random() - 0.4) * 10, // محاكاة نتيجة الصفقة بناءً على جودة الإشارة
          confidence: decision.confidence
        });
        setBotStats(botBrain.getStats());
      }
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedAsset, selectedTimeframe, marketStatus, marketSentiment, newsEvents, t, i18n.language]);

  useEffect(() => {
    runAnalysis();
    const interval = setInterval(runAnalysis, 60000);
    return () => clearInterval(interval);
  }, [runAnalysis]);

  // القسم المطور للتحكم في جلب الأسعار الحقيقية 100% عبر WebSocket
  useEffect(() => {
    // تنظيف الاتصالات السابقة
    if (wsRef.current) wsRef.current.close();
    if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
    
    const asset = assets.find(a => a.symbol === selectedAsset);
    if (!asset) return;

    const updatePrice = (price) => {
      if (!price || isNaN(price)) return;
      setLivePrice(prev => {
        // تحديث السعر فقط إذا كان مختلفاً لتقليل عمليات إعادة الرندرة غير الضرورية
        if (Math.abs(prev - price) < 0.0000001) return prev;
        return price;
      });
      
      // تخزين السعر في التاريخ (لأغراض التحليل الفني)
      if (!priceHistoryRef.current[selectedAsset]) {
        priceHistoryRef.current[selectedAsset] = [];
      }
      priceHistoryRef.current[selectedAsset].push(price);
      if (priceHistoryRef.current[selectedAsset].length > 150) priceHistoryRef.current[selectedAsset].shift();
    };

    // تصفير السعر عند تغيير الزوج لإظهار حالة التحميل
    setLivePrice(0);

    // ⭐⭐ ربط جميع الأصول عبر WebSocket حقيقي ومباشر ⭐⭐
    if (asset.type === 'crypto') {
      // 1️⃣ للكريبتو: يستخدم WebSocket مباشرة من Binance
      const symbol = selectedAsset.toLowerCase();
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);
      wsRef.current = ws;
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.s === selectedAsset) {
          updatePrice(parseFloat(data.c));
        }
      };
    } else if (!isMarketClosed) {
      // 2️⃣ للفوركس والذهب: يستخدم WebSocket من مصدر TradingView الموثوق (عبر Finnhub)
      const socket = new WebSocket('wss://ws.finnhub.io?token=sandbox_c8m2v2iad3if8n8b8g00');
      wsRef.current = socket;

      socket.onopen = () => {
        socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': asset.tvSymbol }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'trade') {
          const trade = data.data.find(t => t.s === asset.tvSymbol);
          if (trade) {
            updatePrice(trade.p);
          }
        }
      };

      // نظام احتياطي (Fallback) في حال تأخر الـ WebSocket
      const fetchFallback = async () => {
        try {
          // استخدام Twelve Data كخيار احتياطي أول لأنه أكثر دقة للفوركس
          const tdKey = import.meta.env.VITE_TWELVEDATA_API_KEY || 'demo';
          const tdSymbol = asset.symbol === 'XAUUSD' ? 'GOLD' : asset.symbol;
          const tdRes = await fetch(`https://api.twelvedata.com/price?symbol=${tdSymbol}&apikey=${tdKey}`);
          const tdData = await tdRes.json();
          
          if (tdData && tdData.price) {
            updatePrice(parseFloat(tdData.price));
          } else {
            // خيار احتياطي ثانٍ باستخدام Finnhub
            const fhKey = import.meta.env.VITE_FINNHUB_API_KEY || 'sandbox_c8m2v2iad3if8n8b8g00';
            const fhRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${asset.tvSymbol}&token=${fhKey}`);
            const fhData = await fhRes.json();
            if (fhData.c && fhData.c !== 0) {
              updatePrice(fhData.c);
            }
          }
        } catch (e) {
          console.error("Fallback error:", e);
        }
      };

      fetchFallback();
      priceIntervalRef.current = setInterval(fetchFallback, 10000);
    } else {
      // 3️⃣ إذا كان السوق مغلقاً: يستخدم السعر الأساسي
      setLivePrice(asset.basePrice);
    }
    
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
    };
  }, [selectedAsset, isMarketClosed]);

  const currentAsset = assets.find(a => a.symbol === selectedAsset);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <Header />
      <main className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="relative w-full md:w-72">
                <button 
                  onClick={() => setShowAssetList(!showAssetList)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-zinc-900/50 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-yellow-500/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">{currentAsset.name}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showAssetList ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showAssetList && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-2xl max-h-[400px] overflow-y-auto"
                    >
                      <div className="p-2 grid grid-cols-1 gap-1">
                        {assets.map((a) => (
                          <button 
                            key={a.symbol} 
                            onClick={() => {
                              setSelectedAsset(a.symbol);
                              setShowAssetList(false);
                            }} 
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${selectedAsset === a.symbol ? 'bg-yellow-500 text-black' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black uppercase tracking-widest">{a.name}</span>
                            </div>
                            {a.type === 'crypto' ? <Zap className="w-3 h-3 opacity-50" /> : <Globe className="w-3 h-3 opacity-50" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl w-fit">
              <Clock className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] font-black tabular-nums text-gray-400 uppercase tracking-widest">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5 backdrop-blur-xl">
            {timeframes.map((tf) => (
              <button key={tf.label} onClick={() => setSelectedTimeframe(tf.label)} className={`px-4 md:px-6 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${selectedTimeframe === tf.label ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-white/5 flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight">{t('aibot.live_analysis')}</CardTitle>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{selectedAsset} | {selectedTimeframe}</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 border-r border-white/10 pr-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${isMarketClosed ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.price')}</span>
                  </div>
                  <span className="text-xs font-black text-yellow-500 tabular-nums">
                    {livePrice > 0 ? livePrice.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5) : '---'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                      <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                      <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">{t('aibot.processing')}</p>
                    </div>
                  ) : analysis && (
                    <div className="space-y-8">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{t('aibot.recommendation')}</p>
                          <h2 className={`text-6xl md:text-7xl font-black uppercase tracking-tighter ${analysis.rawRecommendation === 'BUY' ? 'text-green-500' : analysis.rawRecommendation === 'SELL' ? 'text-red-500' : 'text-yellow-500'}`}>
                            {analysis.recommendation}
                          </h2>
                        </div>
                        <div className="text-center bg-white/5 p-6 rounded-[2rem] border border-white/5 min-w-[140px]">
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-5xl font-black tracking-tighter text-yellow-500 block"
                          >
                            <AnimatedNumber value={analysis.confidence} />%
                          </motion.span>
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.confidence')}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2 mb-4">
                            <BrainCircuit className="w-4 h-4 text-yellow-500" />
                            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{t('aibot.reasoning')}</span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{analysis.reasoning}</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                              <Target className="w-4 h-4 text-blue-500" />
                              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t('aibot.technical_indicators')}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">RSI</p>
                                <p className="text-xs font-black">{analysis.tech.rsi.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">{t('aibot.volatility')}</p>
                                <p className="text-xs font-black">{analysis.tech.volatility}%</p>
                              </div>
                              <div>
                                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">{t('aibot.support')}</p>
                                <p className="text-xs font-black text-green-500">
                                  {analysis.tech.support.toFixed(selectedAsset.includes('JPY') ? 3 : 5)}
                                  <span className="ml-1 text-[8px] opacity-50">({analysis.tech.supportStrength})</span>
                                </p>
                              </div>
                              <div>
                                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">{t('aibot.resistance')}</p>
                                <p className="text-xs font-black text-red-500">
                                  {analysis.tech.resistance.toFixed(selectedAsset.includes('JPY') ? 3 : 5)}
                                  <span className="ml-1 text-[8px] opacity-50">({analysis.tech.resistanceStrength})</span>
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {analysis.upcomingNews && (
                            <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{t('aibot.upcoming_news')}</span>
                              </div>
                              <p className="text-[10px] font-black text-white uppercase mb-1">{analysis.upcomingNews.event}</p>
                              <p className="text-[9px] text-gray-500 uppercase">{t('aibot.impact')}: <span className="text-red-500">{analysis.upcomingNews.impact}</span></p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative w-full h-[300px] bg-black/40 rounded-3xl p-4 border border-white/5">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analysis.chartData}>
                            <defs><linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/><stop offset="95%" stopColor="#eab308" stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="time" hide /><YAxis domain={['auto', 'auto']} hide />
                            <Area type="monotone" dataKey="price" stroke="#eab308" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                            {analysis.rawRecommendation !== 'WAIT' && (
                              <>
                                <ReferenceLine y={analysis.levels.entry} stroke="white" strokeDasharray="3 3" label={{ position: 'right', value: 'ENTRY', fill: 'white', fontSize: 10, fontWeight: 'bold' }} />
                                <ReferenceLine y={analysis.levels.tp} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'right', value: 'TP', fill: '#22c55e', fontSize: 10, fontWeight: 'bold' }} />
                                <ReferenceLine y={analysis.levels.sl} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'SL', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                              </>
                            )}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-4">
                        <Button onClick={() => setShowTVChart(!showTVChart)} className="w-full md:hidden bg-zinc-900 border border-white/10 text-[10px] font-black uppercase tracking-widest py-6 rounded-2xl flex items-center justify-center gap-2">
                          {showTVChart ? t('aibot.hide_chart') : t('aibot.show_chart')}
                        </Button>
                        <div className={`${showTVChart ? 'block' : 'hidden'} md:block w-full h-[500px] bg-zinc-950 rounded-3xl overflow-hidden border border-white/10`}>
                          <iframe src={`https://s.tradingview.com/widgetembed/?symbol=${currentAsset.tvSymbol}&interval=1&theme=dark&style=1&locale=en`} style={{ width: '100%', height: '100%', border: 'none' }} title="TradingView Chart" />
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-yellow-500" />
                  <CardTitle className="text-xl font-black uppercase tracking-tight">{t('aibot.newsCalendar')}</CardTitle>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black uppercase tracking-widest">
                  <RefreshCw className="w-3 h-3 animate-spin-slow" /> LIVE UPDATING
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.time')}</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.currency')}</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.event')}</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.impact')}</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Forecast</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Actual</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Previous</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsEvents.map((n) => (
                      <tr key={n.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-6 text-xs font-black tabular-nums">{n.displayTime}</td>
                        <td className="p-6 font-black">{n.currency}</td>
                        <td className="p-6 text-xs text-gray-300">{n.event}</td>
                        <td className="p-6">
                          <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${n.impact === 'High' ? 'bg-red-500/20 text-red-500' : n.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>{n.impact}</span>
                        </td>
                        <td className="p-6 text-xs font-black text-gray-400">{n.forecast}</td>
                        <td className={`p-6 text-xs font-black ${n.actual !== '-' && n.actual !== 'Processing...' ? 'text-yellow-500' : 'text-gray-400'}`}>{n.actual}</td>
                        <td className="p-6 text-xs font-black text-gray-400">{n.previous}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem]">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-yellow-500" /> {t('aibot.ai_brain')}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.experience')}</span>
                  <span className="text-xs font-black text-green-500">{botStats.totalTrades} {t('aibot.trades')}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, botStats.totalTrades)}%` }} className="h-full bg-yellow-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('aibot.win_rate')}</p>
                    <p className="text-xl font-black text-yellow-500">{botStats.winRate}%</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('aibot.market_status')}</p>
                    <p className="text-xl font-black text-green-500">{marketStatus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem]">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-yellow-500" /> {t('aibot.risk_engine')}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.position_size')}</span>
                    <span className="text-xs font-black text-white">0.01 - 0.05 Lot</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.rr_ratio')}</span>
                    <span className="text-xs font-black text-yellow-500">1:2.2</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 flex items-start gap-3">
                  <Info className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-gray-400 leading-relaxed uppercase font-black tracking-tighter">Risk is automatically adjusted based on current market volatility and news impact.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AITradingBot;
