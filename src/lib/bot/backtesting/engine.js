/**
 * Backtesting Engine - محرك الاختبار الخلفي
 * يسمح باختبار استراتيجيات التداول على بيانات تاريخية
 */

import { calculateATR, calculateRSI, calculateMACD, calculateBollingerBands } from '../analysis/technical.js';
import { calculateDynamicPositionSize } from '../risk/manager_v2.js';

/**
 * فئة محرك الاختبار الخلفي
 */
export class BacktestingEngine {
  constructor(config = {}) {
    this.config = {
      initialBalance: config.initialBalance || 10000,
      riskPercent: config.riskPercent || 2,
      leverage: config.leverage || 1,
      commission: config.commission || 0.0007, // 0.07%
      slippage: config.slippage || 0.0002, // 0.02%
      ...config
    };

    this.results = {
      trades: [],
      balance: this.config.initialBalance,
      equity: this.config.initialBalance,
      peak: this.config.initialBalance,
      drawdown: 0,
      maxDrawdown: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      winRate: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      returns: []
    };

    this.openTrades = [];
  }

  /**
   * تشغيل الاختبار الخلفي
   * @param {Array} historicalData - البيانات التاريخية [{timestamp, open, high, low, close, volume}]
   * @param {Function} strategy - دالة الاستراتيجية (indicators, currentBar) => {action, confidence}
   * @returns {Object} - نتائج الاختبار
   */
  async run(historicalData, strategy) {
    console.log(`🔄 بدء الاختبار الخلفي على ${historicalData.length} شمعة...`);

    // التحقق من صحة البيانات
    if (!historicalData || historicalData.length < 50) {
      throw new Error('البيانات التاريخية غير كافية (يجب أن تكون 50 شمعة على الأقل)');
    }

    // حساب المؤشرات لجميع الشموع
    const dataWithIndicators = this.calculateAllIndicators(historicalData);

    // المرور على كل شمعة
    for (let i = 50; i < dataWithIndicators.length; i++) {
      const currentBar = dataWithIndicators[i];
      const previousBars = dataWithIndicators.slice(Math.max(0, i - 50), i);

      // تحديث الصفقات المفتوحة
      this.updateOpenTrades(currentBar);

      // الحصول على إشارة من الاستراتيجية
      const signal = await strategy(currentBar, previousBars);

      // تنفيذ الإشارة
      if (signal && signal.action !== 'HOLD') {
        this.executeSignal(signal, currentBar);
      }

      // حساب Equity
      this.updateEquity(currentBar);

      // تحديث Drawdown
      this.updateDrawdown();
    }

    // إغلاق جميع الصفقات المفتوحة
    const lastBar = dataWithIndicators[dataWithIndicators.length - 1];
    this.closeAllTrades(lastBar);

    // حساب النتائج النهائية
    this.calculateFinalResults();

    console.log(`✅ انتهى الاختبار الخلفي`);
    return this.getResults();
  }

  /**
   * حساب جميع المؤشرات الفنية
   */
  calculateAllIndicators(data) {
    const closes = data.map(d => d.close);
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);

    return data.map((bar, i) => {
      if (i < 14) return { ...bar, indicators: {} };

      const slice = closes.slice(Math.max(0, i - 50), i + 1);
      const highSlice = highs.slice(Math.max(0, i - 50), i + 1);
      const lowSlice = lows.slice(Math.max(0, i - 50), i + 1);

      return {
        ...bar,
        indicators: {
          atr: calculateATR(highSlice, lowSlice, slice, 14),
          rsi: calculateRSI(slice, 14),
          macd: calculateMACD(slice),
          bb: calculateBollingerBands(slice, 20, 2)
        }
      };
    });
  }

  /**
   * تنفيذ إشارة التداول
   */
  executeSignal(signal, bar) {
    const { action, confidence, stopLoss, takeProfit } = signal;

    // التحقق من الثقة
    if (confidence < 0.7) return;

    // حساب حجم الصفقة
    const positionSize = calculateDynamicPositionSize(
      this.results.balance,
      this.config.riskPercent,
      bar.close,
      stopLoss || (action === 'BUY' ? bar.close * 0.98 : bar.close * 1.02),
      this.config.leverage
    );

    // تطبيق Slippage
    const entryPrice = action === 'BUY' 
      ? bar.close * (1 + this.config.slippage)
      : bar.close * (1 - this.config.slippage);

    // حساب العمولة
    const positionValue = positionSize * entryPrice;
    const commission = positionValue * this.config.commission;

    // التحقق من كفاية الرصيد
    if (commission > this.results.balance * 0.01) {
      console.warn(`⚠️ رصيد غير كافٍ لفتح صفقة`);
      return;
    }

    // فتح الصفقة
    const trade = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: action,
      entryPrice,
      entryTime: bar.timestamp,
      positionSize,
      stopLoss: stopLoss || (action === 'BUY' ? entryPrice * 0.98 : entryPrice * 1.02),
      takeProfit: takeProfit || (action === 'BUY' ? entryPrice * 1.04 : entryPrice * 0.96),
      commission,
      confidence,
      status: 'OPEN'
    };

    this.openTrades.push(trade);
    this.results.balance -= commission;

    console.log(`📊 فتح صفقة ${action} @ ${entryPrice.toFixed(5)} | SL: ${trade.stopLoss.toFixed(5)} | TP: ${trade.takeProfit.toFixed(5)}`);
  }

  /**
   * تحديث الصفقات المفتوحة
   */
  updateOpenTrades(bar) {
    const closedTrades = [];

    this.openTrades = this.openTrades.filter(trade => {
      // التحقق من Stop Loss
      if (trade.type === 'BUY' && bar.low <= trade.stopLoss) {
        this.closeTrade(trade, trade.stopLoss, bar.timestamp, 'SL');
        closedTrades.push(trade);
        return false;
      }
      if (trade.type === 'SELL' && bar.high >= trade.stopLoss) {
        this.closeTrade(trade, trade.stopLoss, bar.timestamp, 'SL');
        closedTrades.push(trade);
        return false;
      }

      // التحقق من Take Profit
      if (trade.type === 'BUY' && bar.high >= trade.takeProfit) {
        this.closeTrade(trade, trade.takeProfit, bar.timestamp, 'TP');
        closedTrades.push(trade);
        return false;
      }
      if (trade.type === 'SELL' && bar.low <= trade.takeProfit) {
        this.closeTrade(trade, trade.takeProfit, bar.timestamp, 'TP');
        closedTrades.push(trade);
        return false;
      }

      return true;
    });
  }

  /**
   * إغلاق صفقة
   */
  closeTrade(trade, exitPrice, exitTime, reason) {
    // تطبيق Slippage
    const actualExitPrice = trade.type === 'BUY'
      ? exitPrice * (1 - this.config.slippage)
      : exitPrice * (1 + this.config.slippage);

    // حساب الربح/الخسارة
    const priceDiff = trade.type === 'BUY'
      ? actualExitPrice - trade.entryPrice
      : trade.entryPrice - actualExitPrice;

    const profit = (priceDiff / trade.entryPrice) * (trade.positionSize * trade.entryPrice);
    const exitCommission = (trade.positionSize * actualExitPrice) * this.config.commission;
    const netProfit = profit - exitCommission;

    // تحديث الرصيد
    this.results.balance += netProfit;

    // تسجيل الصفقة
    const closedTrade = {
      ...trade,
      exitPrice: actualExitPrice,
      exitTime,
      profit: netProfit,
      profitPercent: (netProfit / (trade.positionSize * trade.entryPrice)) * 100,
      duration: exitTime - trade.entryTime,
      reason,
      status: 'CLOSED'
    };

    this.results.trades.push(closedTrade);
    this.results.totalTrades++;

    if (netProfit > 0) {
      this.results.winningTrades++;
      this.results.totalProfit += netProfit;
    } else {
      this.results.losingTrades++;
      this.results.totalLoss += Math.abs(netProfit);
    }

    console.log(`${netProfit > 0 ? '✅' : '❌'} إغلاق صفقة ${trade.type} @ ${actualExitPrice.toFixed(5)} | الربح: ${netProfit.toFixed(2)}$ (${reason})`);
  }

  /**
   * إغلاق جميع الصفقات المفتوحة
   */
  closeAllTrades(bar) {
    this.openTrades.forEach(trade => {
      this.closeTrade(trade, bar.close, bar.timestamp, 'END');
    });
    this.openTrades = [];
  }

  /**
   * تحديث Equity
   */
  updateEquity(bar) {
    let unrealizedPnL = 0;

    this.openTrades.forEach(trade => {
      const priceDiff = trade.type === 'BUY'
        ? bar.close - trade.entryPrice
        : trade.entryPrice - bar.close;
      
      unrealizedPnL += (priceDiff / trade.entryPrice) * (trade.positionSize * trade.entryPrice);
    });

    this.results.equity = this.results.balance + unrealizedPnL;
  }

  /**
   * تحديث Drawdown
   */
  updateDrawdown() {
    if (this.results.equity > this.results.peak) {
      this.results.peak = this.results.equity;
    }

    this.results.drawdown = ((this.results.peak - this.results.equity) / this.results.peak) * 100;

    if (this.results.drawdown > this.results.maxDrawdown) {
      this.results.maxDrawdown = this.results.drawdown;
    }
  }

  /**
   * حساب النتائج النهائية
   */
  calculateFinalResults() {
    // Win Rate
    this.results.winRate = this.results.totalTrades > 0
      ? (this.results.winningTrades / this.results.totalTrades) * 100
      : 0;

    // Profit Factor
    this.results.profitFactor = this.results.totalLoss > 0
      ? this.results.totalProfit / this.results.totalLoss
      : this.results.totalProfit > 0 ? Infinity : 0;

    // Total Return
    this.results.totalReturn = ((this.results.balance - this.config.initialBalance) / this.config.initialBalance) * 100;

    // Average Trade
    this.results.avgProfit = this.results.totalTrades > 0
      ? (this.results.totalProfit - this.results.totalLoss) / this.results.totalTrades
      : 0;

    // Sharpe Ratio (مبسط)
    if (this.results.trades.length > 0) {
      const returns = this.results.trades.map(t => t.profitPercent);
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const stdDev = Math.sqrt(
        returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
      );
      this.results.sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;
    }
  }

  /**
   * الحصول على النتائج
   */
  getResults() {
    return {
      summary: {
        initialBalance: this.config.initialBalance,
        finalBalance: this.results.balance,
        totalReturn: this.results.totalReturn,
        totalTrades: this.results.totalTrades,
        winningTrades: this.results.winningTrades,
        losingTrades: this.results.losingTrades,
        winRate: this.results.winRate,
        profitFactor: this.results.profitFactor,
        maxDrawdown: this.results.maxDrawdown,
        sharpeRatio: this.results.sharpeRatio,
        avgProfit: this.results.avgProfit
      },
      trades: this.results.trades,
      equity: this.results.equity
    };
  }

  /**
   * طباعة النتائج
   */
  printResults() {
    const { summary } = this.getResults();

    console.log('\n' + '='.repeat(60));
    console.log('📊 نتائج الاختبار الخلفي');
    console.log('='.repeat(60));
    console.log(`💰 الرصيد الأولي: ${summary.initialBalance.toFixed(2)}$`);
    console.log(`💰 الرصيد النهائي: ${summary.finalBalance.toFixed(2)}$`);
    console.log(`📈 العائد الإجمالي: ${summary.totalReturn.toFixed(2)}%`);
    console.log(`📊 إجمالي الصفقات: ${summary.totalTrades}`);
    console.log(`✅ صفقات رابحة: ${summary.winningTrades}`);
    console.log(`❌ صفقات خاسرة: ${summary.losingTrades}`);
    console.log(`🎯 نسبة الفوز: ${summary.winRate.toFixed(2)}%`);
    console.log(`💪 عامل الربح: ${summary.profitFactor.toFixed(2)}`);
    console.log(`📉 أقصى انخفاض: ${summary.maxDrawdown.toFixed(2)}%`);
    console.log(`📊 نسبة شارب: ${summary.sharpeRatio.toFixed(2)}`);
    console.log(`💵 متوسط الربح: ${summary.avgProfit.toFixed(2)}$`);
    console.log('='.repeat(60) + '\n');
  }
}

/**
 * استراتيجية مثال بسيطة (RSI + MACD)
 */
export const exampleStrategy = (currentBar, previousBars) => {
  const { indicators } = currentBar;
  
  if (!indicators || !indicators.rsi || !indicators.macd) {
    return { action: 'HOLD' };
  }

  const { rsi, macd, atr } = indicators;

  // إشارة شراء: RSI < 30 و MACD صاعد
  if (rsi < 30 && macd.histogram > 0 && macd.macd > macd.signal) {
    return {
      action: 'BUY',
      confidence: 0.8,
      stopLoss: currentBar.close - (atr * 2),
      takeProfit: currentBar.close + (atr * 3)
    };
  }

  // إشارة بيع: RSI > 70 و MACD هابط
  if (rsi > 70 && macd.histogram < 0 && macd.macd < macd.signal) {
    return {
      action: 'SELL',
      confidence: 0.8,
      stopLoss: currentBar.close + (atr * 2),
      takeProfit: currentBar.close - (atr * 3)
    };
  }

  return { action: 'HOLD' };
};

export default BacktestingEngine;
