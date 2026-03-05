const spotifyService = require('../services/spotifyService');
const supabaseService = require('../services/supabaseService');
const logger = require('../utils/logger');

class TracksController {
  async getTopTracks(req, res) {
    try {
      const { timeRange = 'medium_term', limit = 50 } = req.query;
      const user = await supabaseService.getUserById(req.user.userId);

      const tracks = await spotifyService.getTopTracks(
        user.spotify_access_token,
        timeRange,
        parseInt(limit)
      );

      res.json({ tracks });
    } catch (error) {
      logger.error('Error fetching top tracks:', error);
      res.status(500).json({ error: 'Failed to fetch tracks' });
    }
  }

  async getRecentlyPlayed(req, res) {
    try {
      const { limit = 50 } = req.query;
      const user = await supabaseService.getUserById(req.user.userId);

      const tracks = await spotifyService.getRecentlyPlayed(
        user.spotify_access_token,
        parseInt(limit)
      );

      // Save to listening history
      const historyData = tracks.map(item => ({
        userId: user.id,
        trackId: item.track.id,
        trackName: item.track.name,
        artistName: item.track.artists.map(a => a.name).join(', '),
        playedAt: item.played_at,
        contextType: item.context?.type || null,
        contextUri: item.context?.uri || null
      }));

      await supabaseService.saveListeningHistory(historyData);

      res.json({ tracks });
    } catch (error) {
      logger.error('Error fetching recently played:', error);
      res.status(500).json({ error: 'Failed to fetch tracks' });
    }
  }

  async searchTracks(req, res) {
    try {
      const { q, limit = 20 } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Query parameter required' });
      }

      const user = await supabaseService.getUserById(req.user.userId);
      const tracks = await spotifyService.searchTracks(
        user.spotify_access_token,
        q,
        parseInt(limit)
      );

      res.json({ tracks });
    } catch (error) {
      logger.error('Error searching tracks:', error);
      res.status(500).json({ error: 'Failed to search tracks' });
    }
  }

  async getTrack(req, res) {
    try {
      const { trackId } = req.params;
      const user = await supabaseService.getUserById(req.user.userId);

      const track = await spotifyService.getTrack(user.spotify_access_token, trackId);
      res.json({ track });
    } catch (error) {
      logger.error('Error fetching track:', error);
      res.status(500).json({ error: 'Failed to fetch track' });
    }
  }

  async getAudioFeatures(req, res) {
    try {
      const { trackId } = req.params;
      const user = await supabaseService.getUserById(req.user.userId);

      const features = await spotifyService.getTrackAudioFeatures(
        user.spotify_access_token,
        trackId
      );

      res.json({ features });
    } catch (error) {
      logger.error('Error fetching audio features:', error);
      res.status(500).json({ error: 'Failed to fetch audio features' });
    }
  }
}

module.exports = new TracksController();
