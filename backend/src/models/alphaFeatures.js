/**
 * ميزات ALPHA VIP المتقدمة
 * Multi-Timeframe, Smart Money, Copy Trading, Scalping
 */

/**
 * تحليل Multi-Timeframe
 * تحليل نفس الزوج على عدة أطر زمنية
 */
export class MultiTimeframeAnalysis {
  constructor() {
    this.timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
  }

  /**
   * تحليل شامل على جميع الأطر الزمنية
   */
  async analyze(symbol, marketData) {
    const results = {};

    for (const tf of this.timeframes) {
      results[tf] = await this.analyzeTimeframe(symbol, marketData, tf);
    }

    // تحديد الاتجاه العام
    const overallTrend = this.determineOverallTrend(results);

    return {
      timeframes: results,
      overallTrend,
      alignment: this.calculateAlignment(results),
      recommendation: this.generateRecommendation(results, overallTrend)
    };
  }

  /**
   * تحليل إطار زمني واحد
   */
  async analyzeTimeframe(symbol, marketData, timeframe) {
    // محاكاة تحليل حقيقي
    const { prices } = marketData;

    // حساب الاتجاه
    const sma20 = this.calculateSMA(prices, 20);
    const sma50 = this.calculateSMA(prices, 50);

    const trend = sma20 > sma50 ? 'bullish' : 'bearish';
    const strength = Math.abs((sma20 - sma50) / sma50) * 100;

    return {
      timeframe,
      trend,
      strength: Math.min(strength, 100),
      sma20,
      sma50,
      support: this.findSupport(prices),
      resistance: this.findResistance(prices)
    };
  }

  /**
   * تحديد الاتجاه العام
   */
  determineOverallTrend(results) {
    let bullishCount = 0;
    let bearishCount = 0;

    for (const tf in results) {
      if (results[tf].trend === 'bullish') bullishCount++;
      if (results[tf].trend === 'bearish') bearishCount++;
    }

    if (bullishCount > bearishCount * 1.5) return 'strong_bullish';
    if (bearishCount > bullishCount * 1.5) return 'strong_bearish';
    if (bullishCount > bearishCount) return 'bullish';
    if (bearishCount > bullishCount) return 'bearish';
    return 'neutral';
  }

  /**
   * حساب التوافق بين الأطر الزمنية
   */
  calculateAlignment(results) {
    const trends = Object.values(results).map(r => r.trend);
    const bullish = trends.filter(t => t === 'bullish').length;
    const bearish = trends.filter(t => t === 'bearish').length;

    const total = trends.length;
    const alignment = Math.max(bullish, bearish) / total;

    return {
      score: alignment,
      aligned: alignment >= 0.7,
      direction: bullish > bearish ? 'bullish' : 'bearish'
    };
  }

  /**
   * توليد توصية
   */
  generateRecommendation(results, overallTrend) {
    const alignment = this.calculateAlignment(results);

    if (alignment.aligned && overallTrend.includes('strong')) {
      return {
        action: overallTrend.includes('bullish') ? 'BUY' : 'SELL',
        confidence: 0.9,
        reason: 'توافق قوي على جميع الأطر الزمنية'
      };
    }

    if (alignment.score >= 0.6) {
      return {
        action: alignment.direction === 'bullish' ? 'BUY' : 'SELL',
        confidence: 0.7,
        reason: 'توافق جيد على معظم الأطر الزمنية'
      };
    }

    return {
      action: 'HOLD',
      confidence: 0.3,
      reason: 'عدم توافق بين الأطر الزمنية'
    };
  }

  calculateSMA(prices, period) {
    if (prices.length < period) return prices[prices.length - 1];
    const slice = prices.slice(-period);
    return slice.reduce((a, b) => a + b) / period;
  }

  findSupport(prices) {
    const lows = prices.slice(-50);
    return Math.min(...lows);
  }

  findResistance(prices) {
    const highs = prices.slice(-50);
    return Math.max(...highs);
  }
}

/**
 * تحليل Smart Money
 * تتبع حركة الأموال الذكية (المؤسسات)
 */
export class SmartMoneyAnalysis {
  /**
   * تحليل Smart Money
   */
  async analyze(symbol, marketData) {
    const { prices, volume, highs, lows } = marketData;

    // Order Blocks
    const orderBlocks = this.detectOrderBlocks(prices, volume);

    // Fair Value Gaps
    const fvg = this.detectFairValueGaps(highs, lows, prices);

    // Liquidity Zones
    const liquidity = this.detectLiquidityZones(prices, volume);

    // Market Structure
    const structure = this.analyzeMarketStructure(prices);

    return {
      orderBlocks,
      fairValueGaps: fvg,
      liquidityZones: liquidity,
      marketStructure: structure,
      signal: this.generateSmartMoneySignal(orderBlocks, fvg, liquidity, structure)
    };
  }

  /**
   * كشف Order Blocks
   */
  detectOrderBlocks(prices, volume) {
    const blocks = [];

    for (let i = 5; i < prices.length - 5; i++) {
      // بحث عن شموع بحجم تداول كبير
      const avgVolume = volume.slice(i - 5, i + 5).reduce((a, b) => a + b) / 10;
      
      if (volume[i] > avgVolume * 2) {
        blocks.push({
          index: i,
          price: prices[i],
          volume: volume[i],
          type: prices[i] > prices[i - 1] ? 'bullish' : 'bearish'
        });
      }
    }

    return blocks;
  }

  /**
   * كشف Fair Value Gaps
   */
  detectFairValueGaps(highs, lows, prices) {
    const gaps = [];

    for (let i = 2; i < prices.length; i++) {
      // فجوة صاعدة
      if (lows[i] > highs[i - 2]) {
        gaps.push({
          type: 'bullish',
          start: highs[i - 2],
          end: lows[i],
          size: lows[i] - highs[i - 2]
        });
      }

      // فجوة هابطة
      if (highs[i] < lows[i - 2]) {
        gaps.push({
          type: 'bearish',
          start: lows[i - 2],
          end: highs[i],
          size: lows[i - 2] - highs[i]
        });
      }
    }

    return gaps;
  }

  /**
   * كشف مناطق السيولة
   */
  detectLiquidityZones(prices, volume) {
    const zones = [];

    // البحث عن مناطق تجمع السيولة
    for (let i = 10; i < prices.length - 10; i++) {
      const priceRange = prices.slice(i - 10, i + 10);
      const volumeSum = volume.slice(i - 10, i + 10).reduce((a, b) => a + b);

      const priceStd = this.calculateStdDev(priceRange);

      // منطقة سيولة = سعر مستقر + حجم تداول كبير
      if (priceStd < 0.001 && volumeSum > 0) {
        zones.push({
          price: prices[i],
          volume: volumeSum,
          strength: volumeSum / priceStd
        });
      }
    }

    return zones;
  }

  /**
   * تحليل هيكل السوق
   */
  analyzeMarketStructure(prices) {
    const higherHighs = this.countHigherHighs(prices);
    const lowerLows = this.countLowerLows(prices);

    if (higherHighs > lowerLows * 1.5) {
      return {
        type: 'uptrend',
        strength: higherHighs / (higherHighs + lowerLows)
      };
    }

    if (lowerLows > higherHighs * 1.5) {
      return {
        type: 'downtrend',
        strength: lowerLows / (higherHighs + lowerLows)
      };
    }

    return {
      type: 'range',
      strength: 0.5
    };
  }

  /**
   * توليد إشارة Smart Money
   */
  generateSmartMoneySignal(orderBlocks, fvg, liquidity, structure) {
    let score = 0;

    // Order Blocks
    const recentBlocks = orderBlocks.slice(-5);
    const bullishBlocks = recentBlocks.filter(b => b.type === 'bullish').length;
    const bearishBlocks = recentBlocks.filter(b => b.type === 'bearish').length;

    if (bullishBlocks > bearishBlocks) score += 30;
    if (bearishBlocks > bullishBlocks) score -= 30;

    // Fair Value Gaps
    const recentGaps = fvg.slice(-3);
    const bullishGaps = recentGaps.filter(g => g.type === 'bullish').length;
    const bearishGaps = recentGaps.filter(g => g.type === 'bearish').length;

    if (bullishGaps > bearishGaps) score += 20;
    if (bearishGaps > bullishGaps) score -= 20;

    // Market Structure
    if (structure.type === 'uptrend') score += 30 * structure.strength;
    if (structure.type === 'downtrend') score -= 30 * structure.strength;

    // تحديد الإجراء
    let action = 'HOLD';
    if (score > 50) action = 'BUY';
    if (score < -50) action = 'SELL';

    return {
      action,
      score,
      confidence: Math.abs(score) / 100
    };
  }

  calculateStdDev(array) {
    const mean = array.reduce((a, b) => a + b) / array.length;
    const variance = array.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / array.length;
    return Math.sqrt(variance);
  }

  countHigherHighs(prices) {
    let count = 0;
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[i - 1]) count++;
    }
    return count;
  }

  countLowerLows(prices) {
    let count = 0;
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] < prices[i - 1]) count++;
    }
    return count;
  }
}

/**
 * نظام Copy Trading
 */
export class CopyTradingSystem {
  /**
   * نسخ صفقة من متداول آخر
   */
  async copyTrade(sourceUserId, targetUserId, trade, copyRatio = 1.0) {
    console.log(`📋 نسخ صفقة من ${sourceUserId} إلى ${targetUserId}`);

    const copiedTrade = {
      ...trade,
      originalTrader: sourceUserId,
      copiedBy: targetUserId,
      copyRatio,
      positionSize: trade.positionSize * copyRatio,
      timestamp: Date.now(),
      isCopied: true
    };

    return copiedTrade;
  }

  /**
   * الحصول على أفضل المتداولين للنسخ
   */
  async getTopTraders(limit = 10) {
    // محاكاة - في الواقع نجلب من Firebase
    return [
      {
        id: 'trader1',
        name: 'Pro Trader 1',
        winRate: 0.75,
        totalTrades: 150,
        avgProfit: 2.5,
        followers: 45
      },
      {
        id: 'trader2',
        name: 'Expert Trader 2',
        winRate: 0.72,
        totalTrades: 200,
        avgProfit: 2.2,
        followers: 38
      }
    ];
  }
}

/**
 * إشارات Scalping
 */
export class ScalpingSignals {
  /**
   * توليد إشارات سكالبينغ
   */
  async generateSignals(symbol, marketData) {
    const { prices, volume } = marketData;

    // سكالبينغ يعتمد على حركات صغيرة سريعة
    const signals = [];

    for (let i = 10; i < prices.length; i++) {
      const shortMA = this.calculateMA(prices.slice(i - 5, i), 5);
      const longMA = this.calculateMA(prices.slice(i - 10, i), 10);

      const currentPrice = prices[i];
      const priceChange = ((currentPrice - prices[i - 1]) / prices[i - 1]) * 100;

      // إشارة شراء سريعة
      if (shortMA > longMA && priceChange > 0.05 && volume[i] > volume[i - 1]) {
        signals.push({
          type: 'BUY',
          price: currentPrice,
          target: currentPrice * 1.002, // هدف 0.2%
          stopLoss: currentPrice * 0.999, // وقف 0.1%
          confidence: 0.8,
          timeframe: '1m'
        });
      }

      // إشارة بيع سريعة
      if (shortMA < longMA && priceChange < -0.05 && volume[i] > volume[i - 1]) {
        signals.push({
          type: 'SELL',
          price: currentPrice,
          target: currentPrice * 0.998,
          stopLoss: currentPrice * 1.001,
          confidence: 0.8,
          timeframe: '1m'
        });
      }
    }

    return signals.slice(-5); // آخر 5 إشارات
  }

  calculateMA(prices, period) {
    return prices.reduce((a, b) => a + b) / period;
  }
}

// تصدير جميع الميزات
export const alphaFeatures = {
  multiTimeframe: new MultiTimeframeAnalysis(),
  smartMoney: new SmartMoneyAnalysis(),
  copyTrading: new CopyTradingSystem(),
  scalping: new ScalpingSignals()
};

export default alphaFeatures;
