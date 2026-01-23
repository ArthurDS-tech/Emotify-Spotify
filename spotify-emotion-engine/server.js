const app = require('./src/app');
const logger = require('./src/utils/logger');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  logger.info(`🎵 Emotion Engine Backend rodando em ${NODE_ENV}`);
  logger.info(`📍 http://localhost:${PORT}`);
  logger.info(`🔐 Spotify OAuth integrado`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido. Encerrando servidor...');
  server.close(() => {
    logger.info('Servidor encerrado');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Promise rejection não tratada:', err);
  process.exit(1);
});