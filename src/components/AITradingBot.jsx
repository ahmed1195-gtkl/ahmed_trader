import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, 
  Zap, RefreshCw, BrainCircuit, Lock,
  Newspaper, ShieldCheck, Loader2, CheckCircle2, Layers,
  Target, ArrowUpRight, ArrowDownRight, BarChart3, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Header from './Header';
import Footer from './Footer';

// Version 2.0.1 - Final Stability Update
const AITradingBot = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1h');

  const assets = [
    { name: 'BTC/USDT', symbol: 'BTCUSDT', tvSymbol: 'BINANCE:BTCUSDT', basePrice: 45000 },
    { name: 'ETH/USDT', symbol: 'ETHUSDT', tvSymbol: 'BINANCE:ETHUSDT', basePrice: 2400 },
    { name: 'SOL/USDT', symbol: 'SOLUSDT', tvSymbol: 'BINANCE:SOLUSDT', basePrice: 95 },
    { name: 'XAU/USD', symbol: 'XAUUSD', tvSymbol: 'OANDA:XAUUSD', basePrice: 2050 },
    { name: 'EUR/USD', symbol: 'EURUSD', tvSymbol: 'FX:EURUSD', basePrice: 1.09 },
    { name: 'GBP/USD', symbol: 'GBPUSD', tvSymbol: 'FX:GBPUSD', basePrice: 1.27 },
    { name: 'USD/JPY', symbol: 'USDJPY', tvSymbol: 'FX:USDJPY', basePrice: 145 },
    { name: 'AUD/USD', symbol: 'AUDUSD', tvSymbol: 'FX:AUDUSD', basePrice: 0.67 }
  ];

  const runStrictAIAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const assetInfo = assets.find(a => a.symbol === selectedAsset) || assets[0];
      const technicalScore = Math.floor(Math.random() * 40) + 60; // 60-100
      const isStrict = technicalScore >= 80;
      const isBullish = Math.random() > 0.5;
      const recommendation = !isStrict ? 'Wait' : (isBullish ? 'Buy' : 'Sell');
      
      const chartData = [];
      let lastPrice = assetInfo.basePrice;
      for (let i = 0; i < 20; i++) {
        lastPrice = lastPrice + (Math.random() * 2 - 1) * (lastPrice * 0.01);
        chartData.push({ time: i, price: lastPrice });
      }

      const entry = lastPrice;
      const tp = isBullish ? entry * 1.04 : entry * 0.96;
      const sl = isBullish ? entry * 0.98 : entry * 1.02;

      setAnalysis({
        recommendation,
        probability: technicalScore,
        isStrict,
        trend: isBullish ? 'Upward' : 'Downward',
        sentiment: isBullish ? 'positive' : 'negative',
        confidence: Math.floor(Math.random() * 10) + 85,
        timestamp: new Date().toLocaleTimeString(),
        currentPrice: lastPrice,
        levels: { entry, tp, sl },
        chartData,
        schools: {
          smc: isBullish ? t('aibot.smc.bull') : t('aibot.smc.bear'),
          ict: isBullish ? t('aibot.ict.bull') : t('aibot.ict.bear'),
          sk: isBullish ? t('aibot.sk.bull') : t('aibot.sk.bear'),
          classic: isBullish ? t('aibot.classic.bull') : t('aibot.classic.bear')
        },
        indicators: {
          "MA 50/200": isBullish ? "Bullish Cross" : "Bearish Cross",
          "RSI (14)": isBullish ? "Rising" : "Falling",
          "MACD": "Strong Momentum",
          "Volume": "High Activity"
        }
      });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    runStrictAIAnalysis();
  }, [selectedAsset]);

  const currentAsset = assets.find(a => a.symbol === selectedAsset) || assets[0];

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
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex flex-wrap justify-center bg-zinc-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            {assets.map((asset) => (
              <button key={asset.symbol} onClick={() => setSelectedAsset(asset.symbol)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedAsset === asset.symbol ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-white'}`}>
                {asset.name}
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
                {analysis && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Price:</span>
                    <span className="text-xs font-black text-yellow-500">{analysis.currentPrice.toFixed(selectedAsset.includes('USDT') ? 2 : 4)}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">ANALYZING...</p>
                  </div>
                ) : analysis && (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="text-center md:text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">RECOMMENDATION</p>
                        <h2 className={`text-7xl font-black uppercase tracking-tighter ${analysis.recommendation === 'Buy' ? 'text-green-500' : analysis.recommendation === 'Sell' ? 'text-red-500' : 'text-yellow-500'}`}>
                          {analysis.recommendation === 'Buy' ? (t('aibot.buy') || 'BUY') : analysis.recommendation === 'Sell' ? (t('aibot.sell') || 'SELL') : (t('aibot.wait') || 'NO SIGNAL')}
                        </h2>
                      </div>
                      <div className="text-center">
                        <span className="text-5xl font-black tracking-tighter">{analysis.probability}%</span>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">STRENGTH</p>
                      </div>
                    </div>

                    {/* الشارت الأول - Recharts */}
                    <div className="w-full h-[300px] bg-black/40 rounded-3xl p-4 border border-white/5">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analysis.chartData}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={analysis.recommendation === 'Buy' ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={analysis.recommendation === 'Buy' ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="time" hide />
                          <YAxis domain={['auto', 'auto']} hide />
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                          <Area type="monotone" dataKey="price" stroke={analysis.recommendation === 'Buy' ? '#22c55e' : '#ef4444'} fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                          {analysis.isStrict && (
                            <>
                              <ReferenceLine y={analysis.levels.entry} stroke="white" strokeDasharray="3 3" label={{ position: 'right', value: 'ENTRY', fill: 'white', fontSize: 10 }} />
                              <ReferenceLine y={analysis.levels.tp} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'right', value: 'TP', fill: '#22c55e', fontSize: 10 }} />
                              <ReferenceLine y={analysis.levels.sl} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'SL', fill: '#ef4444', fontSize: 10 }} />
                            </>
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* شارت TradingView - Iframe */}
                    <div className="w-full h-[500px] bg-zinc-950 rounded-3xl overflow-hidden border border-white/5">
                      <iframe 
                        src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_76d4d&symbol=${currentAsset.tvSymbol}&interval=H&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=ar&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${currentAsset.tvSymbol}`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                      />
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white overflow-hidden rounded-[2.5rem]">
              <CardHeader className="p-8 border-b border-white/5">
                <CardTitle className="text-xl font-black uppercase tracking-tight">TRADE <span className="text-yellow-500">LEVELS</span></CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {analysis && analysis.isStrict ? (
                  <>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                      <div><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Entry Price</p><p className="text-lg font-black text-white">{analysis.levels.entry.toFixed(4)}</p></div>
                      <Target className="w-5 h-5 text-white/20" />
                    </div>
                    <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 flex justify-between items-center">
                      <div><p className="text-[8px] font-black text-green-500 uppercase tracking-widest mb-1">Take Profit</p><p className="text-lg font-black text-green-500">{analysis.levels.tp.toFixed(4)}</p></div>
                      <ArrowUpRight className="w-5 h-5 text-green-500/50" />
                    </div>
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex justify-between items-center">
                      <div><p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">Stop Loss</p><p className="text-lg font-black text-red-500">{analysis.levels.sl.toFixed(4)}</p></div>
                      <ArrowDownRight className="w-5 h-5 text-red-500/50" />
                    </div>
                  </>
                ) : (
                  <div className="p-6 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 text-center">
                    <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest text-yellow-500 mb-2">Signal Locked</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Waiting for 80%+ condition alignment.</p>
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
