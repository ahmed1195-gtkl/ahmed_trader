/**
 * خدمة تسجيل الصفقات والتعلم
 * يسجل كل صفقة يقوم بها البوت ويتعلم من النتائج
 */

import { db } from '../../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

/**
 * تسجيل صفقة جديدة
 */
export async function logTrade(tradeData) {
  try {
    const {
      userId,
      symbol,
      action, // 'BUY' or 'SELL'
      entryPrice,
      stopLoss,
      takeProfit,
      positionSize,
      leverage,
      timeframe,
      confidence,
      indicators,
      sentiment,
      newsImpact,
      reason
    } = tradeData;

    // حفظ الصفقة في Firebase
    const tradeRef = await addDoc(collection(db, 'bot_trades'), {
      userId: userId || 'anonymous',
      symbol,
      action,
      entryPrice,
      currentPrice: entryPrice,
      stopLoss,
      takeProfit,
      positionSize,
      leverage: leverage || 1,
      timeframe,
      confidence,
      indicators: indicators || {},
      sentiment: sentiment || 'neutral',
      newsImpact: newsImpact || 'low',
      reason: reason || 'AI Decision',
      status: 'open',
      openedAt: serverTimestamp(),
      closedAt: null,
      pnl: 0,
      pnlPercentage: 0,
      outcome: null, // 'win', 'loss', 'breakeven'
      learningData: {
        marketCondition: 'unknown',
        volatility: 0,
        volume: 0
      }
    });

    console.log('✅ Trade logged:', tradeRef.id);

    return {
      success: true,
      tradeId: tradeRef.id
    };
  } catch (error) {
    console.error('❌ Error logging trade:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * تحديث صفقة موجودة
 */
export async function updateTrade(tradeId, updates) {
  try {
    const tradeRef = doc(db, 'bot_trades', tradeId);
    
    await updateDoc(tradeRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Trade updated:', tradeId);

    return {
      success: true
    };
  } catch (error) {
    console.error('❌ Error updating trade:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * إغلاق صفقة وحساب النتيجة
 */
export async function closeTrade(tradeId, closePrice, reason = 'Manual Close') {
  try {
    const tradeRef = doc(db, 'bot_trades', tradeId);
    
    // جلب بيانات الصفقة الحالية
    const tradeDoc = await getDocs(query(collection(db, 'bot_trades'), where('__name__', '==', tradeId)));
    
    if (tradeDoc.empty) {
      throw new Error('Trade not found');
    }

    const tradeData = tradeDoc.docs[0].data();

    // حساب الربح/الخسارة
    const pnl = calculatePnL(
      tradeData.action,
      tradeData.entryPrice,
      closePrice,
      tradeData.positionSize,
      tradeData.leverage
    );

    const pnlPercentage = ((closePrice - tradeData.entryPrice) / tradeData.entryPrice) * 100 * 
                          (tradeData.action === 'SELL' ? -1 : 1);

    // تحديد النتيجة
    let outcome = 'breakeven';
    if (pnl > 0) outcome = 'win';
    if (pnl < 0) outcome = 'loss';

    // تحديث الصفقة
    await updateDoc(tradeRef, {
      currentPrice: closePrice,
      status: 'closed',
      closedAt: serverTimestamp(),
      closeReason: reason,
      pnl,
      pnlPercentage,
      outcome
    });

    console.log(`✅ Trade closed: ${tradeId} | Outcome: ${outcome} | P&L: ${pnl}`);

    // التعلم من النتيجة
    await learnFromTrade(tradeId, tradeData, outcome, pnl);

    return {
      success: true,
      outcome,
      pnl,
      pnlPercentage
    };
  } catch (error) {
    console.error('❌ Error closing trade:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * حساب الربح/الخسارة
 */
function calculatePnL(action, entryPrice, exitPrice, positionSize, leverage = 1) {
  const priceDiff = action === 'BUY' 
    ? (exitPrice - entryPrice) 
    : (entryPrice - exitPrice);
  
  return priceDiff * positionSize * leverage;
}

/**
 * التعلم من الصفقة
 */
async function learnFromTrade(tradeId, tradeData, outcome, pnl) {
  try {
    // حفظ بيانات التعلم
    await addDoc(collection(db, 'bot_learning'), {
      tradeId,
      symbol: tradeData.symbol,
      action: tradeData.action,
      timeframe: tradeData.timeframe,
      confidence: tradeData.confidence,
      indicators: tradeData.indicators,
      sentiment: tradeData.sentiment,
      newsImpact: tradeData.newsImpact,
      outcome,
      pnl,
      pnlPercentage: tradeData.pnlPercentage || 0,
      timestamp: serverTimestamp(),
      // بيانات إضافية للتعلم
      features: {
        entryPrice: tradeData.entryPrice,
        stopLoss: tradeData.stopLoss,
        takeProfit: tradeData.takeProfit,
        leverage: tradeData.leverage
      }
    });

    console.log('🧠 Learning data saved for trade:', tradeId);
  } catch (error) {
    console.error('❌ Error saving learning data:', error);
  }
}

/**
 * جلب إحصائيات التعلم
 */
export async function getLearningStats(userId, symbol = null, limit = 100) {
  try {
    let q = query(
      collection(db, 'bot_learning'),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limit)
    );

    if (symbol) {
      q = query(q, where('symbol', '==', symbol));
    }

    const snapshot = await getDocs(q);
    const learningData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // حساب الإحصائيات
    const totalTrades = learningData.length;
    const wins = learningData.filter(t => t.outcome === 'win').length;
    const losses = learningData.filter(t => t.outcome === 'loss').length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    
    const totalPnL = learningData.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const avgPnL = totalTrades > 0 ? totalPnL / totalTrades : 0;

    // أفضل الإعدادات
    const bestSettings = analyzeBestSettings(learningData);

    return {
      success: true,
      stats: {
        totalTrades,
        wins,
        losses,
        winRate: winRate.toFixed(2),
        totalPnL: totalPnL.toFixed(2),
        avgPnL: avgPnL.toFixed(2),
        bestSettings
      },
      recentTrades: learningData.slice(0, 10)
    };
  } catch (error) {
    console.error('❌ Error getting learning stats:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * تحليل أفضل الإعدادات
 */
function analyzeBestSettings(learningData) {
  if (learningData.length === 0) {
    return {
      bestTimeframe: 'Unknown',
      bestAction: 'Unknown',
      bestSentiment: 'Unknown'
    };
  }

  // تحليل الإطار الزمني الأفضل
  const timeframeStats = {};
  learningData.forEach(trade => {
    if (!timeframeStats[trade.timeframe]) {
      timeframeStats[trade.timeframe] = { wins: 0, total: 0 };
    }
    timeframeStats[trade.timeframe].total++;
    if (trade.outcome === 'win') {
      timeframeStats[trade.timeframe].wins++;
    }
  });

  let bestTimeframe = 'Unknown';
  let bestTimeframeWinRate = 0;
  Object.entries(timeframeStats).forEach(([tf, stats]) => {
    const winRate = (stats.wins / stats.total) * 100;
    if (winRate > bestTimeframeWinRate) {
      bestTimeframeWinRate = winRate;
      bestTimeframe = tf;
    }
  });

  // تحليل الاتجاه الأفضل
  const buyWins = learningData.filter(t => t.action === 'BUY' && t.outcome === 'win').length;
  const buyTotal = learningData.filter(t => t.action === 'BUY').length;
  const sellWins = learningData.filter(t => t.action === 'SELL' && t.outcome === 'win').length;
  const sellTotal = learningData.filter(t => t.action === 'SELL').length;

  const buyWinRate = buyTotal > 0 ? (buyWins / buyTotal) * 100 : 0;
  const sellWinRate = sellTotal > 0 ? (sellWins / sellTotal) * 100 : 0;

  const bestAction = buyWinRate > sellWinRate ? 'BUY' : 'SELL';

  return {
    bestTimeframe,
    bestTimeframeWinRate: bestTimeframeWinRate.toFixed(2),
    bestAction,
    buyWinRate: buyWinRate.toFixed(2),
    sellWinRate: sellWinRate.toFixed(2)
  };
}

/**
 * جلب الصفقات المفتوحة
 */
export async function getOpenTrades(userId) {
  try {
    const q = query(
      collection(db, 'bot_trades'),
      where('status', '==', 'open'),
      where('userId', '==', userId || 'anonymous'),
      orderBy('openedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const trades = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      trades
    };
  } catch (error) {
    console.error('❌ Error getting open trades:', error);
    return {
      success: false,
      error: error.message,
      trades: []
    };
  }
}

/**
 * جلب تاريخ الصفقات
 */
export async function getTradeHistory(userId, limit = 50) {
  try {
    const q = query(
      collection(db, 'bot_trades'),
      where('userId', '==', userId || 'anonymous'),
      orderBy('openedAt', 'desc'),
      firestoreLimit(limit)
    );

    const snapshot = await getDocs(q);
    const trades = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      trades
    };
  } catch (error) {
    console.error('❌ Error getting trade history:', error);
    return {
      success: false,
      error: error.message,
      trades: []
    };
  }
}
