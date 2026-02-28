import botService from '../services/botService.js';
import tradingService from '../services/tradingService.js';
import analysisService from '../services/analysisService.js';
import priceService from '../services/priceService.js';
import logger from '../utils/logger.js';

export const botController = {
  // Start bot
  async startBot(req, res) {
    try {
      const { userId, settings } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const result = await botService.startBot(userId, settings);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error('Failed to start bot', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Stop bot
  async stopBot(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const result = botService.stopBot(userId);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error('Failed to stop bot', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get bot status
  async getStatus(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const status = botService.getStatus(userId);
      res.json(status);
    } catch (error) {
      logger.error('Failed to get bot status', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get prices
  async getPrices(req, res) {
    try {
      const { symbol } = req.query;

      if (symbol) {
        const price = priceService.getPrice(symbol);
        if (!price) {
          return res.status(404).json({ error: 'Symbol not found' });
        }
        res.json({ symbol, ...price });
      } else {
        const prices = priceService.getAllPrices();
        res.json(prices);
      }
    } catch (error) {
      logger.error('Failed to get prices', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get analysis
  async getAnalysis(req, res) {
    try {
      const { symbol } = req.query;

      if (symbol) {
        const analysis = analysisService.getLastAnalysis(symbol);
        if (!analysis) {
          return res.status(404).json({ error: 'No analysis available for this symbol' });
        }
        res.json(analysis);
      } else {
        const analyses = analysisService.getAllAnalyses();
        res.json(analyses);
      }
    } catch (error) {
      logger.error('Failed to get analysis', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get trades
  async getTrades(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const trades = tradingService.getUserTrades(userId);
      res.json(trades);
    } catch (error) {
      logger.error('Failed to get trades', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Close trade manually
  async closeTrade(req, res) {
    try {
      const { tradeId, reason } = req.body;

      if (!tradeId) {
        return res.status(400).json({ error: 'tradeId is required' });
      }

      const trade = tradingService.getTradeById(tradeId);
      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      const closedTrade = await tradingService.closeTrade(
        tradeId,
        reason || 'MANUAL_CLOSE',
        trade.currentPrice
      );

      res.json({ success: true, trade: closedTrade });
    } catch (error) {
      logger.error('Failed to close trade', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get news
  async getNews(req, res) {
    try {
      const { query, timeframe } = req.query;
      const news = await analysisService.getNews(query || 'crypto', timeframe || 'daily');
      res.json(news);
    } catch (error) {
      logger.error('Failed to get news', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Health check
  async healthCheck(req, res) {
    res.json({
      status: 'ok',
      timestamp: Date.now(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  },
};

export default botController;
