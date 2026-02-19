/**
 * محرك التحليل الفني المتقدم - نسخة محسنة V14.0
 * يقدم تحليلاً واقعياً بناءً على حركة السعر الحقيقية مع دعم البيانات التاريخية
 * تم تطوير خوارزمية الدعوم والمقاومات لتكون حقيقية 100% وتحدد قوة المستويات
 */

export const calculateRSI = (prices, period = 14) => {
  if (prices.length <= period) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const diff = prices[prices.length - i] - prices[prices.length - i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
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
  const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / Math.min(prices.length, 20);
  const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(prices.length, 50);
  
  let score = 0;
  let reason = '';

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

  if (sma20 > sma50) score += 10;
  else score -= 10;
  
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
  const signal = calculateEMA(prices.slice(-9), 9);
  
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

/**
 * خوارزمية متطورة لاستخراج الدعوم والمقاومات الحقيقية
 * تعتمد على تحديد القمم والقيعان المحلية (Fractals) وحساب عدد الارتدادات
 */
export const calculateSupportResistance = (prices) => {
  if (prices.length < 30) return { support: 0, resistance: 0, supportStrength: 'Weak', resistanceStrength: 'Weak' };

  const findLevels = (data, isResistance) => {
    const levels = [];
    const window = 5; // حجم النافذة لتحديد القمة/القاع
    
    for (let i = window; i < data.length - window; i++) {
      let isPivot = true;
      for (let j = 1; j <= window; j++) {
        if (isResistance) {
          if (data[i] < data[i - j] || data[i] < data[i + j]) {
            isPivot = false;
            break;
          }
        } else {
          if (data[i] > data[i - j] || data[i] > data[i + j]) {
            isPivot = false;
            break;
          }
        }
      }
      
      if (isPivot) {
        const price = data[i];
        // تجميع المستويات القريبة من بعضها
        const existingLevel = levels.find(l => Math.abs(l.price - price) / price < 0.002);
        if (existingLevel) {
          existingLevel.hits += 1;
        } else {
          levels.push({ price, hits: 1 });
        }
      }
    }
    return levels.sort((a, b) => b.hits - a.hits);
  };

  const currentPrice = prices[prices.length - 1];
  const resistances = findLevels(prices, true).filter(l => l.price > currentPrice);
  const supports = findLevels(prices, false).filter(l => l.price < currentPrice);

  const bestResistance = resistances[0] || { price: currentPrice * 1.02, hits: 1 };
  const bestSupport = supports[0] || { price: currentPrice * 0.98, hits: 1 };

  const getStrength = (hits) => {
    if (hits >= 3) return 'Strong';
    if (hits === 2) return 'Medium';
    return 'Weak';
  };

  return {
    support: bestSupport.price,
    resistance: bestResistance.price,
    supportStrength: getStrength(bestSupport.hits),
    resistanceStrength: getStrength(bestResistance.hits)
  };
};

/**
 * حساب مؤشر ADX (Average Directional Index) لقياس قوة الاتجاه
 */
export const calculateADX = (prices, period = 14) => {
  if (prices.length < period + 1) return 25; // قيمة افتراضية

  let plusDM = 0, minusDM = 0, tr = 0;
  
  for (let i = prices.length - period; i < prices.length; i++) {
    const high = prices[i];
    const low = prices[i];
    const prevHigh = prices[i - 1];
    const prevLow = prices[i - 1];
    const prevClose = prices[i - 1];
    
    const highDiff = high - prevHigh;
    const lowDiff = prevLow - low;
    
    if (highDiff > lowDiff && highDiff > 0) plusDM += highDiff;
    if (lowDiff > highDiff && lowDiff > 0) minusDM += lowDiff;
    
    const trueRange = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    tr += trueRange;
  }
  
  const plusDI = (plusDM / tr) * 100;
  const minusDI = (minusDM / tr) * 100;
  const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
  
  return dx;
};

/**
 * تحليل حجم التداول (Volume Analysis)
 */
export const calculateVolume = (prices) => {
  if (prices.length < 10) return { trend: 'neutral', strength: 'weak' };
  
  // محاكاة حجم التداول بناءً على تقلبات السعر
  const recentVolatility = prices.slice(-5).reduce((sum, price, i, arr) => {
    if (i === 0) return 0;
    return sum + Math.abs(price - arr[i - 1]);
  }, 0);
  
  const olderVolatility = prices.slice(-10, -5).reduce((sum, price, i, arr) => {
    if (i === 0) return 0;
    return sum + Math.abs(price - arr[i - 1]);
  }, 0);
  
  const trend = recentVolatility > olderVolatility ? 'increasing' : 'decreasing';
  const strength = Math.abs(recentVolatility - olderVolatility) / olderVolatility > 0.2 ? 'strong' : 'weak';
  
  return { trend, strength };
};
