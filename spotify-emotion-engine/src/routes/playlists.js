const express = require('express');
const playlistController = require('../controllers/playlistController');
const auth = require('../middleware/auth');
const { spotifyLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/create', auth, spotifyLimiter, playlistController.createPlaylist);
router.get('/', auth, spotifyLimiter, playlistController.getUserPlaylists);
router.post('/:playlistId/tracks', auth, spotifyLimiter, playlistController.addTracksToPlaylist);

module.exports = router;