const fs = require('fs');
const path = require('path');

const logDir = 'logs';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const levels = { error: 0, warn: 1, info: 2 };
const currentLevel = levels[process.env.LOG_LEVEL || 'info'];

const log = (level, message, data = '') => {
  if (currentLevel >= levels[level]) {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] [${level.toUpperCase()}] ${message} ${data}`;
    console[level === 'error' ? 'error' : 'log'](logMsg);
    fs.appendFileSync(path.join(logDir, 'app.log'), logMsg + '\n');
  }
};

module.exports = {
  error: (msg, data) => log('error', msg, data),
  warn: (msg, data) => log('warn', msg, data),
  info: (msg, data) => log('info', msg, data)
};
