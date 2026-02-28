import firebaseService from './firebaseService.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

/**
 * خدمة ذكاء السوق (Market Intelligence Service)
 * تدير جلب الأخبار، تحليل المشاعر، والتنبؤ بالأثر
 */
class MarketIntelligenceService {
  constructor() {
    this.db = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      this.db = firebaseService.getFirestore();
      this.initialized = true;
      logger.info('✅ Market Intelligence Service initialized');
    } catch (error) {
      logger.error('Failed to initialize Market Intelligence Service', error);
    }
  }

  /**
   * إضافة أو تحديث أصل مالي
   */
  async upsertAsset(symbol, type = 'crypto') {
    try {
      const assetId = symbol.toUpperCase();
      const assetsRef = this.db.collection('assets');
      
      const existingAsset = await assetsRef.doc(assetId).get();
      
      if (!existingAsset.exists) {
        await assetsRef.doc(assetId).set({
          id: assetId,
          symbol: symbol.toUpperCase(),
          type: type,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        logger.info(`Asset created: ${assetId}`);
      }
      
      return assetId;
    } catch (error) {
      logger.error('Failed to upsert asset', error);
      throw error;
    }
  }

  /**
   * حفظ مقالة إخبارية جديدة
   */
  async saveNewsArticle(articleData) {
    try {
      const {
        title,
        source,
        url,
        publishedAt,
        rawText,
        assetId
      } = articleData;

      // توليد معرف فريد للمقالة بناءً على URL
      const articleId = this._hashUrl(url);

      // التحقق من عدم وجود المقالة مسبقاً
      const existingArticle = await this.db
        .collection('news_articles')
        .doc(articleId)
        .get();

      if (existingArticle.exists) {
        logger.debug(`Article already exists: ${articleId}`);
        return articleId;
      }

      // حفظ المقالة الجديدة
      await this.db.collection('news_articles').doc(articleId).set({
        id: articleId,
        asset_id: assetId,
        title: title,
        source: source,
        url: url,
        published_at: new Date(publishedAt),
        raw_text: rawText,
        created_at: new Date()
      });

      logger.info(`News article saved: ${articleId}`);
      return articleId;
    } catch (error) {
      logger.error('Failed to save news article', error);
      throw error;
    }
  }

  /**
   * حفظ درجات المشاعر لمقالة
   */
  async saveSentimentScore(articleId, sentimentData) {
    try {
      const {
        sentimentScore,
        sentimentLabel,
        confidencePercent,
        keyPhrases
      } = sentimentData;

      await this.db.collection('sentiment_scores').add({
        article_id: articleId,
        sentiment_score: sentimentScore,
        sentiment_label: sentimentLabel,
        confidence_percent: confidencePercent,
        key_phrases: keyPhrases || [],
        created_at: new Date()
      });

      logger.info(`Sentiment score saved for article: ${articleId}`);
    } catch (error) {
      logger.error('Failed to save sentiment score', error);
      throw error;
    }
  }

  /**
   * حفظ تنبؤ التأثير لمقالة
   */
  async saveImpactPrediction(articleId, predictionData) {
    try {
      const {
        expectedMovePercent,
        timeframeHours,
        volatilityLevel,
        confidencePercent
      } = predictionData;

      await this.db.collection('impact_predictions').add({
        article_id: articleId,
        expected_move_percent: expectedMovePercent,
        timeframe_hours: timeframeHours,
        volatility_level: volatilityLevel,
        confidence_percent: confidencePercent,
        created_at: new Date()
      });

      logger.info(`Impact prediction saved for article: ${articleId}`);
    } catch (error) {
      logger.error('Failed to save impact prediction', error);
      throw error;
    }
  }

  /**
   * حفظ لقطة سعر
   */
  async savePriceSnapshot(assetId, price) {
    try {
      const timestamp = new Date();
      
      // تقريب الطابع الزمني إلى أقرب دقيقة
      const roundedTimestamp = new Date(
        Math.floor(timestamp.getTime() / 60000) * 60000
      );

      await this.db.collection('price_snapshots').add({
        asset_id: assetId,
        price: price,
        timestamp: roundedTimestamp
      });

      logger.debug(`Price snapshot saved for ${assetId}: ${price}`);
    } catch (error) {
      logger.error('Failed to save price snapshot', error);
      throw error;
    }
  }

  /**
   * حفظ النتائج التاريخية لحركة السعر
   */
  async saveHistoricalOutcome(articleId, moves) {
    try {
      const {
        move1h,
        move4h,
        move24h
      } = moves;

      await this.db.collection('historical_outcomes').add({
        article_id: articleId,
        move_1h: move1h,
        move_4h: move4h,
        move_24h: move24h,
        created_at: new Date()
      });

      logger.info(`Historical outcome saved for article: ${articleId}`);
    } catch (error) {
      logger.error('Failed to save historical outcome', error);
      throw error;
    }
  }

  /**
   * إنشاء تنبيه مخصص للمستخدم
   */
  async createUserAlert(userId, alertData) {
    try {
      const {
        assetId,
        conditionType,
        thresholdValue
      } = alertData;

      const alertId = crypto.randomUUID();

      await this.db.collection('user_alerts').doc(alertId).set({
        id: alertId,
        user_id: userId,
        asset_id: assetId,
        condition_type: conditionType,
        threshold_value: thresholdValue,
        created_at: new Date(),
        status: 'active'
      });

      logger.info(`User alert created: ${alertId}`);
      return alertId;
    } catch (error) {
      logger.error('Failed to create user alert', error);
      throw error;
    }
  }

  /**
   * جلب جميع التنبيهات النشطة للمستخدم
   */
  async getUserAlerts(userId) {
    try {
      const snapshot = await this.db
        .collection('user_alerts')
        .where('user_id', '==', userId)
        .where('status', '==', 'active')
        .get();

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      logger.error('Failed to get user alerts', error);
      return [];
    }
  }

  /**
   * جلب أحدث الأخبار لأصل معين
   */
  async getLatestNewsForAsset(assetId, limit = 10) {
    try {
      const snapshot = await this.db
        .collection('news_articles')
        .where('asset_id', '==', assetId)
        .orderBy('published_at', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      logger.error('Failed to get latest news for asset', error);
      return [];
    }
  }

  /**
   * جلب درجات المشاعر لمقالة
   */
  async getSentimentScores(articleId) {
    try {
      const snapshot = await this.db
        .collection('sentiment_scores')
        .where('article_id', '==', articleId)
        .get();

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      logger.error('Failed to get sentiment scores', error);
      return [];
    }
  }

  /**
   * جلب تنبؤات التأثير لمقالة
   */
  async getImpactPredictions(articleId) {
    try {
      const snapshot = await this.db
        .collection('impact_predictions')
        .where('article_id', '==', articleId)
        .get();

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      logger.error('Failed to get impact predictions', error);
      return [];
    }
  }

  /**
   * جلب إحصائيات تحليلية لأصل معين
   */
  async getAssetAnalytics(assetId, timeframeHours = 24) {
    try {
      const cutoffTime = new Date(Date.now() - timeframeHours * 60 * 60 * 1000);

      // جلب الأخبار الحديثة
      const newsSnapshot = await this.db
        .collection('news_articles')
        .where('asset_id', '==', assetId)
        .where('published_at', '>=', cutoffTime)
        .orderBy('published_at', 'desc')
        .get();

      const newsArticles = newsSnapshot.docs.map(doc => doc.data());

      // حساب إحصائيات المشاعر
      let bullishCount = 0;
      let bearishCount = 0;
      let neutralCount = 0;
      let totalSentimentScore = 0;

      for (const article of newsArticles) {
        const sentiments = await this.getSentimentScores(article.id);
        
        if (sentiments.length > 0) {
          const sentiment = sentiments[0];
          totalSentimentScore += sentiment.sentiment_score;

          if (sentiment.sentiment_label === 'Bullish') bullishCount++;
          else if (sentiment.sentiment_label === 'Bearish') bearishCount++;
          else neutralCount++;
        }
      }

      const totalNews = newsArticles.length;
      const averageSentiment = totalNews > 0 ? totalSentimentScore / totalNews : 0;

      return {
        assetId: assetId,
        timeframeHours: timeframeHours,
        totalNews: totalNews,
        bullishNews: bullishCount,
        bearishNews: bearishCount,
        neutralNews: neutralCount,
        averageSentimentScore: averageSentiment,
        sentimentTrend: averageSentiment > 0.1 ? 'Bullish' : averageSentiment < -0.1 ? 'Bearish' : 'Neutral'
      };
    } catch (error) {
      logger.error('Failed to get asset analytics', error);
      throw error;
    }
  }

  /**
   * دالة مساعدة: توليد hash من URL
   */
  _hashUrl(url) {
    return crypto
      .createHash('sha256')
      .update(url)
      .digest('hex')
      .substring(0, 32);
  }
}

export const marketIntelligenceService = new MarketIntelligenceService();
export default marketIntelligenceService;
