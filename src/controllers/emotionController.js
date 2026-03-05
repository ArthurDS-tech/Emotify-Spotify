const emotionEngine = require('../services/emotionEngine');
const spotifyService = require('../services/spotifyService');
const supabaseService = require('../services/supabaseService');
const logger = require('../utils/logger');

class EmotionController {
  /**
   * Analyze user's top tracks
   */
  async analyzeTopTracks(req, res) {
    try {
      const { timeRange = 'medium_term', limit = 50 } = req.query;
      const user = await supabaseService.getUserById(req.user.userId);

      if (!user || !user.spotify_access_token) {
        return res.status(401).json({ error: 'Spotify not connected' });
      }

      // Get top tracks from Spotify
      const topTracks = await spotifyService.getTopTracks(
        user.spotify_access_token,
        timeRange,
        parseInt(limit)
      );

      if (!topTracks || topTracks.length === 0) {
        return res.json({ analyses: [], aggregated: null });
      }

      // Get audio features
      const trackIds = topTracks.map(t => t.id);
      const audioFeatures = await spotifyService.getAudioFeatures(
        user.spotify_access_token,
        trackIds
      );

      // Combine tracks with features
      const tracksWithFeatures = topTracks.map((track, index) => ({
        track: spotifyService.formatTrackData(track),
        audioFeatures: audioFeatures[index]
      })).filter(item => item.audioFeatures);

      // Analyze emotions
      const analysisResult = emotionEngine.analyzeMultipleTracks(tracksWithFeatures);

      // Save analyses to database
      const savePromises = analysisResult.analyses.map(async (item) => {
        return supabaseService.saveEmotionAnalysis({
          userId: user.id,
          trackId: item.track.id,
          trackName: item.track.name,
          artistName: item.track.artists,
          albumName: item.track.album,
          albumImage: item.track.albumImage,
          
          // Audio features
          valence: item.audioFeatures.valence,
          energy: item.audioFeatures.energy,
          danceability: item.audioFeatures.danceability,
          acousticness: item.audioFeatures.acousticness,
          instrumentalness: item.audioFeatures.instrumentalness,
          speechiness: item.audioFeatures.speechiness,
          liveness: item.audioFeatures.liveness,
          tempo: item.audioFeatures.tempo,
          loudness: item.audioFeatures.loudness,
          mode: item.audioFeatures.mode,
          key: item.audioFeatures.key,
          durationMs: item.audioFeatures.duration_ms,
          timeSignature: item.audioFeatures.time_signature,
          
          // Emotion scores
          joyScore: item.analysis.emotions.joy,
          sadnessScore: item.analysis.emotions.sadness,
          energyScore: item.analysis.emotions.energy,
          calmScore: item.analysis.emotions.calm,
          nostalgiaScore: item.analysis.emotions.nostalgia,
          euphoriaScore: item.analysis.emotions.euphoria,
          introspectionScore: item.analysis.emotions.introspection,
          
          primaryEmotion: item.analysis.primaryEmotion,
          emotionIntensity: item.analysis.emotionIntensity
        });
      });

      await Promise.all(savePromises);

      // Update user insights
      await this.updateUserInsights(user.id);

      res.json(analysisResult);
    } catch (error) {
      logger.error('Error analyzing top tracks:', error);
      res.status(500).json({ error: 'Failed to analyze tracks' });
    }
  }

  /**
   * Get user's emotion analyses from database
   */
  async getUserAnalyses(req, res) {
    try {
      const { limit = 50 } = req.query;
      const analyses = await supabaseService.getUserEmotionAnalyses(
        req.user.userId,
        parseInt(limit)
      );

      res.json({ analyses });
    } catch (error) {
      logger.error('Error fetching analyses:', error);
      res.status(500).json({ error: 'Failed to fetch analyses' });
    }
  }

  /**
   * Get emotion distribution
   */
  async getEmotionDistribution(req, res) {
    try {
      const analyses = await supabaseService.getUserEmotionAnalyses(req.user.userId, 100);

      if (!analyses || analyses.length === 0) {
        return res.json({ distribution: {}, dominantEmotion: null });
      }

      const emotionCounts = {};
      const emotionTotals = {
        joy: 0, sadness: 0, energy: 0, calm: 0,
        nostalgia: 0, euphoria: 0, introspection: 0
      };

      analyses.forEach(analysis => {
        // Count primary emotions
        emotionCounts[analysis.primary_emotion] = 
          (emotionCounts[analysis.primary_emotion] || 0) + 1;

        // Sum emotion scores
        emotionTotals.joy += parseFloat(analysis.joy_score || 0);
        emotionTotals.sadness += parseFloat(analysis.sadness_score || 0);
        emotionTotals.energy += parseFloat(analysis.energy_score || 0);
        emotionTotals.calm += parseFloat(analysis.calm_score || 0);
        emotionTotals.nostalgia += parseFloat(analysis.nostalgia_score || 0);
        emotionTotals.euphoria += parseFloat(analysis.euphoria_score || 0);
        emotionTotals.introspection += parseFloat(analysis.introspection_score || 0);
      });

      // Calculate averages
      const count = analyses.length;
      const avgEmotions = {};
      for (const emotion in emotionTotals) {
        avgEmotions[emotion] = emotionTotals[emotion] / count;
      }

      // Find dominant emotion
      const dominantEmotion = Object.entries(emotionCounts)
        .reduce((max, [emotion, count]) => 
          count > max.count ? { emotion, count } : max,
          { emotion: null, count: 0 }
        );

      res.json({
        distribution: emotionCounts,
        averageScores: avgEmotions,
        dominantEmotion: dominantEmotion.emotion,
        dominantPercentage: (dominantEmotion.count / count) * 100,
        totalTracks: count
      });
    } catch (error) {
      logger.error('Error getting emotion distribution:', error);
      res.status(500).json({ error: 'Failed to get distribution' });
    }
  }

  /**
   * Get personalized insights
   */
  async getInsights(req, res) {
    try {
      const insights = await supabaseService.getUserInsights(req.user.userId);

      if (!insights) {
        return res.json({ insights: null, message: 'No insights available yet' });
      }

      // Generate additional insights
      const analyses = await supabaseService.getUserEmotionAnalyses(req.user.userId, 100);
      
      if (analyses && analyses.length > 0) {
        const emotionTotals = {
          joy: 0, sadness: 0, energy: 0, calm: 0,
          nostalgia: 0, euphoria: 0, introspection: 0
        };

        analyses.forEach(analysis => {
          emotionTotals.joy += parseFloat(analysis.joy_score || 0);
          emotionTotals.sadness += parseFloat(analysis.sadness_score || 0);
          emotionTotals.energy += parseFloat(analysis.energy_score || 0);
          emotionTotals.calm += parseFloat(analysis.calm_score || 0);
          emotionTotals.nostalgia += parseFloat(analysis.nostalgia_score || 0);
          emotionTotals.euphoria += parseFloat(analysis.euphoria_score || 0);
          emotionTotals.introspection += parseFloat(analysis.introspection_score || 0);
        });

        const count = analyses.length;
        const avgEmotions = {};
        for (const emotion in emotionTotals) {
          avgEmotions[emotion] = emotionTotals[emotion] / count;
        }

        const generatedInsights = emotionEngine.generateInsights({
          averageEmotions: avgEmotions,
          dominantEmotion: insights.top_emotion,
          dominantEmotionPercentage: parseFloat(insights.top_emotion_percentage)
        });

        res.json({
          insights,
          personalizedInsights: generatedInsights
        });
      } else {
        res.json({ insights });
      }
    } catch (error) {
      logger.error('Error getting insights:', error);
      res.status(500).json({ error: 'Failed to get insights' });
    }
  }

  /**
   * Analyze a specific track
   */
  async analyzeTrack(req, res) {
    try {
      const { trackId } = req.params;
      const user = await supabaseService.getUserById(req.user.userId);

      if (!user || !user.spotify_access_token) {
        return res.status(401).json({ error: 'Spotify not connected' });
      }

      // Check if already analyzed
      const existing = await supabaseService.getEmotionAnalysisByTrack(
        user.id,
        trackId
      );

      if (existing) {
        return res.json({ analysis: existing, cached: true });
      }

      // Get track and audio features
      const [track, audioFeatures] = await Promise.all([
        spotifyService.getTrack(user.spotify_access_token, trackId),
        spotifyService.getTrackAudioFeatures(user.spotify_access_token, trackId)
      ]);

      // Analyze emotion
      const analysis = emotionEngine.analyzeTrack(audioFeatures);

      // Save to database
      await supabaseService.saveEmotionAnalysis({
        userId: user.id,
        trackId: track.id,
        trackName: track.name,
        artistName: track.artists.map(a => a.name).join(', '),
        albumName: track.album.name,
        albumImage: track.album.images[0]?.url,
        
        valence: audioFeatures.valence,
        energy: audioFeatures.energy,
        danceability: audioFeatures.danceability,
        acousticness: audioFeatures.acousticness,
        instrumentalness: audioFeatures.instrumentalness,
        speechiness: audioFeatures.speechiness,
        liveness: audioFeatures.liveness,
        tempo: audioFeatures.tempo,
        loudness: audioFeatures.loudness,
        mode: audioFeatures.mode,
        key: audioFeatures.key,
        durationMs: audioFeatures.duration_ms,
        timeSignature: audioFeatures.time_signature,
        
        joyScore: analysis.emotions.joy,
        sadnessScore: analysis.emotions.sadness,
        energyScore: analysis.emotions.energy,
        calmScore: analysis.emotions.calm,
        nostalgiaScore: analysis.emotions.nostalgia,
        euphoriaScore: analysis.emotions.euphoria,
        introspectionScore: analysis.emotions.introspection,
        
        primaryEmotion: analysis.primaryEmotion,
        emotionIntensity: analysis.emotionIntensity
      });

      res.json({ track, analysis, cached: false });
    } catch (error) {
      logger.error('Error analyzing track:', error);
      res.status(500).json({ error: 'Failed to analyze track' });
    }
  }

  /**
   * Update user insights (internal helper)
   */
  async updateUserInsights(userId) {
    try {
      const analyses = await supabaseService.getUserEmotionAnalyses(userId, 1000);

      if (!analyses || analyses.length === 0) return;

      const emotionCounts = {};
      let totalValence = 0, totalEnergy = 0, totalDanceability = 0;
      let totalDuration = 0;

      analyses.forEach(analysis => {
        emotionCounts[analysis.primary_emotion] = 
          (emotionCounts[analysis.primary_emotion] || 0) + 1;
        
        totalValence += parseFloat(analysis.valence || 0);
        totalEnergy += parseFloat(analysis.energy || 0);
        totalDanceability += parseFloat(analysis.danceability || 0);
        totalDuration += parseInt(analysis.duration_ms || 0);
      });

      const count = analyses.length;
      const topEmotion = Object.entries(emotionCounts)
        .reduce((max, [emotion, count]) => 
          count > max.count ? { emotion, count } : max,
          { emotion: 'neutral', count: 0 }
        );

      await supabaseService.updateUserInsights(userId, {
        topEmotion: topEmotion.emotion,
        topEmotionPercentage: (topEmotion.count / count) * 100,
        avgValence: totalValence / count,
        avgEnergy: totalEnergy / count,
        avgDanceability: totalDanceability / count,
        totalTracksAnalyzed: count,
        totalListeningTimeMs: totalDuration,
        favoriteGenres: {},
        topArtists: {}
      });
    } catch (error) {
      logger.error('Error updating user insights:', error);
    }
  }
}

module.exports = new EmotionController();
