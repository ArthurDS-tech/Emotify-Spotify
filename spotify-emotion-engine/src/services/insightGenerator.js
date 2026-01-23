class InsightGenerator {
  static generateInsights(emotionScores, normalizedFeatures, dominantEmotion) {
    const insights = [];
    const avg = this._calculateAverages(normalizedFeatures);

    // Insight sobre emoção dominante
    const emotionMessages = {
      alegria: 'Suas músicas refletem um estado de espírito positivo e energético.',
      melancolia: 'Você tem preferido músicas mais introspectivas e melancólicas.',
      nostalgia: 'Suas escolhas musicais evocam memórias e sentimentos nostálgicos.',
      calma: 'Você busca tranquilidade e relaxamento em suas músicas.',
      euforia: 'Suas músicas são animadas e perfeitas para dançar.',
      introspecção: 'Você aprecia músicas instrumentais e contemplativas.',
      energia: 'Suas músicas são intensas e cheias de energia.'
    };
    insights.push(emotionMessages[dominantEmotion] || 'Seu gosto musical é diversificado.');

    // Insight sobre energia
    if (avg.energy > 0.7) {
      insights.push('Você prefere músicas com alta energia e ritmo acelerado.');
    } else if (avg.energy < 0.3) {
      insights.push('Você tende a escolher músicas mais calmas e relaxantes.');
    }

    // Insight sobre valência
    if (avg.valence > 0.6) {
      insights.push('Suas músicas transmitem positividade e bom humor.');
    } else if (avg.valence < 0.4) {
      insights.push('Você se conecta com músicas de tom mais sério ou melancólico.');
    }

    // Insight sobre acústico
    if (avg.acousticness > 0.5) {
      insights.push('Você aprecia sons acústicos e orgânicos.');
    }

    // Insight sobre dançabilidade
    if (avg.danceability > 0.7) {
      insights.push('Suas músicas são perfeitas para dançar e se movimentar.');
    }

    return insights.slice(0, 5);
  }

  static generateEmotionalTimeline(emotionScores) {
    const emotions = Object.entries(emotionScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return emotions.map(([emotion, score]) => ({
      emotion,
      score,
      percentage: Math.round((score / 100) * 100)
    }));
  }

  static generateAverageAudioFeatures(audioFeatures) {
    const avg = this._calculateAverages(audioFeatures);
    return {
      danceability: Math.round(avg.danceability * 100),
      energy: Math.round(avg.energy * 100),
      acousticness: Math.round(avg.acousticness * 100),
      valence: Math.round(avg.valence * 100),
      instrumentalness: Math.round(avg.instrumentalness * 100),
      tempo: Math.round(avg.tempo)
    };
  }

  static _calculateAverages(features) {
    const sum = features.reduce((acc, f) => ({
      danceability: acc.danceability + (f.danceability || 0),
      energy: acc.energy + (f.energy || 0),
      acousticness: acc.acousticness + (f.acousticness || 0),
      valence: acc.valence + (f.valence || 0),
      instrumentalness: acc.instrumentalness + (f.instrumentalness || 0),
      tempo: acc.tempo + (f.tempo || 120)
    }), {
      danceability: 0, energy: 0, acousticness: 0,
      valence: 0, instrumentalness: 0, tempo: 0
    });

    const count = features.length;
    return {
      danceability: sum.danceability / count,
      energy: sum.energy / count,
      acousticness: sum.acousticness / count,
      valence: sum.valence / count,
      instrumentalness: sum.instrumentalness / count,
      tempo: sum.tempo / count
    };
  }
}

module.exports = InsightGenerator;
