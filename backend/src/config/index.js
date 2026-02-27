import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from both backend and parent directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load parent .env first (contains Firebase and API keys)
dotenv.config({ path: join(__dirname, '../../../.env') });
// Then load backend .env (can override if needed)
dotenv.config({ path: join(__dirname, '../../.env') });

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  wsPort: parseInt(process.env.WS_PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Trading
  analysisInterval: parseInt(process.env.ANALYSIS_INTERVAL_MS || '60000', 10),
  maxConcurrentTrades: parseInt(process.env.MAX_CONCURRENT_TRADES || '5', 10),
  defaultRiskPercent: parseFloat(process.env.DEFAULT_RISK_PERCENT || '1'),

  // API Keys
  twelveDataApiKey: process.env.VITE_TWELVE_DATA_API_KEY,
  finnhubApiKey: process.env.VITE_FINNHUB_API_KEY,
  gnewsApiKey: process.env.VITE_GNEWS_API_KEY,
  currentsApiKey: process.env.VITE_CURRENTS_API_KEY,
  cryptopanicApiKey: process.env.VITE_CRYPTOPANIC_API_KEY,

  // Firebase
  firebase: {
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required configuration
const requiredKeys = [
  'twelveDataApiKey',
  'finnhubApiKey',
  'firebase.projectId',
];

for (const key of requiredKeys) {
  const keys = key.split('.');
  let value = config;
  for (const k of keys) {
    value = value[k];
  }
  if (!value) {
    console.warn(`⚠️  Warning: ${key} is not configured`);
  }
}

export default config;
