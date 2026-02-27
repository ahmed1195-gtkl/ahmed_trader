/**
 * خدمة الأخبار المالية
 * تجلب الأخبار المؤثرة على الأزواج المختارة من News API
 */

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

/**
 * جلب الأخبار المتعلقة بزوج معين
 * @param {string} symbol - رمز الزوج (مثل BTCUSDT, EURUSD)
 * @param {number} limit - عدد الأخبار المطلوبة
 */
export async function fetchNewsForSymbol(symbol, limit = 5) {
  try {
    // تحديد الكلمات المفتاحية بناءً على الزوج
    const keywords = getKeywordsForSymbol(symbol);
    
    // محاولة جلب من Finnhub أولاً (أفضل للعملات والأسهم)
    if (FINNHUB_API_KEY && FINNHUB_API_KEY !== 'your_finnhub_api_key_here') {
      try {
        const finnhubNews = await fetchFromFinnhub(keywords[0], limit);
        if (finnhubNews && finnhubNews.length > 0) {
          return finnhubNews;
        }
      } catch (error) {
        console.warn('Finnhub API failed, trying NewsAPI:', error);
      }
    }

    // إذا فشل Finnhub، استخدم NewsAPI
    if (NEWS_API_KEY && NEWS_API_KEY !== 'your_news_api_key_here') {
      const newsApiNews = await fetchFromNewsAPI(keywords, limit);
      if (newsApiNews && newsApiNews.length > 0) {
        return newsApiNews;
      }
    }

    // إذا فشلت جميع APIs، أرجع أخبار افتراضية
    return getDefaultNews(symbol);
  } catch (error) {
    console.error('Error fetching news:', error);
    return getDefaultNews(symbol);
  }
}

/**
 * جلب الأخبار من Finnhub API
 */
async function fetchFromFinnhub(category, limit) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=${category}&token=${FINNHUB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Finnhub API request failed');
    }

    const data = await response.json();
    
    return data.slice(0, limit).map(item => ({
      id: item.id || Math.random().toString(36),
      title: item.headline,
      description: item.summary || '',
      url: item.url,
      source: item.source,
      publishedAt: new Date(item.datetime * 1000).toISOString(),
      sentiment: analyzeSentiment(item.headline + ' ' + item.summary),
      impact: calculateImpact(item)
    }));
  } catch (error) {
    console.error('Finnhub fetch error:', error);
    throw error;
  }
}

/**
 * جلب الأخبار من NewsAPI
 */
async function fetchFromNewsAPI(keywords, limit) {
  try {
    const query = keywords.join(' OR ');
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=${limit}&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('NewsAPI request failed');
    }

    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      throw new Error('No articles found');
    }

    return data.articles.map(article => ({
      id: article.url,
      title: article.title,
      description: article.description || '',
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      sentiment: analyzeSentiment(article.title + ' ' + article.description),
      impact: calculateImpact(article)
    }));
  } catch (error) {
    console.error('NewsAPI fetch error:', error);
    throw error;
  }
}

/**
 * تحديد الكلمات المفتاحية بناءً على الزوج
 */
function getKeywordsForSymbol(symbol) {
  const symbolUpper = symbol.toUpperCase();
  
  // عملات رقمية
  if (symbolUpper.includes('BTC')) return ['bitcoin', 'BTC', 'cryptocurrency'];
  if (symbolUpper.includes('ETH')) return ['ethereum', 'ETH', 'cryptocurrency'];
  if (symbolUpper.includes('BNB')) return ['binance', 'BNB', 'cryptocurrency'];
  if (symbolUpper.includes('SOL')) return ['solana', 'SOL', 'cryptocurrency'];
  if (symbolUpper.includes('XRP')) return ['ripple', 'XRP', 'cryptocurrency'];
  if (symbolUpper.includes('ADA')) return ['cardano', 'ADA', 'cryptocurrency'];
  if (symbolUpper.includes('DOGE')) return ['dogecoin', 'DOGE', 'cryptocurrency'];
  
  // عملات فوركس
  if (symbolUpper.includes('EUR')) return ['euro', 'EUR', 'european central bank', 'ECB'];
  if (symbolUpper.includes('GBP')) return ['pound', 'GBP', 'bank of england', 'UK'];
  if (symbolUpper.includes('JPY')) return ['yen', 'JPY', 'bank of japan', 'japan'];
  if (symbolUpper.includes('USD')) return ['dollar', 'USD', 'federal reserve', 'fed'];
  if (symbolUpper.includes('AUD')) return ['australian dollar', 'AUD', 'RBA'];
  if (symbolUpper.includes('CAD')) return ['canadian dollar', 'CAD', 'bank of canada'];
  if (symbolUpper.includes('CHF')) return ['swiss franc', 'CHF', 'SNB'];
  
  // ذهب ونفط
  if (symbolUpper.includes('XAU') || symbolUpper.includes('GOLD')) return ['gold', 'precious metals'];
  if (symbolUpper.includes('XAG') || symbolUpper.includes('SILVER')) return ['silver', 'precious metals'];
  if (symbolUpper.includes('OIL') || symbolUpper.includes('WTI') || symbolUpper.includes('BRENT')) return ['oil', 'crude', 'energy'];
  
  // افتراضي
  return ['forex', 'trading', 'market'];
}

/**
 * تحليل المشاعر من النص
 */
function analyzeSentiment(text) {
  if (!text) return 'neutral';
  
  const textLower = text.toLowerCase();
  
  // كلمات إيجابية
  const positiveWords = ['surge', 'rise', 'gain', 'bull', 'rally', 'growth', 'profit', 'up', 'high', 'record', 'breakthrough', 'success'];
  // كلمات سلبية
  const negativeWords = ['fall', 'drop', 'crash', 'bear', 'loss', 'down', 'low', 'decline', 'crisis', 'risk', 'concern', 'warning'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (textLower.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (textLower.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

/**
 * حساب تأثير الخبر
 */
function calculateImpact(article) {
  const title = (article.headline || article.title || '').toLowerCase();
  
  // كلمات عالية التأثير
  const highImpactWords = ['fed', 'ecb', 'central bank', 'interest rate', 'inflation', 'gdp', 'unemployment', 'crisis', 'war', 'regulation'];
  // كلمات متوسطة التأثير
  const mediumImpactWords = ['earnings', 'report', 'forecast', 'outlook', 'data', 'survey', 'sentiment'];
  
  for (const word of highImpactWords) {
    if (title.includes(word)) return 'high';
  }
  
  for (const word of mediumImpactWords) {
    if (title.includes(word)) return 'medium';
  }
  
  return 'low';
}

/**
 * أخبار افتراضية إذا فشلت جميع APIs
 */
function getDefaultNews(symbol) {
  const now = new Date();
  
  return [
    {
      id: '1',
      title: `${symbol} Market Analysis Update`,
      description: 'Technical analysis shows potential movement in the coming hours.',
      url: '#',
      source: 'Market Intelligence',
      publishedAt: now.toISOString(),
      sentiment: 'neutral',
      impact: 'medium'
    },
    {
      id: '2',
      title: 'Global Market Sentiment Remains Stable',
      description: 'Traders are monitoring key economic indicators.',
      url: '#',
      source: 'Trading Desk',
      publishedAt: new Date(now - 3600000).toISOString(),
      sentiment: 'neutral',
      impact: 'low'
    }
  ];
}

/**
 * جلب أخبار عامة للأسواق
 */
export async function fetchGeneralMarketNews(limit = 10) {
  try {
    if (NEWS_API_KEY && NEWS_API_KEY !== 'your_news_api_key_here') {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=business&pageSize=${limit}&apiKey=${NEWS_API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        return data.articles.map(article => ({
          id: article.url,
          title: article.title,
          description: article.description || '',
          url: article.url,
          source: article.source.name,
          publishedAt: article.publishedAt,
          sentiment: analyzeSentiment(article.title + ' ' + article.description),
          impact: calculateImpact(article)
        }));
      }
    }

    return getDefaultNews('Market');
  } catch (error) {
    console.error('Error fetching general news:', error);
    return getDefaultNews('Market');
  }
}
