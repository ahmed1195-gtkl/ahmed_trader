import express from 'express';
import http from 'http';
import { config } from './config/index.js';
import logger from './utils/logger.js';
import firebaseService from './services/firebaseService.js';
import botService from './services/botService.js';
import websocketService from './services/websocketService.js';
import botController from './controllers/botController.js';
import marketIntelligenceRoutes from './routes/marketIntelligenceRoutes.js';
import { checkAuth, requireOwnership } from './middleware/authMiddleware.js';

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.VITE_SITE_URL || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

// ── Public Routes (no auth required) ───────────────────────────────────────
app.get('/health', botController.healthCheck);
app.get('/api/prices', botController.getPrices);
app.get('/api/analysis', botController.getAnalysis);
app.get('/api/news', botController.getNews);

// ── Protected Routes (require valid Firebase ID token + ownership) ──────────
// Bot control — user can only start/stop/check their own bot
app.post('/api/bot/start',  checkAuth, requireOwnership, botController.startBot);
app.post('/api/bot/stop',   checkAuth, requireOwnership, botController.stopBot);
app.get('/api/bot/status',  checkAuth, requireOwnership, botController.getStatus);

// Trades — user can only view/close their own trades
app.get('/api/trades',        checkAuth, requireOwnership, botController.getTrades);
app.post('/api/trades/close', checkAuth, botController.closeTrade);

// Market Intelligence Routes (requires auth)
app.use('/api/market-intelligence', checkAuth, marketIntelligenceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize services
async function initialize() {
  try {
    logger.info('🚀 Starting Ahmed Trader Backend...');
    
    // Initialize Firebase
    firebaseService.initialize();
    
    // Initialize Bot Service
    await botService.initialize();
    
    // Initialize WebSocket Server
    websocketService.initialize(server);
    
    // Start HTTP server
    server.listen(config.port, () => {
      logger.info(`✅ HTTP Server listening on port ${config.port}`);
      logger.info(`✅ WebSocket Server listening on port ${config.wsPort}`);
      logger.info(`✅ Ahmed Trader Backend is ready!`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to initialize server', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  server.close(() => {
    logger.info('HTTP server closed');
    
    botService.cleanup();
    websocketService.cleanup();
    
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  
  server.close(() => {
    logger.info('HTTP server closed');
    
    botService.cleanup();
    websocketService.cleanup();
    
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, promise });
});

// Start the server
initialize();
