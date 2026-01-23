const axios = require('axios');
const User = require('../models/User');
const TokenManager = require('../utils/tokenManager');
const config = require('../config/spotify');
const logger = require('../utils/logger');

exports.getAuthUrl = (req, res) => {
  try {
    if (!config.clientId || !config.redirectUri) {
      return res.status(500).json({ 
        error: 'Configuração do Spotify incompleta. Verifique SPOTIFY_CLIENT_ID e SPOTIFY_REDIRECT_URI no .env' 
      });
    }

    const state = Math.random().toString(36).substring(7);
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: 'code',
      redirect_uri: config.redirectUri,
      scope: config.scopes,
      state: state,
      show_dialog: 'false'
    });

    const authUrl = `${config.authUrl}?${params.toString()}`;
    
    logger.info('URL de autenticação gerada com sucesso');
    res.json({ authUrl });
  } catch (error) {
    logger.error('Erro ao gerar URL de autenticação:', error.message);
    res.status(500).json({ error: 'Erro ao gerar URL de autenticação' });
  }
};

exports.callback = async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.redirect('/?error=no_code');
    }

    const tokenResponse = await axios.post(config.tokenUrl, 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
        client_secret: config.clientSecret
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const spotifyToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;
    const expiresIn = tokenResponse.data.expires_in;

    const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${spotifyToken}` }
    });

    const spotifyProfile = profileResponse.data;

    // Tentar salvar no banco, se não conseguir, continuar mesmo assim
    let userId = spotifyProfile.id;
    try {
      let user = await User.findOne({ spotifyId: spotifyProfile.id });
      
      if (!user) {
        user = new User({
          spotifyId: spotifyProfile.id,
          email: spotifyProfile.email,
          name: spotifyProfile.display_name,
          profileImage: spotifyProfile.images?.[0]?.url,
          country: spotifyProfile.country
        });
      }

      user.spotifyAccessToken = spotifyToken;
      user.spotifyRefreshToken = refreshToken;
      user.tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);
      user.refreshToken = TokenManager.generateRefreshToken(user._id || userId);

      await user.save();
      userId = user._id;
      
      logger.info(`Usuario autenticado e salvo: ${user.email}`);
    } catch (dbError) {
      logger.warn('Não foi possível salvar no banco, continuando em modo demo');
    }

    const accessToken = TokenManager.generateAccessToken(userId, spotifyProfile.id);

    logger.info(`Usuario autenticado: ${spotifyProfile.email}`);

    // Redirecionar para dashboard com token e dados do usuário
    const userData = encodeURIComponent(JSON.stringify({
      name: spotifyProfile.display_name,
      email: spotifyProfile.email,
      image: spotifyProfile.images?.[0]?.url
    }));
    
    res.redirect(`/dashboard.html?token=${accessToken}&user=${userData}`);
  } catch (error) {
    logger.error('Auth callback error:', error.message);
    res.redirect('/?error=auth_failed');
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token não fornecido' });
    }

    const decoded = TokenManager.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: 'Refresh token inválido' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const newAccessToken = TokenManager.generateAccessToken(user._id, user.spotifyId);
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    logger.error('Refresh token error:', error.message);
    res.status(500).json({ error: 'Erro ao renovar token' });
  }
};
