/**
 * محرك ذكاء السوق المتقدم - V13.0
 * مسؤول عن جلب البيانات التاريخية وتحليل المشاعر (Sentiment Analysis)
 */

export const fetchHistoricalData = async (symbol, timeframe) => {
  try {
    // تحويل الفريم إلى صيغة Binance
    const intervalMap = { '15M': '15m', '1H': '1h', '4H': '4h', '1D': '1d' };
    const interval = intervalMap[timeframe] || '1h';
    
    // جلب بيانات حقيقية للفوركس والذهب إذا لم يكن الزوج كريبتو
    if (!symbol.endsWith('USDT')) {
      const apiKey = import.meta.env.VITE_TWELVEDATA_API_KEY || 'demo';
      const tdSymbol = symbol === 'XAUUSD' ? 'GOLD' : symbol;
      const intervalMap = { '15M': '15min', '1H': '1h', '4H': '4h', '1D': '1day' };
      const tdInterval = intervalMap[timeframe] || '1h';
      
      try {
        const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${tdSymbol}&interval=${tdInterval}&outputsize=100&apikey=${apiKey}`);
        const data = await res.json();
        if (data && data.values) {
          return data.values.map(v => parseFloat(v.close)).reverse();
        }
      } catch (e) {
        console.warn("TwelveData historical fetch failed, using fallback simulation");
      }
    }

    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`);
    const data = await response.json();
    return data.map(candle => parseFloat(candle[4]));
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return null;
  }
};

export const getMarketSentiment = async (symbol) => {
  try {
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
      impact: (fngScore - 50) / 50 
    };
  } catch (error) {
    return { score: 50, sentiment: 'Neutral', impact: 0 };
  }
};
