const logger = require('../utils/logger');

/**
 * Advanced Emotion Analysis Engine
 * Analyzes Spotify audio features to determine emotional characteristics
 */

class EmotionEngine {
  constructor() {
    // Human-readable metadata for UI/insights.
    this.emotionProfiles = {
      joy: {
        description: 'Músicas alegres e positivas'
      },
      sadness: {
        description: 'Músicas melancólicas e introspectivas'
      },
      energy: {
        description: 'Músicas energéticas e intensas'
      },
      calm: {
        description: 'Músicas calmas e relaxantes'
      },
      nostalgia: {
        description: 'Músicas que evocam memórias'
      },
      euphoria: {
        description: 'Músicas para celebrar e dançar'
      },
      introspection: {
        description: 'Músicas para reflexão profunda'
      }
    };

    // Emotion centroids in latent psychological space.
    this.emotionCentroids = {
      joy: { valence: 0.85, arousal: 0.72, introspection: 0.2, social: 0.72, tension: 0.2 },
      sadness: { valence: 0.2, arousal: 0.28, introspection: 0.75, social: 0.22, tension: 0.45 },
      energy: { valence: 0.62, arousal: 0.9, introspection: 0.15, social: 0.7, tension: 0.62 },
      calm: { valence: 0.55, arousal: 0.22, introspection: 0.62, social: 0.3, tension: 0.12 },
      nostalgia: { valence: 0.48, arousal: 0.35, introspection: 0.74, social: 0.35, tension: 0.3 },
      euphoria: { valence: 0.92, arousal: 0.95, introspection: 0.1, social: 0.84, tension: 0.35 },
      introspection: { valence: 0.34, arousal: 0.3, introspection: 0.9, social: 0.2, tension: 0.4 }
    };

    this.dimensionWeights = {
      valence: 0.25,
      arousal: 0.3,
      introspection: 0.2,
      social: 0.15,
      tension: 0.1
    };
  }

  /**
   * Normalize audio features to 0-1 scale
   */
  normalizeFeatures(features) {
    const tempo = Number.isFinite(features.tempo) ? features.tempo : 0;
    const loudness = Number.isFinite(features.loudness) ? features.loudness : -60;

    return {
      valence: features.valence || 0,
      energy: features.energy || 0,
      danceability: features.danceability || 0,
      acousticness: features.acousticness || 0,
      instrumentalness: features.instrumentalness || 0,
      speechiness: features.speechiness || 0,
      liveness: features.liveness || 0,
      tempo: Math.max(0, Math.min(tempo / 220, 1)),
      loudness: Math.max(0, Math.min((loudness + 60) / 60, 1)),
      mode: features.mode || 0,
      key: features.key || 0
    };
  }

  /**
   * Analyze track and return emotion scores
   */
  analyzeTrack(audioFeatures) {
    try {
      const normalized = this.normalizeFeatures(audioFeatures);
      const dimensions = this.derivePsychologicalDimensions(normalized);
      const centroidScores = this.scoreEmotionsByCentroid(dimensions);
      const ruleBasedScores = this.scoreEmotionsByMusicRules(normalized);
      const rawScores = this.mergeEmotionScores(centroidScores, ruleBasedScores);

      const adjustedScores = { ...rawScores };

      // Mode influence (major -> brighter, minor -> introspective)
      if (normalized.mode === 1) {
        adjustedScores.joy *= 1.08;
        adjustedScores.euphoria *= 1.08;
      } else {
        adjustedScores.sadness *= 1.08;
        adjustedScores.introspection *= 1.08;
      }

      // Context boosts for better separation in edge cases.
      if (normalized.tempo > 0.72 && normalized.energy > 0.7) {
        adjustedScores.energy *= 1.08;
        adjustedScores.euphoria *= 1.05;
      }
      if (normalized.acousticness > 0.7 && normalized.energy < 0.45) {
        adjustedScores.calm *= 1.08;
        adjustedScores.introspection *= 1.05;
      }

      const normalizedScores = this.normalizeScoreMap(adjustedScores);

      const orderedEmotions = Object.entries(normalizedScores)
        .sort((a, b) => b[1] - a[1]);

      const primaryEmotion = orderedEmotions[0] || ['neutral', 0];
      const secondEmotion = orderedEmotions[1] || ['neutral', 0];
      const margin = primaryEmotion[1] - secondEmotion[1];
      const confidence = Math.max(0, Math.min(1, margin * 8));
      const emotionIntensity = primaryEmotion[1];
      const blend = confidence < 0.18 ? `${primaryEmotion[0]} + ${secondEmotion[0]}` : primaryEmotion[0];

      return {
        emotions: {
          joy: normalizedScores.joy,
          sadness: normalizedScores.sadness,
          energy: normalizedScores.energy,
          calm: normalizedScores.calm,
          nostalgia: normalizedScores.nostalgia,
          euphoria: normalizedScores.euphoria,
          introspection: normalizedScores.introspection
        },
        primaryEmotion: primaryEmotion[0],
        secondaryEmotion: secondEmotion[0],
        emotionalBlend: blend,
        emotionIntensity,
        confidence,
        psychologicalProfile: this.generatePsychologicalProfile(dimensions),
        emotionalDimensions: dimensions,
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
    if (!Array.isArray(tracksWithFeatures) || tracksWithFeatures.length === 0) {
      return {
        analyses: [],
        aggregated: {
          averageEmotions: {
            joy: 0,
            sadness: 0,
            energy: 0,
            calm: 0,
            nostalgia: 0,
            euphoria: 0,
            introspection: 0
          },
          dominantEmotion: null,
          dominantEmotionPercentage: 0,
          emotionDistribution: {},
          totalTracks: 0
        }
      };
    }

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
    if (!values.length) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Build approximate audio-features when Spotify audio endpoints are unavailable.
   * Uses only track + artist metadata available in standard Web API endpoints.
   */
  estimateFeaturesFromMetadata(track, artistGenres = []) {
    const popularity = this.clamp01((track?.popularity || 0) / 100);
    const durationMs = track?.duration_ms || 180000;
    const durationNorm = this.clamp01((durationMs - 120000) / 240000);
    const explicitBoost = track?.explicit ? 0.06 : 0;
    const genreText = (artistGenres || []).join(' ').toLowerCase();

    const has = (keywords) => keywords.some((word) => genreText.includes(word));

    const energeticGenre = has(['edm', 'house', 'techno', 'dance', 'rock', 'metal', 'phonk', 'electro']);
    const calmGenre = has(['ambient', 'acoustic', 'classical', 'piano', 'chill', 'lofi', 'jazz']);
    const sadGenre = has(['blues', 'sad', 'indie folk', 'emo']);
    const nostalgicGenre = has(['oldies', 'retro', 'classic rock', 'soul', 'mpb']);

    const releaseYear = this.extractReleaseYear(track?.album?.release_date);
    const currentYear = new Date().getFullYear();
    const ageYears = releaseYear ? Math.max(0, currentYear - releaseYear) : 0;
    const nostalgiaFromAge = this.clamp01(ageYears / 35);

    const energyBase = 0.42 + popularity * 0.25 + (energeticGenre ? 0.2 : 0) - (calmGenre ? 0.18 : 0);
    const valenceBase = 0.5 + (energeticGenre ? 0.1 : 0) - (sadGenre ? 0.2 : 0) - (calmGenre ? 0.05 : 0) + explicitBoost;
    const acousticnessBase = 0.35 + (calmGenre ? 0.3 : 0) - (energeticGenre ? 0.2 : 0);
    const danceabilityBase = 0.45 + popularity * 0.15 + (energeticGenre ? 0.15 : 0) - (calmGenre ? 0.07 : 0);

    return {
      valence: this.clamp01(valenceBase),
      energy: this.clamp01(energyBase),
      danceability: this.clamp01(danceabilityBase),
      acousticness: this.clamp01(acousticnessBase),
      instrumentalness: this.clamp01(calmGenre ? 0.28 : 0.08),
      speechiness: this.clamp01(0.08 + explicitBoost),
      liveness: this.clamp01(0.12 + popularity * 0.08),
      tempo: 88 + energyBase * 75 + (energeticGenre ? 10 : 0) - (calmGenre ? 8 : 0),
      loudness: -20 + energyBase * 14,
      mode: valenceBase >= 0.5 ? 1 : 0,
      key: 5,
      duration_ms: durationMs,
      time_signature: 4,
      _metadata_source: {
        popularity,
        durationNorm,
        energeticGenre,
        calmGenre,
        sadGenre,
        nostalgicGenre: nostalgicGenre || nostalgiaFromAge > 0.5,
        nostalgiaFromAge
      }
    };
  }

  normalizeScoreMap(scores) {
    const maxScore = Math.max(...Object.values(scores), 1);
    const normalized = {};
    for (const [emotion, score] of Object.entries(scores)) {
      normalized[emotion] = Math.max(0, Math.min(1, score / maxScore));
    }
    return normalized;
  }

  derivePsychologicalDimensions(features) {
    const valence = features.valence;
    const arousal = this.clamp01(
      features.energy * 0.6 +
      features.loudness * 0.2 +
      features.tempo * 0.2
    );
    const introspection = this.clamp01(
      features.acousticness * 0.35 +
      features.instrumentalness * 0.25 +
      (1 - features.danceability) * 0.15 +
      (1 - features.energy) * 0.25
    );
    const social = this.clamp01(
      features.danceability * 0.5 +
      features.valence * 0.2 +
      features.energy * 0.2 +
      features.speechiness * 0.1
    );
    const tension = this.clamp01(
      (1 - features.valence) * 0.45 +
      features.loudness * 0.2 +
      features.speechiness * 0.15 +
      features.liveness * 0.2
    );

    return { valence, arousal, introspection, social, tension };
  }

  scoreEmotionsByCentroid(dimensions) {
    const scores = {};
    const totalWeight = Object.values(this.dimensionWeights).reduce((sum, w) => sum + w, 0);

    for (const [emotion, centroid] of Object.entries(this.emotionCentroids)) {
      let weightedSquareDiff = 0;

      for (const [dimension, weight] of Object.entries(this.dimensionWeights)) {
        const diff = dimensions[dimension] - centroid[dimension];
        weightedSquareDiff += weight * (diff * diff);
      }

      const distance = Math.sqrt(weightedSquareDiff / totalWeight);
      scores[emotion] = this.clamp01(1 - distance);
    }

    return scores;
  }

  scoreEmotionsByMusicRules(features) {
    const midTempoDistance = Math.abs(features.tempo - 0.5);
    const midTempoAffinity = this.clamp01(1 - midTempoDistance * 2);

    return {
      joy: this.clamp01(
        features.valence * 0.55 +
        features.energy * 0.25 +
        features.danceability * 0.2
      ),
      sadness: this.clamp01(
        (1 - features.valence) * 0.6 +
        features.acousticness * 0.25 +
        (1 - features.energy) * 0.15
      ),
      energy: this.clamp01(
        features.energy * 0.6 +
        features.tempo * 0.2 +
        features.loudness * 0.2
      ),
      calm: this.clamp01(
        (1 - features.energy) * 0.5 +
        features.acousticness * 0.3 +
        features.instrumentalness * 0.2
      ),
      nostalgia: this.clamp01(
        features.acousticness * 0.3 +
        (1 - features.energy) * 0.2 +
        midTempoAffinity * 0.2 +
        (1 - features.valence) * 0.2 +
        features.instrumentalness * 0.1
      ),
      euphoria: this.clamp01(
        features.valence * 0.45 +
        features.energy * 0.35 +
        features.danceability * 0.2
      ),
      introspection: this.clamp01(
        features.acousticness * 0.35 +
        features.instrumentalness * 0.25 +
        (1 - features.danceability) * 0.2 +
        (1 - features.energy) * 0.1 +
        features.speechiness * 0.1
      )
    };
  }

  mergeEmotionScores(primaryScores, secondaryScores) {
    const merged = {};
    const emotions = Object.keys(primaryScores);
    emotions.forEach((emotion) => {
      merged[emotion] = this.clamp01(
        primaryScores[emotion] * 0.55 + secondaryScores[emotion] * 0.45
      );
    });
    return merged;
  }

  generatePsychologicalProfile(dimensions) {
    return {
      valence: this.describeValence(dimensions.valence),
      activation: this.describeArousal(dimensions.arousal),
      focus: dimensions.introspection > 0.6 ? 'interno' : 'externo',
      socialDrive: dimensions.social > 0.62 ? 'coletivo' : 'individual',
      tension: dimensions.tension > 0.6 ? 'alta' : dimensions.tension < 0.3 ? 'baixa' : 'moderada'
    };
  }

  describeValence(valence) {
    if (valence > 0.7) return 'positivo';
    if (valence < 0.35) return 'melancólico';
    return 'neutro';
  }

  describeArousal(arousal) {
    if (arousal > 0.72) return 'alta';
    if (arousal < 0.35) return 'baixa';
    return 'moderada';
  }

  clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  extractReleaseYear(releaseDate) {
    if (!releaseDate || typeof releaseDate !== 'string') return null;
    const year = Number(releaseDate.slice(0, 4));
    if (!Number.isFinite(year) || year < 1900 || year > 2200) return null;
    return year;
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
