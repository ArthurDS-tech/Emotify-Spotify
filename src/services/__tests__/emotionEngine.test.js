const emotionEngine = require('../emotionEngine');

describe('EmotionEngine', () => {
  test('classifies upbeat tracks as joy/euphoria leaning', () => {
    const result = emotionEngine.analyzeTrack({
      valence: 0.92,
      energy: 0.85,
      danceability: 0.88,
      acousticness: 0.1,
      instrumentalness: 0.0,
      speechiness: 0.08,
      liveness: 0.22,
      tempo: 132,
      loudness: -4,
      mode: 1,
      key: 5,
    });

    expect(['joy', 'euphoria', 'energy']).toContain(result.primaryEmotion);
    expect(result.emotions.joy).toBeGreaterThan(0.65);
    expect(result.emotions.sadness).toBeLessThan(0.55);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  test('classifies low-valence low-energy tracks as sadness/introspection leaning', () => {
    const result = emotionEngine.analyzeTrack({
      valence: 0.18,
      energy: 0.21,
      danceability: 0.3,
      acousticness: 0.78,
      instrumentalness: 0.26,
      speechiness: 0.14,
      liveness: 0.09,
      tempo: 76,
      loudness: -22,
      mode: 0,
      key: 2,
    });

    expect(['sadness', 'introspection', 'calm']).toContain(result.primaryEmotion);
    expect(result.emotions.sadness).toBeGreaterThan(0.5);
  });

  test('returns safe zeroed aggregate for empty input', () => {
    const result = emotionEngine.analyzeMultipleTracks([]);

    expect(result.analyses).toEqual([]);
    expect(result.aggregated.totalTracks).toBe(0);
    expect(result.aggregated.dominantEmotion).toBeNull();
  });
});
