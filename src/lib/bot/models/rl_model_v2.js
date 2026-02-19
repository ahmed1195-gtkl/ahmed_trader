/**
 * نموذج التعلم المعزز المتقدم V2.0
 * تعلم فوري بعد كل صفقة، تعديلات كبيرة، ذاكرة طويلة المدى
 */

import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

class AdvancedRLModel {
  constructor() {
    // الأوزان الأساسية للمؤشرات
    this.weights = {
      rsi: 0.15,
      macd: 0.20,
      trend: 0.25,
      volume: 0.10,
      adx: 0.15,
      sentiment: 0.10,
      news: 0.05
    };

    // إحصائيات الأداء
    this.stats = {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalProfit: 0,
      avgProfit: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      bestTrade: 0,
      worstTrade: 0,
      lastUpdate: new Date()
    };

    // ذاكرة قصيرة المدى (آخر 20 صفقة)
    this.shortTermMemory = [];

    // معرّفات أنماط السوق
    this.marketRegimes = {
      trending: { wins: 0, losses: 0, confidence: 0 },
      ranging: { wins: 0, losses: 0, confidence: 0 },
      volatile: { wins: 0, losses: 0, confidence: 0 }
    };
  }

  /**
   * تسجيل صفقة جديدة والتعلم منها فوراً
   */
  async recordTrade(trade) {
    const { symbol, type, price, profit, confidence, indicators, marketRegime } = trade;

    // تحديث الإحصائيات
    this.stats.totalTrades++;
    const isWin = profit > 0;

    if (isWin) {
      this.stats.wins++;
      this.stats.consecutiveWins++;
      this.stats.consecutiveLosses = 0;
      if (profit > this.stats.bestTrade) this.stats.bestTrade = profit;
    } else {
      this.stats.losses++;
      this.stats.consecutiveLosses++;
      this.stats.consecutiveWins = 0;
      if (profit < this.stats.worstTrade) this.stats.worstTrade = profit;
    }

    this.stats.winRate = (this.stats.wins / this.stats.totalTrades) * 100;
    this.stats.totalProfit += profit;
    this.stats.avgProfit = this.stats.totalProfit / this.stats.totalTrades;
    this.stats.lastUpdate = new Date();

    // تحديث ذاكرة أنماط السوق
    if (marketRegime && this.marketRegimes[marketRegime]) {
      if (isWin) {
        this.marketRegimes[marketRegime].wins++;
      } else {
        this.marketRegimes[marketRegime].losses++;
      }
      const total = this.marketRegimes[marketRegime].wins + this.marketRegimes[marketRegime].losses;
      this.marketRegimes[marketRegime].confidence = (this.marketRegimes[marketRegime].wins / total) * 100;
    }

    // إضافة للذاكرة قصيرة المدى
    this.shortTermMemory.push({ ...trade, isWin, timestamp: Date.now() });
    if (this.shortTermMemory.length > 20) {
      this.shortTermMemory.shift();
    }

    // التعلم الفوري: تعديل الأوزان بناءً على النتيجة
    this.learnFromTrade(trade, isWin);

    // حفظ في Firebase للذاكرة طويلة المدى
    try {
      await addDoc(collection(db, 'bot_learning_v2'), {
        ...trade,
        isWin,
        profit,
        weights: { ...this.weights },
        stats: { ...this.stats },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  }

  /**
   * التعلم من الصفقة (تعديل الأوزان)
   */
  learnFromTrade(trade, isWin) {
    const { indicators } = trade;
    if (!indicators) return;

    // معدل التعلم الديناميكي (أكبر عند الخسارة)
    const learningRate = isWin ? 0.05 : 0.08;

    // تعديل الأوزان بناءً على مساهمة كل مؤشر
    Object.keys(this.weights).forEach(key => {
      if (indicators[key] !== undefined) {
        const contribution = Math.abs(indicators[key]);
        const adjustment = learningRate * contribution * (isWin ? 1 : -1);
        this.weights[key] = Math.max(0.01, Math.min(0.50, this.weights[key] + adjustment));
      }
    });

    // إعادة توزيع الأوزان لتكون مجموعها = 1
    const totalWeight = Object.values(this.weights).reduce((sum, w) => sum + w, 0);
    Object.keys(this.weights).forEach(key => {
      this.weights[key] /= totalWeight;
    });
  }

  /**
   * تحميل البيانات التاريخية من Firebase
   */
  async loadHistoricalData(userId, limit = 100) {
    try {
      const q = query(
        collection(db, 'bot_learning_v2'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(q);
      const trades = [];

      snapshot.forEach(doc => {
        trades.push(doc.data());
      });

      // إعادة بناء الإحصائيات من البيانات التاريخية
      if (trades.length > 0) {
        const wins = trades.filter(t => t.isWin).length;
        const losses = trades.filter(t => !t.isWin).length;
        const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);

        this.stats.totalTrades = trades.length;
        this.stats.wins = wins;
        this.stats.losses = losses;
        this.stats.winRate = (wins / trades.length) * 100;
        this.stats.totalProfit = totalProfit;
        this.stats.avgProfit = totalProfit / trades.length;
        this.stats.bestTrade = Math.max(...trades.map(t => t.profit));
        this.stats.worstTrade = Math.min(...trades.map(t => t.profit));

        // استعادة آخر أوزان محفوظة
        if (trades[0].weights) {
          this.weights = { ...trades[0].weights };
        }
      }

      return trades;
    } catch (error) {
      console.error('Error loading historical data:', error);
      return [];
    }
  }

  /**
   * الحصول على توصية بناءً على نمط السوق
   */
  getRegimeRecommendation(currentRegime) {
    if (!this.marketRegimes[currentRegime]) return null;

    const regime = this.marketRegimes[currentRegime];
    const total = regime.wins + regime.losses;

    if (total < 5) return null; // بيانات غير كافية

    return {
      shouldTrade: regime.confidence > 60,
      confidence: regime.confidence,
      adjustedRisk: regime.confidence > 70 ? 1.2 : regime.confidence < 50 ? 0.7 : 1.0
    };
  }

  /**
   * اكتشاف نمط السوق الحالي
   */
  detectMarketRegime(prices, adx, volatility) {
    // اتجاه قوي
    if (adx > 25) {
      return 'trending';
    }
    
    // تقلب عالي
    if (volatility > 0.02) {
      return 'volatile';
    }
    
    // نطاق محدود
    return 'ranging';
  }

  /**
   * الحصول على الإحصائيات
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * الحصول على الأوزان الحالية
   */
  getWeights() {
    return { ...this.weights };
  }

  /**
   * إعادة تعيين النموذج
   */
  reset() {
    this.weights = {
      rsi: 0.15,
      macd: 0.20,
      trend: 0.25,
      volume: 0.10,
      adx: 0.15,
      sentiment: 0.10,
      news: 0.05
    };

    this.stats = {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalProfit: 0,
      avgProfit: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      bestTrade: 0,
      worstTrade: 0,
      lastUpdate: new Date()
    };

    this.shortTermMemory = [];
    
    this.marketRegimes = {
      trending: { wins: 0, losses: 0, confidence: 0 },
      ranging: { wins: 0, losses: 0, confidence: 0 },
      volatile: { wins: 0, losses: 0, confidence: 0 }
    };
  }
}

// إنشاء نسخة واحدة (Singleton)
export const advancedBotBrain = new AdvancedRLModel();

// للتوافق مع الكود القديم
export const botBrain = advancedBotBrain;
