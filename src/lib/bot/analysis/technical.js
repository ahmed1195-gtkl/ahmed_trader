/**
 * محرك التحليل الفني المتقدم - نسخة محسنة V11.0
 * يقدم تحليلاً واقعياً بناءً على حركة السعر الحقيقية مع دعم البيانات التاريخية
 */

export const calculateRSI = (prices, period = 14) => {
  if (prices.length <= period) return 50;
  
  let gains = 0;
  let losses = 0;
  
  // حساب التغيرات الأولية
  for (let i = 1; i <= period; i++) {
    const diff = prices[prices.length - i] - prices[prices.length - i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // تنعيم RSI (Smoothing) إذا توفرت بيانات كافية
  if (prices.length > period + 1) {
    for (let i = period + 1; i < Math.min(prices.length, period * 2); i++) {
      const diff = prices[i] - prices[i - 1];
      const gain = diff >= 0 ? diff : 0;
      const loss = diff < 0 ? -diff : 0;
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }
  }
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

export const getTechnicalSignal = (prices) => {
  if (prices.length < 2) return { score: 0, rsi: 50, trend: 'neutral', reason: 'Insufficient data' };
  
  const rsi = calculateRSI(prices);
  const lastPrice = prices[prices.length - 1];
  
  // حساب المتوسطات المتحركة البسيطة (SMA) لفترات مختلفة
  const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / Math.min(prices.length, 20);
  const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(prices.length, 50);
  
  let score = 0;
  let reason = '';

  // منطق RSI المحسن
  if (rsi < 30) {
    score += 35;
    reason = 'Oversold conditions detected on RSI, potential reversal.';
  } else if (rsi > 70) {
    score -= 35;
    reason = 'Overbought conditions detected on RSI, potential correction.';
  } else if (rsi > 50 && lastPrice > sma20) {
    score += 15;
    reason = 'Bullish momentum confirmed by RSI and SMA20.';
  } else if (rsi < 50 && lastPrice < sma20) {
    score -= 15;
    reason = 'Bearish pressure confirmed by RSI and SMA20.';
  }

  // تقاطع المتوسطات
  if (sma20 > sma50) {
    score += 10;
  } else {
    score -= 10;
  }
  
  return { 
    score, 
    rsi, 
    trend: score > 20 ? 'bullish' : score < -20 ? 'bearish' : 'neutral',
    reason 
  };
};

export const calculateMACD = (prices) => {
  if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0 };
  
  const calculateEMA = (data, period) => {
    const k = 2 / (period + 1);
    let ema = data[0];
    for (let i = 1; i < data.length; i++) {
      ema = data[i] * k + ema * (1 - k);
    }
    return ema;
  };

  const ema12 = calculateEMA(prices.slice(-12), 12);
  const ema26 = calculateEMA(prices.slice(-26), 26);
  const macd = ema12 - ema26;
  const signal = calculateEMA(prices.slice(-9), 9); // تقريبي للتبسيط
  
  return { macd, signal, histogram: macd - signal };
};

export const calculateBollingerBands = (prices, period = 20, stdDev = 2) => {
  if (prices.length < period) return { middle: 0, upper: 0, lower: 0 };
  const slice = prices.slice(-period);
  const middle = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((a, b) => a + Math.pow(b - middle, 2), 0) / period;
  const sd = Math.sqrt(variance);
  return { middle, upper: middle + (stdDev * sd), lower: middle - (stdDev * sd) };
};

export const calculateSupportResistance = (prices) => {
  if (prices.length < 20) return { support: 0, resistance: 0 };
  const sorted = [...prices].sort((a, b) => a - b);
  // استخدام المئويات بدقة أكبر
  const support = sorted[Math.floor(prices.length * 0.15)]; 
  const resistance = sorted[Math.floor(prices.length * 0.85)];
  return { support, resistance };
};
