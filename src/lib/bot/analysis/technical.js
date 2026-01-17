/**
 * محرك التحليل الفني الاحترافي
 * يحلل البيانات الحقيقية ويقدم تفسيرات منطقية
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

export const analyzeMarketStructure = (prices) => {
  const lastPrice = prices[prices.length - 1];
  const prevPrice = prices[prices.length - 2];
  const high = Math.max(...prices.slice(-20));
  const low = Math.min(...prices.slice(-20));

  let structure = 'Consolidation';
  let reason = 'Price is ranging between key levels.';

  if (lastPrice > high * 0.99) {
    structure = 'BOS Bullish';
    reason = 'Break of Structure detected. Price is clearing buy-side liquidity.';
  } else if (lastPrice < low * 1.01) {
    structure = 'BOS Bearish';
    reason = 'Break of Structure detected. Price is hunting sell-side liquidity.';
  }

  return { structure, reason, lastPrice, high, low };
};

export const getTechnicalSignal = (prices) => {
  if (prices.length < 2) return { score: 0, rsi: 50, trend: 'neutral' };
  
  const rsi = calculateRSI(prices);
  const { structure } = analyzeMarketStructure(prices);
  
  let score = 0;
  if (rsi < 35) score += 25; // Overbought condition
  if (rsi > 65) score -= 25; // Oversold condition
  
  if (structure.includes('Bullish')) score += 30;
  if (structure.includes('Bearish')) score -= 30;
  
  return { 
    score, 
    rsi, 
    trend: score > 0 ? 'bullish' : score < 0 ? 'bearish' : 'neutral',
    structure 
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
