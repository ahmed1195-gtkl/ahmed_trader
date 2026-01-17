import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calculator, Info, ArrowRightLeft, DollarSign, BarChart3, Globe, RefreshCw } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const PipCalculator = () => {
  const { t } = useTranslation();
  const [asset, setAsset] = useState('EURUSD');
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [lotSize, setLotSize] = useState(1);
  const [pipValue, setPipValue] = useState(0);
  const [livePrice, setLivePrice] = useState(1.09);
  const [loading, setLoading] = useState(false);

  const assets = [
    { name: 'EUR/USD', symbol: 'EURUSD', pipDecimal: 4, type: 'forex', fxcmSymbol: 'EURUSD' },
    { name: 'GBP/USD', symbol: 'GBPUSD', pipDecimal: 4, type: 'forex', fxcmSymbol: 'GBPUSD' },
    { name: 'USD/JPY', symbol: 'USDJPY', pipDecimal: 2, type: 'forex', fxcmSymbol: 'USDJPY' },
    { name: 'AUD/USD', symbol: 'AUDUSD', pipDecimal: 4, type: 'forex', fxcmSymbol: 'AUDUSD' },
    { name: 'USD/CHF', symbol: 'USDCHF', pipDecimal: 4, type: 'forex', fxcmSymbol: 'USDCHF' },
    { name: 'XAU/USD', symbol: 'XAUUSD', pipDecimal: 2, type: 'forex', fxcmSymbol: 'XAUUSD' },
    { name: 'BTC/USDT', symbol: 'BTCUSDT', pipDecimal: 2, type: 'crypto' },
    { name: 'ETH/USDT', symbol: 'ETHUSDT', pipDecimal: 2, type: 'crypto' }
  ];

  const accountCurrencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' }
  ];

  // جلب الأسعار الحية
  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      const selectedAsset = assets.find(a => a.symbol === asset);
      try {
        if (selectedAsset.type === 'crypto') {
          const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${asset}`);
          const data = await res.json();
          setLivePrice(parseFloat(data.price));
        } else {
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://rates.fxcm.com/RatesXML')}`);
          const data = await response.json();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data.contents, "text/xml");
          const rates = xmlDoc.getElementsByTagName("Rate");
          for (let i = 0; i < rates.length; i++) {
            if (rates[i].getAttribute("Symbol") === selectedAsset.fxcmSymbol) {
              const bid = parseFloat(rates[i].getElementsByTagName("Bid")[0].childNodes[0].nodeValue);
              const ask = parseFloat(rates[i].getElementsByTagName("Ask")[0].childNodes[0].nodeValue);
              setLivePrice((bid + ask) / 2);
              break;
            }
          }
        }
      } catch (e) {
        console.error("Price fetch error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, [asset]);

  // حساب قيمة النقطة
  useEffect(() => {
    const selectedAsset = assets.find(a => a.symbol === asset);
    let value = 0;
    
    // منطق حساب قيمة النقطة (Pip Value)
    // Formula: (One Pip / Exchange Rate) * Lot Size
    const pipSize = Math.pow(10, -selectedAsset.pipDecimal);
    
    if (selectedAsset.type === 'forex') {
      if (asset.startsWith(accountCurrency)) {
        // إذا كانت عملة الحساب هي العملة الأساسية (مثل USD/JPY والحساب USD)
        value = (pipSize / livePrice) * lotSize * 100000;
      } else if (asset.endsWith(accountCurrency)) {
        // إذا كانت عملة الحساب هي عملة الاقتباس (مثل EUR/USD والحساب USD)
        value = pipSize * lotSize * 100000;
      } else {
        // أزواج متقاطعة (تبسيط للحساب)
        value = (pipSize / livePrice) * lotSize * 100000;
      }
    } else {
      // للعملات الرقمية والذهب
      value = pipSize * lotSize;
    }

    // تحويل العملة إذا لزم الأمر (تبسيط)
    if (accountCurrency === 'EUR') value *= 0.92;
    if (accountCurrency === 'GBP') value *= 0.79;

    setPipValue(value.toFixed(2));
  }, [asset, lotSize, livePrice, accountCurrency]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30">
      <Header />
      <main className="pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6">
            <Calculator className="w-3 h-3" /> {t('nav.tools', 'Trading Tools')}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Pip Calculator</h1>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Smart calculation for all pairs with live rates</p>
        </div>

        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-8 border-b border-white/5">
            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-yellow-500" /> Calculation Parameters
              </div>
              {loading && <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Deposit Currency</label>
                <select 
                  value={accountCurrency} 
                  onChange={(e) => setAccountCurrency(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-yellow-500 transition-colors"
                >
                  {accountCurrencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                </select>
              </div>
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
                  min="0.01"
                />
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-yellow-500/5 border border-yellow-500/10 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">Pip Value Result</span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-white">
                  {accountCurrencies.find(c => c.code === accountCurrency).symbol}{pipValue}
                </span>
                <span className="text-xl font-bold text-gray-500">{accountCurrency}</span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Live Price: {livePrice.toFixed(4)}
                </p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-3 h-3" /> Smart Calculation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Standard Lot (1.0)</p>
                <p className="text-sm font-bold">100,000 Units</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Mini Lot (0.1)</p>
                <p className="text-sm font-bold">10,000 Units</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Micro Lot (0.01)</p>
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
