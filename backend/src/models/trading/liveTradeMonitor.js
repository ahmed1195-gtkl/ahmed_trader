/**
 * نظام تتبع الصفقات الحية (Live Trade Monitor)
 * يراقب الصفقات المفتوحة ويتحقق من وصولها لـ TP أو SL
 */

// Firebase is handled by backend services

export class LiveTradeMonitor {
  constructor() {
    this.activeTrades = new Map(); // Map<tradeId, tradeData>
    this.monitoringInterval = null;
  }

  /**
   * فتح صفقة جديدة
   */
  async openTrade(userId, tradeData) {
    const {
      symbol,
      action, // 'BUY' or 'SELL'
      entryPrice,
      stopLoss,
      takeProfit,
      confidence,
      timeframe,
      reason
    } = tradeData;

    try {
      // حفظ الصفقة في Firebase
      const tradeRef = await addDoc(collection(db, 'live_trades'), {
        userId,
        symbol,
        action,
        entryPrice,
        stopLoss,
        takeProfit,
        confidence,
        timeframe,
        reason,
        status: 'open',
        openedAt: serverTimestamp(),
        currentPrice: entryPrice,
        profitLoss: 0,
        profitLossPercent: 0
      });

      // إضافة الصفقة للمراقبة المحلية
      const trade = {
        id: tradeRef.id,
        ...tradeData,
        userId,
        status: 'open',
        openedAt: new Date(),
        currentPrice: entryPrice,
        profitLoss: 0,
        profitLossPercent: 0
      };

      this.activeTrades.set(tradeRef.id, trade);

      return tradeRef.id;
    } catch (error) {
      console.error('Error opening trade:', error);
      return null;
    }
  }

  /**
   * تحديث السعر الحالي للصفقة والتحقق من TP/SL
   */
  async updateTradePrice(tradeId, currentPrice) {
    const trade = this.activeTrades.get(tradeId);
    if (!trade || trade.status !== 'open') return;

    trade.currentPrice = currentPrice;

    // حساب الربح/الخسارة
    let profitLoss = 0;
    if (trade.action === 'BUY') {
      profitLoss = currentPrice - trade.entryPrice;
    } else {
      profitLoss = trade.entryPrice - currentPrice;
    }

    const profitLossPercent = (profitLoss / trade.entryPrice) * 100;
    trade.profitLoss = profitLoss;
    trade.profitLossPercent = profitLossPercent;

    // التحقق من وصول TP أو SL
    let shouldClose = false;
    let closeReason = '';

    if (trade.action === 'BUY') {
      if (currentPrice >= trade.takeProfit) {
        shouldClose = true;
        closeReason = 'Take Profit Hit';
        trade.status = 'closed_profit';
      } else if (currentPrice <= trade.stopLoss) {
        shouldClose = true;
        closeReason = 'Stop Loss Hit';
        trade.status = 'closed_loss';
      }
    } else { // SELL
      if (currentPrice <= trade.takeProfit) {
        shouldClose = true;
        closeReason = 'Take Profit Hit';
        trade.status = 'closed_profit';
      } else if (currentPrice >= trade.stopLoss) {
        shouldClose = true;
        closeReason = 'Stop Loss Hit';
        trade.status = 'closed_loss';
      }
    }

    // تحديث في Firebase
    try {
      await updateDoc(doc(db, 'live_trades', tradeId), {
        currentPrice,
        profitLoss,
        profitLossPercent,
        status: trade.status,
        ...(shouldClose && {
          closedAt: serverTimestamp(),
          closeReason
        })
      });
    } catch (error) {
      console.error('Error updating trade:', error);
    }

    if (shouldClose) {
      this.activeTrades.delete(tradeId);
      return { closed: true, reason: closeReason, profitLoss, profitLossPercent };
    }

    return { closed: false, profitLoss, profitLossPercent };
  }

  /**
   * إغلاق صفقة يدوياً
   */
  async closeTrade(tradeId, currentPrice, reason = 'Manual Close') {
    const trade = this.activeTrades.get(tradeId);
    if (!trade) return null;

    await this.updateTradePrice(tradeId, currentPrice);
    
    trade.status = trade.profitLoss > 0 ? 'closed_profit' : 'closed_loss';
    trade.closeReason = reason;

    try {
      await updateDoc(doc(db, 'live_trades', tradeId), {
        status: trade.status,
        closedAt: serverTimestamp(),
        closeReason: reason
      });
    } catch (error) {
      console.error('Error closing trade:', error);
    }

    this.activeTrades.delete(tradeId);
    return trade;
  }

  /**
   * الحصول على جميع الصفقات المفتوحة للمستخدم
   */
  async getUserActiveTrades(userId) {
    try {
      const q = query(
        collection(db, 'live_trades'),
        where('userId', '==', userId),
        where('status', '==', 'open')
      );
      
      const snapshot = await getDocs(q);
      const trades = [];
      
      snapshot.forEach(doc => {
        const trade = { id: doc.id, ...doc.data() };
        trades.push(trade);
        this.activeTrades.set(doc.id, trade);
      });

      return trades;
    } catch (error) {
      console.error('Error fetching active trades:', error);
      return [];
    }
  }

  /**
   * الحصول على تاريخ الصفقات المغلقة
   */
  async getUserClosedTrades(userId, limit = 20) {
    try {
      const q = query(
        collection(db, 'live_trades'),
        where('userId', '==', userId),
        where('status', 'in', ['closed_profit', 'closed_loss'])
      );
      
      const snapshot = await getDocs(q);
      const trades = [];
      
      snapshot.forEach(doc => {
        trades.push({ id: doc.id, ...doc.data() });
      });

      // ترتيب حسب تاريخ الإغلاق
      trades.sort((a, b) => {
        if (!a.closedAt || !b.closedAt) return 0;
        return b.closedAt.seconds - a.closedAt.seconds;
      });

      return trades.slice(0, limit);
    } catch (error) {
      console.error('Error fetching closed trades:', error);
      return [];
    }
  }

  /**
   * حساب إحصائيات الأداء
   */
  async getUserPerformanceStats(userId) {
    try {
      const closedTrades = await this.getUserClosedTrades(userId, 100);
      
      if (closedTrades.length === 0) {
        return {
          totalTrades: 0,
          winRate: 0,
          totalProfit: 0,
          avgProfit: 0,
          maxDrawdown: 0,
          profitFactor: 0
        };
      }

      const wins = closedTrades.filter(t => t.profitLoss > 0);
      const losses = closedTrades.filter(t => t.profitLoss <= 0);
      
      const totalProfit = closedTrades.reduce((sum, t) => sum + t.profitLoss, 0);
      const totalWins = wins.reduce((sum, t) => sum + t.profitLoss, 0);
      const totalLosses = Math.abs(losses.reduce((sum, t) => sum + t.profitLoss, 0));
      
      const winRate = (wins.length / closedTrades.length) * 100;
      const avgProfit = totalProfit / closedTrades.length;
      const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins;

      // حساب Max Drawdown
      let peak = 0;
      let maxDrawdown = 0;
      let cumulative = 0;
      
      closedTrades.reverse().forEach(trade => {
        cumulative += trade.profitLoss;
        if (cumulative > peak) peak = cumulative;
        const drawdown = peak - cumulative;
        if (drawdown > maxDrawdown) maxDrawdown = drawdown;
      });

      return {
        totalTrades: closedTrades.length,
        winRate: winRate.toFixed(1),
        totalProfit: totalProfit.toFixed(2),
        avgProfit: avgProfit.toFixed(2),
        maxDrawdown: maxDrawdown.toFixed(2),
        profitFactor: profitFactor.toFixed(2)
      };
    } catch (error) {
      console.error('Error calculating performance:', error);
      return null;
    }
  }

  /**
   * بدء المراقبة التلقائية
   */
  startMonitoring(priceUpdateCallback) {
    if (this.monitoringInterval) return;

    this.monitoringInterval = setInterval(() => {
      this.activeTrades.forEach((trade, tradeId) => {
        if (priceUpdateCallback) {
          priceUpdateCallback(trade.symbol, tradeId);
        }
      });
    }, 2000); // كل ثانيتين
  }

  /**
   * إيقاف المراقبة
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}

// إنشاء نسخة واحدة (Singleton)
export const liveTradeMonitor = new LiveTradeMonitor();
