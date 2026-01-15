import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, 
  Zap, RefreshCw, BrainCircuit, Lock,
  Newspaper, ShieldCheck, Loader2, CheckCircle2, Layers,
  Target, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { createChart } from 'lightweight-charts';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Header from './Header';
import Footer from './Footer';

const AITradingBot = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('BINANCE:BTCUSDT');
  const [timeframe, setTimeframe] = useState('60');
  const tvContainerRef = useRef();
  const areaChartContainerRef = useRef();
  const areaChartRef = useRef();

  const assets = [
    { name: 'BTC/USDT', symbol: 'BINANCE:BTCUSDT', basePrice: 45000 },
    { name: 'ETH/USDT', symbol: 'BINANCE:ETHUSDT', basePrice: 2400 },
    { name: 'SOL/USDT', symbol: 'BINANCE:SOLUSDT', basePrice: 95 },
    { name: 'XAU/USD', symbol: 'OANDA:XAUUSD', basePrice: 2050 },
    { name: 'EUR/USD', symbol: 'FX:EURUSD', basePrice: 1.09 },
    { name: 'GBP/USD', symbol: 'FX:GBPUSD', basePrice: 1.27 },
    { name: 'USD/JPY', symbol: 'FX:USDJPY', basePrice: 145 },
    { name: 'AUD/USD', symbol: 'FX:AUDUSD', basePrice: 0.67 }
  ];

  const runAdvancedAIAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const assetInfo = assets.find(a => a.symbol === selectedAsset) || assets[0];
      const isBullish = Math.random() > 0.45;
      const prob = Math.floor(Math.random() * 25) + 70;
      const recommendation = isBullish ? 'Buy' : 'Sell';
      
      // توليد بيانات الشارت الأول (Area Chart)
      const candleData = [];
      let lastClose = assetInfo.basePrice;
      const now = Math.floor(Date.now() / 1000);
      for (let i = 0; i < 100; i++) {
        const time = now - (100 - i) * 3600;
        const value = lastClose + (Math.random() * 2 - 1) * (lastClose * 0.005);
        candleData.push({ time, value });
        lastClose = value;
      }

      // حدود الصفقات
      const entry = lastClose;
      const tp = isBullish ? entry * 1.05 : entry * 0.95;
      const sl = isBullish ? entry * 0.97 : entry * 1.03;

      setAnalysis({
        recommendation,
        probability: prob,
        trend: isBullish ? 'Upward' : 'Downward',
        sentiment: isBullish ? 'positive' : 'negative',
        confidence: Math.floor(Math.random() * 10) + 85,
        timestamp: new Date().toLocaleTimeString(),
        currentPrice: lastClose,
        levels: { entry, tp, sl },
        candleData,
        schools: {
          smc: isBullish ? t('aibot.smc.bull') : t('aibot.smc.bear'),
          ict: isBullish ? t('aibot.ict.bull') : t('aibot.ict.bear'),
          sk: isBullish ? t('aibot.sk.bull') : t('aibot.sk.bear'),
          classic: isBullish ? t('aibot.classic.bull') : t('aibot.classic.bear')
        },
        indicators: {
          "RSI (14)": isBullish ? "45.2 (Neutral/Bullish)" : "68.5 (Overbought)",
          "MACD": isBullish ? "Bullish Crossover" : "Bearish Divergence",
          "MA 200": isBullish ? "Price Above MA" : "Price Below MA",
          "SMC Zone": isBullish ? "Discount Zone" : "Premium Zone"
        }
      });
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    runAdvancedAIAnalysis();
  }, [selectedAsset, timeframe]);

  // إعداد الشارت الأول (Area Chart)
  useEffect(() => {
    if (analysis && areaChartContainerRef.current) {
      if (areaChartRef.current) areaChartRef.current.remove();

      const chart = createChart(areaChartContainerRef.current, {
        layout: { backgroundColor: 'transparent', textColor: '#a1a1aa' },
        grid: { vertLines: { visible: false }, horzLines: { color: 'rgba(255, 255, 255, 0.05)' } },
        width: areaChartContainerRef.current.clientWidth,
        height: 250,
        handleScale: false,
        handleScroll: false,
      });

      const areaSeries = chart.addAreaSeries({
        lineColor: analysis.recommendation === 'Buy' ? '#22c55e' : analysis.recommendation === 'Sell' ? '#ef4444' : '#eab308',
        topColor: analysis.recommendation === 'Buy' ? 'rgba(34, 197, 94, 0.3)' : analysis.recommendation === 'Sell' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(234, 179, 8, 0.3)',
        bottomColor: 'rgba(0, 0, 0, 0)',
        lineWidth: 3,
      });

      areaSeries.setData(analysis.candleData);
      chart.timeScale().fitContent();
      areaChartRef.current = chart;

      const handleResize = () => chart.applyOptions({ width: areaChartContainerRef.current.clientWidth });
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [analysis]);

  // إعداد شارت TradingView الرسمي
  useEffect(() => {
    if (tvContainerRef.current) {
      tvContainerRef.current.innerHTML = '';
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": selectedAsset,
        "interval": timeframe,
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "ar",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      });
      tvContainerRef.current.appendChild(script);
    }
  }, [selectedAsset, timeframe]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30">
      <Header />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Zap className="w-3 h-3" /> {t('aibot.powered')}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none"
          >
            {t('aibot.title') ? t('aibot.title').split(' ')[0] : 'AI'} <span className="text-yellow-500">{t('aibot.title') ? t('aibot.title').split(' ').slice(1).join(' ') : 'Trading Bot'}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            {t('aibot.subtitle')}
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex flex-wrap justify-center bg-zinc-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            {assets.map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset.symbol)}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedAsset === asset.symbol ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-white'}`}
              >
                {asset.name}
              </button>
            ))}
          </div>
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            {['15', '60', 'D'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === tf ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
              >
                {tf === '15' ? '15m' : tf === '60' ? '1h' : '1d'}
              </button>
            ))}
          </div>
          <Button 
            onClick={runAdvancedAIAnalysis} 
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black h-14 px-8 rounded-2xl font-black uppercase tracking-widest"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : t('aibot.refresh')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white overflow-hidden rounded-[2.5rem] border-t-yellow-500/50">
            <CardHeader className="p-8 border-b border-white/5">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-black uppercase tracking-tight">
                  {t('aibot.verdict') ? t('aibot.verdict').split(' ')[0] : 'Market'} <span className="text-yellow-500">{t('aibot.verdict') ? t('aibot.verdict').split(' ').slice(1).join(' ')}</span>
                </CardTitle>
                <div className="flex items-center gap-4">
                  {analysis && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Price:</span>
                      <span className="text-xs font-black text-yellow-500">{analysis.currentPrice.toFixed(selectedAsset.includes('USDT') ? 2 : 4)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <Activity className="w-4 h-4 text-yellow-500" /> {t('aibot.live')}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-20 flex flex-col items-center justify-center"
                  >
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">{t('aibot.processing')}</p>
                  </motion.div>
                ) : analysis && (
                  <motion.div
                    key="analysis"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="text-center md:text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">{t('aibot.recommendation')}</p>
                        <h2 className={`text-7xl font-black uppercase tracking-tighter ${analysis.recommendation === 'Buy' ? 'text-green-500' : analysis.recommendation === 'Sell' ? 'text-red-500' : 'text-yellow-500'}`}>
                          {analysis.recommendation === 'Buy' ? t('aibot.buy') : analysis.recommendation === 'Sell' ? t('aibot.sell') : t('aibot.wait')}
                        </h2>
                      </div>
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                          <circle 
                            cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" 
                            strokeDasharray={452.4}
                            strokeDashoffset={452.4 - (452.4 * analysis.probability) / 100}
                            className={`${analysis.recommendation === 'Buy' ? 'text-green-500' : analysis.recommendation === 'Sell' ? 'text-red-500' : 'text-yellow-500'} transition-all duration-1000 ease-out`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black tracking-tighter">{analysis.probability}%</span>
                          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.probability')}</span>
                        </div>
                      </div>
                    </div>

                    {/* الشارت الأول (Area Chart) */}
                    <div className="w-full bg-black/40 rounded-3xl p-4 border border-white/5 overflow-hidden">
                      <div className="flex items-center gap-2 mb-4 px-2">
                        <TrendingUp className="w-4 h-4 text-yellow-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">AI Prediction Chart</span>
                      </div>
                      <div ref={areaChartContainerRef} className="w-full" />
                    </div>

                    {/* شارت TradingView الرسمي */}
                    <div className="w-full h-[500px] bg-zinc-950 rounded-3xl overflow-hidden border border-white/5">
                      <div className="flex items-center gap-2 p-4 bg-zinc-900/50 border-b border-white/5">
                        <BarChart3 className="w-4 h-4 text-yellow-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Official TradingView Terminal</span>
                      </div>
                      <div ref={tvContainerRef} className="w-full h-full" />
                    </div>

                    <div className="bg-yellow-500/5 border border-yellow-500/10 p-6 rounded-3xl">
                      <div className="flex items-center gap-3 mb-4">
                        <BrainCircuit className="w-5 h-5 text-yellow-500" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-yellow-500">{t('aibot.smartReasoning')}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-yellow-500/50 uppercase tracking-widest">SMC Analysis</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{analysis.schools.smc}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-yellow-500/50 uppercase tracking-widest">ICT Concepts</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{analysis.schools.ict}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-yellow-500/50 uppercase tracking-widest">SK Strategy</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{analysis.schools.sk}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-yellow-500/50 uppercase tracking-widest">Classic Analysis</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{analysis.schools.classic}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: t('aibot.trend'), value: analysis.trend === 'Upward' ? t('aibot.upward') : t('aibot.downward'), icon: analysis.trend === 'Upward' ? TrendingUp : TrendingDown, color: analysis.trend === 'Upward' ? 'text-green-500' : 'text-red-500' },
                        { label: t('aibot.sentiment'), value: analysis.sentiment === 'positive' ? t('aibot.positive') : t('aibot.negative'), icon: Newspaper, color: analysis.sentiment === 'positive' ? 'text-green-500' : 'text-red-500' },
                        { label: t('aibot.confidence'), value: `${analysis.confidence}%`, icon: ShieldCheck, color: 'text-blue-500' },
                        { label: t('aibot.lastUpdate'), value: analysis.timestamp, icon: RefreshCw, color: 'text-yellow-500' },
                      ].map((item, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                          <item.icon className={`w-4 h-4 mb-3 ${item.color}`} />
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                          <p className="text-xs font-black uppercase tracking-tight">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white overflow-hidden rounded-[2.5rem]">
              <CardHeader className="p-8 border-b border-white/5">
                <CardTitle className="text-xl font-black uppercase tracking-tight">
                  {t('aibot.metrics') ? t('aibot.metrics').split(' ')[0] : 'Technical'} <span className="text-yellow-500">{t('aibot.metrics') ? t('aibot.metrics').split(' ').slice(1).join(' ') : 'Metrics'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {analysis && Object.entries(analysis.indicators).map(([name, status], i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${status.includes('Bullish') || status.includes('Above') || status.includes('Discount') ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{name}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${status.includes('Bullish') || status.includes('Above') || status.includes('Discount') ? 'text-green-500' : 'text-red-500'}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white overflow-hidden rounded-[2.5rem]">
              <CardHeader className="p-8 border-b border-white/5">
                <CardTitle className="text-xl font-black uppercase tracking-tight">
                  {t('aibot.tradeLevels') ? t('aibot.tradeLevels').split(' ')[0] : 'Trade'} <span className="text-yellow-500">{t('aibot.tradeLevels') ? t('aibot.tradeLevels').split(' ').slice(1).join(' ')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {analysis && (
                  <>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Entry Price</p>
                        <p className="text-lg font-black text-white">{analysis.levels.entry.toFixed(selectedAsset.includes('USDT') ? 2 : 4)}</p>
                      </div>
                      <Target className="w-5 h-5 text-white/20" />
                    </div>
                    <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 flex justify-between items-center">
                      <div>
                        <p className="text-[8px] font-black text-green-500 uppercase tracking-widest mb-1">Take Profit</p>
                        <p className="text-lg font-black text-green-500">{analysis.levels.tp.toFixed(selectedAsset.includes('USDT') ? 2 : 4)}</p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-green-500/50" />
                    </div>
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex justify-between items-center">
                      <div>
                        <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">Stop Loss</p>
                        <p className="text-lg font-black text-red-500">{analysis.levels.sl.toFixed(selectedAsset.includes('USDT') ? 2 : 4)}</p>
                      </div>
                      <ArrowDownRight className="w-5 h-5 text-red-500/50" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: t('aibot.secure'), desc: t('aibot.secureDesc'), icon: ShieldCheck },
            { title: t('aibot.validation'), desc: t('aibot.validationDesc'), icon: CheckCircle2 },
            { title: t('aibot.multi'), desc: t('aibot.multiDesc'), icon: Layers },
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-zinc-900/30 border border-white/5 hover:border-yellow-500/20 transition-all group">
              <feature.icon className="w-8 h-8 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-black uppercase tracking-tight mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AITradingBot;
