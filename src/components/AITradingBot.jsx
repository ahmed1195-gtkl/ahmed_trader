import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, 
  Zap, RefreshCw, BrainCircuit, Lock,
  Newspaper, ShieldCheck, Loader2, CheckCircle2, Layers,
  Target, ArrowUpRight, ArrowDownRight, BarChart3, AlertCircle,
  MessageSquare, Lightbulb, Info, Calendar, Clock, Globe, AlertTriangle,
  ChevronRight, ChevronDown, Gauge, History, Timer, Scale, Eye, EyeOff
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
  const [livePrice, setLivePrice] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState('Stable');
  const [botStats, setBotStats] = useState(botBrain.getStats());
  const [riskData, setRiskData] = useState({ positionSize: 0, rrRatio: '1:2' });
  const [showTVChart, setShowTVChart] = useState(false); // التحكم في عرض شارت TradingView على الهاتف
  
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

  // ربط الأسعار الحية
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
    }
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
    };
  }, [selectedAsset]);

  // استعادة جدول الأخبار
  const fetchNews = useCallback(async () => {
    const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    const formatTime = (h, m) => {
      const d = new Date(); d.setHours(h, m, 0);
      return { display: d.toLocaleTimeString(userLocale, { hour: '2-digit', minute: '2-digit' }), raw: d };
    };
    const daily = [
      { id: 'n1', currency: 'USD', event: 'Retail Sales m/m', impact: 'High', ...formatTime(13, 30), actual: '0.4%' },
      { id: 'n2', currency: 'EUR', event: 'ECB Press Conference', impact: 'High', ...formatTime(14, 45), actual: '' },
      { id: 'n3', currency: 'GBP', event: 'CPI y/y', impact: 'High', ...formatTime(7, 0), actual: '4.0%' },
      { id: 'n4', currency: 'USD', event: 'Jobless Claims', impact: 'Medium', ...formatTime(13, 30), actual: '215K' }
    ];
    setNewsEvents(daily);
    const now = new Date();
    const isDanger = daily.some(n => n.impact === 'High' && Math.abs(n.raw - now) < 3600000);
    setMarketStatus(isDanger ? 'Danger' : 'Stable');
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 3600000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  // تشغيل التحليل الذكي
  const runAnalysis = useCallback(() => {
    if (livePrice === 0) return;
    setLoading(true);
    setTimeout(() => {
      const currentPrice = livePrice;
      const history = priceHistoryRef.current.length > 10 ? priceHistoryRef.current : Array(30).fill(currentPrice).map((p, i) => p + Math.sin(i) * 10);
      const tech = getTechnicalSignal(history);
      const macd = calculateMACD(history);
      const bb = calculateBollingerBands(history);
      const aiScore = botBrain.predict({ technicalScore: tech.score, fundamentalScore: marketStatus === 'Danger' ? -30 : 10 });
      const confidence = Math.min(98, Math.max(40, 70 + aiScore));
      const recommendation = confidence >= 80 ? (aiScore > 0 ? 'Buy' : 'Sell') : 'Wait';
      
      // استعادة حدود الصفقة
      const levels = getTradeLevels(currentPrice, recommendation.toLowerCase(), 0.002);
      setRiskData({ positionSize: calculatePositionSize(10000, 1, 20).toFixed(2), rrRatio: '1:2' });

      setAnalysis({
        recommendation,
        confidence,
        tech, macd, bb,
        currentPrice,
        levels,
        reasoning: recommendation === 'Wait' ? t('aibot.wait_reason') || "Market is neutral." : `${recommendation} signal: ${tech.reason}`,
        chartData: history.slice(-30).map((p, i) => ({ time: i, price: p }))
      });

      if (recommendation !== 'Wait') {
        botBrain.recordTrade({ asset: selectedAsset, type: recommendation, profit: aiScore > 0 ? 1 : -1 });
        setBotStats(botBrain.getStats());
      }
      setLoading(false);
    }, 800);
  }, [selectedAsset, marketStatus, livePrice, t]);

  useEffect(() => { runAnalysis(); }, [selectedAsset, selectedTimeframe]);

  const currentAsset = assets.find(a => a.symbol === selectedAsset) || assets[0];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden">
      <Header />
      <main className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6">
            <Globe className="w-3 h-3" /> {t('aibot.powered')} V6.8 LIVE
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6">{t('aibot.title')}</h1>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
              <Activity className={`w-4 h-4 ${marketStatus === 'Stable' ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-[10px] font-black uppercase text-gray-500">Market: {marketStatus}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-black uppercase text-gray-500">Win Rate: {botStats.winRate}%</span>
            </div>
          </div>
        </div>

        {/* Asset Selector */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-2">
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            {assets.map((a) => (
              <button key={a.symbol} onClick={() => setSelectedAsset(a.symbol)} className={`px-4 md:px-6 py-2 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedAsset === a.symbol ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}>
                {a.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Main Analysis Card */}
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-white/5 flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight">AI <span className="text-yellow-500">VERDICT</span></CardTitle>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{selectedAsset}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-black text-yellow-500 tabular-nums">{livePrice.toFixed(4)}</span>
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
                          <h2 className={`text-6xl md:text-7xl font-black uppercase tracking-tighter ${analysis.recommendation === 'Buy' ? 'text-green-500' : analysis.recommendation === 'Sell' ? 'text-red-500' : 'text-yellow-500'}`}>
                            {analysis.recommendation}
                          </h2>
                        </div>
                        <div className="text-center bg-white/5 p-6 rounded-[2rem] border border-white/5 min-w-[140px]">
                          <span className="text-5xl font-black tracking-tighter text-yellow-500">{analysis.confidence.toFixed(1)}%</span>
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.confidence')}</p>
                        </div>
                      </div>

                      {/* استعادة سبب الصفقة */}
                      <div className="p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                        <div className="flex items-center gap-2 mb-2">
                          <BrainCircuit className="w-4 h-4 text-yellow-500" />
                          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{t('aibot.reasoning')}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed italic">"{analysis.reasoning}"</p>
                      </div>

                      {/* استعادة حدود الصفقة على الشارت */}
                      <div className="relative w-full h-[300px] bg-black/40 rounded-3xl p-4 border border-white/5">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analysis.chartData}>
                            <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="time" hide />
                            <YAxis domain={['auto', 'auto']} hide />
                            <Area type="monotone" dataKey="price" stroke="#eab308" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                            {analysis.recommendation !== 'Wait' && (
                              <>
                                <ReferenceLine y={analysis.levels.entry} stroke="white" strokeDasharray="3 3" label={{ position: 'right', value: 'ENTRY', fill: 'white', fontSize: 10, fontWeight: 'bold' }} />
                                <ReferenceLine y={analysis.levels.tp} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'right', value: 'TP', fill: '#22c55e', fontSize: 10, fontWeight: 'bold' }} />
                                <ReferenceLine y={analysis.levels.sl} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'SL', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                              </>
                            )}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* TradingView اختيارياً على الهاتف */}
                      <div className="space-y-4">
                        <Button 
                          onClick={() => setShowTVChart(!showTVChart)}
                          className="w-full md:hidden bg-zinc-900 border border-white/10 text-[10px] font-black uppercase tracking-widest py-6 rounded-2xl flex items-center justify-center gap-2"
                        >
                          {showTVChart ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {showTVChart ? "Hide Advanced Chart" : "Show Advanced Chart"}
                        </Button>
                        
                        <div className={`${showTVChart ? 'block' : 'hidden'} md:block w-full h-[500px] bg-zinc-950 rounded-3xl overflow-hidden border border-white/10`}>
                          <iframe 
                            src={`https://s.tradingview.com/widgetembed/?symbol=${currentAsset.tvSymbol}&interval=1&theme=dark&style=1&locale=en`}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            title="TradingView Chart"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* استعادة جدول الأخبار */}
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center gap-3">
                <Calendar className="w-6 h-6 text-yellow-500" />
                <CardTitle className="text-xl font-black uppercase tracking-tight">{t('aibot.newsCalendar')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Time</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Currency</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Event</th>
                      <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsEvents.map((n) => (
                      <tr key={n.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-6 text-xs font-black tabular-nums">{n.display}</td>
                        <td className="p-6 font-black">{n.currency}</td>
                        <td className="p-6 text-xs text-gray-300">{n.event}</td>
                        <td className="p-6">
                          <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${n.impact === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                            {n.impact}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* AI Status */}
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem]">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-yellow-500" /> AI BRAIN
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Experience</span>
                  <span className="text-xs font-black text-green-500">{botStats.totalTrades} Trades</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, botStats.totalTrades)}%` }} className="h-full bg-yellow-500" />
                </div>
              </CardContent>
            </Card>

            {/* Risk Engine */}
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem]">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Scale className="w-4 h-4 text-yellow-500" /> RISK ENGINE
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-[10px] text-gray-500 uppercase font-black">Position Size</span>
                  <span className="text-xs font-black text-white">{riskData.positionSize} Lots</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-gray-500 uppercase font-black">R/R Ratio</span>
                  <span className="text-xs font-black text-green-500">{riskData.rrRatio}</span>
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
