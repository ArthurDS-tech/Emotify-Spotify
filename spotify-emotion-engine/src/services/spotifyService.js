const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../config/spotify');

// Dados de demo
const DEMO_TRACKS = [
  {
    id: 'track1',
    name: 'Blinding Lights',
    artists: [{ name: 'The Weeknd' }],
    album: { name: 'After Hours' },
    external_urls: { spotify: 'https://open.spotify.com/track/demo1' }
  },
  {
    id: 'track2',
    name: 'Watermelon Sugar', 
    artists: [{ name: 'Harry Styles' }],
    album: { name: 'Fine Line' },
    external_urls: { spotify: 'https://open.spotify.com/track/demo2' }
  },
  {
    id: 'track3',
    name: 'Levitating',
    artists: [{ name: 'Dua Lipa' }],
    album: { name: 'Future Nostalgia' },
    external_urls: { spotify: 'https://open.spotify.com/track/demo3' }
  }
];

const DEMO_AUDIO_FEATURES = [
  {
    id: 'track1',
    danceability: 0.514,
    energy: 0.73,
    valence: 0.675,
    acousticness: 0.001,
    instrumentalness: 0.000,
    tempo: 171.005
  },
  {
    id: 'track2',
    danceability: 0.548,
    energy: 0.816,
    valence: 0.557,
    acousticness: 0.122,
    instrumentalness: 0.000,
    tempo: 95.079
  },
  {
    id: 'track3',
    danceability: 0.702,
    energy: 0.825,
    valence: 0.915,
    acousticness: 0.011,
    instrumentalness: 0.000,
    tempo: 103.0
  }
];

const DEMO_PLAYLISTS = {
  items: [
    {
      id: 'playlist1',
      name: 'Minha Playlist Demo',
      description: 'Playlist criada no modo demo',
      public: true,
      owner: { id: 'demo_user', display_name: 'Usuário Demo' },
      tracks: { total: 15 },
      followers: { total: 5 },
      external_urls: { spotify: 'https://open.spotify.com/playlist/demo1' },
      images: [{ url: 'https://via.placeholder.com/300' }]
    }
  ],
  total: 1
};

class SpotifyService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.isDemoMode = accessToken === 'demo_access_token_123' || !config.clientId || config.clientId === 'demo_client_id';
    
    if (!this.isDemoMode) {
      this.client = axios.create({
        baseURL: config.baseUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    }
  }

  async getTopTracks(period = 'medium_term', limit = 50) {
    if (this.isDemoMode) {
      logger.info('Retornando top tracks DEMO');
      return DEMO_TRACKS.slice(0, Math.min(limit, DEMO_TRACKS.length));
    }

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
    if (this.isDemoMode) {
      logger.info('Retornando recently played DEMO');
      return DEMO_TRACKS.map(track => ({ track })).slice(0, Math.min(limit, DEMO_TRACKS.length));
    }

    try {
      const response = await this.client.get('/me/player/recently-played', {
        params: { limit }
      });
      return response.data.items;
    } catch (error) {
      logger.error('Error fetching recently played:', error.message);
      throw error;
    }
  }

  async getAudioFeatures(trackIds) {
    if (this.isDemoMode) {
      logger.info('Retornando audio features DEMO');
      return DEMO_AUDIO_FEATURES.filter(f => trackIds.includes(f.id));
    }

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
    if (this.isDemoMode) {
      return {
        id: 'demo_user_123',
        email: 'demo@example.com',
        display_name: 'Usuário Demo',
        images: [{ url: 'https://via.placeholder.com/150' }],
        country: 'BR'
      };
    }

    try {
      const response = await this.client.get('/me');
      return response.data;
    } catch (error) {
      logger.error('Error fetching profile:', error.message);
      throw error;
    }
  }

  async createPlaylist(userId, playlistData) {
    if (this.isDemoMode) {
      logger.info('Criando playlist DEMO:', playlistData.name);
      return {
        id: 'demo_playlist_' + Date.now(),
        name: playlistData.name,
        description: playlistData.description,
        public: playlistData.public,
        owner: { id: userId, display_name: 'Usuário Demo' },
        tracks: { total: 0 },
        followers: { total: 0 },
        external_urls: { spotify: 'https://open.spotify.com/playlist/demo' },
        images: []
      };
    }

    try {
      const response = await this.client.post(`/users/${userId}/playlists`, {
        name: playlistData.name,
        description: playlistData.description || '',
        public: playlistData.public !== undefined ? playlistData.public : true,
        collaborative: playlistData.collaborative || false
      });
      return response.data;
    } catch (error) {
      logger.error('Error creating playlist:', error.message);
      throw error;
    }
  }

  async getUserPlaylists(limit = 50, offset = 0) {
    if (this.isDemoMode) {
      logger.info('Retornando playlists DEMO');
      return DEMO_PLAYLISTS;
    }

    try {
      const response = await this.client.get('/me/playlists', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching playlists:', error.message);
      throw error;
    }
  }

  async addTracksToPlaylist(playlistId, trackUris) {
    if (this.isDemoMode) {
      logger.info('Adicionando tracks à playlist DEMO:', playlistId);
      return { snapshot_id: 'demo_snapshot_' + Date.now() };
    }

    try {
      const response = await this.client.post(`/playlists/${playlistId}/tracks`, {
        uris: trackUris
      });
      return response.data;
    } catch (error) {
      logger.error('Error adding tracks to playlist:', error.message);
      throw error;
    }
  }
}

module.exports = SpotifyService;