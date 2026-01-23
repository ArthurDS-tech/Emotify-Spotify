// === src/middleware/auth.js ===
const TokenManager = require('../utils/tokenManager');
const logger = require('../utils/logger');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = TokenManager.verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    res.status(500).json({ error: 'Erro na autenticação' });
  }
};

module.exports = auth;

// === src/middleware/errorHandler.js ===
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Não autorizado',
      details: err.message
    });
  }

  if (err.response?.status === 401) {
    return res.status(401).json({
      error: 'Token Spotify expirou',
      details: 'Faça login novamente'
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    requestId: req.id
  });
};

module.exports = errorHandler;

// === src/middleware/rateLimiter.js ===
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redisClient = require('../config/redis');

const spotifyLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'spotify-limiter:'
  }),
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 requisições por minuto
  message: 'Muitas requisições para Spotify. Aguarde um minuto.'
});

module.exports = { spotifyLimiter };