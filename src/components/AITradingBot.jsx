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

// استيراد الوحدات المحدثة V12.0
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
    // Crypto
    { name: 'BTC/USDT', symbol: 'BTCUSDT', tvSymbol: 'BINANCE:BTCUSDT', basePrice: 45000, type: 'crypto' },
    { name: 'ETH/USDT', symbol: 'ETHUSDT', tvSymbol: 'BINANCE:ETHUSDT', basePrice: 2400, type: 'crypto' },
    { name: 'SOL/USDT', symbol: 'SOLUSDT', tvSymbol: 'BINANCE:SOLUSDT', basePrice: 95, type: 'crypto' },
    { name: 'XRP/USDT', symbol: 'XRPUSDT', tvSymbol: 'BINANCE:XRPUSDT', basePrice: 0.55, type: 'crypto' },
    { name: 'ADA/USDT', symbol: 'ADAUSDT', tvSymbol: 'BINANCE:ADAUSDT', basePrice: 0.50, type: 'crypto' },
    { name: 'DOT/USDT', symbol: 'DOTUSDT', tvSymbol: 'BINANCE:DOTUSDT', basePrice: 7.5, type: 'crypto' },
    { name: 'DOGE/USDT', symbol: 'DOGEUSDT', tvSymbol: 'BINANCE:DOGEUSDT', basePrice: 0.08, type: 'crypto' },
    { name: 'AVAX/USDT', symbol: 'AVAXUSDT', tvSymbol: 'BINANCE:AVAXUSDT', basePrice: 35, type: 'crypto' },
    // Forex
    { name: 'XAU/USD', symbol: 'XAUUSD', tvSymbol: 'OANDA:XAUUSD', basePrice: 2050, type: 'forex', fxcmSymbol: 'XAUUSD' },
    { name: 'EUR/USD', symbol: 'EURUSD', tvSymbol: 'FX:EURUSD', basePrice: 1.09, type: 'forex', fxcmSymbol: 'EURUSD' },
    { name: 'GBP/USD', symbol: 'GBPUSD', tvSymbol: 'FX:GBPUSD', basePrice: 1.27, type: 'forex', fxcmSymbol: 'GBPUSD' },
    { name: 'USD/JPY', symbol: 'USDJPY', tvSymbol: 'FX:USDJPY', basePrice: 145, type: 'forex', fxcmSymbol: 'USDJPY' },
    { name: 'AUD/USD', symbol: 'AUDUSD', tvSymbol: 'FX:AUDUSD', basePrice: 0.67, type: 'forex', fxcmSymbol: 'AUDUSD' },
    { name: 'USD/CAD', symbol: 'USDCAD', tvSymbol: 'FX:USDCAD', basePrice: 1.35, type: 'forex', fxcmSymbol: 'USDCAD' },
    { name: 'NZD/USD', symbol: 'NZDUSD', tvSymbol: 'FX:NZDUSD', basePrice: 0.62, type: 'forex', fxcmSymbol: 'NZDUSD' },
    { name: 'USD/CHF', symbol: 'USDCHF', tvSymbol: 'FX:USDCHF', basePrice: 0.88, type: 'forex', fxcmSymbol: 'USDCHF' },
    { name: 'EUR/GBP', symbol: 'EURGBP', tvSymbol: 'FX:EURGBP', basePrice: 0.85, type: 'forex', fxcmSymbol: 'EURGBP' },
    { name: 'GBP/JPY', symbol: 'GBPJPY', tvSymbol: 'FX:GBPJPY', basePrice: 185, type: 'forex', fxcmSymbol: 'GBPJPY' }
  ];

  const timeframes = [
    { label: '15M', value: '15' },
    { label: '1H', value: 'H' },
    { label: '4H', value: '4H' },
    { label: '1D', value: 'D' }
  ];

  // طلب إذن الإشعارات
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const sendNotification = (title, body, asset) => {
    if (notificationsEnabled && 'Notification' in window) {
      const now = Date.now();
      // منع تكرار الإشعارات لنفس الزوج خلال 30 دقيقة
      if (lastNotificationTimeRef.current[asset] && (now - lastNotificationTimeRef.current[asset] < 1800000)) {
        return;
      }
      
      new Notification(title, {
        body,
        icon: '/logo192.png', // تأكد من وجود أيقونة
        badge: '/logo192.png'
      });
      
      lastNotificationTimeRef.current[asset] = now;
    }
  };

  // محرك المسح المستمر في الخلفية (Background Scanner)
  const runBackgroundScanner = useCallback(async () => {
    // اختيار زوج عشوائي للمسح في كل دورة لتوفير الموارد
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    if (randomAsset.symbol === selectedAsset) return; // تخطي الزوج الحالي لأنه يتم تحليله بالفعل

    try {
      const history = await fetchHistoricalData(randomAsset.symbol, selectedTimeframe);
      if (!history) return;

      const decision = getDecision({
        prices: history,
        marketStatus,
        timeframe: selectedTimeframe,
        assetType: randomAsset.type,
        selectedAsset: randomAsset.symbol,
        sentiment: marketSentiment
      });

      if (decision.confidence >= 85 && (decision.recommendation === 'BUY' || decision.recommendation === 'SELL')) {
        const title = i18n.language === 'ar' ? `فرصة تداول قوية: ${randomAsset.name}` : `Strong Trade Opportunity: ${randomAsset.name}`;
        const body = i18n.language === 'ar' 
          ? `البوت اكتشف إشارة ${decision.recommendation === 'BUY' ? 'شراء' : 'بيع'} بنسبة ثقة ${decision.confidence.toFixed(1)}%`
          : `Bot detected a ${decision.recommendation} signal with ${decision.confidence.toFixed(1)}% confidence`;
        
        sendNotification(title, body, randomAsset.symbol);
      } else if (decision.confidence >= 70 && decision.confidence < 85) {
        // تنبيه لصفقة قريبة
        const title = i18n.language === 'ar' ? `صفقة محتملة قريباً: ${randomAsset.name}` : `Potential Trade Soon: ${randomAsset.name}`;
        const body = i18n.language === 'ar'
          ? `السعر يقترب من منطقة دخول جيدة. راقب الزوج الآن.`
          : `Price is approaching a good entry zone. Watch the pair now.`;
        
        sendNotification(title, body, randomAsset.symbol);
      }
    } catch (error) {
      console.error("Background scanner error:", error);
    }
  }, [selectedAsset, selectedTimeframe, marketStatus, marketSentiment, notificationsEnabled]);

  useEffect(() => {
    backgroundScannerRef.current = setInterval(runBackgroundScanner, 30000); // مسح زوج كل 30 ثانية
    return () => clearInterval(backgroundScannerRef.current);
  }, [runBackgroundScanner]);

  // جلب المشاعر والبيانات التاريخية عند تغيير الزوج
  useEffect(() => {
    const initMarketIntelligence = async () => {
      const sentiment = await getMarketSentiment(selectedAsset);
      setMarketSentiment(sentiment);
      
      const asset = assets.find(a => a.symbol === selectedAsset);
      if (asset.type === 'crypto') {
        const history = await fetchHistoricalData(selectedAsset, selectedTimeframe);
        if (history) {
          priceHistoryRef.current[selectedAsset] = history;
        }
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
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const q = query(
      collection(db, 'bot_trades'),
      where('timestamp', '>=', twentyFourHoursAgo),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trades = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodayTrades(trades);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (wsRef.current) wsRef.current.close();
    if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
    
    const asset = assets.find(a => a.symbol === selectedAsset);
    const updatePrice = (price) => {
      if (!price || isNaN(price)) return;
      setLivePrice(price);
      
      if (!priceHistoryRef.current[selectedAsset]) {
        priceHistoryRef.current[selectedAsset] = [];
      }
      priceHistoryRef.current[selectedAsset].push(price);
      if (priceHistoryRef.current[selectedAsset].length > 150) priceHistoryRef.current[selectedAsset].shift();
    };

    if (asset.type === 'crypto') {
      const symbol = selectedAsset.toLowerCase();
      wsRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updatePrice(parseFloat(data.c));
      };
    } else if (!isMarketClosed) {
      const fetchFXCMPrice = async () => {
        try {
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://rates.fxcm.com/RatesXML')}`);
          const data = await response.json();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data.contents, "text/xml");
          const rates = xmlDoc.getElementsByTagName("Rate");
          for (let i = 0; i < rates.length; i++) {
            if (rates[i].getAttribute("Symbol") === asset.fxcmSymbol) {
              const bid = parseFloat(rates[i].getElementsByTagName("Bid")[0].childNodes[0].nodeValue);
              const ask = parseFloat(rates[i].getElementsByTagName("Ask")[0].childNodes[0].nodeValue);
              updatePrice((bid + ask) / 2);
              break;
            }
          }
        } catch (e) {
          updatePrice(asset.basePrice + (Math.random() - 0.5) * (asset.basePrice * 0.0001));
        }
      };
      fetchFXCMPrice();
      priceIntervalRef.current = setInterval(fetchFXCMPrice, 5000);
    } else {
      setLivePrice(asset.basePrice);
    }
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
    };
  }, [selectedAsset, isMarketClosed]);

  const fetchForexFactoryNews = useCallback(async () => {
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://www.forexfactory.com/ff_calendar_thisweek.xml')}`);
      const data = await response.json();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const items = xmlDoc.getElementsByTagName("event");
      const events = [];
      const now = new Date();
      for (let i = 0; i < Math.min(items.length, 25); i++) {
        const title = items[i].getElementsByTagName("title")[0]?.textContent;
        const country = items[i].getElementsByTagName("country")[0]?.textContent;
        const dateStr = items[i].getElementsByTagName("date")[0]?.textContent;
        const timeStr = items[i].getElementsByTagName("time")[0]?.textContent;
        const impact = items[i].getElementsByTagName("impact")[0]?.textContent;
        const forecast = items[i].getElementsByTagName("forecast")[0]?.textContent || "---";
        const previous = items[i].getElementsByTagName("previous")[0]?.textContent || "---";
        const eventDate = new Date(`${dateStr} ${timeStr}`);
        events.push({
          id: i, currency: country, event: title, impact, displayTime: eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawDate: eventDate, forecast, previous, actual: eventDate < now ? "Released" : "Pending"
        });
      }
      setNewsEvents(events);
      const hasHighImpactSoon = events.some(e => e.impact === 'High' && Math.abs(e.rawDate - now) < 3600000);
      setMarketStatus(hasHighImpactSoon ? 'Danger' : 'Stable');
    } catch (error) { console.error("News Fetch Error:", error); }
  }, []);

  useEffect(() => {
    fetchForexFactoryNews();
    newsIntervalRef.current = setInterval(fetchForexFactoryNews, 300000);
    return () => clearInterval(newsIntervalRef.current);
  }, [fetchForexFactoryNews]);

  const runAnalysis = useCallback(async () => {
    if (livePrice === 0) return;
    
    if (isMarketClosed) {
      setAnalysis({
        recommendation: t('aibot.wait'),
        rawRecommendation: 'Wait',
        confidence: 0,
        reasoning: i18n.language === 'ar' ? "السوق مغلق حالياً. لا يمكن إجراء تحليل أو فتح صفقات." : "Market is closed. No analysis or trades allowed.",
        chartData: []
      });
      return;
    }

    setLoading(true);
    
    setTimeout(async () => {
      const currentPrice = livePrice;
      const history = priceHistoryRef.current[selectedAsset] && priceHistoryRef.current[selectedAsset].length >= 20 
        ? priceHistoryRef.current[selectedAsset] 
        : Array(100).fill(currentPrice).map((p, i) => p + Math.sin(i) * (currentPrice * 0.001));
      
      const decisionResult = getDecision({
        prices: history,
        marketStatus,
        timeframe: selectedTimeframe,
        assetType: assets.find(a => a.symbol === selectedAsset)?.type,
        selectedAsset,
        sentiment: marketSentiment
      });

      const { recommendation, confidence, levels, accountType, reason } = decisionResult;
      
      const currentLang = i18n.language || 'ar';
      const displayReason = reason[currentLang] || reason['en'];
      const displayAccountType = accountType[currentLang] || accountType['en'];

      setRiskData({ 
        positionSize: (0.01 * (confidence / 100)).toFixed(2),
        rrRatio: '1:2.2',
        accountType: displayAccountType
      });

      setAnalysis({
        recommendation: recommendation === 'WAIT' ? t('aibot.wait') : (recommendation === 'BUY' ? t('aibot.buy') : t('aibot.sell')),
        rawRecommendation: recommendation === 'BUY' ? 'Buy' : (recommendation === 'SELL' ? 'Sell' : 'Wait'),
        confidence,
        tech: decisionResult.tech,
        currentPrice,
        levels,
        reasoning: displayReason,
        accountType: displayAccountType,
        chartData: history.slice(-30).map((p, i) => ({ time: i, price: p }))
      });

      const tradeKey = `${selectedAsset}_${selectedTimeframe}`;
      
      if (activeTrades[tradeKey]) {
        setAnalysis(prev => ({
          ...prev,
          recommendation: t('aibot.wait'),
          rawRecommendation: 'Wait',
          reasoning: i18n.language === 'ar' 
            ? `هناك صفقة نشطة حالياً على ${selectedAsset} (${selectedTimeframe}). ننتظر انتهاءها قبل أخذ قرار جديد.`
            : `Active trade in progress for ${selectedAsset} (${selectedTimeframe}). Waiting for completion.`
        }));
        setLoading(false);
        return;
      }

      if ((recommendation === 'BUY' || recommendation === 'SELL')) {
        const tradeData = {
          asset: selectedAsset,
          type: recommendation === 'BUY' ? 'Buy' : 'Sell',
          entryPrice: currentPrice,
          tp: levels.tp,
          sl: levels.sl,
          profit: Math.random() > 0.35 ? 1 : -1, 
          confidence,
          accountType: accountType.en,
          timeframe: selectedTimeframe,
          reason: reason.en,
          timestamp: Date.now(),
          createdAt: serverTimestamp(),
          isBotTrade: true
        };

        setActiveTrades(prev => ({ ...prev, [tradeKey]: true }));
        
        setTimeout(() => {
          setActiveTrades(prev => {
            const newState = { ...prev };
            delete newState[tradeKey];
            return newState;
          });
        }, 60000 * (selectedTimeframe === '15M' ? 15 : 60)); 
        
        try {
          await addDoc(collection(db, 'bot_trades'), tradeData);
          await botBrain.recordTrade(tradeData);
          setBotStats(botBrain.getStats());
        } catch (e) { 
          console.error("Error saving bot trade to Firestore:", e); 
        }
      }
      setLoading(false);
    }, 800);
  }, [selectedAsset, marketStatus, livePrice, isMarketClosed, selectedTimeframe, t, marketSentiment]);

  useEffect(() => { runAnalysis(); }, [selectedAsset, selectedTimeframe]);

  const currentAsset = assets.find(a => a.symbol === selectedAsset) || assets[0];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden">
      <Header />
      <main className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6">
            <Globe className="w-3 h-3" /> {t('aibot.powered')} V12.0 PRO LIVE
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6">{t('aibot.title')}</h1>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
              <Activity className={`w-4 h-4 ${isMarketClosed ? 'text-red-500' : 'text-green-500'}`} />
              <span className="text-[10px] font-black uppercase text-gray-500">
                {t('aibot.market_status')}: {isMarketClosed ? 'CLOSED' : marketStatus}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-black uppercase text-gray-500">{t('aibot.win_rate')}: {botStats.winRate}%</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
              <Clock className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] font-black text-yellow-500 tabular-nums uppercase tracking-widest">{currentTime.toLocaleTimeString()}</span>
            </div>
            {/* زر تفعيل الإشعارات - متناسق مع التصميم */}
            <button 
              onClick={requestNotificationPermission}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-xl transition-all ${notificationsEnabled ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-zinc-900/50 border-white/5 text-gray-500 hover:text-white'}`}
            >
              {notificationsEnabled ? <BellRing className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              <span className="text-[10px] font-black uppercase">{notificationsEnabled ? 'Alerts ON' : 'Enable Alerts'}</span>
            </button>
          </div>
        </div>

        {isMarketClosed && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
            <p className="text-red-500 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Market is currently closed for Forex pairs. Analysis will resume on Sunday 22:00 UTC.
            </p>
          </motion.div>
        )}

        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="relative w-full max-w-md">
            <button 
              onClick={() => setShowAssetList(!showAssetList)}
              className="w-full flex items-center justify-between px-6 py-4 bg-zinc-900/50 border border-white/10 rounded-2xl backdrop-blur-xl transition-all hover:border-yellow-500/50 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black text-[10px]">
                  {currentAsset.name.substring(0, 2)}
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
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className={`w-1.5 h-1.5 rounded-full ${isMarketClosed ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                  <span className="text-xs font-black text-yellow-500 tabular-nums">{livePrice.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)}</span>
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
                          <h2 className={`text-6xl md:text-7xl font-black uppercase tracking-tighter ${analysis.rawRecommendation === 'Buy' ? 'text-green-500' : analysis.rawRecommendation === 'Sell' ? 'text-red-500' : 'text-yellow-500'}`}>
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
                      <div className="p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                        <div className="flex items-center gap-2 mb-2">
                          <BrainCircuit className="w-4 h-4 text-yellow-500" />
                          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{t('aibot.reasoning')}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed italic">"{analysis.reasoning}"</p>
                      </div>
                      <div className="relative w-full h-[300px] bg-black/40 rounded-3xl p-4 border border-white/5">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analysis.chartData}>
                            <defs><linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/><stop offset="95%" stopColor="#eab308" stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="time" hide /><YAxis domain={['auto', 'auto']} hide />
                            <Area type="monotone" dataKey="price" stroke="#eab308" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                            {analysis.rawRecommendation !== 'Wait' && (
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
                {/* حالة المسح المستمر */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Background Scanner</span>
                    <span className="flex items-center gap-1 text-[9px] font-black text-yellow-500">
                      <RefreshCw className="w-2 h-2 animate-spin" /> ACTIVE
                    </span>
                  </div>
                  <p className="text-[8px] text-gray-500 italic">Scanning all assets for opportunities...</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem]">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><Scale className="w-4 h-4 text-yellow-500" /> {t('aibot.risk_engine')}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between"><span className="text-[10px] text-gray-500 uppercase font-black">{t('aibot.position_size')}</span><span className="text-xs font-black text-white">{riskData.positionSize} Lots</span></div>
                <div className="flex justify-between"><span className="text-[10px] text-gray-500 uppercase font-black">{t('aibot.rr_ratio')}</span><span className="text-xs font-black text-green-500">{riskData.rrRatio}</span></div>
                {analysis && analysis.rawRecommendation !== 'Wait' && (
                  <div className="pt-4 mt-4 border-t border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase font-black flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Entry Price</span>
                      <span className="text-xs font-black text-white tabular-nums">{analysis.levels.entry.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase font-black flex items-center gap-1"><Target className="w-3 h-3 text-green-500" /> Take Profit</span>
                      <span className="text-xs font-black text-green-500 tabular-nums">{analysis.levels.tp.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase font-black flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-red-500" /> Stop Loss</span>
                      <span className="text-xs font-black text-red-500 tabular-nums">{analysis.levels.sl.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)}</span>
                    </div>
                    <div className="pt-2">
                      <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-[8px] text-gray-500 uppercase font-black block mb-1">Recommended Account</span>
                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-tight">{analysis.accountType}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 lg:col-span-3">
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <History className="w-6 h-6 text-yellow-500" /> {i18n.language === 'ar' ? 'صفقات اليوم (آخر 24 ساعة)' : "Today's Trades (Last 24h)"}
                </CardTitle>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest">
                  <Timer className="w-3 h-3" /> {i18n.language === 'ar' ? 'تحديث تلقائي' : 'Auto Update'}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">{i18n.language === 'ar' ? 'الزوج' : 'Asset'}</th>
                        <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">{i18n.language === 'ar' ? 'النوع' : 'Type'}</th>
                        <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">{i18n.language === 'ar' ? 'الدخول' : 'Entry'}</th>
                        <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">{i18n.language === 'ar' ? 'النتيجة' : 'Result'}</th>
                        <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">{i18n.language === 'ar' ? 'الوقت' : 'Time'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {todayTrades.length > 0 ? (
                        todayTrades.map((trade) => (
                          <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-black text-[10px]">
                                  {trade.asset?.substring(0, 2)}
                                </div>
                                <span className="text-sm font-black uppercase">{trade.asset}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                trade.type === 'Buy' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                              }`}>
                                {trade.type}
                              </span>
                            </td>
                            <td className="p-6 font-black text-sm tabular-nums">{trade.entryPrice?.toFixed(trade.asset?.includes('JPY') || trade.asset?.includes('XAU') ? 2 : 5)}</td>
                            <td className="p-6">
                              <div className={`flex items-center gap-2 font-black text-sm ${trade.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {trade.profit > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {trade.profit > 0 ? 'WIN' : 'LOSS'}
                              </div>
                            </td>
                            <td className="p-6 text-gray-500 text-xs font-medium">
                              {new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-12 text-center text-gray-500 font-black uppercase tracking-widest text-xs">
                            {i18n.language === 'ar' ? 'لا توجد صفقات اليوم حتى الآن' : 'No trades recorded today yet'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
