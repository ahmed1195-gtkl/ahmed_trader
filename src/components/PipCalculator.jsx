import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calculator, Info, ArrowRightLeft, DollarSign, BarChart3, Globe } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const PipCalculator = () => {
  const { t } = useTranslation();
  const [asset, setAsset] = useState('EURUSD');
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [lotSize, setLotSize] = useState(1);
  const [pipValue, setPipValue] = useState(0);
  const [livePrice, setLivePrice] = useState(1.09);

  const assets = [
    { name: 'EUR/USD', symbol: 'EURUSD', pipDecimal: 4, type: 'forex' },
    { name: 'GBP/USD', symbol: 'GBPUSD', pipDecimal: 4, type: 'forex' },
    { name: 'USD/JPY', symbol: 'USDJPY', pipDecimal: 2, type: 'forex' },
    { name: 'XAU/USD', symbol: 'XAUUSD', pipDecimal: 2, type: 'forex' },
    { name: 'BTC/USDT', symbol: 'BTCUSDT', pipDecimal: 2, type: 'crypto' },
    { name: 'ETH/USDT', symbol: 'ETHUSDT', pipDecimal: 2, type: 'crypto' }
  ];

  useEffect(() => {
    // محاكاة حساب قيمة النقطة بناءً على الزوج وحجم اللوت
    const selectedAsset = assets.find(a => a.symbol === asset);
    let value = 0;
    if (selectedAsset.type === 'forex') {
      if (asset.endsWith('JPY')) {
        value = (0.01 / livePrice) * lotSize * 100000;
      } else {
        value = 0.0001 * lotSize * 100000;
      }
    } else if (selectedAsset.type === 'crypto') {
      value = 0.01 * lotSize;
    }
    setPipValue(value.toFixed(2));
  }, [asset, lotSize, livePrice]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30">
      <Header />
      <main className="pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6">
            <Calculator className="w-3 h-3" /> {t('nav.tools', 'Trading Tools')}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Pip Calculator</h1>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Calculate your risk and pip value accurately</p>
        </div>

        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-8 border-b border-white/5">
            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-yellow-500" /> Calculation Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Asset</label>
                <select 
                  value={asset} 
                  onChange={(e) => setAsset(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-yellow-500 transition-colors"
                >
                  {assets.map(a => <option key={a.symbol} value={a.symbol}>{a.name}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lot Size</label>
                <input 
                  type="number" 
                  value={lotSize} 
                  onChange={(e) => setLotSize(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-yellow-500 transition-colors"
                  step="0.01"
                />
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-yellow-500/5 border border-yellow-500/10 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">Estimated Pip Value</span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-white">${pipValue}</span>
                <span className="text-xl font-bold text-gray-500">{accountCurrency}</span>
              </div>
              <p className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <Info className="w-3 h-3" /> Based on current market rates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Standard Lot</p>
                <p className="text-sm font-bold">100,000 Units</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Mini Lot</p>
                <p className="text-sm font-bold">10,000 Units</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Micro Lot</p>
                <p className="text-sm font-bold">1,000 Units</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PipCalculator;
