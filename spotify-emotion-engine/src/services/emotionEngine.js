class EmotionEngine {
  static normalizeFeatures(audioFeatures) {
    return audioFeatures.map(track => ({
      danceability: track.danceability || 0,
      energy: track.energy || 0,
      acousticness: track.acousticness || 0,
      valence: track.valence || 0,
      instrumentalness: track.instrumentalness || 0,
      tempo: (track.tempo || 120) / 200,
      speechiness: track.speechiness || 0
    }));
  }

  static calculateEmotionalScores(normalizedFeatures) {
    const avg = this._calculateAverages(normalizedFeatures);

    return {
      alegria: Math.round((avg.valence * 0.6 + avg.energy * 0.4) * 100),
      melancolia: Math.round(((1 - avg.valence) * 0.7 + (1 - avg.energy) * 0.3) * 100),
      nostalgia: Math.round((avg.acousticness * 0.5 + (1 - avg.energy) * 0.3 + (1 - avg.valence) * 0.2) * 100),
      calma: Math.round((avg.acousticness * 0.4 + (1 - avg.energy) * 0.6) * 100),
      euforia: Math.round((avg.danceability * 0.5 + avg.energy * 0.5) * 100),
      introspecção: Math.round((avg.instrumentalness * 0.6 + avg.acousticness * 0.4) * 100),
      energia: Math.round((avg.energy * 0.7 + avg.tempo * 0.3) * 100)
    };
  }

  static _calculateAverages(features) {
    const sum = features.reduce((acc, f) => ({
      danceability: acc.danceability + f.danceability,
      energy: acc.energy + f.energy,
      acousticness: acc.acousticness + f.acousticness,
      valence: acc.valence + f.valence,
      instrumentalness: acc.instrumentalness + f.instrumentalness,
      tempo: acc.tempo + f.tempo,
      speechiness: acc.speechiness + f.speechiness
    }), {
      danceability: 0, energy: 0, acousticness: 0, valence: 0,
      instrumentalness: 0, tempo: 0, speechiness: 0
    });

    const count = features.length;
    return {
      danceability: sum.danceability / count,
      energy: sum.energy / count,
      acousticness: sum.acousticness / count,
      valence: sum.valence / count,
      instrumentalness: sum.instrumentalness / count,
      tempo: sum.tempo / count,
      speechiness: sum.speechiness / count
    };
  }

  static findDominantEmotion(emotionScores) {
    return Object.entries(emotionScores)
      .reduce((max, [emotion, score]) => score > max.score ? { emotion, score } : max, 
        { emotion: '', score: 0 })
      .emotion;
  }

  static calculateBalance(emotionScores) {
    const scores = Object.values(emotionScores);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    return Math.round(Math.max(0, Math.min(100, 100 - stdDev)));
  }
}

module.exports = EmotionEngine;
