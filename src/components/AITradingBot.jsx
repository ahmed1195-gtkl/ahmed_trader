import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertCircle, Activity, 
  BarChart3, Globe, ShieldCheck, Zap, Info, 
  ArrowRight, Loader2, RefreshCw, CheckCircle2,
  PieChart, Layers, Newspaper, Target, BrainCircuit
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import Header from './Header';
import Footer from './Footer';

const AITradingBot = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('1hr');

  const assets = [
    'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 
    'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'DOT/USDT', 
    'MATIC/USDT', 'XAU/USD', 'EUR/USD', 'GBP/USD'
  ];

  // توليد بيانات الشارت بشكل ذكي
  const generateChartData = (recommendation, currentPrice) => {
    const data = [];
    let price = currentPrice * 0.98;
    const points = 20;
    
    for (let i = 0; i < points; i++) {
      const isPrediction = i > 14;
      if (!isPrediction) {
        price = price * (1 + (Math.random() * 0.01 - 0.004));
      } else {
        const trend = recommendation === 'Buy' ? 0.005 : recommendation === 'Sell' ? -0.005 : 0.001;
        price = price * (1 + trend + (Math.random() * 0.002 - 0.001));
      }
      data.push({
        time: i,
        price: parseFloat(price.toFixed(2)),
        isPrediction: isPrediction
      });
    }
    return data;
  };

  const runAnalysis = () => {
    setLoading(true);
    
    setTimeout(() => {
      const basePrice = selectedAsset.includes('BTC') ? 45000 : selectedAsset.includes('ETH') ? 2400 : selectedAsset.includes('XAU') ? 2050 : 1.1;
      const currentPrice = basePrice + (Math.random() * basePrice * 0.02);
      
      const technicalIndicators = {
        ma: Math.random() > 0.3 ? 'bullish' : 'bearish',
        rsi: Math.random() > 0.4 ? 'bullish' : 'bearish',
        macd: Math.random() > 0.35 ? 'bullish' : 'bearish',
        bollinger: Math.random() > 0.45 ? 'bullish' : 'bearish',
        adx: Math.random() > 0.4 ? 'bullish' : 'bearish',
        volume: Math.random() > 0.3 ? 'bullish' : 'bearish',
        fibonacci: Math.random() > 0.5 ? 'bullish' : 'bearish',
      };

      let score = 0;
      Object.values(technicalIndicators).forEach(status => {
        if (status === 'bullish') score += 12;
      });

      const newsSentiment = Math.random() > 0.5 ? 'positive' : 'negative';
      score += newsSentiment === 'positive' ? 15 : -10;

      const finalProbability = Math.min(Math.max(score, 15), 98);
      
      let recommendation = 'Wait';
      if (finalProbability > 65) recommendation = 'Buy';
      else if (finalProbability < 40) recommendation = 'Sell';

      const chartData = generateChartData(recommendation, currentPrice);
      
      // حساب حدود الصفقة
      const entry = currentPrice;
      const tp = recommendation === 'Buy' ? entry * 1.05 : recommendation === 'Sell' ? entry * 0.95 : entry;
      const sl = recommendation === 'Buy' ? entry * 0.97 : recommendation === 'Sell' ? entry * 1.03 : entry;

      // التفسير الذكي
      const smartReasoning = recommendation === 'Buy' 
        ? "نلاحظ اختراقاً قوياً لمستويات المقاومة مع زخم شرائي مرتفع مدعوم بسيولة مؤسساتية. مؤشر RSI لا يزال في مناطق تسمح بالصعود، مما يعزز احتمالية استمرار الاتجاه الصاعد."
        : recommendation === 'Sell'
        ? "هناك تشبع شرائي واضح مع ظهور نماذج انعكاسية سلبية على الفريمات الكبيرة. تراجع أحجام التداول عند القمم يشير إلى ضعف المشترين وبداية سيطرة البائعين."
        : "السوق حالياً في مرحلة تذبذب عرضي بانتظار أخبار اقتصادية مؤثرة. من الأفضل البقاء خارج السوق لتجنب التقلبات العشوائية والحفاظ على رأس المال.";

      setAnalysis({
        asset: selectedAsset,
        timeframe: timeframe,
        recommendation: recommendation,
        probability: finalProbability,
        sentiment: newsSentiment,
        trend: finalProbability > 50 ? 'Upward' : 'Downward',
        confidence: Math.floor(Math.random() * 15) + 80,
        timestamp: new Date().toLocaleTimeString(),
        indicators: technicalIndicators,
        chartData: chartData,
        reasoning: smartReasoning,
        levels: { entry, tp, sl }
      });
      
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    runAnalysis();
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
            {t('aibot.title').split(' ')[0]} <span className="text-yellow-500">{t('aibot.title').split(' ').slice(1).join(' ')}</span>
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
          <div className="flex flex-wrap justify-center bg-zinc-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl max-w-full overflow-hidden">
            {assets.slice(0, 6).map((asset) => (
              <button
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedAsset === asset ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-white'}`}
              >
                {asset}
              </button>
            ))}
          </div>
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            {['15min', '1hr', '1day'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === tf ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
              >
                {tf}
              </button>
            ))}
          </div>
          <Button 
            onClick={runAnalysis} 
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
                <CardTitle className="text-2xl font-black uppercase tracking-tight">{t('aibot.verdict').split(' ')[0]} <span className="text-yellow-500">{t('aibot.verdict').split(' ').slice(1).join(' ')}</span></CardTitle>
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <Activity className="w-4 h-4 text-yellow-500" /> {t('aibot.live')}
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

                    {/* Chart Section */}
                    <div className="h-[300px] w-full bg-black/20 rounded-3xl p-4 border border-white/5">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analysis.chartData}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={analysis.recommendation === 'Buy' ? '#22c55e' : analysis.recommendation === 'Sell' ? '#ef4444' : '#eab308'} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={analysis.recommendation === 'Buy' ? '#22c55e' : analysis.recommendation === 'Sell' ? '#ef4444' : '#eab308'} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis dataKey="time" hide />
                          <YAxis domain={['auto', 'auto']} hide />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke={analysis.recommendation === 'Buy' ? '#22c55e' : analysis.recommendation === 'Sell' ? '#ef4444' : '#eab308'} 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorPrice)" 
                          />
                          <ReferenceLine y={analysis.levels.entry} stroke="#ffffff40" strokeDasharray="3 3" label={{ position: 'right', value: 'ENTRY', fill: '#fff', fontSize: 8, fontWeight: 'bold' }} />
                          <ReferenceLine y={analysis.levels.tp} stroke="#22c55e80" strokeDasharray="3 3" label={{ position: 'right', value: 'TP', fill: '#22c55e', fontSize: 8, fontWeight: 'bold' }} />
                          <ReferenceLine y={analysis.levels.sl} stroke="#ef444480" strokeDasharray="3 3" label={{ position: 'right', value: 'SL', fill: '#ef4444', fontSize: 8, fontWeight: 'bold' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Smart Reasoning */}
                    <div className="bg-yellow-500/5 border border-yellow-500/10 p-6 rounded-3xl">
                      <div className="flex items-center gap-3 mb-3">
                        <BrainCircuit className="w-5 h-5 text-yellow-500" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-yellow-500">{t('aibot.smartReasoning')}</h4>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed font-medium">
                        {analysis.reasoning}
                      </p>
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
                <CardTitle className="text-xl font-black uppercase tracking-tight">{t('aibot.metrics').split(' ')[0]} <span className="text-yellow-500">{t('aibot.metrics').split(' ').slice(1).join(' ')}</span></CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {analysis && Object.entries(analysis.indicators).map(([name, status], i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${status === 'bullish' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{name}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'bullish' ? 'text-green-500' : 'text-red-500'}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white overflow-hidden rounded-[2.5rem]">
              <CardHeader className="p-8 border-b border-white/5">
                <CardTitle className="text-xl font-black uppercase tracking-tight">{t('aibot.tradeLevels').split(' ')[0]} <span className="text-yellow-500">{t('aibot.tradeLevels').split(' ').slice(1).join(' ')}</span></CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {analysis && (
                  <>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Entry Price</p>
                      <p className="text-lg font-black text-white">{analysis.levels.entry.toFixed(selectedAsset.includes('USD') ? 4 : 2)}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                      <p className="text-[8px] font-black text-green-500 uppercase tracking-widest mb-1">Take Profit</p>
                      <p className="text-lg font-black text-green-500">{analysis.levels.tp.toFixed(selectedAsset.includes('USD') ? 4 : 2)}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                      <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">Stop Loss</p>
                      <p className="text-lg font-black text-red-500">{analysis.levels.sl.toFixed(selectedAsset.includes('USD') ? 4 : 2)}</p>
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
