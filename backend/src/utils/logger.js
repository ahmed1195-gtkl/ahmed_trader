import { config } from '../config/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const colors = {
  error: '\x1b[31m',
  warn: '\x1b[33m',
  info: '\x1b[36m',
  debug: '\x1b[90m',
  reset: '\x1b[0m',
};

class Logger {
  constructor() {
    this.level = levels[config.logLevel] || levels.info;
    this.logFile = path.join(logsDir, `bot-${new Date().toISOString().split('T')[0]}.log`);
  }

  _log(level, message, data = null) {
    if (levels[level] > this.level) return;

    const timestamp = new Date().toISOString();
    const color = colors[level];
    const reset = colors.reset;
    
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    const consoleMessage = `${color}${logMessage}${reset}`;
    
    // Console output with colors
    console.log(consoleMessage);
    if (data) {
      console.log(data);
    }

    // File output without colors
    const fileMessage = data 
      ? `${logMessage}\n${JSON.stringify(data, null, 2)}\n`
      : `${logMessage}\n`;
    
    fs.appendFileSync(this.logFile, fileMessage);
  }

  error(message, data) {
    this._log('error', message, data);
  }

  warn(message, data) {
    this._log('warn', message, data);
  }

  info(message, data) {
    this._log('info', message, data);
  }

  debug(message, data) {
    this._log('debug', message, data);
  }
}

export const logger = new Logger();
export default logger;
