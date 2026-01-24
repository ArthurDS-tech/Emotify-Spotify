const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  if (err.code === 11000) {
    return res.status(400).json({ error: 'Dados duplicados' });
  }

  res.status(500).json({ error: 'Erro interno do servidor' });
};

module.exports = errorHandler;