import logger from '../utils/logger.js';

/**
 * نموذج التنبؤ بالتأثير (Impact Predictor)
 * يتنبأ بحركة السعر المتوقعة بناءً على الأخبار والمشاعر
 * 
 * يستخدم نموذج Gradient Boosting أو Logistic Regression
 * في الإنتاج، يتم تدريب النموذج على بيانات تاريخية حقيقية
 */
class ImpactPredictor {
  constructor() {
    this.initialized = false;
    this.sourceCredibilityWeights = this._initializeSourceWeights();
    this.categoryImpactFactors = this._initializeCategoryFactors();
  }

  async initialize() {
    try {
      // في الإنتاج، يتم تحميل النموذج المدرب هنا
      // مثال: this.model = await loadTrainedModel();
      this.initialized = true;
      logger.info('✅ Impact Predictor initialized');
    } catch (error) {
      logger.error('Failed to initialize Impact Predictor', error);
    }
  }

  /**
   * التنبؤ بتأثير الخبر على السعر
   * @param {Object} newsData - بيانات الخبر
   * @param {Object} sentimentData - بيانات تحليل المشاعر
   * @param {Array} historicalData - البيانات التاريخية للأصل
   * @returns {Object} - التنبؤ {expectedMove, timeframe, volatility, confidence}
   */
  async predictImpact(newsData, sentimentData, historicalData = []) {
    try {
      const {
        title,
        source,
        category
      } = newsData;

      const {
        sentimentScore,
        sentimentLabel,
        confidencePercent
      } = sentimentData;

      // حساب عوامل التأثير
      const sourceWeight = this.sourceCredibilityWeights[source] || 0.5;
      const categoryFactor = this.categoryImpactFactors[category] || 1.0;
      const sentimentFactor = Math.abs(sentimentScore);

      // حساب حركة السعر المتوقعة
      const expectedMove = this._calculateExpectedMove(
        sentimentScore,
        sourceWeight,
        categoryFactor,
        historicalData
      );

      // تحديد الإطار الزمني
      const timeframe = this._determineTimeframe(categoryFactor, sentimentFactor);

      // تحديد مستوى التقلب
      const volatilityLevel = this._determineVolatility(
        sentimentFactor,
        categoryFactor,
        historicalData
      );

      // حساب درجة الثقة
      const confidence = this._calculatePredictionConfidence(
        sentimentScore,
        sourceWeight,
        confidencePercent,
        historicalData
      );

      return {
        expectedMovePercent: expectedMove,
        timeframeHours: timeframe,
        volatilityLevel: volatilityLevel,
        confidencePercent: confidence
      };
    } catch (error) {
      logger.error('Error predicting impact', error);
      return {
        expectedMovePercent: 0,
        timeframeHours: 24,
        volatilityLevel: 'Medium',
        confidencePercent: 0
      };
    }
  }

  /**
   * حساب حركة السعر المتوقعة
   * @private
   */
  _calculateExpectedMove(sentimentScore, sourceWeight, categoryFactor, historicalData) {
    // الصيغة: حركة السعر = درجة المشاعر × وزن المصدر × عامل الفئة × عامل تاريخي

    // عامل تاريخي: متوسط التقلب التاريخي
    let historicalVolatility = 2.0; // افتراضي
    if (historicalData && historicalData.length > 0) {
      const returns = this._calculateHistoricalReturns(historicalData);
      historicalVolatility = this._calculateStandardDeviation(returns) * 100;
    }

    // حساب الحركة المتوقعة
    const baseMove = sentimentScore * sourceWeight * categoryFactor;
    const expectedMove = baseMove * (historicalVolatility / 2);

    // تحديد الحد الأقصى والأدنى للحركة
    return Math.max(-10, Math.min(10, expectedMove));
  }

  /**
   * تحديد الإطار الزمني للتنبؤ
   * @private
   */
  _determineTimeframe(categoryFactor, sentimentFactor) {
    // الأخبار عالية التأثير تؤثر بسرعة (1 ساعة)
    // الأخبار المتوسطة تؤثر في 4 ساعات
    // الأخبار المنخفضة تؤثر في 24 ساعة

    const impactScore = categoryFactor * sentimentFactor;

    if (impactScore > 0.7) return 1;
    if (impactScore > 0.4) return 4;
    return 24;
  }

  /**
   * تحديد مستوى التقلب
   * @private
   */
  _determineVolatility(sentimentFactor, categoryFactor, historicalData) {
    const impactScore = sentimentFactor * categoryFactor;

    // حساب التقلب التاريخي
    let historicalVolatility = 2.0;
    if (historicalData && historicalData.length > 0) {
      const returns = this._calculateHistoricalReturns(historicalData);
      historicalVolatility = this._calculateStandardDeviation(returns) * 100;
    }

    // تحديد المستوى بناءً على التقلب والتأثير
    const volatilityScore = impactScore + (historicalVolatility / 10);

    if (volatilityScore > 1.5) return 'High';
    if (volatilityScore > 0.8) return 'Medium';
    return 'Low';
  }

  /**
   * حساب درجة الثقة في التنبؤ
   * @private
   */
  _calculatePredictionConfidence(sentimentScore, sourceWeight, sentimentConfidence, historicalData) {
    // العوامل المؤثرة على الثقة:
    // 1. ثقة تحليل المشاعر
    // 2. وزن مصدر الخبر
    // 3. توفر البيانات التاريخية

    let dataAvailabilityFactor = 0.5; // افتراضي
    if (historicalData && historicalData.length > 100) {
      dataAvailabilityFactor = 1.0;
    } else if (historicalData && historicalData.length > 20) {
      dataAvailabilityFactor = 0.75;
    }

    const confidence = (
      (sentimentConfidence / 100) * 0.4 +
      sourceWeight * 0.3 +
      dataAvailabilityFactor * 0.3
    ) * 100;

    return Math.round(Math.max(0, Math.min(100, confidence)));
  }

  /**
   * حساب العوائد التاريخية
   * @private
   */
  _calculateHistoricalReturns(priceData) {
    if (!priceData || priceData.length < 2) return [];

    const returns = [];
    for (let i = 1; i < priceData.length; i++) {
      const prevPrice = priceData[i - 1];
      const currPrice = priceData[i];
      const returnValue = (currPrice - prevPrice) / prevPrice;
      returns.push(returnValue);
    }

    return returns;
  }

  /**
   * حساب الانحراف المعياري
   * @private
   */
  _calculateStandardDeviation(values) {
    if (values.length === 0) return 0;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;

    return Math.sqrt(variance);
  }

  /**
   * تهيئة أوزان مصداقية المصادر
   * @private
   */
  _initializeSourceWeights() {
    return {
      'Reuters': 0.95,
      'Bloomberg': 0.95,
      'AP News': 0.90,
      'CNBC': 0.85,
      'MarketWatch': 0.85,
      'CoinDesk': 0.80,
      'The Block': 0.80,
      'Cointelegraph': 0.75,
      'Twitter': 0.60,
      'Medium': 0.50,
      'Default': 0.60
    };
  }

  /**
   * تهيئة عوامل تأثير الفئات
   * @private
   */
  _initializeCategoryFactors() {
    return {
      'monetary_policy': 2.0,
      'earnings': 1.8,
      'regulatory': 1.7,
      'merger_acquisition': 1.6,
      'economic_data': 1.5,
      'geopolitical': 1.4,
      'product_launch': 1.2,
      'partnership': 1.1,
      'general_news': 0.8,
      'default': 1.0
    };
  }
}

export const impactPredictor = new ImpactPredictor();
export default impactPredictor;
