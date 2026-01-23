const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error('Error:', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: err.message });
  }

  if (err.response?.status === 401) {
    return res.status(401).json({ error: 'Spotify token expired' });
  }

  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
};
