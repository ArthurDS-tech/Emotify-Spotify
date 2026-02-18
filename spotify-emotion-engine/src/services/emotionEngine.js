class EmotionEngine {
  static normalizeFeatures(tracks) {
    return tracks.map(track => ({
      ...track,
      danceability_norm: (track.danceability || 0) * 100,
      energy_norm: (track.energy || 0) * 100,
      acousticness_norm: (track.acousticness || 0) * 100,
      valence_norm: (track.valence || 0) * 100,
      instrumentalness_norm: (track.instrumentalness || 0) * 100,
      tempo_norm: Math.min(1, (track.tempo || 0) / 200) * 100
    }));
  }

  static calculateEmotionalScores(tracks) {
    const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const avgDance = avg(tracks.map(t => t.danceability_norm));
    const avgEnergy = avg(tracks.map(t => t.energy_norm));
    const avgAcoustic = avg(tracks.map(t => t.acousticness_norm));
    const avgValence = avg(tracks.map(t => t.valence_norm));
    const avgInstrumental = avg(tracks.map(t => t.instrumentalness_norm));
    const avgTempo = avg(tracks.map(t => t.tempo_norm));

    return {
      alegria: (avgValence * 0.7 + avgEnergy * 0.3),
      melancolia: ((100 - avgValence) * 0.6 + avgAcoustic * 0.4),
      nostalgia: (avgAcoustic * 0.4 + (100 - avgEnergy) * 0.2 + Math.abs(avgValence - 50) * 0.2 + avgTempo * 0.2),
      calma: ((100 - avgEnergy) * 0.5 + avgAcoustic * 0.5),
      euforia: (avgEnergy * 0.4 + avgValence * 0.4 + avgDance * 0.2),
      introspecção: (avgInstrumental * 0.4 + avgAcoustic * 0.4 + (100 - avgValence) * 0.2),
      energia: (avgEnergy * 0.5 + avgDance * 0.3 + avgTempo * 0.2)
    };
  }

  static findDominantEmotion(scores) {
    return Object.entries(scores).reduce((max, [emotion, score]) => 
      score > max.score ? { emotion, score } : max
    , { emotion: 'Neutra', score: 0 }).emotion;
  }

  static calculateBalance(scores) {
    const values = Object.values(scores);
    const avg = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    return Math.round(100 - Math.sqrt(variance)) / 100;
  }

  static calculateDiversity(scores) {
    const total = Object.values(scores).reduce((sum, v) => sum + (v > 0 ? v : 0), 0);
    if (!total) return 0;

    const probabilities = Object.values(scores)
      .map(v => (v > 0 ? v / total : 0))
      .filter(p => p > 0);

    const entropy = -probabilities.reduce((sum, p) => sum + p * Math.log2(p), 0);
    const maxEntropy = Math.log2(Object.keys(scores).length);

    if (!maxEntropy) return 0;

    return Math.round((entropy / maxEntropy) * 100);
  }
}

module.exports = EmotionEngine;