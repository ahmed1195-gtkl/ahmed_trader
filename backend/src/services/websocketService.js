import { WebSocketServer } from 'ws';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // userId -> Set of WebSocket connections
  }

  initialize(server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws, req) => {
      logger.info(`New WebSocket connection from ${req.socket.remoteAddress}`);

      ws.isAlive = true;
      ws.userId = null;

      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleMessage(ws, data);
        } catch (error) {
          logger.error('Failed to parse WebSocket message', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        if (ws.userId) {
          this.removeClient(ws.userId, ws);
          logger.info(`WebSocket connection closed for user ${ws.userId}`);
        }
      });

      ws.on('error', (error) => {
        logger.error('WebSocket error', error);
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to Ahmed Trader Backend',
        timestamp: Date.now(),
      }));
    });

    // Heartbeat to detect broken connections
    const heartbeat = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
          logger.warn('Terminating inactive WebSocket connection');
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    this.wss.on('close', () => {
      clearInterval(heartbeat);
    });

    logger.info(`✅ WebSocket Server initialized on port ${config.wsPort}`);
  }

  handleMessage(ws, data) {
    const { type, payload } = data;

    switch (type) {
      case 'auth':
        this.handleAuth(ws, payload);
        break;

      case 'subscribe':
        this.handleSubscribe(ws, payload);
        break;

      case 'unsubscribe':
        this.handleUnsubscribe(ws, payload);
        break;

      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;

      default:
        logger.warn(`Unknown WebSocket message type: ${type}`);
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }
  }

  handleAuth(ws, payload) {
    const { userId } = payload;

    if (!userId) {
      ws.send(JSON.stringify({ type: 'error', message: 'userId is required' }));
      return;
    }

    ws.userId = userId;
    this.addClient(userId, ws);

    ws.send(JSON.stringify({
      type: 'auth_success',
      userId,
      timestamp: Date.now(),
    }));

    logger.info(`User ${userId} authenticated`);
  }

  handleSubscribe(ws, payload) {
    const { channels } = payload;

    if (!ws.userId) {
      ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
      return;
    }

    ws.subscriptions = ws.subscriptions || new Set();
    
    if (Array.isArray(channels)) {
      channels.forEach(channel => ws.subscriptions.add(channel));
    }

    ws.send(JSON.stringify({
      type: 'subscribed',
      channels: Array.from(ws.subscriptions),
      timestamp: Date.now(),
    }));

    logger.debug(`User ${ws.userId} subscribed to channels: ${channels.join(', ')}`);
  }

  handleUnsubscribe(ws, payload) {
    const { channels } = payload;

    if (!ws.subscriptions) return;

    if (Array.isArray(channels)) {
      channels.forEach(channel => ws.subscriptions.delete(channel));
    }

    ws.send(JSON.stringify({
      type: 'unsubscribed',
      channels,
      timestamp: Date.now(),
    }));
  }

  addClient(userId, ws) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId).add(ws);
  }

  removeClient(userId, ws) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete(ws);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  // Broadcast to all connected clients
  broadcast(message) {
    const data = JSON.stringify(message);
    this.wss.clients.forEach((ws) => {
      if (ws.readyState === 1) { // OPEN
        ws.send(data);
      }
    });
  }

  // Send to specific user
  sendToUser(userId, message) {
    const userClients = this.clients.get(userId);
    if (!userClients) return;

    const data = JSON.stringify(message);
    userClients.forEach((ws) => {
      if (ws.readyState === 1) {
        ws.send(data);
      }
    });
  }

  // Send to specific channel subscribers
  sendToChannel(channel, message) {
    const data = JSON.stringify(message);
    this.wss.clients.forEach((ws) => {
      if (ws.subscriptions && ws.subscriptions.has(channel) && ws.readyState === 1) {
        ws.send(data);
      }
    });
  }

  // Send price update
  sendPriceUpdate(symbol, priceData) {
    this.sendToChannel('prices', {
      type: 'price_update',
      symbol,
      data: priceData,
      timestamp: Date.now(),
    });
  }

  // Send analysis update
  sendAnalysisUpdate(symbol, analysis) {
    this.sendToChannel('analysis', {
      type: 'analysis_update',
      symbol,
      data: analysis,
      timestamp: Date.now(),
    });
  }

  // Send trade update
  sendTradeUpdate(userId, trade) {
    this.sendToUser(userId, {
      type: 'trade_update',
      data: trade,
      timestamp: Date.now(),
    });
  }

  // Send bot status update
  sendBotStatus(userId, status) {
    this.sendToUser(userId, {
      type: 'bot_status',
      data: status,
      timestamp: Date.now(),
    });
  }

  cleanup() {
    if (this.wss) {
      this.wss.close();
      logger.info('WebSocket Server closed');
    }
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
