const axios = require('axios');
const logger = require('../utils/logger');

class SpotifyService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://api.spotify.com/v1';
  }

  async getTopTracks(period = 'medium_term', limit = 50) {
    try {
      const response = await axios.get(`${this.baseUrl}/me/top/tracks`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
        params: { time_range: period, limit }
      });
      return response.data.items;
    } catch (error) {
      logger.error('Spotify getTopTracks error:', error.message);
      throw new Error('Erro ao buscar músicas favoritas');
    }
  }

  async getRecentlyPlayed(limit = 50) {
    try {
      const response = await axios.get(`${this.baseUrl}/me/player/recently-played`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
        params: { limit }
      });
      return response.data.items.map(item => item.track);
    } catch (error) {
      logger.error('Spotify getRecentlyPlayed error:', error.message);
      throw new Error('Erro ao buscar músicas recentes');
    }
  }

  async getAudioFeatures(trackIds) {
    try {
      const response = await axios.get(`${this.baseUrl}/audio-features`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
        params: { ids: trackIds.join(',') }
      });
      return response.data.audio_features.filter(f => f !== null);
    } catch (error) {
      logger.error('Spotify getAudioFeatures error:', error.message);
      throw new Error('Erro ao buscar características de áudio');
    }
  }

  async getUserProfile() {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      return response.data;
    } catch (error) {
      logger.error('Spotify getUserProfile error:', error.message);
      throw new Error('Erro ao buscar perfil');
    }
  }
}

module.exports = SpotifyService;
