import { LiveTradeMonitor } from '../models/trading/liveTradeMonitor.js';
import firebaseService from './firebaseService.js';

// Simple risk management calculator
function calculateRiskManagement({ entryPrice, recommendation, accountSize, riskPercent }) {
  const riskAmount = accountSize * (riskPercent / 100);
  const stopLossPercent = 0.02; // 2%
  const takeProfitPercent = 0.06; // 6% (1:3 risk:reward)
  
  return {
    lotSize: 0.01, // Standard micro lot
    stopLoss: recommendation === 'BUY' 
      ? entryPrice * (1 - stopLossPercent)
      : entryPrice * (1 + stopLossPercent),
    takeProfit: recommendation === 'BUY'
      ? entryPrice * (1 + takeProfitPercent)
      : entryPrice * (1 - takeProfitPercent),
    riskAmount,
  };
}
import priceService from './priceService.js';
import logger from '../utils/logger.js';

class TradingService {
  constructor() {
    this.activeTrades = new Map(); // tradeId -> trade object
    this.userTrades = new Map(); // userId -> Set of tradeIds
    this.tradeMonitor = new LiveTradeMonitor();
    this.maxTradesPerUser = 5;
  }

  async initialize() {
    logger.info('Initializing Trading Service...');
    
    // Load active trades from Firebase
    // This will be implemented when we integrate with real user system
    
    logger.info('✅ Trading Service initialized');
  }

  async openTrade(userId, analysis) {
    try {
      // Check if user has reached max trades
      const userTradeIds = this.userTrades.get(userId) || new Set();
      if (userTradeIds.size >= this.maxTradesPerUser) {
        logger.warn(`User ${userId} has reached max trades limit`);
        return { success: false, error: 'Max trades limit reached' };
      }

      // Check if confidence is high enough
      if (analysis.confidence < 85) {
        logger.info(`Confidence too low for ${analysis.symbol}: ${analysis.confidence}%`);
        return { success: false, error: 'Confidence too low' };
      }

      // Calculate risk management
      const riskParams = calculateRiskManagement({
        entryPrice: analysis.price,
        recommendation: analysis.recommendation,
        accountSize: 10000, // Default, should come from user settings
        riskPercent: 1,
      });

      // Create trade object
      const trade = {
        id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        symbol: analysis.symbol,
        type: analysis.recommendation,
        status: 'active',
        entryPrice: analysis.price,
        currentPrice: analysis.price,
        lotSize: riskParams.lotSize,
        takeProfit: riskParams.takeProfit,
        stopLoss: riskParams.stopLoss,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        openedAt: Date.now(),
        profit: 0,
        profitPercent: 0,
      };

      // Save to Firebase
      const tradeId = await firebaseService.saveTrade(userId, trade);
      trade.firebaseId = tradeId;

      // Add to active trades
      this.activeTrades.set(trade.id, trade);
      
      // Add to user trades
      if (!this.userTrades.has(userId)) {
        this.userTrades.set(userId, new Set());
      }
      this.userTrades.get(userId).add(trade.id);

      // Start monitoring
      this.monitorTrade(trade);

      logger.info(`Trade opened: ${trade.id} - ${trade.symbol} ${trade.type} @ ${trade.entryPrice}`);

      return { success: true, trade };
    } catch (error) {
      logger.error('Failed to open trade', error);
      return { success: false, error: error.message };
    }
  }

  monitorTrade(trade) {
    // Subscribe to price updates
    priceService.subscribe(trade.symbol, (priceData) => {
      this.updateTrade(trade.id, priceData.price);
    });
  }

  updateTrade(tradeId, currentPrice) {
    const trade = this.activeTrades.get(tradeId);
    if (!trade || trade.status !== 'active') return;

    // Update current price
    trade.currentPrice = currentPrice;

    // Calculate profit
    const priceDiff = trade.type === 'BUY' 
      ? currentPrice - trade.entryPrice
      : trade.entryPrice - currentPrice;
    
    trade.profit = priceDiff * trade.lotSize * 100000; // Assuming forex standard lot
    trade.profitPercent = (priceDiff / trade.entryPrice) * 100;

    // Check if TP or SL hit
    if (trade.type === 'BUY') {
      if (currentPrice >= trade.takeProfit) {
        this.closeTrade(tradeId, 'TP_HIT', currentPrice);
      } else if (currentPrice <= trade.stopLoss) {
        this.closeTrade(tradeId, 'SL_HIT', currentPrice);
      }
    } else if (trade.type === 'SELL') {
      if (currentPrice <= trade.takeProfit) {
        this.closeTrade(tradeId, 'TP_HIT', currentPrice);
      } else if (currentPrice >= trade.stopLoss) {
        this.closeTrade(tradeId, 'SL_HIT', currentPrice);
      }
    }

    // Update in Firebase (throttled)
    if (!trade.lastUpdate || Date.now() - trade.lastUpdate > 5000) {
      firebaseService.updateTrade(trade.firebaseId, {
        currentPrice: trade.currentPrice,
        profit: trade.profit,
        profitPercent: trade.profitPercent,
      }).catch(err => logger.error('Failed to update trade in Firebase', err));
      
      trade.lastUpdate = Date.now();
    }
  }

  async closeTrade(tradeId, reason, closePrice) {
    const trade = this.activeTrades.get(tradeId);
    if (!trade) return;

    trade.status = 'closed';
    trade.closePrice = closePrice;
    trade.closedAt = Date.now();
    trade.closeReason = reason;

    // Calculate final profit
    const priceDiff = trade.type === 'BUY' 
      ? closePrice - trade.entryPrice
      : trade.entryPrice - closePrice;
    
    trade.profit = priceDiff * trade.lotSize * 100000;
    trade.profitPercent = (priceDiff / trade.entryPrice) * 100;
    trade.isWin = trade.profit > 0;

    // Update in Firebase
    await firebaseService.updateTrade(trade.firebaseId, {
      status: 'closed',
      closePrice,
      closedAt: trade.closedAt,
      closeReason: reason,
      profit: trade.profit,
      profitPercent: trade.profitPercent,
      isWin: trade.isWin,
    });

    // Save to learning system
    await firebaseService.saveBotLearning(trade.userId, {
      symbol: trade.symbol,
      type: trade.type,
      entryPrice: trade.entryPrice,
      closePrice,
      profit: trade.profit,
      confidence: trade.confidence,
      reasoning: trade.reasoning,
      isWin: trade.isWin,
    });

    // Remove from active trades
    this.activeTrades.delete(tradeId);
    
    // Remove from user trades
    const userTradeIds = this.userTrades.get(trade.userId);
    if (userTradeIds) {
      userTradeIds.delete(tradeId);
    }

    // Unsubscribe from price updates
    priceService.unsubscribe(trade.symbol, () => {});

    logger.info(`Trade closed: ${tradeId} - ${reason} - Profit: $${trade.profit.toFixed(2)} (${trade.profitPercent.toFixed(2)}%)`);

    return trade;
  }

  getUserTrades(userId) {
    const userTradeIds = this.userTrades.get(userId) || new Set();
    const trades = [];
    
    userTradeIds.forEach(tradeId => {
      const trade = this.activeTrades.get(tradeId);
      if (trade) {
        trades.push(trade);
      }
    });

    return trades;
  }

  getAllActiveTrades() {
    return Array.from(this.activeTrades.values());
  }

  getTradeById(tradeId) {
    return this.activeTrades.get(tradeId);
  }
}

export const tradingService = new TradingService();
export default tradingService;
