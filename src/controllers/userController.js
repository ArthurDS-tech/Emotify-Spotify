const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-spotifyAccessToken -spotifyRefreshToken -refreshToken');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, updatedAt: new Date() },
      { new: true }
    ).select('-spotifyAccessToken -spotifyRefreshToken -refreshToken');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};