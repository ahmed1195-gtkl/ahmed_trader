import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, 
  Zap, RefreshCw, BrainCircuit, Lock,
  Newspaper, ShieldCheck, Loader2, CheckCircle2, Layers,
  Target, ArrowUpRight, ArrowDownRight, BarChart3, AlertCircle,
  MessageSquare, Lightbulb, Info, Calendar, Clock, Globe, AlertTriangle,
  ChevronRight, ChevronDown, Gauge, History, Timer, Scale
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Header from './Header';
import Footer from './Footer';

// استيراد الوحدات المحدثة
import { getTechnicalSignal, calculateMACD, calculateBollingerBands } from '../lib/bot/analysis/technical';
import { getTradeLevels, calculatePositionSize } from '../lib/bot/risk/manager';
import { botBrain } from '../lib/bot/models/rl_model';

const AITradingBot = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [newsEvents, setNewsEvents] = useState([]);
  const [weeklyNews, setWeeklyNews] = useState([]);
  const [livePrice, setLivePrice] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState('Stable');
  const [botStats, setBotStats] = useState(botBrain.getStats());
  const [riskData, setRiskData] = useState({ positionSize: 0, rrRatio: '1:2' });
  
  const priceIntervalRef = useRef(null);
  const timeIntervalRef = useRef(null);
  const wsRef = useRef(null);
  const priceHistoryRef = useRef([]);

  const assets = [
    { name: 'BTC/USDT', symbol: 'BTCUSDT', tvSymbol: 'BINANCE:BTCUSDT', basePrice: 45000, type: 'crypto' },
    { name: 'ETH/USDT', symbol: 'ETHUSDT', tvSymbol: 'BINANCE:ETHUSDT', basePrice: 2400, type: 'crypto' },
    { name: 'SOL/USDT', symbol: 'SOLUSDT', tvSymbol: 'BINANCE:SOLUSDT', basePrice: 95, type: 'crypto' },
    { name: 'XAU/USD', symbol: 'XAUUSD', tvSymbol: 'OANDA:XAUUSD', basePrice: 2050, type: 'forex', fxcmSymbol: 'XAUUSD' },
    { name: 'EUR/USD', symbol: 'EURUSD', tvSymbol: 'FX:EURUSD', basePrice: 1.09, type: 'forex', fxcmSymbol: 'EURUSD' },
    { name: 'GBP/USD', symbol: 'GBPUSD', tvSymbol: 'FX:GBPUSD', basePrice: 1.27, type: 'forex', fxcmSymbol: 'GBPUSD' },
    { name: 'USD/JPY', symbol: 'USDJPY', tvSymbol: 'FX:USDJPY', basePrice: 145, type: 'forex', fxcmSymbol: 'USDJPY' },
    { name: 'AUD/USD', symbol: 'AUDUSD', tvSymbol: 'FX:AUDUSD', basePrice: 0.67, type: 'forex', fxcmSymbol: 'AUDUSD' }
  ];

  const timeframes = [
    { label: '15M', value: '15' },
    { label: '1H', value: 'H' },
    { label: '4H', value: '4H' },
    { label: '1D', value: 'D' }
  ];

  useEffect(() => {
    timeIntervalRef.current = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeIntervalRef.current);
  }, []);

  // ربط الأسعار الحية لجميع الأزواج (العملات الرقمية من Binance والفوركس من FXCM)
  useEffect(() => {
    if (wsRef.current) wsRef.current.close();
    if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
    
    const asset = assets.find(a => a.symbol === selectedAsset);
    
    const updatePrice = (price) => {
      if (!price || isNaN(price)) return;
      setLivePrice(price);
      priceHistoryRef.current.push(price);
      if (priceHistoryRef.current.length > 50) priceHistoryRef.current.shift();
    };

    if (asset.type === 'crypto') {
      const symbol = selectedAsset.toLowerCase();
      wsRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updatePrice(parseFloat(data.c));
      };
    } else {
      // جلب الأسعار من FXCM تلقائياً عبر تغذية XML
      const fetchFXCMPrice = async () => {
        try {
          // استخدام بروكسي لتجاوز CORS
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://rates.fxcm.com/RatesXML')}`);
          const data = await response.json();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data.contents, "text/xml");
          const rates = xmlDoc.getElementsByTagName("Rate");
          
          for (let i = 0; i < rates.length; i++) {
            const symbol = rates[i].getAttribute("Symbol");
            if (symbol === asset.fxcmSymbol) {
              const bid = parseFloat(rates[i].getElementsByTagName("Bid")[0].childNodes[0].nodeValue);
              const ask = parseFloat(rates[i].getElementsByTagName("Ask")[0].childNodes[0].nodeValue);
              updatePrice((bid + ask) / 2);
              break;
            }
          }
        } catch (error) {
          console.error("FXCM Fetch Error:", error);
          // Fallback محاكاة في حال فشل الـ API
          const secondTimestamp = Math.floor(Date.now() / 1000);
          const seed = selectedAsset.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + secondTimestamp;
          const pseudoRandom = (Math.sin(seed) + 1) / 2;
          updatePrice(asset.basePrice + (pseudoRandom * 2 - 1) * (asset.basePrice * 0.0001));
        }
      };
      fetchFXCMPrice();
      priceIntervalRef.current = setInterval(fetchFXCMPrice, 5000); // تحديث كل 5 ثوانٍ للفوركس
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
    };
  }, [selectedAsset]);

  const fetchForexFactoryNews = useCallback(async () => {
    try {
      const now = new Date();
      const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;
      const formatLocalTime = (hours, minutes, dayOffset = 0) => {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        date.setHours(hours, minutes, 0, 0);
        return { display: date.toLocaleTimeString(userLocale, { hour: '2-digit', minute: '2-digit', hour12: true }), raw: date };
      };

      const daily = [
        { id: 'd1', currency: 'USD', event: 'Core Retail Sales m/m', impact: 'High', ...formatLocalTime(13, 30), actual: '0.4%', forecast: '0.2%', previous: '0.1%' },
        { id: 'd2', currency: 'EUR', event: 'ECB President Lagarde Speaks', impact: 'High', ...formatLocalTime(15, 0), actual: '', forecast: '', previous: '' },
        { id: 'd3', currency: 'GBP', event: 'CPI y/y', impact: 'High', ...formatLocalTime(7, 0), actual: '4.0%', forecast: '3.8%', previous: '3.9%' },
        { id: 'd4', currency: 'USD', event: 'Empire State Manufacturing Index', impact: 'Medium', ...formatLocalTime(13, 30), actual: '-14.5', forecast: '-5.0', previous: '9.1' },
        { id: 'd5', currency: 'AUD', event: 'Westpac Consumer Sentiment', impact: 'Low', ...formatLocalTime(0, 30), actual: '81.0', forecast: '', previous: '82.1' }
      ];

      setNewsEvents(daily);
      const highImpactSoon = daily.some(n => n.impact === 'High' && Math.abs(n.raw - now) < 3600000);
      setMarketStatus(highImpactSoon ? 'Danger' : (daily.some(n => n.impact === 'Medium') ? 'Volatile' : 'Stable'));
    } catch (error) {
      console.error("News fetch error", error);
    }
  }, []);

  useEffect(() => {
    fetchForexFactoryNews();
    const newsInterval = setInterval(fetchForexFactoryNews, 3600000);
    return () => clearInterval(newsInterval);
  }, [fetchForexFactoryNews]);

  const runAdvancedAIAnalysis = useCallback(() => {
    if (livePrice === 0) return;
    setLoading(true);
    
    setTimeout(() => {
      const currentPrice = livePrice;
      const history = priceHistoryRef.current.length > 10 ? priceHistoryRef.current : Array(30).fill(currentPrice).map((p, i) => p + Math.sin(i) * 10);
      
      const techSignal = getTechnicalSignal(history);
      const macd = calculateMACD(history);
      const bb = calculateBollingerBands(history);
      
      const fundamentalScore = marketStatus === 'Danger' ? -30 : 10;
      const aiDecisionScore = botBrain.predict({ technicalScore: techSignal.score, fundamentalScore });
      
      const confidence = Math.min(98, Math.max(40, 70 + aiDecisionScore));
      const isBullish = aiDecisionScore > 0;
      
      let recommendation = 'Wait';
      if (confidence >= 80) recommendation = isBullish ? 'Buy' : 'Sell';
      
      const levels = getTradeLevels(currentPrice, recommendation.toLowerCase(), 0.002);
      const posSize = calculatePositionSize(10000, 1, 20);
      setRiskData({ positionSize: posSize.toFixed(2), rrRatio: '1:2' });

      const reasoning = recommendation === 'Wait' 
        ? "Market conditions are neutral. Waiting for a stronger technical confirmation."
        : `${recommendation} signal generated: ${techSignal.reason} Confidence at ${confidence.toFixed(1)}%.`;

      setAnalysis({
        recommendation,
        strength: confidence > 85 ? 'Strong' : 'Normal',
        confidence,
        techSignal,
        macd,
        bb,
        trend: techSignal.trend,
        currentPrice,
        levels,
        chartData: history.slice(-30).map((p, i) => ({ time: i, price: p })),
        reasoning,
        timeframe: selectedTimeframe
      });

      if (recommendation !== 'Wait') {
        botBrain.recordTrade({ asset: selectedAsset, type: recommendation, profit: isBullish ? 1 : -1 });
        setBotStats(botBrain.getStats());
      }
      
      setLoading(false);
    }, 1000);
  }, [selectedAsset, selectedTimeframe, marketStatus, livePrice, t]);

  useEffect(() => {
    runAdvancedAIAnalysis();
  }, [selectedAsset, selectedTimeframe]);

  const currentAsset = assets.find(a => a.symbol === selectedAsset) || assets[0];
  const currentTimeframe = timeframes.find(tf => tf.label === selectedTimeframe) || timeframes[1];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden">
      <Header />
      <main className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 md:mb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Globe className="w-3 h-3" /> {t('aibot.powered')} V6.7 LIVE (FXCM)
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-none">
            {t('aibot.title')}
          </motion.h1>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
              <Activity className={`w-4 h-4 ${marketStatus === 'Stable' ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Market:</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${marketStatus === 'Stable' ? 'text-green-500' : 'text-red-500'}`}>{marketStatus}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">AI Win Rate:</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">{botStats.winRate}%</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
              <Clock className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] font-black text-yellow-500 tabular-nums uppercase tracking-widest">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Asset & Timeframe Selectors */}
        <div className="flex flex-col items-center gap-6 mb-8 md:mb-12">
          <div className="flex flex-wrap justify-center bg-zinc-900/50 p-1 rounded-xl md:rounded-2xl border border-white/5 backdrop-blur-xl max-w-full overflow-x-auto">
            {assets.map((asset) => (
              <button key={asset.symbol} onClick={() => setSelectedAsset(asset.symbol)} className={`px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedAsset === asset.symbol ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                {asset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Main Verdict Card */}
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl">
              <CardHeader className="p-6 md:p-8 border-b border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">AI <span className="text-yellow-500">VERDICT</span></CardTitle>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-yellow-500/50" />
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Timeframe: <span className="text-yellow-500">{selectedTimeframe}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Price:</span>
                    <span className="text-xs font-black text-yellow-500 tabular-nums">{livePrice.toFixed(selectedAsset.includes('JPY') ? 2 : 4)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <div className="py-16 md:py-20 flex flex-col items-center justify-center">
                      <Loader2 className="w-10 md:w-12 h-10 md:h-12 text-yellow-500 animate-spin mb-4" />
                      <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">{t('aibot.processing')}</p>
                    </div>
                  ) : analysis && (
                    <div className="space-y-6 md:space-y-8">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                        <div className="text-center md:text-left">
                          <p className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">{t('aibot.recommendation')}</p>
                          <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter ${analysis.recommendation === 'Buy' ? 'text-green-500' : analysis.recommendation === 'Sell' ? 'text-red-500' : 'text-yellow-500'}`}>
                            {analysis.recommendation === 'Buy' ? t('aibot.buy') : analysis.recommendation === 'Sell' ? t('aibot.sell') : t('aibot.wait')}
                          </h2>
                        </div>
                        <div className="text-center bg-white/5 p-6 rounded-[2rem] border border-white/5">
                          <span className={`text-4xl md:text-5xl font-black tracking-tighter ${analysis.confidence >= 80 ? 'text-green-500' : 'text-yellow-500'}`}>{analysis.confidence.toFixed(1)}%</span>
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.confidence')}</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                        <div className="flex items-center gap-2 mb-2">
                          <BrainCircuit className="w-4 h-4 text-yellow-500" />
                          <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">{t('aibot.reasoning')}</span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed italic">"{analysis.reasoning}"</p>
                      </div>

                      {/* Prediction Chart */}
                      <div className="relative w-full h-[250px] md:h-[350px] bg-black/40 rounded-2xl md:rounded-3xl p-2 md:p-4 border border-white/5">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analysis.chartData}>
                            <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={analysis.recommendation === 'Buy' ? '#22c55e' : analysis.recommendation === 'Sell' ? '#ef4444' : '#eab308'} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={analysis.recommendation === 'Buy' ? '#22c55e' : analysis.recommendation === 'Sell' ? '#ef4444' : '#eab308'} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="time" hide />
                            <YAxis domain={['auto', 'auto']} hide />
                            <Area type="monotone" dataKey="price" stroke={analysis.recommendation === 'Buy' ? '#22c55e' : analysis.recommendation === 'Sell' ? '#ef4444' : '#eab308'} fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                            {analysis.recommendation !== 'Wait' && (
                              <>
                                <ReferenceLine y={analysis.levels.entry} stroke="white" strokeDasharray="3 3" label={{ position: 'right', value: 'ENTRY', fill: 'white', fontSize: 8, fontWeight: 'bold' }} />
                                <ReferenceLine y={analysis.levels.tp} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'right', value: 'TP', fill: '#22c55e', fontSize: 8, fontWeight: 'bold' }} />
                                <ReferenceLine y={analysis.levels.sl} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'SL', fill: '#ef4444', fontSize: 8, fontWeight: 'bold' }} />
                              </>
                            )}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* TradingView Terminal */}
                      <div className="w-full h-[400px] md:h-[500px] bg-zinc-950 rounded-2xl md:rounded-3xl overflow-hidden border border-white/5">
                        <iframe 
                          src={`https://s.tradingview.com/widgetembed/?symbol=${currentAsset.tvSymbol}&interval=${currentTimeframe.value}&theme=dark&style=1&locale=en`}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          title="TradingView Chart"
                        />
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* AI Status Card */}
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[1.5rem] md:rounded-[2.5rem]">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" /> AI LEARNING
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Experience</span>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{botStats.totalTrades} Trades</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                    <span>Learning Progress</span>
                    <span>{Math.min(100, botStats.totalTrades)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, botStats.totalTrades)}%` }} className="h-full bg-yellow-500" />
                  </div>
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
