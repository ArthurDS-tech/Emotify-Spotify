const axios = require('axios');
const jwt = require('jsonwebtoken');
const supabaseService = require('../services/supabaseService');
const spotifyService = require('../services/spotifyService');
const logger = require('../utils/logger');

class AuthController {
  /**
   * Generate Spotify authorization URL
   */
  getAuthUrl(req, res) {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'user-library-read',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-read-playback-state',
      'user-read-currently-playing'
    ].join(' ');

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${process.env.SPOTIFY_CLIENT_ID}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(scopes)}`;

    res.json({ authUrl });
  }

  /**
   * Handle Spotify OAuth callback
   */
  async callback(req, res) {
    const { code } = req.query;

    if (!code) {
      logger.error('No authorization code received');
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=No authorization code`);
    }

    try {
      logger.info('🔐 Starting OAuth callback process...');
      
      // Exchange code for tokens
      logger.info('📝 Step 1: Exchanging code for tokens...');
      const tokenResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI
        }),
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      logger.info('✅ Tokens received successfully');

      // Get user profile from Spotify
      logger.info('👤 Step 2: Fetching user profile from Spotify...');
      const spotifyProfile = await spotifyService.getUserProfile(access_token);
      logger.info(`✅ User profile received: ${spotifyProfile.id} (${spotifyProfile.email})`);

      // Calculate token expiration
      const tokenExpiresAt = new Date(Date.now() + expires_in * 1000);

      // Create or update user in Supabase
      logger.info('💾 Step 3: Saving user to Supabase...');
      logger.info(`   Spotify ID: ${spotifyProfile.id}`);
      logger.info(`   Email: ${spotifyProfile.email}`);
      logger.info(`   Display Name: ${spotifyProfile.display_name}`);
      
      const user = await supabaseService.createOrUpdateUser({
        spotifyId: spotifyProfile.id,
        email: spotifyProfile.email,
        displayName: spotifyProfile.display_name,
        profileImage: spotifyProfile.images?.[0]?.url || null,
        country: spotifyProfile.country,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: tokenExpiresAt.toISOString()
      });
      
      logger.info(`✅ User saved successfully with ID: ${user.id}`);

      // Generate JWT for our application
      logger.info('🔑 Step 4: Generating JWT token...');
      const appToken = jwt.sign(
        {
          userId: user.id,
          spotifyId: user.spotify_id,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      logger.info('✅ JWT generated successfully');
      logger.info(`🎉 Authentication complete! Redirecting to: ${process.env.FRONTEND_URL}/auth/success`);
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${appToken}`);
    } catch (error) {
      logger.error('❌ OAuth callback error occurred');
      logger.error('Error type:', error.constructor.name);
      logger.error('Error message:', error.message);
      
      if (error.response) {
        logger.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      if (error.code) {
        logger.error('Error code:', error.code);
      }
      
      logger.error('Error stack:', error.stack);
      
      // Provide more specific error messages
      let errorMessage = 'Authentication failed';
      
      if (error.message.includes('Supabase') || error.message.includes('database')) {
        errorMessage = 'Database error - Please contact support';
        logger.error('🔴 DATABASE ERROR - Check Supabase configuration and schema');
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid Spotify credentials';
      } else if (error.response?.status === 401) {
        errorMessage = 'Spotify authorization failed';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(errorMessage)}`);
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser(req, res) {
    try {
      const user = await supabaseService.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Don't send sensitive tokens to client
      const { spotify_access_token, spotify_refresh_token, ...safeUser } = user;

      res.json({ user: safeUser });
    } catch (error) {
      logger.error('Error fetching current user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  /**
   * Refresh Spotify access token
   */
  async refreshToken(req, res) {
    try {
      const user = await supabaseService.getUserById(req.user.userId);

      if (!user || !user.spotify_refresh_token) {
        return res.status(401).json({ error: 'No refresh token available' });
      }

      const { accessToken, expiresIn } = await spotifyService.refreshAccessToken(
        user.spotify_refresh_token
      );

      const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

      await supabaseService.updateUserTokens(
        user.id,
        accessToken,
        user.spotify_refresh_token,
        tokenExpiresAt.toISOString()
      );

      res.json({ success: true });
    } catch (error) {
      logger.error('Error refreshing token:', error);
      res.status(500).json({ error: 'Failed to refresh token' });
    }
  }

  /**
   * Logout user
   */
  async logout(req, res) {
    try {
      // In a more complex setup, you might want to invalidate the JWT
      // For now, client-side token removal is sufficient
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Error during logout:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  }
}

module.exports = new AuthController();
