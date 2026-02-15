/**
 * خدمة بيانات السوق الحقيقية
 * تربط التحديات بأسعار الأسواق الفعلية عبر APIs
 */

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || 'sandbox_c8m2v2iad3if8n8b8g00';
const TWELVEDATA_API_KEY = import.meta.env.VITE_TWELVEDATA_API_KEY || 'demo';

/**
 * الرموز المتاحة للتداول في التحديات
 */
export const AVAILABLE_SYMBOLS = {
  FOREX: [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'forex' },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', type: 'forex' },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', type: 'forex' },
    { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', type: 'forex' },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', type: 'forex' },
    { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', type: 'forex' }
  ],
  COMMODITIES: [
    { symbol: 'XAU/USD', name: 'Gold', type: 'commodity' },
    { symbol: 'XAG/USD', name: 'Silver', type: 'commodity' },
    { symbol: 'CL', name: 'Crude Oil', type: 'commodity' }
  ],
  STOCKS: [
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock' },
    { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
    { symbol: 'META', name: 'Meta Platforms Inc.', type: 'stock' }
  ],
  INDICES: [
    { symbol: '^GSPC', name: 'S&P 500', type: 'index' },
    { symbol: '^DJI', name: 'Dow Jones', type: 'index' },
    { symbol: '^IXIC', name: 'NASDAQ', type: 'index' }
  ]
};

/**
 * الحصول على جميع الرموز المتاحة
 */
export const getAllSymbols = () => {
  return [
    ...AVAILABLE_SYMBOLS.FOREX,
    ...AVAILABLE_SYMBOLS.COMMODITIES,
    ...AVAILABLE_SYMBOLS.STOCKS,
    ...AVAILABLE_SYMBOLS.INDICES
  ];
};

/**
 * الحصول على السعر الحالي لرمز معين من Finnhub
 */
export const getCurrentPrice = async (symbol) => {
  try {
    // تحويل الرمز للصيغة المناسبة لـ Finnhub
    const finnhubSymbol = symbol.replace('/', '');
    
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${FINNHUB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price from Finnhub');
    }
    
    const data = await response.json();
    
    return {
      symbol,
      price: data.c, // السعر الحالي
      high: data.h, // أعلى سعر
      low: data.l, // أدنى سعر
      open: data.o, // سعر الافتتاح
      previousClose: data.pc, // سعر الإغلاق السابق
      change: data.d, // التغير
      changePercent: data.dp, // نسبة التغير
      timestamp: Date.now()
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    
    // محاولة استخدام TwelveData كبديل
    return getCurrentPriceFromTwelveData(symbol);
  }
};

/**
 * الحصول على السعر من TwelveData (بديل)
 */
export const getCurrentPriceFromTwelveData = async (symbol) => {
  try {
    const cleanSymbol = symbol.replace('/', '');
    
    const response = await fetch(
      `https://api.twelvedata.com/price?symbol=${cleanSymbol}&apikey=${TWELVEDATA_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price from TwelveData');
    }
    
    const data = await response.json();
    
    return {
      symbol,
      price: parseFloat(data.price),
      timestamp: Date.now()
    };
  } catch (error) {
    console.error(`Error fetching price from TwelveData for ${symbol}:`, error);
    throw error;
  }
};

/**
 * الحصول على أسعار متعددة دفعة واحدة
 */
export const getMultiplePrices = async (symbols) => {
  const prices = {};
  
  // جلب الأسعار بشكل متوازي
  const pricePromises = symbols.map(symbol => 
    getCurrentPrice(symbol).catch(err => {
      console.error(`Failed to get price for ${symbol}:`, err);
      return null;
    })
  );
  
  const results = await Promise.all(pricePromises);
  
  results.forEach((result, index) => {
    if (result) {
      prices[symbols[index]] = result;
    }
  });
  
  return prices;
};

/**
 * الحصول على البيانات التاريخية
 */
export const getHistoricalData = async (symbol, interval = '1day', outputsize = 30) => {
  try {
    const cleanSymbol = symbol.replace('/', '');
    
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${cleanSymbol}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVEDATA_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }
    
    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message);
    }
    
    return data.values.map(item => ({
      date: item.datetime,
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
      volume: parseInt(item.volume)
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * الاشتراك في تحديثات الأسعار الفورية (WebSocket)
 */
export class PriceStreamService {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        
        // إعادة الاشتراك في الرموز
        this.subscribers.forEach((callback, symbol) => {
          this.subscribe(symbol, callback);
        });
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'trade') {
          data.data.forEach(trade => {
            const callback = this.subscribers.get(trade.s);
            if (callback) {
              callback({
                symbol: trade.s,
                price: trade.p,
                volume: trade.v,
                timestamp: trade.t
              });
            }
          });
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        
        // محاولة إعادة الاتصال
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.connect(), 5000 * this.reconnectAttempts);
        }
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  subscribe(symbol, callback) {
    this.subscribers.set(symbol, callback);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const cleanSymbol = symbol.replace('/', '');
      this.ws.send(JSON.stringify({ type: 'subscribe', symbol: cleanSymbol }));
    }
  }

  unsubscribe(symbol) {
    this.subscribers.delete(symbol);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const cleanSymbol = symbol.replace('/', '');
      this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol: cleanSymbol }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }
}

/**
 * حساب حجم الصفقة بناءً على المخاطرة
 */
export const calculatePositionSize = (balance, riskPercent, entryPrice, stopLoss) => {
  const riskAmount = (balance * riskPercent) / 100;
  const priceDifference = Math.abs(entryPrice - stopLoss);
  
  if (priceDifference === 0) return 0;
  
  const positionSize = riskAmount / priceDifference;
  
  return Math.floor(positionSize * 100) / 100; // تقريب لرقمين عشريين
};

/**
 * حساب نقاط Stop Loss و Take Profit المقترحة
 */
export const calculateSLTP = (entryPrice, type, riskRewardRatio = 2) => {
  // حساب ATR تقريبي (1% من السعر)
  const atr = entryPrice * 0.01;
  
  let stopLoss, takeProfit;
  
  if (type === 'buy') {
    stopLoss = entryPrice - (atr * 1.5);
    takeProfit = entryPrice + (atr * 1.5 * riskRewardRatio);
  } else {
    stopLoss = entryPrice + (atr * 1.5);
    takeProfit = entryPrice - (atr * 1.5 * riskRewardRatio);
  }
  
  return {
    stopLoss: Math.round(stopLoss * 100000) / 100000,
    takeProfit: Math.round(takeProfit * 100000) / 100000
  };
};

// إنشاء instance واحد من PriceStreamService
export const priceStream = new PriceStreamService();
