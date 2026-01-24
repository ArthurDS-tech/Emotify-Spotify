const redisClient = require('../config/redis');
const logger = require('../utils/logger');

class CacheService {
  static async get(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error.message);
      return null;
    }
  }

  static async set(key, value, expiresIn = 3600) {
    try {
      await redisClient.setEx(key, expiresIn, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache set error:', error.message);
      return false;
    }
  }

  static async delete(key) {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error.message);
      return false;
    }
  }

  static async invalidateUserCache(userId) {
    try {
      const keys = await redisClient.keys(`emotion:${userId}:*`);
      if (keys.length) {
        await redisClient.del(keys);
      }
      return true;
    } catch (error) {
      logger.error('Cache invalidation error:', error.message);
      return false;
    }
  }
}

module.exports = CacheService;