const rateLimit = require('express-rate-limit');

const spotifyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 requests por minuto
  message: 'Muitas requisições para Spotify API',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas de login
  message: 'Muitas tentativas de login',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { spotifyLimiter, authLimiter };