/**
 * خدمة الأخبار المتقدمة - نسخة محسّنة
 * تجمع الأخبار من مصادر متعددة مع نظام احتياطي ذكي
 * 
 * المصادر المدعومة:
 * 1. CoinGecko API - للعملات الرقمية (مجاني، بدون حد)
 * 2. Alpha Vantage - للفوركس والأسهم (مجاني)
 * 3. NewsAPI - للأخبار العامة (مجاني)
 * 4. CryptoPanic - لأخبار التشفير (مجاني)
 * 5. GNews - أخبار عامة (مجاني)
 */

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || 'demo';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY || '';

// Cache للأخبار لتقليل الطلبات
const newsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

/**
 * جلب الأخبار من مصادر متعددة مع نظام احتياطي
 */
export async function fetchMultiSourceNews(symbol, limit = 15) {
  const cacheKey = `${symbol}-${limit}`;
  
  // التحقق من الـ Cache
  if (newsCache.has(cacheKey)) {
    const cached = newsCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  let allNews = [];
  const isCrypto = isCryptoSymbol(symbol);

  try {
    // المحاولة الأولى: CoinGecko للعملات الرقمية
    if (isCrypto) {
      try {
        const cryptoNews = await fetchFromCoinGecko(symbol, limit);
        allNews = allNews.concat(cryptoNews);
      } catch (e) {
        console.warn('CoinGecko fetch failed:', e);
      }
    }

    // المحاولة الثانية: Alpha Vantage للفوركس والأسهم
    if (!isCrypto || allNews.length < limit / 2) {
      try {
        const alphaNews = await fetchFromAlphaVantage(symbol, limit);
        allNews = allNews.concat(alphaNews);
      } catch (e) {
        console.warn('Alpha Vantage fetch failed:', e);
      }
    }

    // المحاولة الثالثة: NewsAPI كمصدر عام
    if (allNews.length < limit / 2) {
      try {
        const newsApiNews = await fetchFromNewsAPI(symbol, limit);
        allNews = allNews.concat(newsApiNews);
      } catch (e) {
        console.warn('NewsAPI fetch failed:', e);
      }
    }

    // المحاولة الرابعة: GNews كمصدر احتياطي
    if (allNews.length < limit / 2) {
      try {
        const gNewsData = await fetchFromGNews(symbol, limit);
        allNews = allNews.concat(gNewsData);
      } catch (e) {
        console.warn('GNews fetch failed:', e);
      }
    }

    // إزالة التكرار وترتيب حسب التاريخ
    allNews = deduplicateNews(allNews);
    allNews = allNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    allNews = allNews.slice(0, limit);

    // حفظ في الـ Cache
    newsCache.set(cacheKey, {
      data: allNews,
      timestamp: Date.now()
    });

    return allNews;
  } catch (error) {
    console.error('Error in fetchMultiSourceNews:', error);
    return getDefaultNews(symbol);
  }
}

/**
 * جلب الأخبار من CoinGecko (بدون مفتاح API)
 */
async function fetchFromCoinGecko(symbol, limit) {
  try {
    // تحويل الرمز إلى معرف CoinGecko
    const coinId = getCoinGeckoId(symbol);
    
    const response = await fetch(
      `${COINGECKO_BASE_URL}/news?limit=${limit}`
    );

    if (!response.ok) throw new Error('CoinGecko API failed');

    const data = await response.json();
    
    return (data || []).map(item => ({
      id: item.id || Math.random().toString(36),
      title: item.title,
      description: item.description || item.title,
      source: item.source || 'CoinGecko',
      url: item.url || '#',
      publishedAt: item.published_at || new Date().toISOString(),
      sentiment: analyzeSentiment(item.title + ' ' + (item.description || '')),
      impact: calculateNewsImpact(item.title),
      category: 'crypto'
    }));
  } catch (error) {
    console.error('CoinGecko fetch error:', error);
    throw error;
  }
}

/**
 * جلب الأخبار من Alpha Vantage
 */
async function fetchFromAlphaVantage(symbol, limit) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&symbols=${symbol}&limit=${limit}&apikey=${ALPHA_VANTAGE_KEY}`
    );

    if (!response.ok) throw new Error('Alpha Vantage API failed');

    const data = await response.json();
    
    if (!data.feed) return [];

    return data.feed.slice(0, limit).map(item => ({
      id: item.url || Math.random().toString(36),
      title: item.title,
      description: item.summary || item.title,
      source: item.source || 'Alpha Vantage',
      url: item.url || '#',
      publishedAt: item.time_published || new Date().toISOString(),
      sentiment: item.overall_sentiment_label || 'Neutral',
      impact: item.overall_sentiment_score ? 'High' : 'Medium',
      category: 'forex'
    }));
  } catch (error) {
    console.error('Alpha Vantage fetch error:', error);
    throw error;
  }
}

/**
 * جلب الأخبار من NewsAPI
 */
async function fetchFromNewsAPI(symbol, limit) {
  if (!NEWS_API_KEY) return [];

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(symbol)}&sortBy=publishedAt&pageSize=${limit}&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) throw new Error('NewsAPI failed');

    const data = await response.json();
    
    if (!data.articles) return [];

    return data.articles.slice(0, limit).map(article => ({
      id: article.url,
      title: article.title,
      description: article.description || article.title,
      source: article.source.name || 'NewsAPI',
      url: article.url,
      publishedAt: article.publishedAt,
      sentiment: analyzeSentiment(article.title + ' ' + (article.description || '')),
      impact: calculateNewsImpact(article.title),
      category: 'general'
    }));
  } catch (error) {
    console.error('NewsAPI fetch error:', error);
    throw error;
  }
}

/**
 * جلب الأخبار من GNews
 */
async function fetchFromGNews(symbol, limit) {
  if (!GNEWS_API_KEY) return [];

  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(symbol)}&lang=en&max=${limit}&apikey=${GNEWS_API_KEY}`
    );

    if (!response.ok) throw new Error('GNews failed');

    const data = await response.json();
    
    if (!data.articles) return [];

    return data.articles.slice(0, limit).map(article => ({
      id: article.url,
      title: article.title,
      description: article.description || article.title,
      source: 'GNews',
      url: article.url,
      publishedAt: article.publishedAt,
      sentiment: analyzeSentiment(article.title + ' ' + (article.description || '')),
      impact: calculateNewsImpact(article.title),
      category: 'general'
    }));
  } catch (error) {
    console.error('GNews fetch error:', error);
    throw error;
  }
}

/**
 * تحليل المشاعر من النص
 */
function analyzeSentiment(text) {
  if (!text) return 'Neutral';

  const textLower = text.toLowerCase();
  
  const positiveWords = [
    'surge', 'rise', 'gain', 'bull', 'rally', 'growth', 'profit', 'up', 'high',
    'record', 'breakthrough', 'success', 'bullish', 'positive', 'strong', 'rally',
    'adoption', 'partnership', 'integration', 'upgrade', 'launch'
  ];
  
  const negativeWords = [
    'fall', 'drop', 'crash', 'bear', 'loss', 'down', 'low', 'decline', 'crisis',
    'risk', 'concern', 'warning', 'bearish', 'negative', 'weak', 'selloff',
    'ban', 'regulation', 'hack', 'exploit', 'vulnerability'
  ];

  let positiveScore = 0;
  let negativeScore = 0;

  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    positiveScore += (text.match(regex) || []).length;
  });

  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    negativeScore += (text.match(regex) || []).length;
  });

  if (positiveScore > negativeScore) return 'Positive';
  if (negativeScore > positiveScore) return 'Negative';
  return 'Neutral';
}

/**
 * حساب تأثير الخبر
 */
function calculateNewsImpact(title) {
  const titleLower = title.toLowerCase();
  
  const highImpactKeywords = [
    'fed', 'ecb', 'central bank', 'interest rate', 'inflation', 'gdp',
    'unemployment', 'crisis', 'war', 'regulation', 'sec', 'lawsuit',
    'bankruptcy', 'merger', 'acquisition', 'ipo', 'earnings'
  ];

  for (const keyword of highImpactKeywords) {
    if (titleLower.includes(keyword)) return 'High';
  }

  return 'Medium';
}

/**
 * إزالة الأخبار المكررة
 */
function deduplicateNews(news) {
  const seen = new Set();
  return news.filter(item => {
    const key = item.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * التحقق من أن الرمز هو عملة رقمية
 */
function isCryptoSymbol(symbol) {
  const cryptoSymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'DOT', 'LINK'];
  return cryptoSymbols.includes(symbol.toUpperCase());
}

/**
 * تحويل الرمز إلى معرف CoinGecko
 */
function getCoinGeckoId(symbol) {
  const mapping = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'BNB': 'binancecoin',
    'SOL': 'solana',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'AVAX': 'avalanche-2',
    'DOGE': 'dogecoin',
    'DOT': 'polkadot',
    'LINK': 'chainlink'
  };
  return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
}

/**
 * أخبار افتراضية
 */
function getDefaultNews(symbol) {
  const now = new Date();
  return [
    {
      id: '1',
      title: `${symbol} Market Update - Technical Analysis`,
      description: 'Market analysis shows potential movement based on technical indicators.',
      source: 'Market Intelligence',
      url: '#',
      publishedAt: now.toISOString(),
      sentiment: 'Neutral',
      impact: 'Medium',
      category: 'analysis'
    },
    {
      id: '2',
      title: 'Global Markets Sentiment Remains Stable',
      description: 'Traders monitoring key economic indicators and market trends.',
      source: 'Trading Desk',
      url: '#',
      publishedAt: new Date(now - 3600000).toISOString(),
      sentiment: 'Neutral',
      impact: 'Low',
      category: 'general'
    }
  ];
}

/**
 * مسح الـ Cache (للاستخدام اليدوي)
 */
export function clearNewsCache() {
  newsCache.clear();
}

/**
 * الحصول على إحصائيات الـ Cache
 */
export function getNewsCacheStats() {
  return {
    size: newsCache.size,
    entries: Array.from(newsCache.keys())
  };
}
