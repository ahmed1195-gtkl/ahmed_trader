/**
 * Centralized Analysis Service
 * خدمة تحليل مركزية تجمع جميع أنواع التحليلات في مكان واحد
 * وتوفر نتائج موحدة ودقيقة لجميع المستخدمين
 */

import { getTechnicalSignal, calculateRSI, calculateATR, calculateMACD, calculateBollingerBands, calculateATRBasedLevels } from './analysis/technical.js';
import { analyzeSentiment } from './analysis/sentiment.js';
import { getMarketRegime } from './analysis/market_regime.js';
import { calculateDynamicPositionSize, assessOverallRisk } from './risk/manager_v2.js';

/**
 * فئة التحليل المركزي
 */
export class CentralizedAnalysisService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 60000; // دقيقة واحدة
    this.analysisHistory = [];
    this.maxHistorySize = 1000;
  }

  /**
   * تحليل شامل لزوج عملات
   * @param {string} symbol - رمز الزوج (مثل EURUSD)
   * @param {Object} marketData - بيانات السوق {prices, highs, lows, volume, news}
   * @param {Object} userAccount - بيانات حساب المستخدم {balance, openTrades, riskPercent}
   * @returns {Promise<Object>} - نتيجة التحليل الشاملة
   */
  async analyzeSymbol(symbol, marketData, userAccount = {}) {
    const cacheKey = `${symbol}_${Date.now() - (Date.now() % this.cacheExpiry)}`;

    // التحقق من الكاش
    if (this.cache.has(cacheKey)) {
      console.log(`📦 استخدام نتيجة محفوظة لـ ${symbol}`);
      return this.cache.get(cacheKey);
    }

    console.log(`🔍 بدء التحليل المركزي لـ ${symbol}...`);

    const startTime = Date.now();

    try {
      // 1. التحليل الفني
      const technicalAnalysis = await this.performTechnicalAnalysis(marketData);

      // 2. تحليل المشاعر
      const sentimentAnalysis = await this.performSentimentAnalysis(symbol, marketData.news || []);

      // 3. تحليل نظام السوق
      const marketRegime = await this.performMarketRegimeAnalysis(marketData);

      // 4. تقييم المخاطر
      const riskAssessment = await this.performRiskAssessment(userAccount, marketData);

      // 5. توليد الإشارة النهائية
      const signal = await this.generateSignal(
        technicalAnalysis,
        sentimentAnalysis,
        marketRegime,
        riskAssessment,
        marketData
      );

      // 6. حساب مستويات الدخول والخروج
      const levels = await this.calculateTradeLevels(
        signal,
        marketData,
        userAccount
      );

      const analysis = {
        symbol,
        timestamp: Date.now(),
        signal,
        levels,
        technical: technicalAnalysis,
        sentiment: sentimentAnalysis,
        marketRegime,
        risk: riskAssessment,
        confidence: this.calculateOverallConfidence(
          technicalAnalysis,
          sentimentAnalysis,
          marketRegime
        ),
        processingTime: Date.now() - startTime
      };

      // حفظ في الكاش
      this.cache.set(cacheKey, analysis);

      // حفظ في السجل
      this.addToHistory(analysis);

      console.log(`✅ انتهى التحليل المركزي لـ ${symbol} في ${analysis.processingTime}ms`);

      return analysis;

    } catch (error) {
      console.error(`❌ خطأ في التحليل المركزي لـ ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * التحليل الفني
   */
  async performTechnicalAnalysis(marketData) {
    const { prices, highs, lows, closes } = marketData;

    if (!prices || prices.length < 14) {
      return {
        score: 0,
        signal: 'HOLD',
        indicators: {},
        reason: 'بيانات غير كافية'
      };
    }

    // حساب المؤشرات
    const rsi = calculateRSI(prices, 14);
    const atr = calculateATR(highs, lows, closes || prices, 14);
    const macd = calculateMACD(prices);
    const bb = calculateBollingerBands(prices, 20, 2);

    // الحصول على الإشارة الفنية
    const technicalSignal = getTechnicalSignal(prices);

    // تحليل إضافي
    const currentPrice = prices[prices.length - 1];
    const pricePosition = this.analyzePricePosition(currentPrice, bb);
    const momentum = this.analyzeMomentum(rsi, macd);
    const volatility = this.analyzeVolatility(atr, currentPrice);

    return {
      ...technicalSignal,
      indicators: {
        rsi,
        atr,
        macd,
        bb
      },
      pricePosition,
      momentum,
      volatility
    };
  }

  /**
   * تحليل المشاعر
   */
  async performSentimentAnalysis(symbol, news) {
    if (!news || news.length === 0) {
      return {
        score: 0,
        sentiment: 'neutral',
        newsCount: 0,
        impact: 'low'
      };
    }

    const sentimentResult = await analyzeSentiment(news, symbol);

    return {
      ...sentimentResult,
      newsCount: news.length,
      impact: this.calculateNewsImpact(news)
    };
  }

  /**
   * تحليل نظام السوق
   */
  async performMarketRegimeAnalysis(marketData) {
    const { prices, volume } = marketData;

    if (!prices || prices.length < 50) {
      return {
        regime: 'Unknown',
        confidence: 0,
        description: 'بيانات غير كافية'
      };
    }

    const regime = getMarketRegime(prices, volume);

    return {
      ...regime,
      volatilityLevel: this.classifyVolatility(prices),
      trendStrength: this.calculateTrendStrength(prices)
    };
  }

  /**
   * تقييم المخاطر
   */
  async performRiskAssessment(userAccount, marketData) {
    const {
      balance = 10000,
      openTrades = [],
      riskPercent = 2
    } = userAccount;

    const { prices } = marketData;
    const volatility = this.calculateVolatility(prices);

    const overallRisk = assessOverallRisk(
      balance,
      openTrades,
      volatility,
      'Normal'
    );

    return {
      ...overallRisk,
      recommendedRisk: this.calculateRecommendedRisk(volatility, openTrades.length),
      maxPositionSize: this.calculateMaxPositionSize(balance, volatility)
    };
  }

  /**
   * توليد الإشارة النهائية
   */
  async generateSignal(technical, sentiment, marketRegime, risk, marketData) {
    // إذا كانت المخاطرة عالية جداً، لا نفتح صفقات
    if (risk.riskLevel === 'Critical' || risk.maxNewTrades === 0) {
      return {
        action: 'HOLD',
        reason: 'مستوى المخاطرة مرتفع جداً',
        confidence: 0
      };
    }

    // حساب النقاط من كل تحليل
    let totalScore = 0;
    let maxScore = 0;

    // التحليل الفني (وزن 40%)
    totalScore += (technical.score || 0) * 0.4;
    maxScore += 100 * 0.4;

    // المشاعر (وزن 30%)
    totalScore += (sentiment.score || 0) * 0.3;
    maxScore += 100 * 0.3;

    // نظام السوق (وزن 20%)
    const regimeScore = this.getRegimeScore(marketRegime.regime);
    totalScore += regimeScore * 0.2;
    maxScore += 100 * 0.2;

    // المخاطرة (وزن 10%)
    const riskScore = this.getRiskScore(risk.riskLevel);
    totalScore += riskScore * 0.1;
    maxScore += 100 * 0.1;

    // حساب النسبة المئوية النهائية
    const finalScore = (totalScore / maxScore) * 100;

    // تحديد الإجراء
    let action = 'HOLD';
    let reason = '';

    if (finalScore >= 70) {
      action = technical.trend === 'bullish' ? 'BUY' : 'SELL';
      reason = `إشارة قوية: التحليل الفني ${technical.score}% + المشاعر ${sentiment.score}%`;
    } else if (finalScore >= 60) {
      action = technical.trend === 'bullish' ? 'BUY' : 'SELL';
      reason = `إشارة متوسطة: مجموع النقاط ${finalScore.toFixed(1)}%`;
    } else {
      reason = `إشارة ضعيفة: مجموع النقاط ${finalScore.toFixed(1)}% (أقل من 60%)`;
    }

    return {
      action,
      reason,
      confidence: finalScore / 100,
      breakdown: {
        technical: technical.score,
        sentiment: sentiment.score,
        regime: regimeScore,
        risk: riskScore
      }
    };
  }

  /**
   * حساب مستويات التداول
   */
  async calculateTradeLevels(signal, marketData, userAccount) {
    if (signal.action === 'HOLD') {
      return null;
    }

    const { prices, highs, lows, closes } = marketData;
    const currentPrice = prices[prices.length - 1];

    // حساب ATR
    const atr = calculateATR(highs, lows, closes || prices, 14);

    // حساب SL/TP بناءً على ATR
    const { stopLoss, takeProfit } = calculateATRBasedLevels(
      signal.action,
      currentPrice,
      atr,
      2, // SL = 2 * ATR
      3  // TP = 3 * ATR
    );

    // حساب حجم الصفقة
    const positionSize = calculateDynamicPositionSize(
      userAccount.balance || 10000,
      userAccount.riskPercent || 2,
      currentPrice,
      stopLoss,
      userAccount.leverage || 1
    );

    return {
      entry: currentPrice,
      stopLoss,
      takeProfit,
      positionSize,
      riskRewardRatio: Math.abs((takeProfit - currentPrice) / (currentPrice - stopLoss)),
      potentialProfit: Math.abs(takeProfit - currentPrice) * positionSize,
      potentialLoss: Math.abs(currentPrice - stopLoss) * positionSize
    };
  }

  /**
   * حساب الثقة الإجمالية
   */
  calculateOverallConfidence(technical, sentiment, marketRegime) {
    const weights = {
      technical: 0.4,
      sentiment: 0.3,
      regime: 0.3
    };

    const technicalConf = (technical.score || 0) / 100;
    const sentimentConf = Math.abs(sentiment.score || 0) / 100;
    const regimeConf = (marketRegime.confidence || 0) / 100;

    return (
      technicalConf * weights.technical +
      sentimentConf * weights.sentiment +
      regimeConf * weights.regime
    );
  }

  // ===== دوال مساعدة =====

  analyzePricePosition(price, bb) {
    if (price > bb.upper) return 'above_upper_band';
    if (price < bb.lower) return 'below_lower_band';
    if (price > bb.middle) return 'above_middle';
    return 'below_middle';
  }

  analyzeMomentum(rsi, macd) {
    if (rsi > 70 && macd.histogram > 0) return 'strong_bullish';
    if (rsi < 30 && macd.histogram < 0) return 'strong_bearish';
    if (rsi > 50 && macd.histogram > 0) return 'bullish';
    if (rsi < 50 && macd.histogram < 0) return 'bearish';
    return 'neutral';
  }

  analyzeVolatility(atr, price) {
    const atrPercent = (atr / price) * 100;
    if (atrPercent > 2) return 'high';
    if (atrPercent > 1) return 'medium';
    return 'low';
  }

  calculateNewsImpact(news) {
    const highImpactCount = news.filter(n => n.importance === 'high' || n.impact === 'high').length;
    if (highImpactCount >= 3) return 'high';
    if (highImpactCount >= 1) return 'medium';
    return 'low';
  }

  classifyVolatility(prices) {
    if (prices.length < 20) return 'unknown';
    
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }

    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + r * r, 0) / returns.length
    );

    if (stdDev > 0.02) return 'high';
    if (stdDev > 0.01) return 'medium';
    return 'low';
  }

  calculateTrendStrength(prices) {
    if (prices.length < 20) return 0;

    const sma20 = prices.slice(-20).reduce((a, b) => a + b) / 20;
    const sma50 = prices.slice(-50).reduce((a, b) => a + b) / Math.min(prices.length, 50);

    const diff = Math.abs(sma20 - sma50) / sma50;
    return Math.min(diff * 100, 100);
  }

  calculateVolatility(prices) {
    if (prices.length < 20) return 0.01;

    const returns = [];
    for (let i = 1; i < Math.min(prices.length, 50); i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }

    return Math.sqrt(
      returns.reduce((sum, r) => sum + r * r, 0) / returns.length
    );
  }

  calculateRecommendedRisk(volatility, openTradesCount) {
    let baseRisk = 2;

    if (volatility > 0.03) baseRisk -= 0.5;
    if (volatility > 0.05) baseRisk -= 0.5;

    if (openTradesCount > 3) baseRisk -= 0.5;
    if (openTradesCount > 5) baseRisk -= 0.5;

    return Math.max(0.5, Math.min(5, baseRisk));
  }

  calculateMaxPositionSize(balance, volatility) {
    const baseMax = balance * 0.1;
    
    if (volatility > 0.03) return baseMax * 0.5;
    if (volatility > 0.02) return baseMax * 0.7;
    
    return baseMax;
  }

  getRegimeScore(regime) {
    const scores = {
      'Trending': 80,
      'Ranging': 50,
      'Volatile': 30,
      'Calm': 60,
      'Unknown': 40
    };
    return scores[regime] || 40;
  }

  getRiskScore(riskLevel) {
    const scores = {
      'Low': 90,
      'Medium': 70,
      'High': 40,
      'Critical': 0
    };
    return scores[riskLevel] || 50;
  }

  addToHistory(analysis) {
    this.analysisHistory.push({
      symbol: analysis.symbol,
      timestamp: analysis.timestamp,
      signal: analysis.signal.action,
      confidence: analysis.confidence
    });

    if (this.analysisHistory.length > this.maxHistorySize) {
      this.analysisHistory.shift();
    }
  }

  /**
   * الحصول على إحصائيات الأداء
   */
  getPerformanceStats() {
    if (this.analysisHistory.length === 0) {
      return null;
    }

    const totalAnalyses = this.analysisHistory.length;
    const buySignals = this.analysisHistory.filter(a => a.signal === 'BUY').length;
    const sellSignals = this.analysisHistory.filter(a => a.signal === 'SELL').length;
    const holdSignals = this.analysisHistory.filter(a => a.signal === 'HOLD').length;

    const avgConfidence = this.analysisHistory.reduce((sum, a) => sum + a.confidence, 0) / totalAnalyses;

    return {
      totalAnalyses,
      buySignals,
      sellSignals,
      holdSignals,
      avgConfidence: (avgConfidence * 100).toFixed(2) + '%',
      cacheSize: this.cache.size
    };
  }

  /**
   * مسح الكاش
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ تم مسح الكاش');
  }
}

// إنشاء نسخة واحدة (Singleton)
export const centralizedAnalysis = new CentralizedAnalysisService();

export default centralizedAnalysis;
