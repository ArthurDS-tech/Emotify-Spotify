// === src/controllers/authController.js ===
const axios = require('axios');
const User = require('../models/User');
const TokenManager = require('../utils/tokenManager');
const config = require('../config/spotify');
const logger = require('../utils/logger');

exports.getAuthUrl = (req, res) => {
  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code',
    redirect_uri: config.redirectUri,
    scope: config.scopes,
    state: Math.random().toString(36).substring(7)
  });

  const authUrl = `${config.authUrl}?${params}`;
  res.json({ authUrl });
};

exports.callback = async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Código de autorização não fornecido' });
    }

    // Trocar código por token Spotify
    const tokenResponse = await axios.post(config.tokenUrl, {
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      client_secret: config.clientSecret
    });

    const spotifyToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;
    const expiresIn = tokenResponse.data.expires_in;

    // Buscar perfil do usuário
    const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${spotifyToken}` }
    });

    const spotifyProfile = profileResponse.data;

    // Criar ou atualizar usuário
    let user = await User.findOne({ spotifyId: spotifyProfile.id });
    
    if (!user) {
      user = new User({
        spotifyId: spotifyProfile.id,
        email: spotifyProfile.email,
        name: spotifyProfile.display_name,
        profileImage: spotifyProfile.images?.[0]?.url,
        country: spotifyProfile.country
      });
    }

    user.spotifyAccessToken = spotifyToken;
    user.spotifyRefreshToken = refreshToken;
    user.tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);
    user.refreshToken = TokenManager.generateRefreshToken(user._id);

    await user.save();

    // Gerar tokens próprios
    const accessToken = TokenManager.generateAccessToken(user._id, user.spotifyId);
    const newRefreshToken = user.refreshToken;

    logger.info(`Usuario autenticado: ${user.email}`);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    logger.error('Auth callback error:', error.message);
    res.status(500).json({ error: 'Erro na autenticação' });
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    const decoded = TokenManager.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: 'Refresh token inválido' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const newAccessToken = TokenManager.generateAccessToken(user._id, user.spotifyId);
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    logger.error('Refresh token error:', error.message);
    res.status(500).json({ error: 'Erro ao renovar token' });
  }
};

// === src/controllers/userController.js ===
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, updatedAt: new Date() },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// === src/controllers/emotionController.js ===
const EmotionAnalysis = require('../models/EmotionAnalysis');
const SpotifyService = require('../services/spotifyService');
const EmotionEngine = require('../services/emotionEngine');
const InsightGenerator = require('../services/insightGenerator');
const CacheService = require('../services/cacheService');
const User = require('../models/User');

exports.analyzeEmotion = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'medium_term' } = req.query;

    // Verificar cache
    const cacheKey = `emotion:${userId}:${period}`;
    const cachedData = await CacheService.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    // Buscar usuário e verificar token
    const user = await User.findById(userId);
    if (!user || !user.spotifyAccessToken) {
      return res.status(401).json({ error: 'Token Spotify não encontrado' });
    }

    // Inicializar serviço Spotify
    const spotifyService = new SpotifyService(user.spotifyAccessToken);

    // Buscar top tracks
    const tracks = await spotifyService.getTopTracks(period, 50);
    
    if (!tracks || tracks.length === 0) {
      return res.status(400).json({ error: 'Nenhuma música encontrada' });
    }

    // Buscar audio features
    const trackIds = tracks.map(t => t.id);
    const audioFeatures = await spotifyService.getAudioFeatures(trackIds);

    // Processar emoções
    const normalized = EmotionEngine.normalizeFeatures(audioFeatures);
    const emotionScores = EmotionEngine.calculateEmotionalScores(normalized);
    const dominantEmotion = EmotionEngine.findDominantEmotion(emotionScores);
    const balance = EmotionEngine.calculateBalance(emotionScores);

    // Gerar insights e timeline
    const insights = InsightGenerator.generateInsights(emotionScores, normalized, dominantEmotion);
    const timeline = InsightGenerator.generateEmotionalTimeline(emotionScores);
    const avgFeatures = InsightGenerator.generateAverageAudioFeatures(audioFeatures);

    const result = {
      dominantEmotion,
      emotionalBalance: balance,
      emotionalTimeline: timeline,
      insights,
      emotionBreakdown: emotionScores,
      averageAudioFeatures: avgFeatures,
      trackCount: tracks.length
    };

    // Salvar no banco
    const analysis = new EmotionAnalysis({
      userId,
      period,
      ...result
    });
    await analysis.save();

    // Cachear resultado
    await CacheService.set(cacheKey, result, 86400); // 24 horas

    res.json(result);
  } catch (error) {
    logger.error('Emotion analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalysisHistory = async (req, res) => {
  try {
    const analyses = await EmotionAnalysis.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// === src/controllers/tracksController.js ===
const TrackCache = require('../models/TrackCache');
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