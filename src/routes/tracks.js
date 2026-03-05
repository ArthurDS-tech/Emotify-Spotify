const express = require('express');
const tracksController = require('../controllers/tracksController');
const auth = require('../middleware/auth');
const { spotifyLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/top', auth, spotifyLimiter, tracksController.getTopTracks);
router.get('/recently-played', auth, spotifyLimiter, tracksController.getRecentlyPlayed);

module.exports = router;