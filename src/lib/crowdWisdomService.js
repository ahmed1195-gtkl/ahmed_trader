import { db } from './firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

/**
 * ═══════════════════════════════════════════════════════════════
 * Crowd Wisdom Service
 * ═══════════════════════════════════════════════════════════════
 * تحليل توجهات المتداولين في المنصة
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * الحصول على توجه السوق لرمز معين
 */
export async function getMarketSentiment(symbol, timeframe = 24) {
  try {
    const startTime = Timestamp.fromDate(new Date(Date.now() - timeframe * 60 * 60 * 1000));
    
    const tradesQuery = query(
      collection(db, 'challenge_trades'),
      where('symbol', '==', symbol),
      where('openTime', '>=', startTime)
    );
    
    const tradesSnap = await getDocs(tradesQuery);
    
    if (tradesSnap.empty) {
      return {
        symbol,
        buyPercent: 50,
        sellPercent: 50,
        totalTrades: 0,
        trend: 'neutral',
        confidence: 'low'
      };
    }

    const trades = tradesSnap.docs.map(doc => doc.data());
    const buyTrades = trades.filter(t => t.type === 'buy').length;
    const sellTrades = trades.filter(t => t.type === 'sell').length;
    const totalTrades = trades.length;

    const buyPercent = (buyTrades / totalTrades) * 100;
    const sellPercent = (sellTrades / totalTrades) * 100;

    let trend = 'neutral';
    let confidence = 'low';

    if (buyPercent > 65) {
      trend = 'bullish';
      confidence = buyPercent > 80 ? 'high' : 'medium';
    } else if (sellPercent > 65) {
      trend = 'bearish';
      confidence = sellPercent > 80 ? 'high' : 'medium';
    }

    // حساب متوسط الربح/الخسارة
    const closedTrades = trades.filter(t => t.status === 'closed');
    const avgProfit = closedTrades.length > 0
      ? closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0) / closedTrades.length
      : 0;

    return {
      symbol,
      buyPercent: parseFloat(buyPercent.toFixed(2)),
      sellPercent: parseFloat(sellPercent.toFixed(2)),
      totalTrades,
      uniqueTraders: new Set(trades.map(t => t.userId)).size,
      trend,
      confidence,
      avgProfit: parseFloat(avgProfit.toFixed(2)),
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error getting market sentiment:', error);
    throw error;
  }
}

/**
 * الحصول على الرموز الأكثر تداولاً
 */
export async function getMostTradedSymbols(limit = 10, timeframe = 24) {
  try {
    const startTime = Timestamp.fromDate(new Date(Date.now() - timeframe * 60 * 60 * 1000));
    
    const tradesQuery = query(
      collection(db, 'challenge_trades'),
      where('openTime', '>=', startTime)
    );
    
    const tradesSnap = await getDocs(tradesQuery);
    
    const symbolCounts = {};
    
    tradesSnap.docs.forEach(doc => {
      const trade = doc.data();
      symbolCounts[trade.symbol] = (symbolCounts[trade.symbol] || 0) + 1;
    });

    const sorted = Object.entries(symbolCounts)
      .map(([symbol, count]) => ({ symbol, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sorted;
  } catch (error) {
    console.error('Error getting most traded symbols:', error);
    return [];
  }
}

/**
 * الحصول على خريطة حرارية للتداول
 */
export async function getTradingHeatmap() {
  try {
    const symbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'BTC/USD'];
    const heatmap = [];

    for (const symbol of symbols) {
      const sentiment = await getMarketSentiment(symbol, 24);
      heatmap.push(sentiment);
    }

    return heatmap.sort((a, b) => b.totalTrades - a.totalTrades);
  } catch (error) {
    console.error('Error getting trading heatmap:', error);
    return [];
  }
}

export default {
  getMarketSentiment,
  getMostTradedSymbols,
  getTradingHeatmap
};
