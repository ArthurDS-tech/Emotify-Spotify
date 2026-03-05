const SpotifyService = require('../services/spotifyService');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.createPlaylist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, description = '', public = true } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome da playlist é obrigatório' });
    }

    // Buscar usuário e verificar token
    const user = await User.findById(userId);
    if (!user || !user.spotifyAccessToken) {
      return res.status(401).json({ error: 'Token Spotify não encontrado' });
    }

    // Inicializar serviço Spotify
    const spotifyService = new SpotifyService(user.spotifyAccessToken);

    // Criar playlist no Spotify
    const playlist = await spotifyService.createPlaylist(user.spotifyId, {
      name,
      description,
      public
    });

    logger.info(`Playlist criada: ${playlist.name} para usuário ${user.email}`);

    res.status(201).json(playlist);
  } catch (error) {
    logger.error('Erro ao criar playlist:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;

    const user = await User.findById(userId);
    if (!user || !user.spotifyAccessToken) {
      return res.status(401).json({ error: 'Token Spotify não encontrado' });
    }

    const spotifyService = new SpotifyService(user.spotifyAccessToken);
    const playlists = await spotifyService.getUserPlaylists(parseInt(limit), parseInt(offset));

    res.json(playlists);
  } catch (error) {
    logger.error('Erro ao buscar playlists:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.addTracksToPlaylist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { playlistId } = req.params;
    const { trackUris } = req.body;

    if (!trackUris || !Array.isArray(trackUris)) {
      return res.status(400).json({ error: 'Lista de URIs de tracks é obrigatória' });
    }

    const user = await User.findById(userId);
    if (!user || !user.spotifyAccessToken) {
      return res.status(401).json({ error: 'Token Spotify não encontrado' });
    }

    const spotifyService = new SpotifyService(user.spotifyAccessToken);
    const result = await spotifyService.addTracksToPlaylist(playlistId, trackUris);

    res.json(result);
  } catch (error) {
    logger.error('Erro ao adicionar tracks à playlist:', error.message);
    res.status(500).json({ error: error.message });
  }
};