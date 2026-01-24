require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Conectar ao banco de dados
connectDB();

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