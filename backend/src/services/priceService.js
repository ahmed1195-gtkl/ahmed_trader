import axios from 'axios';
import WebSocket from 'ws';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

class PriceService {
  constructor() {
    this.prices = new Map(); // symbol -> { price, timestamp, history: [] }
    this.websockets = new Map(); // symbol -> WebSocket connection
    this.subscribers = new Map(); // symbol -> Set of callback functions
    this.maxHistoryLength = 150;
  }

  // Subscribe to price updates
  subscribe(symbol, callback) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
      this.startPriceStream(symbol);
    }
    this.subscribers.get(symbol).add(callback);
    
    // Return current price if available
    return this.prices.get(symbol);
  }

  // Unsubscribe from price updates
  unsubscribe(symbol, callback) {
    const subs = this.subscribers.get(symbol);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) {
        this.stopPriceStream(symbol);
        this.subscribers.delete(symbol);
      }
    }
  }

  // Start price stream for a symbol
  startPriceStream(symbol) {
    const isCrypto = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'].includes(symbol);
    
    if (isCrypto) {
      this.startBinanceStream(symbol);
    } else if (symbol === 'XAUUSD') {
      this.startGoldSimulation(symbol);
    } else {
      this.startFinnhubStream(symbol);
    }
  }

  // Binance WebSocket for crypto
  startBinanceStream(symbol) {
    const streamSymbol = symbol.toLowerCase();
    const wsUrl = `wss://stream.binance.com:9443/ws/${streamSymbol}@trade`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.on('open', () => {
      logger.info(`📊 Binance WebSocket connected: ${symbol}`);
    });

    ws.on('message', (data) => {
      try {
        const trade = JSON.parse(data.toString());
        const price = parseFloat(trade.p);
        this.updatePrice(symbol, price);
      } catch (error) {
        logger.error(`Error parsing Binance data for ${symbol}`, error);
      }
    });

    ws.on('error', (error) => {
      logger.error(`Binance WebSocket error for ${symbol}`, error);
      this.fallbackToAPI(symbol);
    });

    ws.on('close', () => {
      logger.warn(`Binance WebSocket closed for ${symbol}, reconnecting...`);
      setTimeout(() => this.startBinanceStream(symbol), 5000);
    });

    this.websockets.set(symbol, ws);
  }

  // Finnhub WebSocket for forex
  startFinnhubStream(symbol) {
    if (!config.finnhubApiKey) {
      logger.warn(`Finnhub API key not configured, using fallback for ${symbol}`);
      this.fallbackToAPI(symbol);
      return;
    }

    const wsUrl = `wss://ws.finnhub.io?token=${config.finnhubApiKey}`;
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'subscribe', symbol }));
      logger.info(`📊 Finnhub WebSocket connected: ${symbol}`);
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'trade' && message.data && message.data.length > 0) {
          const price = message.data[0].p;
          this.updatePrice(symbol, price);
        }
      } catch (error) {
        logger.error(`Error parsing Finnhub data for ${symbol}`, error);
      }
    });

    ws.on('error', (error) => {
      logger.error(`Finnhub WebSocket error for ${symbol}`, error);
      this.fallbackToAPI(symbol);
    });

    ws.on('close', () => {
      logger.warn(`Finnhub WebSocket closed for ${symbol}, reconnecting...`);
      setTimeout(() => this.startFinnhubStream(symbol), 5000);
    });

    this.websockets.set(symbol, ws);
  }

  // Gold simulation (realistic)
  startGoldSimulation(symbol) {
    let basePrice = 2650.0; // Current realistic gold price
    let lastPrice = basePrice;
    
    const updateGoldPrice = () => {
      // Realistic gold volatility: 0.05% - 0.2% per update
      const volatility = 0.001 + Math.random() * 0.0015;
      const direction = Math.random() > 0.5 ? 1 : -1;
      const change = lastPrice * volatility * direction;
      
      lastPrice = lastPrice + change;
      
      // Mean reversion: pull back towards base price
      const meanReversionStrength = 0.001;
      lastPrice += (basePrice - lastPrice) * meanReversionStrength;
      
      // Keep within realistic bounds (±5% from base)
      const minPrice = basePrice * 0.95;
      const maxPrice = basePrice * 1.05;
      lastPrice = Math.max(minPrice, Math.min(maxPrice, lastPrice));
      
      this.updatePrice(symbol, lastPrice);
    };

    // Update every 2 seconds
    const interval = setInterval(updateGoldPrice, 2000);
    this.websockets.set(symbol, { close: () => clearInterval(interval) });
    
    // Initial price
    updateGoldPrice();
    logger.info(`📊 Gold simulation started: ${symbol}`);
  }

  // Fallback to API polling
  fallbackToAPI(symbol) {
    const fetchPrice = async () => {
      try {
        let price;
        
        if (symbol.includes('USDT')) {
          // Binance API fallback
          const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
          price = parseFloat(response.data.price);
        } else {
          // Twelve Data API fallback
          const response = await axios.get(`https://api.twelvedata.com/price`, {
            params: {
              symbol,
              apikey: config.twelveDataApiKey,
            },
          });
          price = parseFloat(response.data.price);
        }
        
        this.updatePrice(symbol, price);
      } catch (error) {
        logger.error(`Failed to fetch price for ${symbol}`, error);
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(fetchPrice, 5000);
    this.websockets.set(symbol, { close: () => clearInterval(interval) });
    
    // Initial fetch
    fetchPrice();
  }

  // Update price and notify subscribers
  updatePrice(symbol, price) {
    const now = Date.now();
    
    // Get or create price data
    let priceData = this.prices.get(symbol);
    if (!priceData) {
      priceData = { price, timestamp: now, history: [] };
      this.prices.set(symbol, priceData);
    }

    // Update current price
    priceData.price = price;
    priceData.timestamp = now;

    // Add to history
    priceData.history.push({ price, timestamp: now });
    
    // Limit history length
    if (priceData.history.length > this.maxHistoryLength) {
      priceData.history.shift();
    }

    // Notify all subscribers
    const subs = this.subscribers.get(symbol);
    if (subs) {
      subs.forEach(callback => {
        try {
          callback({ symbol, price, timestamp: now, history: priceData.history });
        } catch (error) {
          logger.error(`Error in price subscriber callback for ${symbol}`, error);
        }
      });
    }
  }

  // Stop price stream
  stopPriceStream(symbol) {
    const ws = this.websockets.get(symbol);
    if (ws) {
      if (typeof ws.close === 'function') {
        ws.close();
      }
      this.websockets.delete(symbol);
      logger.info(`📊 Price stream stopped: ${symbol}`);
    }
  }

  // Get current price
  getPrice(symbol) {
    return this.prices.get(symbol);
  }

  // Get all prices
  getAllPrices() {
    const result = {};
    this.prices.forEach((data, symbol) => {
      result[symbol] = data;
    });
    return result;
  }

  // Cleanup
  cleanup() {
    this.websockets.forEach((ws, symbol) => {
      this.stopPriceStream(symbol);
    });
    this.prices.clear();
    this.subscribers.clear();
  }
}

export const priceService = new PriceService();
export default priceService;
