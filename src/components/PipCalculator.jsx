import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Globe, BarChart3, RefreshCw, Info, ChevronDown, Zap, Target, Scale } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import AuthGuardPopup from './AuthGuardPopup';
import { auth } from '../lib/firebase';

const PipCalculator = () => {
  const { t } = useTranslation();
  const [asset, setAsset] = useState('BTCUSDT');
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [lotSize, setLotSize] = useState(1);
  const [pipValue, setPipValue] = useState(0);
  const [livePrice, setLivePrice] = useState(1.09);
  const [loading, setLoading] = useState(false);
  const [showAssetList, setShowAssetList] = useState(false);
  const [showCurrencyList, setShowCurrencyList] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);

  const assets = [
    // Forex Majors
    { name: 'EUR/USD', symbol: 'EURUSD', pipDecimal: 4, type: 'forex' },
    { name: 'GBP/USD', symbol: 'GBPUSD', pipDecimal: 4, type: 'forex' },
    { name: 'USD/JPY', symbol: 'USDJPY', pipDecimal: 2, type: 'forex' },
    { name: 'AUD/USD', symbol: 'AUDUSD', pipDecimal: 4, type: 'forex' },
    { name: 'USD/CHF', symbol: 'USDCHF', pipDecimal: 4, type: 'forex' },
    { name: 'USD/CAD', symbol: 'USDCAD', pipDecimal: 4, type: 'forex' },
    { name: 'NZD/USD', symbol: 'NZDUSD', pipDecimal: 4, type: 'forex' },
    // Forex Crosses
    { name: 'EUR/GBP', symbol: 'EURGBP', pipDecimal: 4, type: 'forex' },
    { name: 'EUR/JPY', symbol: 'EURJPY', pipDecimal: 2, type: 'forex' },
    { name: 'GBP/JPY', symbol: 'GBPJPY', pipDecimal: 2, type: 'forex' },
    { name: 'AUD/JPY', symbol: 'AUDJPY', pipDecimal: 2, type: 'forex' },
    { name: 'EUR/AUD', symbol: 'EURAUD', pipDecimal: 4, type: 'forex' },
    // Metals
    { name: 'XAU/USD (Gold)', symbol: 'XAUUSD', pipDecimal: 2, type: 'forex' },
    { name: 'XAG/USD (Silver)', symbol: 'XAGUSD', pipDecimal: 3, type: 'forex' },
    // Crypto
    { name: 'BTC/USDT', symbol: 'BTCUSDT', pipDecimal: 2, type: 'crypto' },
    { name: 'ETH/USDT', symbol: 'ETHUSDT', pipDecimal: 2, type: 'crypto' },
    { name: 'BNB/USDT', symbol: 'BNBUSDT', pipDecimal: 2, type: 'crypto' },
    { name: 'SOL/USDT', symbol: 'SOLUSDT', pipDecimal: 2, type: 'crypto' },
    { name: 'XRP/USDT', symbol: 'XRPUSDT', pipDecimal: 4, type: 'crypto' },
    { name: 'ADA/USDT', symbol: 'ADAUSDT', pipDecimal: 4, type: 'crypto' },
    { name: 'AVAX/USDT', symbol: 'AVAXUSDT', pipDecimal: 2, type: 'crypto' },
    { name: 'DOGE/USDT', symbol: 'DOGEUSDT', pipDecimal: 5, type: 'crypto' },
    { name: 'DOT/USDT', symbol: 'DOTUSDT', pipDecimal: 2, type: 'crypto' },
    { name: 'LINK/USDT', symbol: 'LINKUSDT', pipDecimal: 3, type: 'crypto' },
    { name: 'MATIC/USDT', symbol: 'MATICUSDT', pipDecimal: 4, type: 'crypto' },
    { name: 'SHIB/USDT', symbol: 'SHIBUSDT', pipDecimal: 8, type: 'crypto' },
    { name: 'LTC/USDT', symbol: 'LTCUSDT', pipDecimal: 2, type: 'crypto' },
    { name: 'BCH/USDT', symbol: 'BCHUSDT', pipDecimal: 2, type: 'crypto' },
    { name: 'UNI/USDT', symbol: 'UNIUSDT', pipDecimal: 3, type: 'crypto' },
    { name: 'ATOM/USDT', symbol: 'ATOMUSDT', pipDecimal: 3, type: 'crypto' },
    { name: 'NEAR/USDT', symbol: 'NEARUSDT', pipDecimal: 3, type: 'crypto' },
    { name: 'APT/USDT', symbol: 'APTUSDT', pipDecimal: 2, type: 'crypto' },
    { name: 'OP/USDT', symbol: 'OPUSDT', pipDecimal: 3, type: 'crypto' },
    { name: 'ARB/USDT', symbol: 'ARBUSDT', pipDecimal: 4, type: 'crypto' }
  ];

  const accountCurrencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' }
  ];

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
          // جلب أسعار الفوركس والذهب
          // نستخدم ExchangeRate-API كخيار أساسي للفوركس لضمان التحديث اليومي المستقر
          const baseCurrency = asset.substring(0, 3);
          const quoteCurrency = asset.substring(3);
          
          // محاولة جلب السعر من Twelve Data أولاً (للحصول على سعر أدق إذا توفر)
          const apiKey = import.meta.env.VITE_TWELVEDATA_API_KEY || 'demo';
          const symbol = selectedAsset.symbol === 'XAUUSD' ? 'GOLD' : selectedAsset.symbol;
          
          try {
            const res = await fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`);
            const data = await res.json();
            if (data && data.price) {
              setLivePrice(parseFloat(data.price));
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn("TwelveData fetch failed, trying fallback...");
          }

          // نظام احتياطي (Fallback) يضمن التحديث كل 24 ساعة على الأقل
          const fallbackRes = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
          const fallbackData = await fallbackRes.json();
          if (fallbackData && fallbackData.rates && fallbackData.rates[quoteCurrency]) {
            setLivePrice(fallbackData.rates[quoteCurrency]);
          }
        }
      } catch (e) {
        console.error("Price fetch error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    // تحديث الكريبتو كل 15 ثانية، أما الفوركس فيكفي تحديثه عند تغيير الزوج أو كل ساعة لضمان استقرار السعر اليومي
    const intervalTime = assets.find(a => a.symbol === asset).type === 'crypto' ? 15000 : 3600000;
    const interval = setInterval(fetchPrice, intervalTime);
    return () => clearInterval(interval);
  }, [asset]);

  const [exchangeRates, setExchangeRates] = useState({ EUR: 0.92, GBP: 0.79, JPY: 145, USD: 1 });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsUserAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data && data.rates) {
          setExchangeRates(data.rates);
        }
      } catch (e) {
        console.error("Exchange rate fetch error", e);
      }
    };
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const selectedAsset = assets.find(a => a.symbol === asset);
    const pipSize = Math.pow(10, -selectedAsset.pipDecimal);
    let value = 0;
    
    if (selectedAsset.type === 'forex') {
      const lotUnits = 100000;
      // If the quote currency is the same as account currency
      if (asset.endsWith(accountCurrency)) {
        value = pipSize * lotSize * lotUnits;
      } else {
        // Standard formula: (Pip Size / Current Price) * Lot Size * Units
        // This gives value in base currency, then we convert to account currency
        value = (pipSize / livePrice) * lotSize * lotUnits;
        
        // Convert from base currency to account currency
        const baseCurrency = asset.substring(0, 3);
        if (baseCurrency !== accountCurrency) {
          const rateToBase = exchangeRates[baseCurrency] || 1;
          const rateToAccount = exchangeRates[accountCurrency] || 1;
          value = (value / rateToBase) * rateToAccount;
        }
      }
    } else {
      // For Crypto/Metals
      value = pipSize * lotSize;
      // Convert USD value to account currency if needed
      if (accountCurrency !== 'USD') {
        value = value * (exchangeRates[accountCurrency] || 1);
      }
    }

    setPipValue(value.toFixed(2));
  }, [asset, lotSize, livePrice, accountCurrency, exchangeRates]);

  const currentAsset = assets.find(a => a.symbol === asset);
  const currentCurrency = accountCurrencies.find(c => c.code === accountCurrency);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden">
      <Header />
      <main className="pt-32 md:pt-40 pb-20 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6">
            <Calculator className="w-3 h-3" /> {t('nav.tools', 'Trading Tools')}
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4">Pip Calculator</h1>
          <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">Global Assets & Live Market Rates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/40 backdrop-blur-2xl border-white/10 text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-yellow-500" /> Parameters
                </CardTitle>
                {loading && <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />}
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Account Currency Selection */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Account Currency
                    </label>
                    <div className="relative">
                      <button 
                        onClick={() => setShowCurrencyList(!showCurrencyList)}
                        className="w-full flex items-center justify-between px-6 py-4 bg-black/50 border border-white/10 rounded-2xl transition-all hover:border-yellow-500/50"
                      >
                        <span className="text-sm font-black uppercase tracking-widest">{accountCurrency}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCurrencyList ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showCurrencyList && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-2xl"
                          >
                            {accountCurrencies.map(c => (
                              <button 
                                key={c.code} 
                                onClick={() => { setAccountCurrency(c.code); setShowCurrencyList(false); }}
                                className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all ${accountCurrency === c.code ? 'bg-yellow-500 text-black' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                              >
                                <span className="text-[10px] font-black uppercase tracking-widest">{c.code}</span>
                                <span className="font-bold">{c.symbol}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Asset Selection */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Asset Pair
                    </label>
                    <div className="relative">
                      <button 
                        onClick={() => setShowAssetList(!showAssetList)}
                        className="w-full flex items-center justify-between px-6 py-4 bg-black/50 border border-white/10 rounded-2xl transition-all hover:border-yellow-500/50"
                      >
                        <span className="text-sm font-black uppercase tracking-widest">{currentAsset.name}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showAssetList ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showAssetList && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-2xl max-h-[300px] overflow-y-auto"
                          >
                            {assets.map(a => (
                              <button 
                                key={a.symbol} 
                                onClick={() => { setAsset(a.symbol); setShowAssetList(false); }}
                                className={`w-full px-6 py-4 text-left transition-all ${asset === a.symbol ? 'bg-yellow-500 text-black' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                              >
                                <span className="text-[10px] font-black uppercase tracking-widest">{a.name}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Lot Size Input */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Scale className="w-3 h-3" /> Lot Size (Volume)
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={lotSize} 
                      onChange={(e) => setLotSize(e.target.value)} 
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-5 text-xl font-black focus:outline-none focus:border-yellow-500 transition-all placeholder:text-gray-700" 
                      step="0.01" min="0.01" 
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Units</div>
                  </div>
                </div>

                {/* Result Display */}
                <div className="p-10 rounded-[2.5rem] bg-yellow-500/5 border border-yellow-500/10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-4 relative z-10">Calculated Pip Value</span>
                  <div className="flex items-baseline gap-3 relative z-10">
                    <span className="text-7xl md:text-8xl font-black tracking-tighter text-white">
                      {currentCurrency.symbol}{pipValue}
                    </span>
                    <span className="text-2xl font-black text-gray-500 uppercase tracking-widest">{accountCurrency}</span>
                  </div>
                  <div className="mt-8 flex flex-wrap justify-center gap-6 relative z-10">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                      <Globe className="w-3 h-3 text-gray-500" />
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Price: {livePrice.toFixed(currentAsset.pipDecimal + 1)}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                      <Info className="w-3 h-3 text-gray-500" />
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Real-time Feed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <Card className="bg-zinc-900/40 backdrop-blur-2xl border-white/10 text-white rounded-[2.5rem]">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-yellow-500" /> Trading Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Type</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{currentAsset.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pip Decimal</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{currentAsset.pipDecimal} Places</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Standard Lot</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">100,000 Units</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[9px] text-gray-400 leading-relaxed italic">
                    "The pip value is calculated based on live market rates. For crypto, it represents the value of a single unit price change."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <AuthGuardPopup isOpen={!isUserAuthenticated} />
    </div>
  );
};

export default PipCalculator;
