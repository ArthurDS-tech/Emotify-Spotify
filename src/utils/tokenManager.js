const jwt = require('jsonwebtoken');

class TokenManager {
  static generateAccessToken(userId, spotifyId, spotifyAccessToken) {
    return jwt.sign(
      { userId, spotifyId, spotifyAccessToken },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  static generateRefreshToken(userId) {
    return jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.type === 'refresh' ? decoded : null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = TokenManager;