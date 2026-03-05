const express = require('express');
const tracksController = require('../controllers/tracksController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/top', auth, tracksController.getTopTracks);
router.get('/recent', auth, tracksController.getRecentlyPlayed);
router.get('/search', auth, tracksController.searchTracks);
router.get('/:trackId', auth, tracksController.getTrack);
router.get('/:trackId/features', auth, tracksController.getAudioFeatures);

module.exports = router;
