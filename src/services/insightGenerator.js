class InsightGenerator {
  static generateInsights(emotionScores, audioFeatures, dominantEmotion) {
    const insights = [];
    
    // Análise da emoção dominante
    if (emotionScores.alegria > 70) {
      insights.push('Suas músicas refletem um estado de espírito muito positivo');
    } else if (emotionScores.melancolia > 60) {
      insights.push('Você tem preferência por músicas mais introspectivas');
    }

    // Análise de energia
    const avgEnergy = this.calculateAverage(audioFeatures, 'energy');
    if (avgEnergy > 0.7) {
      insights.push('Você prefere músicas com alta energia');
    } else if (avgEnergy < 0.4) {
      insights.push('Suas músicas tendem a ser mais calmas e relaxantes');
    }

    // Análise de dançabilidade
    const avgDance = this.calculateAverage(audioFeatures, 'danceability');
    if (avgDance > 0.7) {
      insights.push('Suas músicas são perfeitas para dançar');
    }

    return insights.slice(0, 3); // Máximo 3 insights
  }

  static generateEmotionalTimeline(emotionScores) {
    const timeline = [];
    const emotions = Object.keys(emotionScores);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      timeline.push({
        date,
        emotion: randomEmotion,
        intensity: Math.round(emotionScores[randomEmotion])
      });
    }
    
    return timeline.reverse();
  }

  static generateAverageAudioFeatures(audioFeatures) {
    if (!audioFeatures || audioFeatures.length === 0) return {};

    const features = ['danceability', 'energy', 'valence', 'acousticness', 'instrumentalness', 'tempo'];
    const averages = {};

    features.forEach(feature => {
      averages[feature] = this.calculateAverage(audioFeatures, feature);
    });

    return averages;
  }

  static calculateAverage(array, property) {
    if (!array || array.length === 0) return 0;
    const sum = array.reduce((acc, item) => acc + (item[property] || 0), 0);
    return sum / array.length;
  }
}

module.exports = InsightGenerator;