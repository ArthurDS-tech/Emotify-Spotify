const mongoose = require('mongoose');
const logger = require('../utils/logger');

let connected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/emotion-engine', {
      serverSelectionTimeoutMS: 5000
    });
    logger.info('MongoDB connected');
    connected = true;
  } catch (error) {
    logger.warn('MongoDB unavailable - demo mode');
    connected = false;
  }
};

const disconnectDB = async () => {
  if (connected) await mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB };
