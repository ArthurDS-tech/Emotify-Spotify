const emotionEngine = require('../services/emotionEngine');
const spotifyService = require('../services/spotifyService');
const supabaseService = require('../services/supabaseService');
const logger = require('../utils/logger');

class EmotionController {
  async executeSpotifyWithRefresh(user, executor) {
    try {
      return await executor(user.spotify_access_token);
    } catch (error) {
      if (error.response?.status !== 401 || !user.spotify_refresh_token) {
        throw error;
      }

      const { accessToken, expiresIn } = await spotifyService.refreshAccessToken(
        user.spotify_refresh_token
      );

      const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
      await supabaseService.updateUserTokens(
        user.id,
        accessToken,
        user.spotify_refresh_token,
        tokenExpiresAt
      );

      user.spotify_access_token = accessToken;
      return executor(accessToken);
    }
  }

  async getArtistGenresMap(user, tracks) {
    const artistIds = [...new Set(
      tracks
        .flatMap(track => (track.artists || []).map(artist => artist.id))
        .filter(Boolean)
    )];

    if (artistIds.length === 0) {
      return new Map();
    }

    try {
      const artists = await this.executeSpotifyWithRefresh(
        user,
        (token) => spotifyService.getArtists(token, artistIds)
      );
      return new Map(artists.map(artist => [artist.id, artist.genres || []]));
    } catch (error) {
      if (error.response?.status === 403) {
        logger.warn('Spotify artists endpoint unavailable (403). Continuing without genre enrichment.');
        return new Map();
      }
      throw error;
    }
  }

  async getAudioFeaturesMap(user, tracks) {
    const trackIds = tracks.map(track => track.id).filter(Boolean);
    if (trackIds.length === 0) {
      return new Map();
    }

    try {
      const audioFeatures = await this.executeSpotifyWithRefresh(
        user,
        (token) => spotifyService.getAudioFeatures(token, trackIds)
      );
      return new Map(
        audioFeatures
          .filter(feature => feature && feature.id)
          .map(feature => [feature.id, feature])
      );
    } catch (error) {
      if (error.response?.status === 403) {
        logger.warn('Spotify audio-features unavailable (403). Using metadata estimation fallback.');
        return new Map();
      }
      throw error;
    }
  }

  async analyzeTracksWithFallback(user, tracks, persist = true) {
    const audioFeaturesById = await this.getAudioFeaturesMap(user, tracks);
    const genresByArtistId = await this.getArtistGenresMap(user, tracks);

    const trackEntries = tracks
      .filter(track => track && track.id)
      .map(track => {
        const directFeatures = audioFeaturesById.get(track.id);
        const genres = (track.artists || [])
          .flatMap(artist => genresByArtistId.get(artist.id) || []);
        const features = directFeatures || emotionEngine.estimateFeaturesFromMetadata(track, genres);
        const analysis = emotionEngine.analyzeTrack(features);

        return {
          track,
          audioFeatures: features,
          analysis,
          source: directFeatures ? 'audio_features' : 'metadata_estimation'
        };
      });

    if (persist && trackEntries.length > 0) {
      await Promise.all(
        trackEntries.map(async (item) => {
          await supabaseService.saveEmotionAnalysis({
            userId: user.id,
            trackId: item.track.id,
            trackName: item.track.name,
            artistName: item.track.artists.map(a => a.name).join(', '),
            albumName: item.track.album?.name,
            albumImage: item.track.album?.images?.[0]?.url || null,
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
            durationMs: item.track.duration_ms || item.audioFeatures.duration_ms,
            timeSignature: item.audioFeatures.time_signature,
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
        })
      );
    }

    return trackEntries;
  }

  buildEmotionSummary(entries) {
    if (!entries.length) {
      return {
        totalTracks: 0,
        dominantEmotion: null,
        dominantPercentage: 0,
        distribution: {},
        averageConfidence: 0
      };
    }

    const counts = {};
    let confidenceSum = 0;

    entries.forEach((entry) => {
      const emotion = entry.analysis.primaryEmotion;
      counts[emotion] = (counts[emotion] || 0) + 1;
      confidenceSum += Number(entry.analysis.confidence || 0);
    });

    const dominant = Object.entries(counts).reduce(
      (max, [emotion, count]) => (count > max.count ? { emotion, count } : max),
      { emotion: null, count: 0 }
    );

    return {
      totalTracks: entries.length,
      dominantEmotion: dominant.emotion,
      dominantPercentage: (dominant.count / entries.length) * 100,
      distribution: counts,
      averageConfidence: confidenceSum / entries.length
    };
  }

  formatTrackEntryForResponse(entry) {
    return {
      id: entry.track.id,
      name: entry.track.name,
      artists: (entry.track.artists || []).map(artist => artist.name).join(', '),
      album: entry.track.album?.name || '',
      albumImage: entry.track.album?.images?.[0]?.url || null,
      popularity: entry.track.popularity || 0,
      source: entry.source,
      primaryEmotion: entry.analysis.primaryEmotion,
      secondaryEmotion: entry.analysis.secondaryEmotion,
      emotionalBlend: entry.analysis.emotionalBlend,
      confidence: entry.analysis.confidence,
      emotionIntensity: entry.analysis.emotionIntensity,
      psychologicalProfile: entry.analysis.psychologicalProfile,
      emotionalDimensions: entry.analysis.emotionalDimensions
    };
  }

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

      // Try direct audio features first.
      const trackIds = topTracks.map(t => t.id).filter(Boolean);
      let audioFeatures = [];
      try {
        audioFeatures = await spotifyService.getAudioFeatures(
          user.spotify_access_token,
          trackIds
        );
      } catch (error) {
        if (error.response?.status === 403) {
          logger.warn('Spotify audio-features unavailable (403). Falling back to metadata estimation.');
        } else {
          throw error;
        }
      }

      const audioFeaturesById = new Map(
        audioFeatures
          .filter(feature => feature && feature.id)
          .map(feature => [feature.id, feature])
      );

      // Build artist genres map for metadata fallback.
      const allArtistIds = [...new Set(
        topTracks
          .flatMap(track => (track.artists || []).map(artist => artist.id))
          .filter(Boolean)
      )];

      let artistById = new Map();
      try {
        const artists = await spotifyService.getArtists(
          user.spotify_access_token,
          allArtistIds
        );
        artistById = new Map(artists.map(artist => [artist.id, artist]));
      } catch (error) {
        if (error.response?.status === 403) {
          logger.warn('Spotify artists endpoint unavailable (403). Fallback will run without genre enrichment.');
        } else {
          throw error;
        }
      }

      // Combine tracks with features
      const tracksWithFeatures = topTracks.map((track) => ({
        track: spotifyService.formatTrackData(track),
        audioFeatures: audioFeaturesById.get(track.id) || emotionEngine.estimateFeaturesFromMetadata(
          track,
          (track.artists || [])
            .flatMap(artist => artistById.get(artist.id)?.genres || [])
        )
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
        return res.json({
          insights: null,
          personalizedInsights: [],
          message: 'No insights available yet'
        });
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
        res.json({ insights, personalizedInsights: [] });
      }
    } catch (error) {
      logger.error('Error getting insights:', error);
      res.status(500).json({ error: 'Failed to get insights' });
    }
  }

  async analyzeCompleteProfile(req, res) {
    try {
      const user = await supabaseService.getUserById(req.user.userId);
      if (!user || !user.spotify_access_token) {
        return res.status(401).json({ error: 'Spotify not connected' });
      }

      const [recentItems, topTracks] = await Promise.all([
        this.executeSpotifyWithRefresh(user, (token) => spotifyService.getRecentlyPlayed(token, 20)),
        this.executeSpotifyWithRefresh(user, (token) => spotifyService.getTopTracks(token, 'short_term', 20))
      ]);

      const recentTracks = recentItems.map(item => item.track).filter(Boolean);
      const recentEntries = await this.analyzeTracksWithFallback(user, recentTracks, true);
      const topEntries = await this.analyzeTracksWithFallback(user, topTracks, true);

      await this.updateUserInsights(user.id);

      res.json({
        success: true,
        message: 'Perfil emocional atualizado com sucesso',
        report: {
          generatedAt: new Date().toISOString(),
          recent: {
            summary: this.buildEmotionSummary(recentEntries),
            tracks: recentEntries.map(entry => this.formatTrackEntryForResponse(entry))
          },
          top: {
            summary: this.buildEmotionSummary(topEntries),
            tracks: topEntries.map(entry => this.formatTrackEntryForResponse(entry))
          }
        }
      });
    } catch (error) {
      logger.error('Error analyzing complete profile:', error);
      res.status(500).json({ error: 'Failed to analyze complete profile' });
    }
  }

  async getEmotionReport(req, res) {
    try {
      const user = await supabaseService.getUserById(req.user.userId);
      if (!user || !user.spotify_access_token) {
        return res.status(401).json({ error: 'Spotify not connected' });
      }

      const [recentItems, topTracks] = await Promise.all([
        this.executeSpotifyWithRefresh(user, (token) => spotifyService.getRecentlyPlayed(token, 20)),
        this.executeSpotifyWithRefresh(user, (token) => spotifyService.getTopTracks(token, 'short_term', 20))
      ]);

      const recentTracks = recentItems.map(item => item.track).filter(Boolean);
      const recentEntries = await this.analyzeTracksWithFallback(user, recentTracks, false);
      const topEntries = await this.analyzeTracksWithFallback(user, topTracks, false);

      res.json({
        generatedAt: new Date().toISOString(),
        recent: {
          summary: this.buildEmotionSummary(recentEntries),
          tracks: recentEntries.map(entry => this.formatTrackEntryForResponse(entry))
        },
        top: {
          summary: this.buildEmotionSummary(topEntries),
          tracks: topEntries.map(entry => this.formatTrackEntryForResponse(entry))
        }
      });
    } catch (error) {
      logger.error('Error fetching emotion report:', error);
      res.status(500).json({ error: 'Failed to fetch emotion report' });
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

      // Get track and try direct audio features.
      const track = await spotifyService.getTrack(user.spotify_access_token, trackId);
      let audioFeatures;
      let analysisSource = 'audio_features';

      try {
        audioFeatures = await spotifyService.getTrackAudioFeatures(
          user.spotify_access_token,
          trackId
        );
      } catch (error) {
        if (error.response?.status !== 403) {
          throw error;
        }

        let genres = [];
        try {
          const artists = await spotifyService.getArtists(
            user.spotify_access_token,
            (track.artists || []).map(artist => artist.id).filter(Boolean)
          );
          genres = artists.flatMap(artist => artist.genres || []);
        } catch (artistError) {
          if (artistError.response?.status === 403) {
            logger.warn('Spotify artists endpoint unavailable (403) during single-track fallback.');
          } else {
            throw artistError;
          }
        }
        audioFeatures = emotionEngine.estimateFeaturesFromMetadata(track, genres);
        analysisSource = 'metadata_estimation';
      }

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

      res.json({ track, analysis, source: analysisSource, cached: false });
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
