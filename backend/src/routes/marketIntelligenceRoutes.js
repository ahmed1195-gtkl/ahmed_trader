import express from 'express';
import marketIntelligenceService from '../services/marketIntelligenceService.js';
import sentimentAnalyzer from '../models/sentimentAnalyzer.js';
import impactPredictor from '../models/impactPredictor.js';
import logger from '../utils/logger.js';
import { fetchGlobalNews } from '../services/newsService.js';

const router = express.Router();

/**
 * GET /api/market-intelligence/assets
 * جلب قائمة الأصول المتاحة
 */
router.get('/assets', async (req, res) => {
  try {
    const assets = [
      { id: 'BTC', symbol: 'BTC', name: 'Bitcoin', type: 'crypto' },
      { id: 'ETH', symbol: 'ETH', name: 'Ethereum', type: 'crypto' },
      { id: 'BNB', symbol: 'BNB', name: 'Binance Coin', type: 'crypto' },
      { id: 'SOL', symbol: 'SOL', name: 'Solana', type: 'crypto' },
      { id: 'XRP', symbol: 'XRP', name: 'Ripple', type: 'crypto' },
      { id: 'ADA', symbol: 'ADA', name: 'Cardano', type: 'crypto' },
      { id: 'AVAX', symbol: 'AVAX', name: 'Avalanche', type: 'crypto' },
      { id: 'DOGE', symbol: 'DOGE', name: 'Dogecoin', type: 'crypto' },
      { id: 'DOT', symbol: 'DOT', name: 'Polkadot', type: 'crypto' },
      { id: 'LINK', symbol: 'LINK', name: 'Chainlink', type: 'crypto' },
      { id: 'EURUSD', symbol: 'EUR/USD', name: 'Euro', type: 'forex' },
      { id: 'GBPUSD', symbol: 'GBP/USD', name: 'British Pound', type: 'forex' },
      { id: 'USDJPY', symbol: 'USD/JPY', name: 'Japanese Yen', type: 'forex' },
      { id: 'AUDUSD', symbol: 'AUD/USD', name: 'Australian Dollar', type: 'forex' },
      { id: 'USDCAD', symbol: 'USD/CAD', name: 'Canadian Dollar', type: 'forex' },
      { id: 'XAUUSD', symbol: 'XAU/USD', name: 'Gold', type: 'commodity' }
    ];

    res.json({ success: true, data: assets });
  } catch (error) {
    logger.error('Error fetching assets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/market-intelligence/:assetId
 * جلب بيانات شاملة لأصل معين (أخبار + تحليلات)
 */
router.get('/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;
    const { timeframe = 'daily' } = req.query;

    // جلب الأخبار
    let newsData = [];
    try {
      newsData = await fetchGlobalNews(assetId, timeframe);
    } catch (e) {
      logger.warn(`Failed to fetch news for ${assetId}:`, e.message);
    }

    // معالجة الأخبار وتحليلها
    const processedNews = [];
    for (const news of newsData) {
      try {
        // تحليل المشاعر
        const sentimentData = await sentimentAnalyzer.analyzeSentiment(news.title + ' ' + (news.description || ''));
        
        // التنبؤ بالأثر
        const impactData = await impactPredictor.predictImpact(
          { title: news.title, source: news.source, category: 'general_news' },
          sentimentData,
          []
        );

        processedNews.push({
          id: news.id || Math.random().toString(36).substr(2, 9),
          title: news.title,
          source: news.source,
          description: news.description,
          url: news.url,
          publishedAt: news.publishedAt,
          sentimentLabel: sentimentData.sentimentLabel,
          sentimentScore: sentimentData.sentimentScore,
          confidencePercent: sentimentData.confidencePercent,
          keyPhrases: sentimentData.keyPhrases,
          impact: impactData.expectedMovePercent > 2 ? 'High' : 'Medium',
          expectedMove: impactData.expectedMovePercent,
          timeframe: impactData.timeframeHours,
          volatilityLevel: impactData.volatilityLevel
        });
      } catch (e) {
        logger.warn(`Failed to process news ${news.id}:`, e.message);
        // إضافة الخبر بدون تحليل
        processedNews.push({
          id: news.id || Math.random().toString(36).substr(2, 9),
          title: news.title,
          source: news.source,
          description: news.description,
          url: news.url,
          publishedAt: news.publishedAt,
          sentimentLabel: 'Neutral',
          sentimentScore: 0,
          confidencePercent: 50,
          impact: 'Medium'
        });
      }
    }

    // حساب التحليلات الإجمالية
    const analytics = calculateAnalytics(processedNews, assetId);

    res.json({
      success: true,
      data: {
        assetId,
        news: processedNews,
        analytics
      }
    });
  } catch (error) {
    logger.error('Error fetching market intelligence:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/market-intelligence/:assetId/news
 * جلب الأخبار فقط لأصل معين
 */
router.get('/:assetId/news', async (req, res) => {
  try {
    const { assetId } = req.params;
    const { limit = 10, timeframe = 'daily' } = req.query;

    const newsData = await fetchGlobalNews(assetId, timeframe);
    const limitedNews = newsData.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: limitedNews
    });
  } catch (error) {
    logger.error('Error fetching news:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/market-intelligence/:assetId/analytics
 * جلب التحليلات فقط لأصل معين
 */
router.get('/:assetId/analytics', async (req, res) => {
  try {
    const { assetId } = req.params;
    const { timeframe = 24 } = req.query;

    const analytics = await marketIntelligenceService.getAssetAnalytics(assetId, parseInt(timeframe));

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/market-intelligence/articles/:articleId/sentiment
 * جلب درجات المشاعر لمقالة معينة
 */
router.get('/articles/:articleId/sentiment', async (req, res) => {
  try {
    const { articleId } = req.params;

    const sentiments = await marketIntelligenceService.getSentimentScores(articleId);

    res.json({
      success: true,
      data: sentiments
    });
  } catch (error) {
    logger.error('Error fetching sentiment scores:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/market-intelligence/articles/:articleId/impact
 * جلب تنبؤات التأثير لمقالة معينة
 */
router.get('/articles/:articleId/impact', async (req, res) => {
  try {
    const { articleId } = req.params;

    const predictions = await marketIntelligenceService.getImpactPredictions(articleId);

    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    logger.error('Error fetching impact predictions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/market-intelligence/alerts
 * إنشاء تنبيه مخصص للمستخدم
 */
router.post('/alerts', async (req, res) => {
  try {
    const { userId, assetId, conditionType, thresholdValue } = req.body;

    if (!userId || !assetId || !conditionType || thresholdValue === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const alertId = await marketIntelligenceService.createUserAlert(userId, {
      assetId,
      conditionType,
      thresholdValue
    });

    res.json({
      success: true,
      data: { alertId }
    });
  } catch (error) {
    logger.error('Error creating alert:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/market-intelligence/alerts
 * جلب التنبيهات النشطة للمستخدم
 */
router.get('/alerts', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const alerts = await marketIntelligenceService.getUserAlerts(userId);

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    logger.error('Error fetching alerts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/market-intelligence/alerts/:alertId
 * حذف تنبيه معين
 */
router.delete('/alerts/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;

    // تحديث حالة التنبيه إلى inactive
    const db = marketIntelligenceService.db;
    await db.collection('user_alerts').doc(alertId).update({
      status: 'inactive'
    });

    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting alert:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * دالة مساعدة: حساب التحليلات الإجمالية
 */
function calculateAnalytics(newsData, assetId) {
  const bullishNews = newsData.filter(n => n.sentimentLabel === 'Bullish' || n.sentimentLabel === 'Positive').length;
  const bearishNews = newsData.filter(n => n.sentimentLabel === 'Bearish' || n.sentimentLabel === 'Negative').length;
  const neutralNews = newsData.filter(n => n.sentimentLabel === 'Neutral').length;

  const totalSentiment = newsData.reduce((sum, n) => sum + (n.sentimentScore || 0), 0);
  const averageSentiment = newsData.length > 0 ? totalSentiment / newsData.length : 0;

  const averageConfidence = newsData.length > 0 
    ? newsData.reduce((sum, n) => sum + (n.confidencePercent || 0), 0) / newsData.length
    : 0;

  const averageMove = newsData.length > 0
    ? newsData.reduce((sum, n) => sum + (n.expectedMove || 0), 0) / newsData.length
    : 0;

  return {
    assetId,
    totalNews: newsData.length,
    bullishNews,
    bearishNews,
    neutralNews,
    averageSentimentScore: averageSentiment,
    sentimentTrend: averageSentiment > 0.3 ? 'Bullish' : averageSentiment < -0.3 ? 'Bearish' : 'Neutral',
    volatilityLevel: Math.abs(averageSentiment) > 0.6 ? 'High' : Math.abs(averageSentiment) > 0.3 ? 'Medium' : 'Low',
    predictedMove: averageMove,
    timeframe: '4h',
    confidence: Math.round(averageConfidence)
  };
}

export default router;
