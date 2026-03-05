const spotifyService = require('../services/spotifyService');
const supabaseService = require('../services/supabaseService');
const emotionEngine = require('../services/emotionEngine');
const logger = require('../utils/logger');

class PlaylistController {
  async getUserPlaylists(req, res) {
    try {
      const user = await supabaseService.getUserById(req.user.userId);
      const playlists = await spotifyService.getUserPlaylists(user.spotify_access_token);

      res.json({ playlists });
    } catch (error) {
      logger.error('Error fetching playlists:', error);
      res.status(500).json({ error: 'Failed to fetch playlists' });
    }
  }

  async createEmotionPlaylist(req, res) {
    try {
      const { emotion, name, description, trackCount = 20 } = req.body;

      if (!emotion || !name) {
        return res.status(400).json({ error: 'Emotion and name required' });
      }

      const user = await supabaseService.getUserById(req.user.userId);

      // Get user's analyzed tracks with this emotion
      const analyses = await supabaseService.getUserEmotionAnalyses(user.id, 200);
      const emotionTracks = analyses
        .filter(a => a.primary_emotion === emotion)
        .sort((a, b) => parseFloat(b.emotion_intensity) - parseFloat(a.emotion_intensity))
        .slice(0, trackCount);

      if (emotionTracks.length === 0) {
        return res.status(404).json({ error: 'No tracks found for this emotion' });
      }

      // Create Spotify playlist
      const spotifyProfile = await spotifyService.getUserProfile(user.spotify_access_token);
      const playlist = await spotifyService.createPlaylist(
        user.spotify_access_token,
        spotifyProfile.id,
        name,
        description || `Playlist baseada na emoção: ${emotion}`,
        false
      );

      // Add tracks to playlist
      const trackUris = emotionTracks.map(t => `spotify:track:${t.track_id}`);
      await spotifyService.addTracksToPlaylist(
        user.spotify_access_token,
        playlist.id,
        trackUris
      );

      // Save to database
      await supabaseService.createPlaylist({
        userId: user.id,
        spotifyPlaylistId: playlist.id,
        name: playlist.name,
        description: playlist.description,
        emotionTheme: emotion,
        isPublic: false,
        isCollaborative: false,
        imageUrl: playlist.images?.[0]?.url,
        trackCount: emotionTracks.length
      });

      res.json({ playlist, trackCount: emotionTracks.length });
    } catch (error) {
      logger.error('Error creating emotion playlist:', error);
      res.status(500).json({ error: 'Failed to create playlist' });
    }
  }

  async getRecommendations(req, res) {
    try {
      const { emotion, limit = 20 } = req.query;
      const user = await supabaseService.getUserById(req.user.userId);

      // Get seed tracks based on emotion
      const analyses = await supabaseService.getUserEmotionAnalyses(user.id, 100);
      const seedTracks = analyses
        .filter(a => !emotion || a.primary_emotion === emotion)
        .sort((a, b) => parseFloat(b.emotion_intensity) - parseFloat(a.emotion_intensity))
        .slice(0, 5)
        .map(a => a.track_id);

      if (seedTracks.length === 0) {
        return res.json({ recommendations: [] });
      }

      // Get recommendations from Spotify
      const recommendations = await spotifyService.getRecommendations(
        user.spotify_access_token,
        seedTracks,
        {},
        parseInt(limit)
      );

      res.json({ recommendations });
    } catch (error) {
      logger.error('Error getting recommendations:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  }
}

module.exports = new PlaylistController();
