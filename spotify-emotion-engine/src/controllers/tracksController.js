const SpotifyService = require('../services/spotifyService');
const User = require('../models/User');

exports.getTopTracks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'medium_term', limit = 50 } = req.query;

    const user = await User.findById(userId);
    if (!user || !user.spotifyAccessToken) {
      return res.status(401).json({ error: 'Token Spotify não encontrado' });
    }

    const spotifyService = new SpotifyService(user.spotifyAccessToken);
    const tracks = await spotifyService.getTopTracks(period, parseInt(limit));

    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentlyPlayed = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50 } = req.query;

    const user = await User.findById(userId);
    if (!user || !user.spotifyAccessToken) {
      return res.status(401).json({ error: 'Token Spotify não encontrado' });
    }

    const spotifyService = new SpotifyService(user.spotifyAccessToken);
    const tracks = await spotifyService.getRecentlyPlayed(parseInt(limit));

    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
