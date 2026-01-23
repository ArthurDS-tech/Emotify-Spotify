const rateLimit = require('express-rate-limit');

module.exports = {
  spotifyLimiter: rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: 'Too many requests',
    standardHeaders: true,
    legacyHeaders: false
  })
};
