const express = require('express');
const authRoutes = require('./authRoutes');
const emotionRoutes = require('./emotionRoutes');
const tracksRoutes = require('./tracksRoutes');
const playlistRoutes = require('./playlistRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/emotion', emotionRoutes);
router.use('/tracks', tracksRoutes);
router.use('/playlists', playlistRoutes);
router.use('/user', userRoutes);

module.exports = router;
