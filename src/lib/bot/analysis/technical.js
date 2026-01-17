/**
 * محرك التحليل الفني المتقدم - نسخة مستقرة
 * يقدم تحليلاً واقعياً بناءً على حركة السعر الحقيقية
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
  const rs = gains / (losses || 1);
  return 100 - (100 / (1 + rs));
};

export const getTechnicalSignal = (prices) => {
  if (prices.length < 2) return { score: 0, rsi: 50, trend: 'neutral', reason: 'Insufficient data' };
  
  const rsi = calculateRSI(prices);
  const lastPrice = prices[prices.length - 1];
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  
  let score = 0;
  let reason = '';

  if (rsi < 30) {
    score += 35;
    reason = 'Oversold conditions detected on RSI, potential reversal.';
  } else if (rsi > 70) {
    score -= 35;
    reason = 'Overbought conditions detected on RSI, potential correction.';
  }

  if (lastPrice > avgPrice) {
    score += 15;
    if (!reason) reason = 'Price is trading above average, bullish momentum.';
  } else {
    score -= 15;
    if (!reason) reason = 'Price is trading below average, bearish pressure.';
  }
  
  return { 
    score, 
    rsi, 
    trend: score > 0 ? 'bullish' : score < 0 ? 'bearish' : 'neutral',
    reason 
  };
};

export const calculateMACD = (prices) => {
  if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0 };
  const ema12 = prices.slice(-12).reduce((a, b) => a + b, 0) / 12;
  const ema26 = prices.slice(-26).reduce((a, b) => a + b, 0) / 26;
  const macd = ema12 - ema26;
  const signal = macd * 0.9;
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
