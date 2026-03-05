const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class SupabaseService {
  /**
   * User Operations
   */
  async createOrUpdateUser(userData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .upsert({
          spotify_id: userData.spotifyId,
          email: userData.email,
          display_name: userData.displayName,
          profile_image: userData.profileImage,
          country: userData.country,
          spotify_access_token: userData.accessToken,
          spotify_refresh_token: userData.refreshToken,
          token_expires_at: userData.tokenExpiresAt,
          last_login: new Date().toISOString()
        }, {
          onConflict: 'spotify_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating/updating user:', error);
      throw error;
    }
  }

  async getUserBySpotifyId(spotifyId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('spotify_id', spotifyId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  async updateUserTokens(userId, accessToken, refreshToken, expiresAt) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          spotify_access_token: accessToken,
          spotify_refresh_token: refreshToken,
          token_expires_at: expiresAt
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating user tokens:', error);
      throw error;
    }
  }

  /**
   * Emotion Analysis Operations
   */
  async saveEmotionAnalysis(analysisData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('emotion_analyses')
        .upsert({
          user_id: analysisData.userId,
          track_id: analysisData.trackId,
          track_name: analysisData.trackName,
          artist_name: analysisData.artistName,
          album_name: analysisData.albumName,
          album_image: analysisData.albumImage,
          
          // Audio features
          valence: analysisData.valence,
          energy: analysisData.energy,
          danceability: analysisData.danceability,
          acousticness: analysisData.acousticness,
          instrumentalness: analysisData.instrumentalness,
          speechiness: analysisData.speechiness,
          liveness: analysisData.liveness,
          tempo: analysisData.tempo,
          loudness: analysisData.loudness,
          mode: analysisData.mode,
          key: analysisData.key,
          duration_ms: analysisData.durationMs,
          time_signature: analysisData.timeSignature,
          
          // Emotion scores
          joy_score: analysisData.joyScore,
          sadness_score: analysisData.sadnessScore,
          energy_score: analysisData.energyScore,
          calm_score: analysisData.calmScore,
          nostalgia_score: analysisData.nostalgiaScore,
          euphoria_score: analysisData.euphoriaScore,
          introspection_score: analysisData.introspectionScore,
          
          primary_emotion: analysisData.primaryEmotion,
          emotion_intensity: analysisData.emotionIntensity
        }, {
          onConflict: 'user_id,track_id'
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error saving emotion analysis:', error);
      throw error;
    }
  }

  async getUserEmotionAnalyses(userId, limit = 50) {
    try {
      const { data, error } = await supabaseAdmin
        .from('emotion_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('analyzed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching emotion analyses:', error);
      throw error;
    }
  }

  async getEmotionAnalysisByTrack(userId, trackId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('emotion_analyses')
        .select('*')
        .eq('user_id', userId)
        .eq('track_id', trackId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching emotion analysis:', error);
      throw error;
    }
  }

  /**
   * Listening History Operations
   */
  async saveListeningHistory(historyData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('listening_history')
        .insert(historyData.map(item => ({
          user_id: item.userId,
          track_id: item.trackId,
          track_name: item.trackName,
          artist_name: item.artistName,
          played_at: item.playedAt,
          context_type: item.contextType,
          context_uri: item.contextUri
        })))
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error saving listening history:', error);
      throw error;
    }
  }

  async getUserListeningHistory(userId, limit = 100) {
    try {
      const { data, error } = await supabaseAdmin
        .from('listening_history')
        .select('*')
        .eq('user_id', userId)
        .order('played_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching listening history:', error);
      throw error;
    }
  }

  /**
   * Playlist Operations
   */
  async createPlaylist(playlistData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('playlists')
        .insert({
          user_id: playlistData.userId,
          spotify_playlist_id: playlistData.spotifyPlaylistId,
          name: playlistData.name,
          description: playlistData.description,
          emotion_theme: playlistData.emotionTheme,
          is_public: playlistData.isPublic,
          is_collaborative: playlistData.isCollaborative,
          image_url: playlistData.imageUrl,
          track_count: playlistData.trackCount || 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating playlist:', error);
      throw error;
    }
  }

  async getUserPlaylists(userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('playlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching playlists:', error);
      throw error;
    }
  }

  async addTracksToPlaylist(playlistId, tracks) {
    try {
      const { data, error } = await supabaseAdmin
        .from('playlist_tracks')
        .insert(tracks.map((track, index) => ({
          playlist_id: playlistId,
          track_id: track.trackId,
          track_name: track.trackName,
          artist_name: track.artistName,
          added_by: track.addedBy,
          position: index
        })))
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error adding tracks to playlist:', error);
      throw error;
    }
  }

  /**
   * User Insights Operations
   */
  async updateUserInsights(userId, insightsData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_insights')
        .upsert({
          user_id: userId,
          top_emotion: insightsData.topEmotion,
          top_emotion_percentage: insightsData.topEmotionPercentage,
          avg_valence: insightsData.avgValence,
          avg_energy: insightsData.avgEnergy,
          avg_danceability: insightsData.avgDanceability,
          total_tracks_analyzed: insightsData.totalTracksAnalyzed,
          total_listening_time_ms: insightsData.totalListeningTimeMs,
          favorite_genres: insightsData.favoriteGenres,
          top_artists: insightsData.topArtists,
          most_active_hour: insightsData.mostActiveHour,
          most_active_day: insightsData.mostActiveDay
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating user insights:', error);
      throw error;
    }
  }

  async getUserInsights(userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_insights')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching user insights:', error);
      throw error;
    }
  }

  /**
   * Track Cache Operations
   */
  async getCachedTrack(trackId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('track_cache')
        .select('*')
        .eq('track_id', trackId)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching cached track:', error);
      return null;
    }
  }

  async cacheTrack(trackId, trackData, audioFeatures) {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { data, error } = await supabaseAdmin
        .from('track_cache')
        .upsert({
          track_id: trackId,
          track_data: trackData,
          audio_features: audioFeatures,
          expires_at: expiresAt.toISOString()
        }, {
          onConflict: 'track_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error caching track:', error);
      return null;
    }
  }

  /**
   * Social Features - User Connections
   */
  async createConnection(userId, connectedUserId, compatibilityScore) {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_connections')
        .insert({
          user_id: userId,
          connected_user_id: connectedUserId,
          compatibility_score: compatibilityScore,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating connection:', error);
      throw error;
    }
  }

  async getUserConnections(userId, status = 'accepted') {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_connections')
        .select(`
          *,
          connected_user:users!user_connections_connected_user_id_fkey(
            id, display_name, profile_image, spotify_id
          )
        `)
        .eq('user_id', userId)
        .eq('status', status);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching connections:', error);
      throw error;
    }
  }

  async updateConnectionStatus(connectionId, status) {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_connections')
        .update({ status })
        .eq('id', connectionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating connection status:', error);
      throw error;
    }
  }
}

module.exports = new SupabaseService();
