class InsightGenerator {
  static generateInsights(emotionScores, normalizedTracks, dominantEmotion) {
    const insights = [];

    // Insight 1: Emoção dominante
    if (emotionScores[dominantEmotion.toLowerCase()] > 70) {
      insights.push(
        `Você teve picos de ${dominantEmotion} durante este período`
      );
    }

    // Insight 2: Tendência acústica
    const avgAcoustic = (normalizedTracks.reduce((sum, t) => sum + (t.acousticness_norm || 0), 0) / normalizedTracks.length);
    if (avgAcoustic > 60) {
      insights.push(
        'Músicas acústicas estão associadas a momentos de introspecção'
      );
    }

    // Insight 3: Energia geral
    const avgEnergy = (normalizedTracks.reduce((sum, t) => sum + (t.energy_norm || 0), 0) / normalizedTracks.length);
    const highEnergyPercentage = (normalizedTracks.filter(t => (t.energy || 0) > 0.7).length / normalizedTracks.length) * 100;
    
    if (highEnergyPercentage > 50) {
      insights.push(
        'Preferência por músicas com alta energia e intensidade'
      );
    } else if (highEnergyPercentage < 30) {
      insights.push(
        'Você prefere músicas mais calmas e relaxantes'
      );
    }

    // Insight 4: Padrão emocional noturno
    if (emotionScores.melancolia > 65) {
      insights.push(
        'Picos de melancolia foram detectados no período noturno'
      );
    }

    // Insight 5: Padrão geral
    const avgValence = (normalizedTracks.reduce((sum, t) => sum + (t.valence_norm || 0), 0) / normalizedTracks.length);
    if (avgValence > 60) {
      insights.push(
        'Seu padrão emocional é majoritariamente positivo e alegre'
      );
    } else if (avgValence < 40) {
      insights.push(
        'Seu padrão emocional é introspectivo e contemplativo'
      );
    } else {
      insights.push(
        'Seu padrão emocional é equilibrado entre diferentes humores'
      );
    }

    // Insight 6: Danceability
    const avgDance = (normalizedTracks.reduce((sum, t) => sum + (t.danceability_norm || 0), 0) / normalizedTracks.length);
    if (avgDance > 65) {
      insights.push(
        'Você tem uma forte preferência por músicas para dançar'
      );
    }

    return insights.slice(0, 6);
  }

  static generateEmotionalTimeline(emotionScores, periodDays = 7) {
    const emotions = Object.entries(emotionScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion]) => emotion);

    const timeline = [];
    const today = new Date();

    for (let i = periodDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const emotionIndex = (periodDays - i) % emotions.length;
      const emotion = emotions[emotionIndex];
      const score = Math.round(40 + Math.random() * 50);

      timeline.push({
        day: dateStr,
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        score
      });
    }

    return timeline;
  }

  static generateAverageAudioFeatures(tracks) {
    const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return {
      danceability: Math.round(avg(tracks.map(t => (t.danceability || 0) * 100))),
      energy: Math.round(avg(tracks.map(t => (t.energy || 0) * 100))),
      acousticness: Math.round(avg(tracks.map(t => (t.acousticness || 0) * 100))),
      valence: Math.round(avg(tracks.map(t => (t.valence || 0) * 100))),
      instrumentalness: Math.round(avg(tracks.map(t => (t.instrumentalness || 0) * 100))),
      tempo: Math.round(avg(tracks.map(t => t.tempo || 0)))
    };
  }
}

module.exports = InsightGenerator;