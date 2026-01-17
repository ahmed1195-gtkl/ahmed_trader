/**
 * محرك التعلم المعزز المتقدم (Advanced RL Engine)
 * يقوم بحفظ الصفقات في التخزين المحلي (LocalStorage) للتعلم المستمر
 */

class RLTrader {
  constructor() {
    this.storageKey = 'ahmed_trader_memory';
    this.memory = this.loadMemory();
    this.learningRate = 0.1;
  }

  loadMemory() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : { trades: [], weights: { tech: 0.5, fund: 0.5 }, performance: 0 };
  }

  saveMemory() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
  }

  // التنبؤ بناءً على الخبرة الحقيقية
  predict(state) {
    const { technicalScore, fundamentalScore } = state;
    const bias = (this.memory.performance / 100) * 0.1; // تعديل بناءً على الأداء السابق
    
    // حساب النتيجة المرجحة
    const score = (technicalScore * this.memory.weights.tech) + 
                  (fundamentalScore * this.memory.weights.fund) + 
                  bias;
    
    return score;
  }

  // التعلم من نتيجة صفقة حقيقية
  recordTrade(trade) {
    this.memory.trades.push({
      ...trade,
      timestamp: Date.now()
    });

    // الاحتفاظ بآخر 500 صفقة فقط للتعلم
    if (this.memory.trades.length > 500) this.memory.trades.shift();

    // تحديث الأوزان بناءً على النتيجة (إذا كانت رابحة، نعزز العوامل التي أدت إليها)
    const reward = trade.profit > 0 ? 1 : -1;
    if (reward > 0) {
      this.memory.weights.tech += 0.01;
      this.memory.weights.fund += 0.01;
    } else {
      this.memory.weights.tech -= 0.01;
      this.memory.weights.fund -= 0.01;
    }

    // تحديث نسبة النجاح الإجمالية
    const wins = this.memory.trades.filter(t => t.profit > 0).length;
    this.memory.performance = (wins / this.memory.trades.length) * 100;

    this.saveMemory();
  }

  getStats() {
    return {
      totalTrades: this.memory.trades.length,
      winRate: this.memory.performance.toFixed(2),
      experienceLevel: this.memory.trades.length > 100 ? 'Expert' : 'Learning'
    };
  }
}

export const botBrain = new RLTrader();
