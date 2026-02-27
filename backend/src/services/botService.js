import cron from 'node-cron';
import priceService from './priceService.js';
import analysisService from './analysisService.js';
import tradingService from './tradingService.js';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

class BotService {
  constructor() {
    this.isRunning = false;
    this.activeSymbols = new Set();
    this.analysisJobs = new Map(); // symbol -> cron job
    this.userSettings = new Map(); // userId -> settings
  }

  async initialize() {
    logger.info('🤖 Initializing Bot Service...');
    
    await tradingService.initialize();
    
    logger.info('✅ Bot Service initialized');
  }

  // Start bot for a user
  async startBot(userId, settings = {}) {
    try {
      const {
        symbols = ['BTCUSDT', 'ETHUSDT', 'EURUSD', 'GBPUSD', 'XAUUSD'],
        timeframe = '1h',
        autoTrade = true,
        analysisInterval = config.analysisInterval,
      } = settings;

      // Save user settings
      this.userSettings.set(userId, { symbols, timeframe, autoTrade, analysisInterval });

      logger.info(`Starting bot for user ${userId} with ${symbols.length} symbols`);

      // Start price streams for all symbols
      symbols.forEach(symbol => {
        if (!this.activeSymbols.has(symbol)) {
          this.startSymbolAnalysis(symbol, userId, timeframe, autoTrade, analysisInterval);
          this.activeSymbols.add(symbol);
        }
      });

      this.isRunning = true;

      return { success: true, message: 'Bot started successfully' };
    } catch (error) {
      logger.error('Failed to start bot', error);
      return { success: false, error: error.message };
    }
  }

  startSymbolAnalysis(symbol, userId, timeframe, autoTrade, interval) {
    logger.info(`Starting analysis for ${symbol} (interval: ${interval}ms)`);

    // Subscribe to price updates
    priceService.subscribe(symbol, async (priceData) => {
      // Price updates are handled automatically
    });

    // Schedule periodic analysis
    const cronExpression = this.getCronExpression(interval);
    const job = cron.schedule(cronExpression, async () => {
      await this.runAnalysis(symbol, userId, timeframe, autoTrade);
    });

    this.analysisJobs.set(symbol, job);

    // Run initial analysis
    setTimeout(() => {
      this.runAnalysis(symbol, userId, timeframe, autoTrade);
    }, 5000);
  }

  async runAnalysis(symbol, userId, timeframe, autoTrade) {
    try {
      const priceData = priceService.getPrice(symbol);
      
      if (!priceData || !priceData.history || priceData.history.length < 20) {
        logger.debug(`Waiting for more price data for ${symbol}...`);
        return;
      }

      // Run analysis
      const analysis = await analysisService.analyze(symbol, priceData, timeframe);
      
      if (!analysis) {
        return;
      }

      // Auto-trade if enabled and confidence is high
      if (autoTrade && analysis.confidence >= 85 && analysis.recommendation !== 'WAIT') {
        const result = await tradingService.openTrade(userId, analysis);
        
        if (result.success) {
          logger.info(`✅ Auto-trade executed: ${symbol} ${analysis.recommendation}`);
        } else {
          logger.debug(`Auto-trade skipped for ${symbol}: ${result.error}`);
        }
      }
    } catch (error) {
      logger.error(`Analysis failed for ${symbol}`, error);
    }
  }

  getCronExpression(intervalMs) {
    // Convert milliseconds to cron expression
    const seconds = Math.floor(intervalMs / 1000);
    
    if (seconds < 60) {
      return `*/${seconds} * * * * *`;
    } else {
      const minutes = Math.floor(seconds / 60);
      return `0 */${minutes} * * * *`;
    }
  }

  // Stop bot for a user
  stopBot(userId) {
    try {
      const settings = this.userSettings.get(userId);
      
      if (!settings) {
        return { success: false, error: 'Bot not running for this user' };
      }

      // Stop analysis jobs for user's symbols
      settings.symbols.forEach(symbol => {
        const job = this.analysisJobs.get(symbol);
        if (job) {
          job.stop();
          this.analysisJobs.delete(symbol);
        }
        
        // Unsubscribe from price updates
        priceService.unsubscribe(symbol, () => {});
        this.activeSymbols.delete(symbol);
      });

      // Close all active trades for user
      const trades = tradingService.getUserTrades(userId);
      trades.forEach(trade => {
        tradingService.closeTrade(trade.id, 'BOT_STOPPED', trade.currentPrice);
      });

      this.userSettings.delete(userId);

      logger.info(`Bot stopped for user ${userId}`);

      return { success: true, message: 'Bot stopped successfully' };
    } catch (error) {
      logger.error('Failed to stop bot', error);
      return { success: false, error: error.message };
    }
  }

  // Get bot status
  getStatus(userId) {
    const settings = this.userSettings.get(userId);
    const isRunning = !!settings;
    
    return {
      isRunning,
      settings: settings || null,
      activeSymbols: settings ? settings.symbols : [],
      activeTrades: isRunning ? tradingService.getUserTrades(userId) : [],
      analyses: isRunning ? analysisService.getAllAnalyses() : {},
    };
  }

  // Cleanup
  cleanup() {
    logger.info('Cleaning up Bot Service...');
    
    // Stop all analysis jobs
    this.analysisJobs.forEach((job, symbol) => {
      job.stop();
    });
    
    // Cleanup price service
    priceService.cleanup();
    
    // Clear caches
    analysisService.clearCache();
    
    this.analysisJobs.clear();
    this.activeSymbols.clear();
    this.userSettings.clear();
    this.isRunning = false;
    
    logger.info('✅ Bot Service cleaned up');
  }
}

export const botService = new BotService();
export default botService;
