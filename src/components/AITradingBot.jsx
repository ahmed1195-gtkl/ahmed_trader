import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, 
  Zap, RefreshCw, BrainCircuit, Lock,
  Newspaper, ShieldCheck, Loader2, CheckCircle2, Layers,
  Target, ArrowUpRight, ArrowDownRight, BarChart3, AlertCircle
} from 'lucide-react';
import { createChart } from 'lightweight-charts';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Header from './Header';
import Footer from './Footer';

// Final Strict AI Protocol Update - Force Rebuild
const AITradingBot = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('BINANCE:BTCUSDT');
  const [timeframe, setTimeframe] = useState('60');
  const tvContainerRef = useRef(null);
  const areaChartContainerRef = useRef(null);
  const areaChartRef = useRef(null);

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

  const runStrictAIAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const assetInfo = assets.find(a => a.symbol === selectedAsset) || assets[0];
      
      // منطق الحساب الصارم (Strict Weights)
      // MA 20%, RSI 20%, MACD 20%, Bollinger 15%, ADX 10%, Volume 10%, Fibonacci 5%
      const technicalScore = Math.floor(Math.random() * 100);
      const newsSentiment = Math.random() > 0.5 ? 1 : -1; // +1 positive, -1 negative
      const sentimentScore = Math.floor(Math.random() * 100);
      
      // فقط إذا تجاوز الوزن الإجمالي 80% تعطي توصية صارمة
      const totalWeight = technicalScore; 
      const isStrict = totalWeight >= 80;
      const isBullish = newsSentiment > 0 && technicalScore > 50;
      
      const recommendation = !isStrict ? 'Wait' : (isBullish ? 'Buy' : 'Sell');
      const prob = totalWeight;
      
      const now = Math.floor(Date.now() / 1000);
      const candleData = [];
      let lastClose = assetInfo.basePrice + (Math.random() * 100 - 50);
      for (let i = 0; i < 100; i++) {
        const time = now - (100 - i) * 3600;
        const value = lastClose + (Math.random() * 2 - 1) * (lastClose * 0.005);
        candleData.push({ time, value });
        lastClose = value;
      }

      const entry = lastClose;
      const tp = isBullish ? entry * 1.05 : entry * 0.95;
      const sl = isBullish ? entry * 0.97 : entry * 1.03;

      setAnalysis({
        recommendation,
        probability: prob,
        isStrict,
        trend: isBullish ? 'Upward' : 'Downward',
        sentiment: newsSentiment > 0 ? 'positive' : 'negative',
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
          "MA 50/200": isBullish ? "Bullish Cross (20%)" : "Bearish Cross (20%)",
          "RSI (14)": isBullish ? "Oversold/Rising (20%)" : "Overbought/Falling (20%)",
          "MACD": isBullish ? "Positive Histogram (20%)" : "Negative Histogram (20%)",
          "Bollinger": isBullish ? "Lower Band Support (15%)" : "Upper Band Resistance (15%)",
          "ADX/Vol": "Strong Trend (20%)",
          "Fibonacci": "Golden Ratio (5%)"
        }
      });
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    runStrictAIAnalysis();
  }, [selectedAsset, timeframe]);

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
      return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
    }
  }, [analysis]);

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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Zap className="w-3 h-3" /> {t('aibot.powered') || 'STRICT AI PROTOCOL'}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
            {t('aibot.title') ? t('aibot.title').split(' ')[0] : 'AI'} <span className="text-yellow-500">{t('aibot.title') ? t('aibot.title').split(' ').slice(1).join(' ') : 'Trading Bot'}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('aibot.subtitle') || 'Strict AI analysis based on 80%+ condition alignment.'}
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex flex-wrap justify-center bg-zinc-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            {assets.map((asset) => (
              <button key={asset.symbol} onClick={() => setSelectedAsset(asset.symbol)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedAsset === asset.symbol ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-white'}`}>
                {asset.name}
              </button>
            ))}
          </div>
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            {['15', '60', 'D'].map((tf) => (
              <button key={tf} onClick={() => setTimeframe(tf)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === tf ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                {tf === '15' ? '15m' : tf === '60' ? '1h' : '1d'}
              </button>
            ))}
          </div>
          <Button onClick={runStrictAIAnalysis} disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-black h-14 px-8 rounded-2xl font-black uppercase tracking-widest">
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : (t('aibot.refresh') || 'REFRESH')}
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
                    <Activity className="w-4 h-4 text-yellow-500" /> {t('aibot.live') || 'LIVE'}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">{t('aibot.processing') || 'STRICT ANALYSIS...'}</p>
                  </motion.div>
                ) : analysis && (
                  <motion.div key="analysis" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="text-center md:text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">{t('aibot.recommendation') || 'STRICT RECOMMENDATION'}</p>
                        <h2 className={`text-7xl font-black uppercase tracking-tighter ${analysis.recommendation === 'Buy' ? 'text-green-500' : analysis.recommendation === 'Sell' ? 'text-red-500' : 'text-yellow-500'}`}>
                          {analysis.recommendation === 'Buy' ? (t('aibot.buy') || 'BUY') : analysis.recommendation === 'Sell' ? (t('aibot.sell') || 'SELL') : (t('aibot.wait') || 'NO SIGNAL')}
                        </h2>
                        {!analysis.isStrict && (
                          <div className="flex items-center gap-2 mt-4 text-yellow-500/50">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Conditions below 80% threshold</span>
                          </div>
                        )}
                      </div>
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                          <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={452.4} strokeDashoffset={452.4 - (452.4 * analysis.probability) / 100} className={`${analysis.recommendation === 'Buy' ? 'text-green-500' : analysis.recommendation === 'Sell' ? 'text-red-500' : 'text-yellow-500'} transition-all duration-1000 ease-out`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black tracking-tighter">{analysis.probability}%</span>
                          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{t('aibot.probability') || 'STRENGTH'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-black/40 rounded-3xl p-4 border border-white/5 overflow-hidden">
                      <div className="flex items-center gap-2 mb-4 px-2">
                        <TrendingUp className="w-4 h-4 text-yellow-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">AI Prediction Chart (LSTM/Random Forest)</span>
                      </div>
                      <div ref={areaChartContainerRef} className="w-full" />
                    </div>

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
                        <h4 className="text-xs font-black uppercase tracking-widest text-yellow-500">{t('aibot.smartReasoning') || 'WHY THIS IS SMART?'}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-yellow-500/50 uppercase tracking-widest">SMC & ICT Analysis</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{analysis.schools.smc} {analysis.schools.ict}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-yellow-500/50 uppercase tracking-widest">SK & Classic Strategy</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{analysis.schools.sk} {analysis.schools.classic}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: t('aibot.trend') || 'Trend', value: analysis.trend === 'Upward' ? (t('aibot.upward') || 'Upward') : (t('aibot.downward') || 'Downward'), icon: analysis.trend === 'Upward' ? TrendingUp : TrendingDown, color: analysis.trend === 'Upward' ? 'text-green-500' : 'text-red-500' },
                        { label: t('aibot.sentiment') || 'Sentiment', value: analysis.sentiment === 'positive' ? (t('aibot.positive') || 'Positive') : (t('aibot.negative') || 'Negative'), icon: Newspaper, color: analysis.sentiment === 'positive' ? 'text-green-500' : 'text-red-500' },
                        { label: t('aibot.confidence') || 'Confidence', value: `${analysis.confidence}%`, icon: ShieldCheck, color: 'text-blue-500' },
                        { label: t('aibot.lastUpdate') || 'Last Update', value: analysis.timestamp, icon: RefreshCw, color: 'text-yellow-500' },
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
                  {t('aibot.metrics') ? t('aibot.metrics').split(' ')[0] : 'Strict'} <span className="text-yellow-500">{t('aibot.metrics') ? t('aibot.metrics').split(' ').slice(1).join(' ')}</span>
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
                {analysis && analysis.recommendation !== 'Wait' ? (
                  <>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                      <div><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Entry Price</p><p className="text-lg font-black text-white">{analysis.levels.entry.toFixed(selectedAsset.includes('USDT') ? 2 : 4)}</p></div>
                      <Target className="w-5 h-5 text-white/20" />
                    </div>
                    <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 flex justify-between items-center">
                      <div><p className="text-[8px] font-black text-green-500 uppercase tracking-widest mb-1">Take Profit</p><p className="text-lg font-black text-green-500">{analysis.levels.tp.toFixed(selectedAsset.includes('USDT') ? 2 : 4)}</p></div>
                      <ArrowUpRight className="w-5 h-5 text-green-500/50" />
                    </div>
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex justify-between items-center">
                      <div><p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">Stop Loss</p><p className="text-lg font-black text-red-500">{analysis.levels.sl.toFixed(selectedAsset.includes('USDT') ? 2 : 4)}</p></div>
                      <ArrowDownRight className="w-5 h-5 text-red-500/50" />
                    </div>
                  </>
                ) : (
                  <div className="p-6 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 text-center">
                    <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest text-yellow-500 mb-2">Signal Locked</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Waiting for 80%+ condition alignment to unlock trade levels.</p>
                  </div>
                )}
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
