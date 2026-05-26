import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  Search, Filter, Bell, BellRing, BellOff, Cpu, Wifi, TrendingUpIcon,
  Sigma, FlaskConical, Atom, Microscope, LineChart, BarChart2, Boxes,
  Award, Flame, Radar, Binary, Network
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell,
  RadarChart, Radar as RadarShape, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Header from './Header';
import Footer from './Footer';
import AuthGuardPopup from './AuthGuardPopup';
import { auth } from '../lib/firebase';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

// === محركات AI المتقدمة V2 ===
import { getTradeLevels, calculatePositionSize } from '../lib/bot/risk/manager';
import { advancedBotBrain } from '../lib/bot/models/rl_model_v2';
import { getDecisionV2 } from '../lib/bot/models/decision_engine_v2';
import { analyzeOrderFlow } from '../lib/bot/analysis/orderFlow';
import { fetchHistoricalData, getMarketSentiment, fetchGlobalNews } from '../lib/bot/analysis/market_intelligence';
import { fetchNewsForSymbol } from '../lib/bot/analysis/newsService';
import { logTrade } from '../lib/bot/learning/tradeLogger';
import NewsPanel from './NewsPanel';
import LiveTradesPanel from './LiveTradesPanel';

// ======================== ANIMATED NUMBER ========================
const AnimatedNumber = ({ value, decimals = 1, prefix = '', suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = display;
    const end = parseFloat(value);
    const diff = end - start;
    const steps = 40;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplay(start + diff * (step / steps));
      if (step >= steps) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{typeof display === 'number' ? display.toFixed(decimals) : display}{suffix}</span>;
};

// ======================== GAUGE CIRCLE ========================
const GaugeArc = ({ value, max = 100, color, size = 100, label, sublabel }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (pct / 100) * circumference * 0.75;
  const rotation = -135;
  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: size, height: size * 0.7 }} className="relative">
        <svg width={size} height={size * 0.75} viewBox="0 0 100 75">
          <path
            d="M 10 70 A 40 40 0 1 1 90 70"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 10 70 A 40 40 0 1 1 90 70"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75}`}
            strokeDashoffset={`${circumference * 0.75 * (1 - pct / 100)}`}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
          <text x="50" y="62" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold">
            {Math.round(value)}
          </text>
        </svg>
      </div>
      {label && <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</p>}
      {sublabel && <p className="text-[8px] text-gray-600 uppercase">{sublabel}</p>}
    </div>
  );
};

// ======================== SIGNAL STRENGTH BAR ========================
const SignalBar = ({ label, value, color, icon: Icon, maxVal = 100 }) => {
  const pct = Math.max(0, Math.min(100, Math.abs(value / maxVal) * 100));
  const isNeg = value < 0;
  return (
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 truncate">{label}</span>
          <span className="text-[10px] font-black ml-2 shrink-0" style={{ color }}>
            {value > 0 ? '+' : ''}{typeof value === 'number' ? value.toFixed(1) : value}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: isNeg ? '#ef4444' : color }}
          />
        </div>
      </div>
    </div>
  );
};

// ======================== INDICATOR CHIP ========================
const IndicatorChip = ({ label, value, status }) => {
  const colors = {
    bullish: 'bg-green-500/15 border-green-500/30 text-green-400',
    bearish: 'bg-red-500/15 border-red-500/30 text-red-400',
    neutral: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    strong: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    weak: 'bg-gray-500/15 border-gray-500/30 text-gray-400',
  };
  const cls = colors[status] || colors.neutral;
  return (
    <div className={`px-3 py-2 rounded-xl border ${cls} flex flex-col gap-0.5`}>
      <span className="text-[8px] font-black uppercase tracking-widest opacity-70">{label}</span>
      <span className="text-[11px] font-black">{value}</span>
    </div>
  );
};

// ======================== AI ANALYST PANEL ========================
const AIAnalystPanel = ({ analysis, selectedAsset, lang }) => {
  if (!analysis) return null;
  const isAr = lang === 'ar';

  const dimensions = [
    { name: isAr ? 'الاتجاه' : 'Trend', score: analysis.scores?.trend || 0, max: 25, color: '#22c55e', icon: TrendingUp },
    { name: isAr ? 'الزخم' : 'Momentum', score: analysis.scores?.momentum || 0, max: 20, color: '#3b82f6', icon: Activity },
    { name: 'ADX', score: analysis.scores?.trendStrength || 0, max: 15, color: '#8b5cf6', icon: Gauge },
    { name: isAr ? 'الحجم' : 'Volume', score: analysis.scores?.volume || 0, max: 10, color: '#f59e0b', icon: BarChart2 },
    { name: 'RSI', score: analysis.scores?.rsi || 0, max: 10, color: '#06b6d4', icon: Sigma },
    { name: 'BB', score: analysis.scores?.bb || 0, max: 5, color: '#ec4899', icon: LineChart },
    { name: 'FVG', score: analysis.scores?.fvg || 0, max: 25, color: '#10b981', icon: Layers },
    { name: isAr ? 'الأخبار' : 'News', score: analysis.scores?.news || 0, max: 30, color: '#f97316', icon: Newspaper },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
          {isAr ? 'المحلل الذكي — تفكير متعدد الأبعاد' : 'AI Analyst — Multi-Dimensional Thinking'}
        </span>
      </div>
      <div className="space-y-2.5">
        {dimensions.map((d, i) => (
          <SignalBar
            key={d.name}
            label={d.name}
            value={d.score}
            maxVal={d.max}
            color={d.color}
            icon={d.icon}
          />
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-widest font-black">
          <span className="text-gray-500">{isAr ? 'النتيجة الإجمالية' : 'Final Score'}</span>
          <span className={analysis.rawScore > 0 ? 'text-green-400' : analysis.rawScore < 0 ? 'text-red-400' : 'text-amber-400'}>
            {analysis.rawScore > 0 ? '+' : ''}{(analysis.rawScore || 0).toFixed(1)}
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, 50 + (analysis.rawScore || 0) / 2))}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className={`h-full rounded-full ${(analysis.rawScore || 0) > 0 ? 'bg-gradient-to-r from-amber-500 to-green-500' : 'bg-gradient-to-l from-amber-500 to-red-500'}`}
          />
        </div>
      </div>
    </div>
  );
};

// ======================== RL STATS PANEL ========================
const RLStatsPanel = ({ weights, stats, lang }) => {
  const isAr = lang === 'ar';
  const weightKeys = weights ? Object.keys(weights) : [];
  const labels = {
    rsi: 'RSI', macd: 'MACD', trend: isAr ? 'اتجاه' : 'Trend',
    volume: isAr ? 'حجم' : 'Volume', adx: 'ADX',
    sentiment: isAr ? 'مشاعر' : 'Sentiment', news: isAr ? 'أخبار' : 'News'
  };
  const colors = ['#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-purple-400 to-purple-700" />
        <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
          {isAr ? 'أوزان التعلم المعزز — تحديث ديناميكي' : 'RL Weights — Dynamic Updates'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {weightKeys.map((key, i) => (
          <div key={key} className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[8px] font-black uppercase tracking-wider text-gray-400">{labels[key] || key}</span>
              <span className="text-[10px] font-black" style={{ color: colors[i % colors.length] }}>
                {(weights[key] * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${weights[key] * 100}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="h-full rounded-full"
                style={{ background: colors[i % colors.length] }}
              />
            </div>
          </div>
        ))}
      </div>
      {stats && (
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
          <div className="text-center">
            <p className="text-[8px] text-gray-500 uppercase font-black mb-1">{isAr ? 'أفضل صفقة' : 'Best Trade'}</p>
            <p className="text-sm font-black text-green-400">+{(stats.bestTrade || 0).toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] text-gray-500 uppercase font-black mb-1">{isAr ? 'الربح الكلي' : 'Total P/L'}</p>
            <p className={`text-sm font-black ${(stats.totalProfit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {(stats.totalProfit || 0) >= 0 ? '+' : ''}{(stats.totalProfit || 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ======================== ORDER FLOW VISUAL ========================
const OrderFlowVisual = ({ orderFlow, lang }) => {
  const isAr = lang === 'ar';
  if (!orderFlow) return null;
  const buy = orderFlow.buyPressure || 50;
  const sell = orderFlow.sellPressure || 50;
  const imbalance = orderFlow.imbalance || 'Neutral';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-700" />
        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
          {isAr ? 'تدفق الطلبات — Order Flow' : 'Order Flow Analysis'}
        </span>
      </div>
      {/* Buy/Sell Pressure Bar */}
      <div className="relative h-7 rounded-xl overflow-hidden bg-black/30 border border-white/5 flex">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${buy}%` }}
          transition={{ duration: 1.2 }}
          className="h-full bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center"
        >
          {buy > 20 && <span className="text-[8px] font-black text-white">{buy.toFixed(0)}%</span>}
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${sell}%` }}
          transition={{ duration: 1.2 }}
          className="h-full bg-gradient-to-l from-red-600 to-red-400 flex items-center justify-center"
        >
          {sell > 20 && <span className="text-[8px] font-black text-white">{sell.toFixed(0)}%</span>}
        </motion.div>
      </div>
      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
        <span className="text-green-400">{isAr ? 'ضغط شراء' : 'Buy Pressure'}</span>
        <span className="text-red-400">{isAr ? 'ضغط بيع' : 'Sell Pressure'}</span>
      </div>
      {/* Imbalance Badge */}
      <div className={`px-3 py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border ${
        imbalance.includes('Bullish') ? 'bg-green-500/10 border-green-500/20 text-green-400' :
        imbalance.includes('Bearish') ? 'bg-red-500/10 border-red-500/20 text-red-400' :
        'bg-white/5 border-white/10 text-gray-400'
      }`}>
        {isAr ? (imbalance.includes('Bullish') ? 'عدم توازن صاعد 🔥' : imbalance.includes('Bearish') ? 'عدم توازن هابط ⚠️' : 'متوازن ⚖️') : imbalance}
      </div>
      {orderFlow.interpretation && (
        <p className="text-[9px] text-gray-400 leading-relaxed italic border-l-2 border-cyan-500/30 pl-3">
          {orderFlow.interpretation}
        </p>
      )}
    </div>
  );
};

// ======================== MARKET REGIME BADGE ========================
const MarketRegimeBadge = ({ regime, lang }) => {
  const isAr = lang === 'ar';
  const regimes = {
    trending: {
      label: isAr ? 'سوق اتجاهي 📈' : 'Trending Market',
      color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: TrendingUp
    },
    ranging: {
      label: isAr ? 'سوق عرضي ↔️' : 'Ranging Market',
      color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Scale
    },
    volatile: {
      label: isAr ? 'سوق متقلب ⚡' : 'Volatile Market',
      color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: Zap
    }
  };
  const r = regimes[regime] || regimes.ranging;
  const Icon = r.icon;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${r.bg} ${r.color}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="text-[9px] font-black uppercase tracking-widest">{r.label}</span>
    </div>
  );
};

// ======================== MAIN COMPONENT ========================
const AITradingBot = () => {
  const { t } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === 'ar';

  // === State ===
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [newsEvents, setNewsEvents] = useState([]);
  const [globalNews, setGlobalNews] = useState([]);
  const [livePrice, setLivePrice] = useState(0);
  const [prevLivePrice, setPrevLivePrice] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState('Stable');
  const [isMarketClosed, setIsMarketClosed] = useState(false);
  const [botStats, setBotStats] = useState(advancedBotBrain.getStats());
  const [botWeights, setBotWeights] = useState(advancedBotBrain.getWeights());
  const [marketSentiment, setMarketSentiment] = useState(null);
  const [showAssetList, setShowAssetList] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
  const [showNewsPanel, setShowNewsPanel] = useState(false);
  const [liveTradesData, setLiveTradesData] = useState([]);
  const [showLiveTrades, setShowLiveTrades] = useState(false);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [marketRegime, setMarketRegime] = useState('ranging');
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'rl' | 'signals'
  const [priceTick, setPriceTick] = useState(null); // 'up' | 'down' | null

  const priceIntervalRef = useRef(null);
  const timeIntervalRef = useRef(null);
  const newsIntervalRef = useRef(null);
  const wsRef = useRef(null);
  const priceHistoryRef = useRef({});

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
    { name: 'LTC/USDT', symbol: 'LTCUSDT', tvSymbol: 'BINANCE:LTCUSDT', basePrice: 70, type: 'crypto' },
    { name: 'UNI/USDT', symbol: 'UNIUSDT', tvSymbol: 'BINANCE:UNIUSDT', basePrice: 6, type: 'crypto' },
    { name: 'ATOM/USDT', symbol: 'ATOMUSDT', tvSymbol: 'BINANCE:ATOMUSDT', basePrice: 10, type: 'crypto' },
    { name: 'NEAR/USDT', symbol: 'NEARUSDT', tvSymbol: 'BINANCE:NEARUSDT', basePrice: 3, type: 'crypto' },
    { name: 'XAU/USD (Gold)', symbol: 'XAUUSD', tvSymbol: 'OANDA:XAUUSD', basePrice: 2650, type: 'commodity' },
  ];

  const timeframes = [
    { label: '15M', value: '15' },
    { label: '1H', value: 'H' },
    { label: '4H', value: '4H' },
    { label: '1D', value: 'D' }
  ];

  const currentAsset = assets.find(a => a.symbol === selectedAsset) || assets[0];
  const isJpy = selectedAsset.includes('JPY');
  const isXau = selectedAsset.includes('XAU');
  const priceDecimals = (isJpy || isXau) ? 2 : selectedAsset.includes('SHIB') ? 8 : selectedAsset.includes('USDT') && currentAsset.basePrice < 1 ? 5 : 2;

  // === Market Intelligence Init ===
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

  // === Market Hours ===
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const day = now.getUTCDay();
      const hour = now.getUTCHours();
      const asset = assets.find(a => a.symbol === selectedAsset);
      if (asset && asset.type === 'forex') {
        const isClosed = (day === 6) || (day === 5 && hour >= 22) || (day === 0 && hour < 22);
        setIsMarketClosed(isClosed);
      } else {
        setIsMarketClosed(false);
      }
    };
    check();
    const iv = setInterval(check, 60000);
    return () => clearInterval(iv);
  }, [selectedAsset]);

  // === Clock & Auth ===
  useEffect(() => {
    timeIntervalRef.current = setInterval(() => setCurrentTime(new Date()), 1000);
    const unsub = auth.onAuthStateChanged(u => setIsUserAuthenticated(!!u));
    return () => { clearInterval(timeIntervalRef.current); unsub(); };
  }, []);

  // === News Fetcher ===
  const fetchNews = useCallback(async () => {
    setIsNewsLoading(true);
    try {
      let calendarNews = [];
      try {
        const res = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json');
        const data = await res.json();
        const now = new Date();
        const upcoming = data.filter(e => {
          const d = new Date(e.date);
          return d > new Date(now.getTime() - 3600000) && d < new Date(now.getTime() + 86400000);
        }).slice(0, 10);
        calendarNews = upcoming.map(e => ({
          id: 'cal-' + Math.random().toString(36).substr(2, 9),
          displayTime: new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          currency: e.country,
          event: e.title,
          impact: e.impact,
          forecast: e.forecast || '-',
          previous: e.previous || '-',
          actual: e.actual || '-',
          source: 'Economic Calendar',
          type: 'calendar'
        }));
      } catch (e) { /* silent */ }

      const gNewsData = await fetchGlobalNews(selectedAsset.replace('USDT', ''));
      setGlobalNews(gNewsData || []);

      const globalFmt = (gNewsData || []).map(n => ({
        id: 'glob-' + Math.random().toString(36).substr(2, 9),
        displayTime: new Date(n.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        currency: selectedAsset.replace('USDT', ''),
        event: n.title,
        impact: n.sentiment === 'Positive' ? 'High' : n.sentiment === 'Negative' ? 'High' : 'Medium',
        forecast: 'News',
        actual: n.sentiment,
        previous: n.source,
        source: n.source,
        type: 'global'
      }));

      const allNews = [...calendarNews, ...globalFmt];
      setNewsEvents(allNews);
    } catch (err) {
      console.error('News fetch error:', err);
    } finally {
      setIsNewsLoading(false);
    }
  }, [selectedAsset]);

  useEffect(() => {
    fetchNews();
    newsIntervalRef.current = setInterval(fetchNews, 60000);
    return () => clearInterval(newsIntervalRef.current);
  }, [fetchNews]);

  // === Main Analysis (V2 Engine) ===
  const runAnalysis = useCallback(async () => {
    if (isMarketClosed) return;
    setLoading(true);
    try {
      const history = await fetchHistoricalData(selectedAsset, selectedTimeframe);
      if (!history || history.length < 30) throw new Error('Insufficient data');

      const decision = getDecisionV2({
        prices: history,
        marketStatus,
        timeframe: selectedTimeframe,
        assetType: currentAsset.type,
        selectedAsset,
        sentiment: marketSentiment,
        news: newsEvents,
        globalNews,
        rlWeights: advancedBotBrain.getWeights()
      });

      // Detect market regime
      const volatility = (decision.tech?.volatility || 1) / 100;
      const detectedRegime = advancedBotBrain.detectMarketRegime(history, decision.tech?.adx || 25, volatility);
      setMarketRegime(detectedRegime);

      // Get order flow
      const orderFlow = await analyzeOrderFlow(selectedAsset, history[history.length - 1], history).catch(() => null);

      const chartData = history.slice(-30).map((p, i) => ({
        time: i,
        price: p,
        sma: i >= 5 ? history.slice(i - 5, i + 1).reduce((a, b) => a + b, 0) / 6 : p
      }));

      // Build per-dimension scores dynamically for AI Analyst panel from decision scores
      const scores = {
        trend: decision.scores?.trend || 0,
        momentum: decision.scores?.momentum || 0,
        trendStrength: decision.scores?.trendStrength || 0,
        volume: decision.scores?.volume || 0,
        rsi: decision.scores?.rsi || 0,
        bb: decision.scores?.bb || 0,
        fvg: decision.scores?.fvg || 0,
        news: decision.scores?.news || 0
      };

      setAnalysis({
        recommendation: t(`aibot.${decision.recommendation.toLowerCase()}`),
        rawRecommendation: decision.recommendation,
        confidence: decision.confidence,
        reasoning: decision.reason?.[lang] || decision.reason?.['en'],
        levels: decision.levels,
        rrRatio: decision.rrRatio,
        chartData,
        tech: decision.tech,
        orderFlow,
        upcomingNews: decision.upcomingNews,
        rawScore: decision.rawScore || 0,
        scores
      });

      // Update RL brain
      if (decision.recommendation !== 'WAIT' && decision.confidence > 70) {
        setBotStats(advancedBotBrain.getStats());
        setBotWeights(advancedBotBrain.getWeights());

        // Log trade
        const currentUser = auth.currentUser;
        if (currentUser) {
          logTrade({
            userId: currentUser.uid,
            symbol: selectedAsset,
            action: decision.recommendation,
            entryPrice: history[history.length - 1],
            stopLoss: decision.levels?.sl,
            takeProfit: decision.levels?.tp,
            positionSize: 0.01,
            leverage: 1,
            timeframe: selectedTimeframe,
            confidence: decision.confidence,
            indicators: decision.tech,
            sentiment: marketSentiment?.sentiment || 'neutral',
            newsImpact: newsEvents.length > 0 ? 'medium' : 'low',
            reason: decision.reason?.['ar'] || decision.reason?.['en']
          });
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedAsset, selectedTimeframe, marketStatus, marketSentiment, newsEvents, globalNews, t, lang]);

  useEffect(() => {
    runAnalysis();
    const iv = setInterval(runAnalysis, 60000);
    return () => clearInterval(iv);
  }, [runAnalysis]);

  // === WebSocket Price Feed ===
  useEffect(() => {
    if (wsRef.current) wsRef.current.close();
    if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);

    const asset = assets.find(a => a.symbol === selectedAsset);
    if (!asset) return;

    const updatePrice = (price) => {
      if (!price || isNaN(price)) return;
      setLivePrice(prev => {
        if (prev !== 0) {
          setPrevLivePrice(prev);
        }
        if (price > prev) setPriceTick('up');
        else if (price < prev) setPriceTick('down');
        setTimeout(() => setPriceTick(null), 600);
        if (Math.abs(prev - price) < 0.0000001) return prev;
        return price;
      });
      if (!priceHistoryRef.current[selectedAsset]) {
        priceHistoryRef.current[selectedAsset] = [];
      }
      priceHistoryRef.current[selectedAsset].push(price);
      if (priceHistoryRef.current[selectedAsset].length > 200) {
        priceHistoryRef.current[selectedAsset].shift();
      }
    };

    setLivePrice(0);

    if (asset.type === 'crypto') {
      const sym = selectedAsset.toLowerCase();
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${sym}@ticker`);
      wsRef.current = ws;
      ws.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if (d.s === selectedAsset) updatePrice(parseFloat(d.c));
      };
      ws.onerror = () => ws.close();
    } else if (!isMarketClosed) {
      const socket = new WebSocket('wss://ws.finnhub.io?token=sandbox_c8m2v2iad3if8n8b8g00');
      wsRef.current = socket;
      socket.onopen = () => socket.send(JSON.stringify({ type: 'subscribe', symbol: asset.tvSymbol }));
      socket.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if (d.type === 'trade' && d.data) {
          const trade = d.data.find(t => t.s === asset.tvSymbol);
          if (trade) updatePrice(parseFloat(trade.p));
        }
      };
      // Fallback polling
      const fetchFallback = async () => {
        try {
          const tdKey = import.meta.env.VITE_TWELVEDATA_API_KEY || 'demo';
          const tdSym = asset.symbol === 'XAUUSD' ? 'GOLD' : asset.symbol;
          const tdRes = await fetch(`https://api.twelvedata.com/price?symbol=${tdSym}&apikey=${tdKey}`);
          const tdData = await tdRes.json();
          if (tdData?.price) { updatePrice(parseFloat(tdData.price)); return; }
          const fhKey = import.meta.env.VITE_FINNHUB_API_KEY || 'sandbox_c8m2v2iad3if8n8b8g00';
          const fhRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${asset.tvSymbol}&token=${fhKey}`);
          const fhData = await fhRes.json();
          if (fhData?.c && fhData.c !== 0) updatePrice(fhData.c);
        } catch (e) { /* silent */ }
      };
      fetchFallback();
      priceIntervalRef.current = setInterval(fetchFallback, 10000);
    } else {
      setLivePrice(asset.basePrice);
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
    };
  }, [selectedAsset, isMarketClosed]);

  // Computed UI helpers
  const recColor = analysis?.rawRecommendation === 'BUY'
    ? 'text-green-400' : analysis?.rawRecommendation === 'SELL'
    ? 'text-red-400' : 'text-amber-400';

  const recBg = analysis?.rawRecommendation === 'BUY'
    ? 'from-green-500/20 to-green-500/5 border-green-500/20'
    : analysis?.rawRecommendation === 'SELL'
    ? 'from-red-500/20 to-red-500/5 border-red-500/20'
    : 'from-amber-500/20 to-amber-500/5 border-amber-500/20';

  const confidenceColor = (analysis?.confidence || 0) >= 85
    ? '#22c55e' : (analysis?.confidence || 0) >= 70
    ? '#f59e0b' : '#ef4444';

  const priceChangeColor = priceTick === 'up' ? 'text-green-400' : priceTick === 'down' ? 'text-red-400' : 'text-amber-400';

  return (
    <div className="min-h-screen text-white selection:bg-amber-500/30"
      style={{ background: 'linear-gradient(135deg, #050505 0%, #0a0a0f 50%, #05050a 100%)' }}>
      <Header />

      {/* === BACKGROUND AMBIENT === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      </div>

      <main className="relative z-10 container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">

        {/* === TOP BAR === */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          {/* Asset Selector */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <button
                onClick={() => setShowAssetList(!showAssetList)}
                className="flex items-center justify-between gap-3 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-xl hover:border-amber-500/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <Activity className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{isAr ? 'الأصل المختار' : 'Asset'}</p>
                    <p className="text-sm font-black">{currentAsset.name}</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showAssetList ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showAssetList && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    className="absolute z-50 top-full left-0 mt-2 w-64 rounded-2xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl"
                    style={{ background: 'rgba(10,10,20,0.97)', maxHeight: '380px', overflowY: 'auto' }}
                  >
                    <div className="p-2 space-y-0.5">
                      {assets.map(a => (
                        <button
                          key={a.symbol}
                          onClick={() => { setSelectedAsset(a.symbol); setShowAssetList(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${
                            selectedAsset === a.symbol
                              ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-white'
                              : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'
                          }`}
                        >
                          <span className="text-[11px] font-black uppercase">{a.name}</span>
                          {a.type === 'crypto' ? <Zap className="w-3 h-3 opacity-40" /> : <Globe className="w-3 h-3 opacity-40" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Live Price */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-white/10"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className={`w-2 h-2 rounded-full ${isMarketClosed ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
              <div>
                <p className="text-[8px] text-gray-500 uppercase tracking-widest font-black">{isAr ? 'السعر الحي' : 'Live Price'}</p>
                <motion.p
                  key={livePrice}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm font-black tabular-nums transition-colors ${priceChangeColor}`}
                >
                  {livePrice > 0 ? livePrice.toFixed(priceDecimals) : '---'}
                  {priceTick === 'up' && <span className="ml-1 text-[9px] text-green-400">▲</span>}
                  {priceTick === 'down' && <span className="ml-1 text-[9px] text-red-400">▼</span>}
                </motion.p>
              </div>
            </div>

            {/* Clock */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/5"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <Clock className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-black tabular-nums text-gray-400 uppercase tracking-widest">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>

            {/* Market Regime */}
            <MarketRegimeBadge regime={marketRegime} lang={lang} />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* News button */}
            <button
              onClick={() => setShowNewsPanel(!showNewsPanel)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all"
              style={{ background: 'rgba(245,158,11,0.08)' }}
            >
              <Newspaper className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                {isAr ? 'الأخبار' : 'News'}
              </span>
              {newsEvents.length > 0 && (
                <span className="bg-amber-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded-full">
                  {newsEvents.length}
                </span>
              )}
            </button>

            {/* Timeframes */}
            <div className="flex p-1 rounded-xl border border-white/5"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              {timeframes.map(tf => (
                <button
                  key={tf.label}
                  onClick={() => setSelectedTimeframe(tf.label)}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    selectedTimeframe === tf.label
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:block">
                {isAr ? 'تحليل' : 'Analyze'}
              </span>
            </button>
          </div>
        </div>

        {/* === MAIN GRID === */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* === LEFT COL: Analysis Card === */}
          <div className="xl:col-span-2 space-y-6">

            {/* Recommendation Hero Card */}
            <div className="rounded-3xl overflow-hidden border border-white/8 shadow-2xl backdrop-blur-2xl"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1))' }}>
                    <BrainCircuit className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-tight">
                      {isAr ? 'محرك القرار الذكي V2' : 'AI Decision Engine V2'}
                    </h2>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest">
                      {selectedAsset} · {selectedTimeframe} · Phoenix Engine
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <Cpu className="w-3 h-3 text-purple-400" />
                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-wider">AI V2.0</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="py-16 flex flex-col items-center justify-center gap-4"
                    >
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-pulse" />
                        <div className="absolute inset-2 rounded-full border-2 border-amber-500/40 animate-ping" />
                        <BrainCircuit className="absolute inset-0 m-auto w-7 h-7 text-amber-400 animate-pulse" />
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-black text-amber-400 uppercase tracking-widest mb-1">
                          {isAr ? 'تحليل متعدد الأبعاد...' : 'Multi-dimensional Analysis...'}
                        </p>
                        <p className="text-[9px] text-gray-600 uppercase tracking-widest">
                          RSI · MACD · ADX · FVG · Order Flow · Sentiment
                        </p>
                      </div>
                    </motion.div>
                  ) : analysis && (
                    <motion.div
                      key="analysis"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Recommendation + Confidence */}
                      <div className={`flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-br border ${recBg}`}>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            {isAr ? 'توصية المحرك الذكي' : 'AI Recommendation'}
                          </p>
                          <motion.h3
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none ${recColor}`}
                          >
                            {analysis.recommendation}
                          </motion.h3>
                          {analysis.rrRatio && (
                            <div className="flex items-center gap-2 mt-3">
                              <Scale className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                {isAr ? 'نسبة الربح/المخاطرة' : 'Risk/Reward'}: <span className="text-white">{analysis.rrRatio}</span>
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Confidence Gauge */}
                        <div className="flex flex-col items-center gap-2">
                          <GaugeArc
                            value={analysis.confidence}
                            max={100}
                            color={confidenceColor}
                            size={120}
                            label={isAr ? 'مستوى الثقة' : 'Confidence'}
                            sublabel="Phoenix V2"
                          />
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            analysis.confidence >= 85 ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                            analysis.confidence >= 70 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                            'bg-red-500/10 border-red-500/20 text-red-400'
                          }`}>
                            {analysis.confidence >= 85 ? (isAr ? 'ثقة عالية' : 'High Confidence') :
                             analysis.confidence >= 70 ? (isAr ? 'ثقة متوسطة' : 'Medium') :
                             (isAr ? 'انتظر إشارة' : 'Wait for Signal')}
                          </div>
                        </div>
                      </div>

                      {/* Indicator Chips */}
                      {analysis.tech && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <IndicatorChip
                            label="RSI"
                            value={analysis.tech.rsi?.toFixed(1)}
                            status={analysis.tech.rsi < 30 ? 'bullish' : analysis.tech.rsi > 70 ? 'bearish' : 'neutral'}
                          />
                          <IndicatorChip
                            label="ADX"
                            value={`${analysis.tech.adx?.toFixed(1) || '--'}`}
                            status={analysis.tech.adx > 25 ? 'strong' : 'weak'}
                          />
                          <IndicatorChip
                            label={isAr ? 'التذبذب' : 'Volatility'}
                            value={`${analysis.tech.volatility}%`}
                            status={parseFloat(analysis.tech.volatility) > 2 ? 'bearish' : 'bullish'}
                          />
                          <IndicatorChip
                            label={isAr ? 'الحجم' : 'Volume'}
                            value={analysis.tech.volume === 'increasing' ? (isAr ? 'متزايد' : 'Rising') : (isAr ? 'متناقص' : 'Falling')}
                            status={analysis.tech.volume === 'increasing' ? 'bullish' : 'bearish'}
                          />
                        </div>
                      )}

                      {/* Levels + Reasoning */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Reasoning */}
                        <div className="p-5 rounded-2xl border border-white/8"
                          style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <div className="flex items-center gap-2 mb-3">
                            <BrainCircuit className="w-4 h-4 text-amber-400" />
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                              {isAr ? 'تحليل المحرك الذكي' : 'AI Engine Analysis'}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-300 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {analysis.reasoning}
                          </p>
                        </div>

                        {/* Levels */}
                        {analysis.rawRecommendation !== 'WAIT' && analysis.levels && (
                          <div className="p-5 rounded-2xl border border-white/8 space-y-3"
                            style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="w-4 h-4 text-blue-400" />
                              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                {isAr ? 'مستويات التداول' : 'Trade Levels'}
                              </span>
                            </div>
                            {[
                              { label: isAr ? 'دخول' : 'Entry', value: analysis.levels.entry, color: 'text-white', border: 'border-white/20', bg: 'bg-white/5' },
                              { label: isAr ? 'جني أرباح' : 'Take Profit', value: analysis.levels.tp, color: 'text-green-400', border: 'border-green-500/20', bg: 'bg-green-500/5' },
                              { label: isAr ? 'وقف خسارة' : 'Stop Loss', value: analysis.levels.sl, color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5' },
                            ].map(lvl => (
                              <div key={lvl.label} className={`flex items-center justify-between p-3 rounded-xl border ${lvl.bg} ${lvl.border}`}>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{lvl.label}</span>
                                <span className={`text-sm font-black tabular-nums ${lvl.color}`}>
                                  {lvl.value?.toFixed(priceDecimals)}
                                </span>
                              </div>
                            ))}
                            {/* S/R */}
                            {analysis.tech && (
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                                <div className="p-2 rounded-xl bg-green-500/5 border border-green-500/10">
                                  <p className="text-[8px] font-black text-gray-500 uppercase mb-1">{isAr ? 'دعم' : 'Support'}</p>
                                  <p className="text-[10px] font-black text-green-400">
                                    {analysis.tech.support?.toFixed(priceDecimals)}
                                    <span className="text-[7px] ml-1 opacity-60">({analysis.tech.supportStrength})</span>
                                  </p>
                                </div>
                                <div className="p-2 rounded-xl bg-red-500/5 border border-red-500/10">
                                  <p className="text-[8px] font-black text-gray-500 uppercase mb-1">{isAr ? 'مقاومة' : 'Resistance'}</p>
                                  <p className="text-[10px] font-black text-red-400">
                                    {analysis.tech.resistance?.toFixed(priceDecimals)}
                                    <span className="text-[7px] ml-1 opacity-60">({analysis.tech.resistanceStrength})</span>
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* News Alert */}
                      {analysis.upcomingNews && (
                        <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-500/20"
                          style={{ background: 'rgba(239,68,68,0.06)' }}>
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">
                              {isAr ? '⚠️ تنبيه خبر اقتصادي' : '⚠️ Economic News Alert'}
                            </p>
                            <p className="text-xs font-black text-white">{analysis.upcomingNews.event}</p>
                            <p className="text-[9px] text-red-300 uppercase mt-1">
                              {isAr ? 'التأثير:' : 'Impact:'} {analysis.upcomingNews.impact}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Chart */}
                      <div className="relative h-56 rounded-2xl overflow-hidden border border-white/5 p-4"
                        style={{ background: 'rgba(0,0,0,0.4)' }}>
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2">
                          {isAr ? 'حركة السعر — آخر 30 نقطة' : 'Price Action — Last 30 Bars'}
                        </p>
                        <ResponsiveContainer width="100%" height="90%">
                          <AreaChart data={analysis.chartData}>
                            <defs>
                              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="time" hide />
                            <YAxis domain={['auto', 'auto']} hide />
                            <Area
                              type="monotone" dataKey="price"
                              stroke="#f59e0b" strokeWidth={2}
                              fill="url(#priceGrad)" fillOpacity={1}
                            />
                            {analysis.rawRecommendation !== 'WAIT' && analysis.levels && (
                              <>
                                <ReferenceLine y={analysis.levels.entry} stroke="rgba(255,255,255,0.4)" strokeDasharray="4 4"
                                  label={{ position: 'right', value: 'Entry', fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: 'bold' }} />
                                <ReferenceLine y={analysis.levels.tp} stroke="#22c55e" strokeDasharray="4 4"
                                  label={{ position: 'right', value: 'TP', fill: '#22c55e', fontSize: 9, fontWeight: 'bold' }} />
                                <ReferenceLine y={analysis.levels.sl} stroke="#ef4444" strokeDasharray="4 4"
                                  label={{ position: 'right', value: 'SL', fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }} />
                              </>
                            )}
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload?.length) {
                                  return (
                                    <div className="bg-zinc-900 border border-white/10 px-3 py-2 rounded-xl text-xs font-black text-amber-400 tabular-nums">
                                      {payload[0].value?.toFixed(priceDecimals)}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Flow Card */}
            {analysis?.orderFlow && (
              <div className="p-5 rounded-3xl border border-cyan-500/10 backdrop-blur-xl"
                style={{ background: 'rgba(6,182,212,0.04)' }}>
                <OrderFlowVisual orderFlow={analysis.orderFlow} lang={lang} />
              </div>
            )}
          </div>

          {/* === RIGHT COL: Intelligence Panels === */}
          <div className="space-y-6">

            {/* Tab Switcher */}
            <div className="flex p-1 rounded-2xl border border-white/8"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              {[
                { id: 'analysis', label: isAr ? 'المحلل' : 'Analyst', icon: Microscope },
                { id: 'rl', label: isAr ? 'التعلم' : 'Learning', icon: Atom },
                { id: 'market', label: isAr ? 'السوق' : 'Market', icon: Globe },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="rounded-3xl border border-white/8 p-5 backdrop-blur-xl"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                {activeTab === 'analysis' && (
                  <AIAnalystPanel analysis={analysis} selectedAsset={selectedAsset} lang={lang} />
                )}
                {activeTab === 'rl' && (
                  <RLStatsPanel
                    weights={botWeights}
                    stats={botStats}
                    lang={lang}
                  />
                )}
                {activeTab === 'market' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-700" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                        {isAr ? 'مشاعر السوق الحية' : 'Live Market Sentiment'}
                      </span>
                    </div>
                    {marketSentiment ? (
                      <div className="space-y-4">
                        <div className={`p-4 rounded-2xl border text-center ${
                          marketSentiment.sentiment === 'Bullish'
                            ? 'bg-green-500/8 border-green-500/20'
                            : 'bg-red-500/8 border-red-500/20'
                        }`}>
                          <p className="text-3xl mb-1">
                            {marketSentiment.sentiment === 'Bullish' ? '🐂' : '🐻'}
                          </p>
                          <p className={`text-lg font-black uppercase ${
                            marketSentiment.sentiment === 'Bullish' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {isAr ? (marketSentiment.sentiment === 'Bullish' ? 'صاعد' : 'هابط') : marketSentiment.sentiment}
                          </p>
                        </div>
                        <div>
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2">
                            <span className="text-gray-500">{isAr ? 'درجة المشاعر' : 'Sentiment Score'}</span>
                            <span className="text-white">{marketSentiment.score?.toFixed(1) || '--'}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${marketSentiment.score || 50}%` }}
                              transition={{ duration: 1 }}
                              className={`h-full rounded-full ${marketSentiment.sentiment === 'Bullish' ? 'bg-green-500' : 'bg-red-500'}`}
                            />
                          </div>
                        </div>
                        {marketSentiment.reason && (
                          <p className="text-[9px] text-gray-400 italic leading-relaxed border-l-2 border-blue-500/30 pl-3">
                            "{marketSentiment.reason}"
                          </p>
                        )}
                        <MarketRegimeBadge regime={marketRegime} lang={lang} />
                      </div>
                    ) : (
                      <div className="py-10 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bot Performance Stats */}
            <div className="rounded-3xl border border-white/8 p-5 backdrop-blur-xl"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-green-400 to-green-700" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">
                  {isAr ? 'أداء البوت — الذاكرة التراكمية' : 'Bot Performance — Cumulative Memory'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: isAr ? 'نسبة الفوز' : 'Win Rate',
                    value: `${parseFloat(botStats.winRate || 0).toFixed(1)}%`,
                    color: 'text-green-400',
                    bg: 'bg-green-500/8 border-green-500/15',
                    icon: Award
                  },
                  {
                    label: isAr ? 'إجمالي الصفقات' : 'Total Trades',
                    value: botStats.totalTrades || 0,
                    color: 'text-white',
                    bg: 'bg-white/5 border-white/8',
                    icon: BarChart3
                  },
                  {
                    label: isAr ? 'أفضل صفقة' : 'Best Trade',
                    value: `+${(botStats.bestTrade || 0).toFixed(1)}`,
                    color: 'text-amber-400',
                    bg: 'bg-amber-500/8 border-amber-500/15',
                    icon: Flame
                  },
                  {
                    label: isAr ? 'انتصارات متتالية' : 'Win Streak',
                    value: botStats.consecutiveWins || 0,
                    color: 'text-blue-400',
                    bg: 'bg-blue-500/8 border-blue-500/15',
                    icon: Zap
                  },
                ].map(stat => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className={`p-3 rounded-2xl border ${stat.bg}`}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Icon className={`w-3 h-3 ${stat.color}`} />
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                  );
                })}
              </div>
              {/* Learning Status */}
              <div className="mt-4 p-3 rounded-2xl border border-amber-500/15"
                style={{ background: 'rgba(245,158,11,0.06)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">
                    {isAr ? 'حالة التعلم النشط' : 'Active Learning Status'}
                  </span>
                </div>
                <p className="text-[9px] text-gray-400 leading-relaxed">
                  {isAr
                    ? 'البوت يُحدّث أوزانه الداخلية بعد كل صفقة باستخدام التعلم المعزز. معدل التعلم يزداد تلقائياً عند الخسارة لتسريع التكيّف.'
                    : 'Bot updates internal weights after each trade via Reinforcement Learning. Learning rate auto-increases on losses to accelerate adaptation.'}
                </p>
              </div>
            </div>

            {/* Quick News Summary */}
            {newsEvents.length > 0 && (
              <div className="rounded-3xl border border-white/8 p-5 backdrop-blur-xl"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-orange-400 to-orange-700" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                      {isAr ? 'أخبار اليوم' : "Today's News"}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNewsPanel(true)}
                    className="text-[8px] font-black text-amber-400 uppercase tracking-widest hover:text-amber-300 transition-colors"
                  >
                    {isAr ? 'عرض الكل' : 'View All'} →
                  </button>
                </div>
                <div className="space-y-2">
                  {newsEvents.slice(0, 4).map(n => (
                    <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl border border-white/5"
                      style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                        n.impact === 'High' ? 'bg-red-500' : n.impact === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-white truncate">{n.event}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[8px] text-gray-600 font-black uppercase">{n.displayTime}</span>
                          <span className="text-[8px] text-gray-600">·</span>
                          <span className="text-[8px] text-gray-600 font-black uppercase">{n.currency}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Panels */}
      <NewsPanel
        isOpen={showNewsPanel}
        onClose={() => setShowNewsPanel(false)}
        news={newsEvents}
        isLoading={isNewsLoading}
      />
      <LiveTradesPanel
        isOpen={showLiveTrades}
        onClose={() => setShowLiveTrades(false)}
        trades={liveTradesData}
        stats={null}
      />
    </div>
  );
};

export default AITradingBot;
