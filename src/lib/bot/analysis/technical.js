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
