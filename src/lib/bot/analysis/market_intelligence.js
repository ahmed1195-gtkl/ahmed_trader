/**
 * محرك ذكاء السوق المتقدم - V12.0
 * مسؤول عن جلب البيانات التاريخية وتحليل المشاعر (Sentiment Analysis)
 */

export const fetchHistoricalData = async (symbol, timeframe) => {
  try {
    // تحويل الفريم إلى صيغة Binance
    const intervalMap = { '15M': '15m', '1H': '1h', '4H': '4h', '1D': '1d' };
    const interval = intervalMap[timeframe] || '1h';
    
    // جلب آخر 100 شمعة لضمان دقة RSI(14) و MACD(26)
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`);
    const data = await response.json();
    
    // استخراج أسعار الإغلاق
    return data.map(candle => parseFloat(candle[4]));
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return null;
  }
};

export const getMarketSentiment = async (symbol) => {
  try {
    // محاكاة تحليل المشاعر بناءً على مؤشر الخوف والطمع وبيانات السيولة
    // في النسخة المتقدمة يمكن ربطها بـ API لمشاعر تويتر أو الأخبار
    const response = await fetch('https://api.alternative.me/fng/');
    const data = await response.json();
    const fngScore = parseInt(data.data[0].value);
    
    let sentiment = 'Neutral';
    if (fngScore > 70) sentiment = 'Extreme Greed';
    else if (fngScore > 55) sentiment = 'Greed';
    else if (fngScore < 30) sentiment = 'Extreme Fear';
    else if (fngScore < 45) sentiment = 'Fear';
    
    return {
      score: fngScore,
      sentiment: sentiment,
      impact: (fngScore - 50) / 50 // معامل تأثير بين -1 و 1
    };
  } catch (error) {
    return { score: 50, sentiment: 'Neutral', impact: 0 };
  }
};
