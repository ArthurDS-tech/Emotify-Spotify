const axios = require('axios');
const logger = require('../utils/logger');

class SpotifyService {
  constructor() {
    this.baseURL = 'https://api.spotify.com/v1';
    this.authURL = 'https://accounts.spotify.com/api/token';
  }

  /**
   * Get authorization header
   */
  getAuthHeader(accessToken) {
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(
        this.authURL,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }),
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in
      };
    } catch (error) {
      logger.error('Error refreshing Spotify token:', error.response?.data || error.message);
      throw new Error('Failed to refresh Spotify token');
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/me`, {
        headers: this.getAuthHeader(accessToken)
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching user profile:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user's top tracks
   * @param {string} timeRange - short_term, medium_term, or long_term
   * @param {number} limit - Number of tracks (max 50)
   */
  async getTopTracks(accessToken, timeRange = 'medium_term', limit = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/me/top/tracks`, {
        headers: this.getAuthHeader(accessToken),
        params: { time_range: timeRange, limit }
      });
      return response.data.items;
    } catch (error) {
      logger.error('Error fetching top tracks:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user's top artists
   */
  async getTopArtists(accessToken, timeRange = 'medium_term', limit = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/me/top/artists`, {
        headers: this.getAuthHeader(accessToken),
        params: { time_range: timeRange, limit }
      });
      return response.data.items;
    } catch (error) {
      logger.error('Error fetching top artists:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get multiple artists by ID
   */
  async getArtists(accessToken, artistIds = []) {
    try {
      if (!artistIds.length) return [];

      const chunks = this.chunkArray(artistIds, 50);
      const allArtists = [];

      for (const chunk of chunks) {
        const response = await axios.get(`${this.baseURL}/artists`, {
          headers: this.getAuthHeader(accessToken),
          params: { ids: chunk.join(',') }
        });

        allArtists.push(...response.data.artists.filter(Boolean));
      }

      return allArtists;
    } catch (error) {
      logger.error('Error fetching artists:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get recently played tracks
   */
  async getRecentlyPlayed(accessToken, limit = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/me/player/recently-played`, {
        headers: this.getAuthHeader(accessToken),
        params: { limit }
      });
      return response.data.items;
    } catch (error) {
      logger.error('Error fetching recently played:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get audio features for multiple tracks
   */
  async getAudioFeatures(accessToken, trackIds) {
    try {
      // Spotify API accepts max 100 IDs at once
      const chunks = this.chunkArray(trackIds, 100);
      const allFeatures = [];

      for (const chunk of chunks) {
        const response = await axios.get(`${this.baseURL}/audio-features`, {
          headers: this.getAuthHeader(accessToken),
          params: { ids: chunk.join(',') }
        });
        allFeatures.push(...response.data.audio_features.filter(f => f !== null));
      }

      return allFeatures;
    } catch (error) {
      logger.error('Error fetching audio features:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get audio features for a single track
   */
  async getTrackAudioFeatures(accessToken, trackId) {
    try {
      const response = await axios.get(`${this.baseURL}/audio-features/${trackId}`, {
        headers: this.getAuthHeader(accessToken)
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching track audio features:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get track details
   */
  async getTrack(accessToken, trackId) {
    try {
      const response = await axios.get(`${this.baseURL}/tracks/${trackId}`, {
        headers: this.getAuthHeader(accessToken)
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching track:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get multiple tracks
   */
  async getTracks(accessToken, trackIds) {
    try {
      const chunks = this.chunkArray(trackIds, 50);
      const allTracks = [];

      for (const chunk of chunks) {
        const response = await axios.get(`${this.baseURL}/tracks`, {
          headers: this.getAuthHeader(accessToken),
          params: { ids: chunk.join(',') }
        });
        allTracks.push(...response.data.tracks.filter(t => t !== null));
      }

      return allTracks;
    } catch (error) {
      logger.error('Error fetching tracks:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Search tracks
   */
  async searchTracks(accessToken, query, limit = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        headers: this.getAuthHeader(accessToken),
        params: {
          q: query,
          type: 'track',
          limit
        }
      });
      return response.data.tracks.items;
    } catch (error) {
      logger.error('Error searching tracks:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user's playlists
   */
  async getUserPlaylists(accessToken, limit = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/me/playlists`, {
        headers: this.getAuthHeader(accessToken),
        params: { limit }
      });
      return response.data.items;
    } catch (error) {
      logger.error('Error fetching playlists:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a playlist
   */
  async createPlaylist(accessToken, userId, name, description, isPublic = false) {
    try {
      const response = await axios.post(
        `${this.baseURL}/users/${userId}/playlists`,
        {
          name,
          description,
          public: isPublic
        },
        { headers: this.getAuthHeader(accessToken) }
      );
      return response.data;
    } catch (error) {
      logger.error('Error creating playlist:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Add tracks to playlist
   */
  async addTracksToPlaylist(accessToken, playlistId, trackUris) {
    try {
      const chunks = this.chunkArray(trackUris, 100);
      
      for (const chunk of chunks) {
        await axios.post(
          `${this.baseURL}/playlists/${playlistId}/tracks`,
          { uris: chunk },
          { headers: this.getAuthHeader(accessToken) }
        );
      }
      
      return true;
    } catch (error) {
      logger.error('Error adding tracks to playlist:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get recommendations based on seed tracks
   */
  async getRecommendations(accessToken, seedTracks, targetFeatures = {}, limit = 20) {
    try {
      const params = {
        seed_tracks: seedTracks.slice(0, 5).join(','),
        limit,
        ...targetFeatures
      };

      const response = await axios.get(`${this.baseURL}/recommendations`, {
        headers: this.getAuthHeader(accessToken),
        params
      });
      
      return response.data.tracks;
    } catch (error) {
      logger.error('Error getting recommendations:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user's saved tracks
   */
  async getSavedTracks(accessToken, limit = 50, offset = 0) {
    try {
      const response = await axios.get(`${this.baseURL}/me/tracks`, {
        headers: this.getAuthHeader(accessToken),
        params: { limit, offset }
      });
      return response.data.items;
    } catch (error) {
      logger.error('Error fetching saved tracks:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get current playback state
   */
  async getCurrentPlayback(accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/me/player`, {
        headers: this.getAuthHeader(accessToken)
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 204) {
        return null; // No active playback
      }
      logger.error('Error fetching playback state:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Utility: Chunk array into smaller arrays
   */
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Format track data for storage
   */
  formatTrackData(track) {
    return {
      id: track.id,
      name: track.name,
      artists: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      albumImage: track.album.images[0]?.url || null,
      duration: track.duration_ms,
      popularity: track.popularity,
      uri: track.uri,
      previewUrl: track.preview_url
    };
  }
}

module.exports = new SpotifyService();
