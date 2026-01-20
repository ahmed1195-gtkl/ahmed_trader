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

/**
 * جلب الأخبار العالمية من GNews و Currents
 */
export const fetchGlobalNews = async (query = 'crypto') => {
  const news = [];
  
  // 1. GNews API
  try {
    const gnewsKey = import.meta.env.VITE_GNEWS_API_KEY || 'demo';
    const res = await fetch(`https://gnews.io/api/v4/search?q=${query}&lang=en&max=5&apikey=${gnewsKey}`);
    const data = await res.json();
    if (data.articles) {
      data.articles.forEach(a => news.push({
        source: 'GNews',
        title: a.title,
        description: a.description,
        url: a.url,
        publishedAt: a.publishedAt,
        sentiment: analyzeTextSentiment(a.title + " " + a.description)
      }));
    }
  } catch (e) { console.warn("GNews fetch failed"); }

  // 2. Currents API
  try {
    const currentsKey = import.meta.env.VITE_CURRENTS_API_KEY || 'demo';
    const res = await fetch(`https://api.currentsapi.services/v1/search?keywords=${query}&language=en&apiKey=${currentsKey}`);
    const data = await res.json();
    if (data.news) {
      data.news.slice(0, 5).forEach(a => news.push({
        source: 'Currents',
        title: a.title,
        description: a.description,
        url: a.url,
        publishedAt: a.published_at,
        sentiment: analyzeTextSentiment(a.title + " " + a.description)
      }));
    }
  } catch (e) { console.warn("Currents fetch failed"); }

  return news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
};

/**
 * تحليل بسيط لمشاعر النص (Sentiment Analysis)
 */
const analyzeTextSentiment = (text) => {
  const positiveWords = ['bullish', 'surge', 'growth', 'gain', 'positive', 'breakout', 'adoption', 'high', 'profit'];
  const negativeWords = ['bearish', 'crash', 'drop', 'negative', 'fall', 'risk', 'ban', 'scam', 'low', 'loss'];
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  positiveWords.forEach(w => { if (lowerText.includes(w)) score += 1; });
  negativeWords.forEach(w => { if (lowerText.includes(w)) score -= 1; });
  
  return score > 0 ? 'Positive' : score < 0 ? 'Negative' : 'Neutral';
};
