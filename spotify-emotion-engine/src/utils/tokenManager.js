const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'default-secret';
const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'default-refresh';

module.exports = {
  generateAccessToken: (userId, spotifyId) => 
    jwt.sign({ userId, spotifyId }, secret, { expiresIn: '7d' }),
  
  generateRefreshToken: (userId) => 
    jwt.sign({ userId }, refreshSecret, { expiresIn: '30d' }),
  
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, secret);
    } catch {
      return null;
    }
  },
  
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, refreshSecret);
    } catch {
      return null;
    }
  }
};
