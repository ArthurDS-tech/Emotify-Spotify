const EmotionAnalysis = require('../models/EmotionAnalysis');
const SpotifyService = require('../services/spotifyService');
const EmotionEngine = require('../services/emotionEngine');
const InsightGenerator = require('../services/insightGenerator');
const CacheService = require('../services/cacheService');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.analyzeEmotion = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'medium_term' } = req.query;

    const cacheKey = `emotion:${userId}:${period}`;
    const cachedData = await CacheService.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const user = await User.findById(userId);
    if (!user || !user.spotifyAccessToken) {
      return res.status(401).json({ error: 'Token Spotify não encontrado' });
    }

    const spotifyService = new SpotifyService(user.spotifyAccessToken);
    const tracks = await spotifyService.getTopTracks(period, 50);
    
    if (!tracks || tracks.length === 0) {
      return res.status(400).json({ error: 'Nenhuma música encontrada' });
    }

    const trackIds = tracks.map(t => t.id);
    const audioFeatures = await spotifyService.getAudioFeatures(trackIds);

    const normalized = EmotionEngine.normalizeFeatures(audioFeatures);
    const emotionScores = EmotionEngine.calculateEmotionalScores(normalized);
    const dominantEmotion = EmotionEngine.findDominantEmotion(emotionScores);
    const balance = EmotionEngine.calculateBalance(emotionScores);

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

    const analysis = new EmotionAnalysis({
      userId,
      period,
      ...result
    });
    await analysis.save();

    await CacheService.set(cacheKey, result, 86400);

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
