// === src/utils/logger.js ===
const fs = require('fs');
const path = require('path');

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = logLevels[process.env.LOG_LEVEL || 'info'];

const formatLog = (level, message, data = '') => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message} ${data}`;
};

const logger = {
  error: (message, data) => {
    if (currentLevel >= logLevels.error) {
      const log = formatLog('error', message, data);
      console.error(log);
      fs.appendFileSync(path.join(logDir, 'app.log'), log + '\n');
    }
  },
  warn: (message, data) => {
    if (currentLevel >= logLevels.warn) {
      const log = formatLog('warn', message, data);
      console.warn(log);
      fs.appendFileSync(path.join(logDir, 'app.log'), log + '\n');
    }
  },
  info: (message, data) => {
    if (currentLevel >= logLevels.info) {
      const log = formatLog('info', message, data);
      console.log(log);
      fs.appendFileSync(path.join(logDir, 'app.log'), log + '\n');
    }
  },
  debug: (message, data) => {
    if (currentLevel >= logLevels.debug) {
      const log = formatLog('debug', message, data);
      console.log(log);
    }
  }
};

module.exports = logger;

// === src/utils/tokenManager.js ===
const jwt = require('jsonwebtoken');
const logger = require('./logger');

class TokenManager {
  static generateAccessToken(userId, spotifyId) {
    return jwt.sign(
      { userId, spotifyId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
  }

  static generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d' }
    );
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      logger.error('Token verification failed:', error.message);
      return null;
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      logger.error('Refresh token verification failed:', error.message);
      return null;
    }
  }

  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}

module.exports = TokenManager;

// === src/utils/validators.js ===
const Joi = require('joi');

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  emotionQuery: Joi.object({
    period: Joi.string().valid('short_term', 'medium_term', 'long_term'),
    limit: Joi.number().min(1).max(50),
    offset: Joi.number().min(0)
  })
};

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    return {
      valid: false,
      errors: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    };
  }
  return { valid: true, value };
};

module.exports = { schemas, validate };