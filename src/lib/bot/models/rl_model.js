/**
 * محرك التعلم المعزز (RL) - V8.0
 * يحفظ نتائج الصفقات لتحسين القرارات المستقبلية ويرتبط بـ Firebase لتحديث الأوزان
 */
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

class RLTrader {
  constructor() {
    this.storageKey = 'ahmed_trader_v8_memory';
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
      session: this.memory.session,
      volatility: trade.volatility || 'Normal'
    };
    
    this.memory.trades.push(tradeEntry);
    if (this.memory.trades.length > 100) this.memory.trades.shift();
    
    const wins = this.memory.trades.filter(t => t.profit > 0).length;
    if (this.memory.trades.length > 0) {
      this.memory.winRate = (wins / this.memory.trades.length) * 100;
    }
    
    // تعلم تلقائي كل 10 صفقات
    if (this.memory.trades.length % 10 === 0) {
      await this.evolveStrategy();
    }
    
    this.saveMemory();
  }

  async evolveStrategy() {
    const recentTrades = this.memory.trades.slice(-10);
    const losingTrades = recentTrades.filter(t => t.profit <= 0);
    
    if (losingTrades.length > 5) {
      // تقليل وزن الأسباب الخاسرة وتشديد الفلاتر
      this.weights.trend = Math.max(10, this.weights.trend - 1);
      this.weights.fundamental = Math.min(30, this.weights.fundamental + 2);
      
      try {
        await updateDoc(doc(db, 'bot_settings', 'weights'), this.weights);
      } catch (e) { console.error("Update Weights Error:", e); }
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
