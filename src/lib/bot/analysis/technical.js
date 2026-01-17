/**
 * محرك التحليل الفني المتقدم
 * يقوم بحساب المؤشرات الفنية وتقديم إشارات التداول
 */

export const calculateRSI = (prices, period = 14) => {
  if (prices.length < period) return 50;
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

export const analyzeTrend = (prices) => {
  const shortMA = prices.slice(-10).reduce((a, b) => a + b, 0) / 10;
  const longMA = prices.slice(-30).reduce((a, b) => a + b, 0) / 30;
  if (shortMA > longMA) return 'bullish';
  if (shortMA < longMA) return 'bearish';
  return 'neutral';
};

export const getTechnicalSignal = (prices) => {
  const rsi = calculateRSI(prices);
  const trend = analyzeTrend(prices);
  
  let score = 0;
  if (rsi < 30) score += 30; // Overbought
  if (rsi > 70) score -= 30; // Oversold
  if (trend === 'bullish') score += 20;
  if (trend === 'bearish') score -= 20;
  
  return { score, rsi, trend };
};

export const calculateMACD = (prices) => {
  if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0 };
  const ema12 = prices.slice(-12).reduce((a, b) => a + b, 0) / 12;
  const ema26 = prices.slice(-26).reduce((a, b) => a + b, 0) / 26;
  const macd = ema12 - ema26;
  const signal = macd * 0.9; // تبسيط للإشارة
  return { macd, signal, histogram: macd - signal };
};

export const calculateBollingerBands = (prices, period = 20, stdDev = 2) => {
  if (prices.length < period) return { middle: 0, upper: 0, lower: 0 };
  const slice = prices.slice(-period);
  const middle = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((a, b) => a + Math.pow(b - middle, 2), 0) / period;
  const sd = Math.sqrt(variance);
  return {
    middle,
    upper: middle + (stdDev * sd),
    lower: middle - (stdDev * sd)
  };
};
