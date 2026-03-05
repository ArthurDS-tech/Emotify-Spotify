const logger = require('../utils/logger');

/**
 * Advanced Emotion Analysis Engine
 * Analyzes Spotify audio features to determine emotional characteristics
 */

class EmotionEngine {
  constructor() {
    // Emotion weights and thresholds calibrated for accuracy
    this.emotionProfiles = {
      joy: {
        weights: { valence: 0.5, energy: 0.3, danceability: 0.2 },
        threshold: 0.6,
        description: 'Músicas alegres e positivas'
      },
      sadness: {
        weights: { valence: -0.5, energy: -0.3, acousticness: 0.2 },
        threshold: 0.5,
        description: 'Músicas melancólicas e introspectivas'
      },
      energy: {
        weights: { energy: 0.6, loudness: 0.2, tempo: 0.2 },
        threshold: 0.65,
        description: 'Músicas energéticas e intensas'
      },
      calm: {
        weights: { energy: -0.4, acousticness: 0.3, instrumentalness: 0.3 },
        threshold: 0.55,
        description: 'Músicas calmas e relaxantes'
      },
      nostalgia: {
        weights: { valence: 0.2, acousticness: 0.3, instrumentalness: 0.2, energy: -0.3 },
        threshold: 0.5,
        description: 'Músicas que evocam memórias'
      },
      euphoria: {
        weights: { valence: 0.4, energy: 0.4, danceability: 0.2 },
        threshold: 0.7,
        description: 'Músicas para celebrar e dançar'
      },
      introspection: {
        weights: { valence: -0.2, energy: -0.3, acousticness: 0.3, speechiness: 0.2 },
        threshold: 0.5,
        description: 'Músicas para reflexão profunda'
      }
    };
  }

  /**
   * Normalize audio features to 0-1 scale
   */
  normalizeFeatures(features) {
    return {
      valence: features.valence || 0,
      energy: features.energy || 0,
      danceability: features.danceability || 0,
      acousticness: features.acousticness || 0,
      instrumentalness: features.instrumentalness || 0,
      speechiness: features.speechiness || 0,
      liveness: features.liveness || 0,
      tempo: Math.min(features.tempo / 200, 1) || 0, // Normalize tempo to 0-1
      loudness: Math.min((features.loudness + 60) / 60, 1) || 0, // Normalize loudness
      mode: features.mode || 0,
      key: features.key || 0
    };
  }

  /**
   * Calculate emotion score based on weighted features
   */
  calculateEmotionScore(normalizedFeatures, emotionProfile) {
    let score = 0;
    let totalWeight = 0;

    for (const [feature, weight] of Object.entries(emotionProfile.weights)) {
      if (normalizedFeatures[feature] !== undefined) {
        const featureValue = normalizedFeatures[feature];
        score += featureValue * weight;
        totalWeight += Math.abs(weight);
      }
    }

    // Normalize score to 0-1 range
    const normalizedScore = totalWeight > 0 ? (score + totalWeight) / (2 * totalWeight) : 0;
    return Math.max(0, Math.min(1, normalizedScore));
  }

  /**
   * Analyze track and return emotion scores
   */
  analyzeTrack(audioFeatures) {
    try {
      const normalized = this.normalizeFeatures(audioFeatures);
      const emotionScores = {};

      // Calculate score for each emotion
      for (const [emotion, profile] of Object.entries(this.emotionProfiles)) {
        emotionScores[emotion] = this.calculateEmotionScore(normalized, profile);
      }

      // Determine primary emotion
      const primaryEmotion = Object.entries(emotionScores)
        .reduce((max, [emotion, score]) => 
          score > max.score ? { emotion, score } : max,
          { emotion: 'neutral', score: 0 }
        );

      // Calculate emotion intensity (how strong the primary emotion is)
      const emotionIntensity = primaryEmotion.score;

      // Apply mode influence (major = happier, minor = sadder)
      if (normalized.mode === 1) {
        emotionScores.joy *= 1.1;
        emotionScores.euphoria *= 1.1;
      } else {
        emotionScores.sadness *= 1.1;
        emotionScores.introspection *= 1.1;
      }

      // Normalize scores after mode adjustment
      const maxScore = Math.max(...Object.values(emotionScores));
      if (maxScore > 1) {
        for (const emotion in emotionScores) {
          emotionScores[emotion] /= maxScore;
        }
      }

      return {
        emotions: {
          joy: emotionScores.joy,
          sadness: emotionScores.sadness,
          energy: emotionScores.energy,
          calm: emotionScores.calm,
          nostalgia: emotionScores.nostalgia,
          euphoria: emotionScores.euphoria,
          introspection: emotionScores.introspection
        },
        primaryEmotion: primaryEmotion.emotion,
        emotionIntensity,
        audioFeatures: normalized
      };
    } catch (error) {
      logger.error('Error analyzing track emotions:', error);
      throw error;
    }
  }

  /**
   * Analyze multiple tracks and return aggregated insights
   */
  analyzeMultipleTracks(tracksWithFeatures) {
    const analyses = tracksWithFeatures.map(track => ({
      ...track,
      analysis: this.analyzeTrack(track.audioFeatures)
    }));

    // Aggregate emotion scores
    const emotionTotals = {
      joy: 0, sadness: 0, energy: 0, calm: 0,
      nostalgia: 0, euphoria: 0, introspection: 0
    };

    const emotionCounts = {};

    analyses.forEach(({ analysis }) => {
      for (const [emotion, score] of Object.entries(analysis.emotions)) {
        emotionTotals[emotion] += score;
      }
      emotionCounts[analysis.primaryEmotion] = 
        (emotionCounts[analysis.primaryEmotion] || 0) + 1;
    });

    const trackCount = analyses.length;
    const avgEmotions = {};
    for (const emotion in emotionTotals) {
      avgEmotions[emotion] = emotionTotals[emotion] / trackCount;
    }

    // Find dominant emotion
    const dominantEmotion = Object.entries(emotionCounts)
      .reduce((max, [emotion, count]) => 
        count > max.count ? { emotion, count } : max,
        { emotion: 'neutral', count: 0 }
      );

    return {
      analyses,
      aggregated: {
        averageEmotions: avgEmotions,
        dominantEmotion: dominantEmotion.emotion,
        dominantEmotionPercentage: (dominantEmotion.count / trackCount) * 100,
        emotionDistribution: emotionCounts,
        totalTracks: trackCount
      }
    };
  }

  /**
   * Generate personalized insights based on emotion analysis
   */
  generateInsights(aggregatedData) {
    const { averageEmotions, dominantEmotion, dominantEmotionPercentage } = aggregatedData;
    const insights = [];

    // Dominant emotion insight
    const emotionDesc = this.emotionProfiles[dominantEmotion]?.description || 'variadas';
    insights.push({
      type: 'dominant_emotion',
      title: `Sua vibe é ${dominantEmotion}`,
      description: `${dominantEmotionPercentage.toFixed(1)}% das suas músicas são ${emotionDesc}`,
      icon: this.getEmotionIcon(dominantEmotion)
    });

    // Energy level insight
    if (averageEmotions.energy > 0.7) {
      insights.push({
        type: 'energy',
        title: 'Você ama energia!',
        description: 'Suas músicas são intensas e cheias de vida',
        icon: '⚡'
      });
    } else if (averageEmotions.calm > 0.7) {
      insights.push({
        type: 'calm',
        title: 'Paz e tranquilidade',
        description: 'Você prefere sons relaxantes e calmos',
        icon: '🧘'
      });
    }

    // Emotional balance insight
    const emotionVariance = this.calculateVariance(Object.values(averageEmotions));
    if (emotionVariance < 0.05) {
      insights.push({
        type: 'balance',
        title: 'Gosto eclético',
        description: 'Você aprecia uma grande variedade de emoções musicais',
        icon: '🎭'
      });
    }

    // Valence insight
    const avgValence = averageEmotions.joy + averageEmotions.euphoria - 
                       averageEmotions.sadness - averageEmotions.introspection;
    if (avgValence > 0.3) {
      insights.push({
        type: 'positivity',
        title: 'Vibes positivas',
        description: 'Suas músicas tendem a ser alegres e otimistas',
        icon: '😊'
      });
    } else if (avgValence < -0.3) {
      insights.push({
        type: 'melancholy',
        title: 'Alma melancólica',
        description: 'Você se conecta com músicas mais introspectivas',
        icon: '🌙'
      });
    }

    return insights;
  }

  /**
   * Calculate variance for emotion distribution
   */
  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Get emoji icon for emotion
   */
  getEmotionIcon(emotion) {
    const icons = {
      joy: '😊',
      sadness: '😢',
      energy: '⚡',
      calm: '😌',
      nostalgia: '💭',
      euphoria: '🎉',
      introspection: '🤔'
    };
    return icons[emotion] || '🎵';
  }

  /**
   * Calculate compatibility between two users based on emotion profiles
   */
  calculateCompatibility(user1Emotions, user2Emotions) {
    let totalDifference = 0;
    const emotions = Object.keys(user1Emotions);

    emotions.forEach(emotion => {
      const diff = Math.abs(user1Emotions[emotion] - user2Emotions[emotion]);
      totalDifference += diff;
    });

    // Convert difference to similarity score (0-1)
    const avgDifference = totalDifference / emotions.length;
    const compatibility = 1 - avgDifference;

    return Math.max(0, Math.min(1, compatibility));
  }
}

module.exports = new EmotionEngine();
