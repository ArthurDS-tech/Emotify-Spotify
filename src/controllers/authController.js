const axios = require('axios');
const User = require('../models/User');
const TokenManager = require('../utils/tokenManager');
const config = require('../config/spotify');
const logger = require('../utils/logger');

// Dados de demo para teste
const DEMO_USER = {
  id: 'demo_user_123',
  email: 'demo@example.com',
  display_name: 'Usuário Demo',
  images: [{ url: 'https://via.placeholder.com/150' }],
  country: 'BR'
};

const DEMO_TRACKS = [
  {
    id: 'track1',
    name: 'Blinding Lights',
    artists: [{ name: 'The Weeknd' }],
    album: { name: 'After Hours' }
  },
  {
    id: 'track2', 
    name: 'Watermelon Sugar',
    artists: [{ name: 'Harry Styles' }],
    album: { name: 'Fine Line' }
  }
];

const DEMO_AUDIO_FEATURES = [
  {
    id: 'track1',
    danceability: 0.514,
    energy: 0.73,
    valence: 0.675,
    acousticness: 0.001,
    instrumentalness: 0.000,
    tempo: 171.005
  },
  {
    id: 'track2',
    danceability: 0.548,
    energy: 0.816,
    valence: 0.557,
    acousticness: 0.122,
    instrumentalness: 0.000,
    tempo: 95.079
  }
];

const isDemoMode = () => {
  return config.clientId === 'demo_client_id' || !config.clientId || config.clientId === 'your_spotify_client_id';
};

exports.getAuthUrl = (req, res) => {
  if (isDemoMode()) {
    // Modo demo - retorna URL fake
    const demoUrl = `http://localhost:3000/demo-auth?code=demo_code_123&state=demo_state`;
    return res.json({ authUrl: demoUrl });
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code',
    redirect_uri: config.redirectUri,
    scope: config.scopes,
    state: Math.random().toString(36).substring(7)
  });

  const authUrl = `${config.authUrl}?${params}`;
  res.json({ authUrl });
};

exports.callback = async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Código de autorização não fornecido' });
    }

    let spotifyProfile, spotifyToken, refreshToken;

    if (isDemoMode() || code === 'demo_code_123') {
      // Modo demo
      logger.info('Usando modo DEMO - dados simulados');
      spotifyProfile = DEMO_USER;
      spotifyToken = 'demo_access_token_123';
      refreshToken = 'demo_refresh_token_123';
    } else {
      // Modo real
      logger.info('🔐 Iniciando troca de código por token...');
      logger.info(`📍 Redirect URI: ${config.redirectUri}`);
      logger.info(`🔑 Client ID: ${config.clientId}`);
      
      // Spotify requer application/x-www-form-urlencoded e Basic Auth
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri
      });

      const authHeader = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

      const tokenResponse = await axios.post(config.tokenUrl, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`
        }
      });

      spotifyToken = tokenResponse.data.access_token;
      refreshToken = tokenResponse.data.refresh_token;

      logger.info('✅ Token obtido com sucesso!');

      const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${spotifyToken}` }
      });

      spotifyProfile = profileResponse.data;
      logger.info(`👤 Perfil obtido: ${spotifyProfile.email}`);
    }

    // Simular salvamento no banco (sem MongoDB)
    const userData = {
      _id: 'demo_user_id_123',
      spotifyId: spotifyProfile.id,
      email: spotifyProfile.email,
      name: spotifyProfile.display_name,
      profileImage: spotifyProfile.images?.[0]?.url,
      country: spotifyProfile.country,
      spotifyAccessToken: spotifyToken,
      spotifyRefreshToken: refreshToken
    };

    // Gerar tokens próprios (incluindo o access token do Spotify no payload)
    const accessToken = TokenManager.generateAccessToken(
      userData._id,
      userData.spotifyId,
      spotifyToken
    );
    const newRefreshToken = TokenManager.generateRefreshToken(userData._id);

    logger.info(`Usuario autenticado (${isDemoMode() ? 'DEMO' : 'REAL'}): ${userData.email}`);

    const frontendUrl = process.env.FRONTEND_URL;

    if (frontendUrl) {
      const params = new URLSearchParams({
        accessToken,
        refreshToken: newRefreshToken,
        name: userData.name || '',
        email: userData.email || '',
        profileImage: userData.profileImage || ''
      });

      return res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
    }

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: userData._id,
        email: userData.email,
        name: userData.name,
        profileImage: userData.profileImage
      }
    });
  } catch (error) {
    logger.error('❌ Auth callback error:', error.message);
    
    if (error.response) {
      logger.error('📋 Status:', error.response.status);
      logger.error('📋 Data:', JSON.stringify(error.response.data));
      logger.error('📋 Headers:', JSON.stringify(error.response.headers));
      
      return res.status(error.response.status).json({ 
        error: 'Erro na autenticação com Spotify',
        details: error.response.data 
      });
    }
    
    res.status(500).json({ error: 'Erro na autenticação' });
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    const decoded = TokenManager.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: 'Refresh token inválido' });
    }

    const newAccessToken = TokenManager.generateAccessToken(decoded.userId, 'demo_spotify_id');
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    logger.error('Refresh token error:', error.message);
    res.status(500).json({ error: 'Erro ao renovar token' });
  }
};

// Exportar dados de demo para outros controladores
exports.DEMO_USER = DEMO_USER;
exports.DEMO_TRACKS = DEMO_TRACKS;
exports.DEMO_AUDIO_FEATURES = DEMO_AUDIO_FEATURES;
exports.isDemoMode = isDemoMode;