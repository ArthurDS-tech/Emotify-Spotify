const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost')) {
      logger.warn('MongoDB local não disponível, usando modo mock');
      return null;
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('✅ MongoDB conectado');
    return mongoose.connection;
  } catch (error) {
    logger.warn('⚠️ MongoDB não disponível, continuando sem persistência:', error.message);
    return null;
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB desconectado');
  }
};

module.exports = { connectDB, disconnectDB };