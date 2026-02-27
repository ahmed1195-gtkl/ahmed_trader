/**
 * محرك التعلم المعزز (RL) - V11.0 المحسن
 * يحسن الأوزان بناءً على الأداء الفعلي ويرتبط بـ Firebase
 */
import { db } from './../firebase';

class RLTrader {
  constructor() {
    this.storageKey = 'ahmed_trader_v11_memory';
    this.memory = this.loadMemory();
    this.weights = {
      trend: 25,
      entryModel: 20,
      momentum: 15,
      volume: 10,
      fundamental: 15,
      multiTF: 15
    };
    this.syncWeightsWithFirebase();
  }

  async syncWeightsWithFirebase() {
    try {
      const docRef = doc(db, 'bot_settings', 'weights');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.weights = docSnap.data();
      } else {
        await setDoc(docRef, this.weights);
      }
    } catch (e) {
      console.error("Firebase Sync Error:", e);
    }
  }

  loadMemory() {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(this.storageKey) : null;
      return saved ? JSON.parse(saved) : { trades: [], winRate: 85, session: Date.now() };
    } catch (e) {
      return { trades: [], winRate: 85, session: Date.now() };
    }
  }

  saveMemory() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
    }
  }

  async recordTrade(trade) {
    const tradeEntry = { 
      ...trade, 
      time: Date.now(),
      session: this.memory.session
    };
    
    this.memory.trades.push(tradeEntry);
    if (this.memory.trades.length > 100) this.memory.trades.shift();
    
    const wins = this.memory.trades.filter(t => t.profit > 0).length;
    if (this.memory.trades.length > 0) {
      this.memory.winRate = (wins / this.memory.trades.length) * 100;
    }
    
    // تعلم أكثر ذكاءً كل 5 صفقات
    if (this.memory.trades.length % 5 === 0) {
      await this.evolveStrategy();
    }
    
    this.saveMemory();
  }

  async evolveStrategy() {
    const recentTrades = this.memory.trades.slice(-10);
    if (recentTrades.length < 5) return;

    const winRate = (recentTrades.filter(t => t.profit > 0).length / recentTrades.length) * 100;
    
    // إذا كان معدل الفوز منخفضاً، نقوم بتعديل الأوزان
    if (winRate < 70) {
      // زيادة وزن التحليل الفني والاتجاه لتقليل المخاطرة
      this.weights.trend = Math.min(40, this.weights.trend + 2);
      this.weights.entryModel = Math.min(30, this.weights.entryModel + 1);
      this.weights.fundamental = Math.min(25, this.weights.fundamental + 1);
      
      // تقليل وزن الزخم والسيولة لأنهما قد يكونان خادعين في التذبذب
      this.weights.momentum = Math.max(10, this.weights.momentum - 1);
      this.weights.volume = Math.max(5, this.weights.volume - 1);
    } else if (winRate > 90) {
      // إذا كان الأداء ممتازاً، نحافظ على الأوزان مع تعديلات طفيفة للتحسين
      this.weights.multiTF = Math.min(25, this.weights.multiTF + 1);
    }
    
    try {
      await updateDoc(doc(db, 'bot_settings', 'weights'), this.weights);
    } catch (e) { 
      console.error("Update Weights Error:", e); 
    }
  }

  getStats() {
    return {
      totalTrades: this.memory.trades.length,
      winRate: typeof this.memory.winRate === 'number' ? this.memory.winRate.toFixed(1) : "85.0"
    };
  }
}

export const botBrain = new RLTrader();
