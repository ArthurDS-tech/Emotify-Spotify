const express = require('express');
const tracksController = require('../controllers/tracksController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/top', auth, tracksController.getTopTracks);
router.get('/recently-played', auth, tracksController.getRecentlyPlayed);

module.exports = router;
