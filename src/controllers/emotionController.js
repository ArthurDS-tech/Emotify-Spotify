const logger = require('../utils/logger');

exports.analyzeEmotion = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'medium_term' } = req.query;

    // Verificar token do Spotify vindo do JWT
    const spotifyAccessToken = req.user.spotifyAccessToken;
    if (!spotifyAccessToken) {
      return res.status(401).json({ error: 'Token Spotify não encontrado' });
    }

    // Inicializar serviços
    const SpotifyService = require('../services/spotifyService');
    const EmotionEngine = require('../services/emotionEngine');
    const InsightGenerator = require('../services/insightGenerator');
    const CacheService = require('../services/cacheService');
    
    const spotifyService = new SpotifyService(spotifyAccessToken);

    // Verificar cache
    const cacheKey = `emotion:${userId}:${period}`;
    const cachedData = await CacheService.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

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
    const diversity = EmotionEngine.calculateDiversity(emotionScores);

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
      trackCount: tracks.length,
      emotionalDiversity: diversity
    };

    // Cachear resultado (ignorar falhas silenciosamente)
    await CacheService.set(cacheKey, result, 86400);

    res.json(result);
  } catch (error) {
    logger.error('Emotion analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalysisHistory = async (req, res) => {
  try {
    const EmotionAnalysis = require('../models/EmotionAnalysis');
    const analyses = await EmotionAnalysis.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};