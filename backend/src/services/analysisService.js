import { getDecisionV2 } from '../models/models/decision_engine_v2.js';
import { calculateRSI, calculateMACD, calculateBollingerBands, getTechnicalSignal } from '../models/analysis/technical.js';
import logger from '../utils/logger.js';
import { OpenAI } from 'openai';
import { config } from '../config/index.js';
import priceService from './priceService.js';

// Helper to calculate all indicators
function calculateIndicators(prices) {
  return {
    rsi: calculateRSI(prices),
    macd: calculateMACD(prices),
    bollingerBands: calculateBollingerBands(prices),
    signal: getTechnicalSignal(prices),
  };
}

class AnalysisService {
  constructor() {
    this.analysisCache = new Map(); // symbol -> last analysis
    this.newsCache = {}; // query -> { data, timestamp }
    this.newsCacheDuration = 5 * 60 * 1000; // 5 minutes
    
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey || process.env.OPENAI_API_KEY,
    });
  }

  async analyze(symbol, priceData, timeframe = '1h') {
    try {
      logger.debug(`Analyzing ${symbol}...`);

      if (!priceData || !priceData.history || priceData.history.length < 20) {
        logger.warn(`Insufficient price data for ${symbol}`);
        return null;
      }

      // Calculate technical indicators
      const indicators = calculateIndicators(priceData.history);

      // Simplified sentiment and news
      const sentiment = { overall: 'neutral', score: 0 };
      const news = { economic: [], global: [] };

      // Get decision from engine
      const decision = getDecisionV2({
        prices: priceData.history,
        marketCondition: this.determineMarketCondition(indicators),
        timeframe,
        assetType: this.getAssetType(symbol),
        sentiment,
        economicNews: news.economic,
        globalNews: news.global,
      });

      const analysis = {
        symbol,
        timestamp: Date.now(),
        price: priceData.price,
        indicators,
        sentiment,
        decision,
        confidence: decision.confidence,
        recommendation: decision.recommendation,
        reasoning: decision.reasoning,
      };

      // Cache analysis
      this.analysisCache.set(symbol, analysis);

      logger.info(`Analysis complete for ${symbol}: ${decision.recommendation} (${decision.confidence}%)`);

      return analysis;
    } catch (error) {
      logger.error(`Analysis failed for ${symbol}`, error);
      return null;
    }
  }

  async getMarketSentiment(symbol) {
    try {
      return await getMarketSentiment(symbol);
    } catch (error) {
      logger.error(`Failed to get market sentiment for ${symbol}`, error);
      return { overall: 'neutral', score: 0 };
    }
  }

  async getNews(query = 'crypto') {
    const now = Date.now();
    const cacheKey = `news_${query}`;
    
    // Return cached news if still fresh
    if (this.newsCache[cacheKey] && (now - this.newsCache[cacheKey].timestamp) < this.newsCacheDuration) {
      return this.newsCache[cacheKey].data;
    }

    try {
      // Import news fetchers
      const { fetchGlobalNews } = await import('../models/analysis/market_intelligence.js');
      
      // Fetch news
      const global = await fetchGlobalNews(query).catch(err => {
        logger.error(`Failed to fetch global news for ${query}`, err);
        return [];
      });

      // AI Sentiment Analysis (Phase 2)
      const enrichedNews = await this.enrichNewsWithAI(global, query);

      const result = {
        global: enrichedNews,
        economic: [], // Placeholder for future economic news integration
        timestamp: now,
      };

      // Cache the result
      this.newsCache[cacheKey] = {
        data: result,
        timestamp: now,
      };

      logger.info(`News fetched for ${query}: ${enrichedNews.length} articles`);

      return result;
    } catch (error) {
      logger.error(`Failed to get news for ${query}`, error);
      return { global: [], economic: [], timestamp: now };
    }
  }

  async enrichNewsWithAI(newsItems, query) {
    // Phase 2: Real AI Sentiment Analysis using LLM
    try {
      // Limit to top 5 news items to save tokens and time
      const topNews = newsItems.slice(0, 5);
      const otherNews = newsItems.slice(5);

      const prompt = `Analyze the following financial news for ${query}. For each news item, provide:
      1. Sentiment (Bullish, Bearish, or Neutral)
      2. Confidence score (0.0 to 1.0)
      3. Impact score (-1.0 to 1.0)
      4. A very brief 1-sentence summary of why.
      
      News items:
      ${topNews.map((n, i) => `${i+1}. Title: ${n.title}\nDescription: ${n.description}`).join('\n\n')}
      
      Return the result as a JSON array of objects with keys: sentiment, confidence, impact_score, summary.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const aiResults = JSON.parse(response.choices[0].message.content).results || JSON.parse(response.choices[0].message.content);
      
      const enrichedTopNews = topNews.map((item, index) => {
        const ai = aiResults[index] || {};
        
        // Get real-time price correlation
        const symbol = this.mapQueryToSymbol(query);
        const priceData = priceService.getPrice(symbol);
        
        return {
          ...item,
          ai_analysis: {
            sentiment: ai.sentiment || item.sentiment,
            confidence: ai.confidence || 0.85,
            impact_score: ai.impact_score || (item.sentiment === 'Positive' ? 0.7 : item.sentiment === 'Negative' ? -0.7 : 0),
            summary: ai.summary || item.description
          },
          correlation: {
            symbol: symbol,
            current_price: priceData?.price || null,
            price_change_24h: priceData?.change24h || 0,
            timestamp: Date.now()
          }
        };
      });

      return [...enrichedTopNews, ...otherNews.map(n => ({
        ...n,
        ai_analysis: {
          sentiment: n.sentiment,
          confidence: 0.7,
          impact_score: n.sentiment === 'Positive' ? 0.5 : n.sentiment === 'Negative' ? -0.5 : 0,
          summary: n.description
        }
      }))];
    } catch (error) {
      logger.error("AI Enrichment failed, using fallback", error);
      return newsItems.map(item => ({
        ...item,
        ai_analysis: {
          sentiment: item.sentiment,
          confidence: 0.6,
          impact_score: item.sentiment === 'Positive' ? 0.4 : item.sentiment === 'Negative' ? -0.4 : 0,
          summary: item.description
        }
      }));
    }
  }

  mapQueryToSymbol(query) {
    const q = query.toUpperCase();
    if (q.includes('BTC')) return 'BTCUSDT';
    if (q.includes('ETH')) return 'ETHUSDT';
    if (q.includes('GOLD') || q.includes('XAU')) return 'XAUUSD';
    if (q.includes('EUR')) return 'EURUSD';
    if (q.includes('GBP')) return 'GBPUSD';
    return 'BTCUSDT'; // Default
  }

  determineMarketCondition(indicators) {
    if (!indicators || !indicators.rsi) {
      return 'neutral';
    }

    const { rsi, macdHistogram } = indicators;

    if (rsi > 70 && macdHistogram > 0) {
      return 'overbought';
    } else if (rsi < 30 && macdHistogram < 0) {
      return 'oversold';
    } else if (macdHistogram > 0) {
      return 'bullish';
    } else if (macdHistogram < 0) {
      return 'bearish';
    }

    return 'neutral';
  }

  getAssetType(symbol) {
    if (symbol.includes('USDT')) return 'crypto';
    if (symbol === 'XAUUSD') return 'commodity';
    if (symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('GBP')) return 'forex';
    return 'unknown';
  }

  getLastAnalysis(symbol) {
    return this.analysisCache.get(symbol);
  }

  getAllAnalyses() {
    const result = {};
    this.analysisCache.forEach((analysis, symbol) => {
      result[symbol] = analysis;
    });
    return result;
  }

  clearCache() {
    this.analysisCache.clear();
    this.newsCache = { economic: null, global: null, timestamp: 0 };
  }
}

export const analysisService = new AnalysisService();
export default analysisService;
