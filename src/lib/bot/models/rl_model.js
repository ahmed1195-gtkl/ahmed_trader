/**
 * محرك التعلم المعزز (RL) - نسخة مستقرة
 * يحفظ نتائج الصفقات لتحسين القرارات المستقبلية
 */

class RLTrader {
  constructor() {
    this.storageKey = 'ahmed_trader_v2_memory';
    this.memory = this.loadMemory();
  }

  loadMemory() {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(this.storageKey) : null;
      return saved ? JSON.parse(saved) : { trades: [], winRate: 85 };
    } catch (e) {
      return { trades: [], winRate: 85 };
    }
  }

  saveMemory() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
    }
  }

  predict(state) {
    const { technicalScore, fundamentalScore } = state;
    // تعديل بسيط بناءً على نسبة النجاح السابقة
    const performanceBias = (this.memory.winRate - 50) / 100;
    return technicalScore + fundamentalScore + performanceBias;
  }

  recordTrade(trade) {
    this.memory.trades.push({ ...trade, time: Date.now() });
    if (this.memory.trades.length > 100) this.memory.trades.shift();
    
    // تحديث نسبة النجاح بشكل تقريبي للتعلم
    const wins = this.memory.trades.filter(t => t.profit > 0).length;
    if (this.memory.trades.length > 0) {
      this.memory.winRate = (wins / this.memory.trades.length) * 100;
    }
    this.saveMemory();
  }

  getStats() {
    return {
      totalTrades: this.memory.trades.length,
      winRate: this.memory.winRate.toFixed(1)
    };
  }
}

export const botBrain = new RLTrader();
