// === src/services/spotifyService.js ===
const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../config/spotify');

class SpotifyService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getTopTracks(period = 'medium_term', limit = 50) {
    try {
      const response = await this.client.get('/me/top/tracks', {
        params: { time_range: period, limit, offset: 0 }
      });
      return response.data.items;
    } catch (error) {
      logger.error('Error fetching top tracks:', error.message);
      throw error;
    }
  }

  async getRecentlyPlayed(limit = 50) {
    try {
      const response = await this.client.get('/me/player/recently-played', {
        params: { limit }
      });
      return response.data.items.map(item => item.track);
    } catch (error) {
      logger.error('Error fetching recently played:', error.message);
      throw error;
    }
  }

  async getAudioFeatures(trackIds) {
    try {
      const batches = [];
      for (let i = 0; i < trackIds.length; i += 100) {
        batches.push(trackIds.slice(i, i + 100));
      }

      const allFeatures = [];
      for (const batch of batches) {
        const response = await this.client.get('/audio-features', {
          params: { ids: batch.join(',') }
        });
        allFeatures.push(...response.data.audio_features.filter(f => f !== null));
      }
      return allFeatures;
    } catch (error) {
      logger.error('Error fetching audio features:', error.message);
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await this.client.get('/me');
      return response.data;
    } catch (error) {
      logger.error('Error fetching profile:', error.message);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(config.tokenUrl, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret
      });
      return response.data.access_token;
    } catch (error) {
      logger.error('Error refreshing token:', error.message);
      throw error;
    }
  }
}

module.exports = SpotifyService;

// === src/services/emotionEngine.js ===
class EmotionEngine {
  static normalizeFeatures(tracks) {
    return tracks.map(track => ({
      ...track,
      danceability_norm: (track.danceability || 0) * 100,
      energy_norm: (track.energy || 0) * 100,
      acousticness_norm: (track.acousticness || 0) * 100,
      valence_norm: (track.valence || 0) * 100,
      instrumentalness_norm: (track.instrumentalness || 0) * 100
    }));
  }

  static calculateEmotionalScores(tracks) {
    const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const avgDance = avg(tracks.map(t => t.danceability_norm));
    const avgEnergy = avg(tracks.map(t => t.energy_norm));
    const avgAcoustic = avg(tracks.map(t => t.acousticness_norm));
    const avgValence = avg(tracks.map(t => t.valence_norm));
    const avgInstrumental = avg(tracks.map(t => t.instrumentalness_norm));

    return {
      alegria: (avgValence * 0.7 + avgEnergy * 0.3),
      melancolia: ((100 - avgValence) * 0.6 + avgAcoustic * 0.4),
      nostalgia: (avgAcoustic * 0.5 + (100 - avgEnergy) * 0.3 + Math.abs(avgValence - 50) * 0.2),
      calma: ((100 - avgEnergy) * 0.5 + avgAcoustic * 0.5),
      euforia: (avgEnergy * 0.4 + avgValence * 0.4 + avgDance * 0.2),
      introspecção: (avgInstrumental * 0.4 + avgAcoustic * 0.4 + (100 - avgValence) * 0.2),
      energia: (avgEnergy * 0.6 + avgDance * 0.4)
    };
  }

  static findDominantEmotion(scores) {
    return Object.entries(scores).reduce((max, [emotion, score]) => 
      score > max.score ? { emotion, score } : max
    , { emotion: 'Neutra', score: 0 }).emotion;
  }

  static calculateBalance(scores) {
    const values = Object.values(scores);
    const avg = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    return Math.round(100 - Math.sqrt(variance));
  }
}

module.exports = EmotionEngine;

// === src/services/cacheService.js ===
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
      await redisClient.setex(key, expiresIn, JSON.stringify(value));
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