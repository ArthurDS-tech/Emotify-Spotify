const redis = require('redis');
const logger = require('../utils/logger');

let client;

try {
  client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB) || 0,
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        logger.error('Redis connection refused');
        return new Error('Redis connection refused');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error('Redis retry time exhausted');
      }
      return Math.min(options.attempt * 100, 3000);
    }
  });

  client.on('error', (err) => {
    logger.error('Redis error:', err.message);
  });

  client.on('connect', () => {
    logger.info('✅ Redis conectado');
  });

  // Conectar ao Redis
  client.connect().catch(err => {
    logger.error('Erro ao conectar Redis:', err.message);
  });
} catch (error) {
  logger.error('Erro ao inicializar Redis:', error.message);
  // Criar cliente mock se Redis não estiver disponível
  client = {
    get: () => Promise.resolve(null),
    setEx: () => Promise.resolve('OK'),
    del: () => Promise.resolve(1),
    keys: () => Promise.resolve([])
  };
}

module.exports = client;