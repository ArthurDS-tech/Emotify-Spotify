const express = require('express');
const playlistController = require('../controllers/playlistController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, playlistController.getUserPlaylists);
router.post('/create-emotion', auth, playlistController.createEmotionPlaylist);
router.get('/recommendations', auth, playlistController.getRecommendations);

module.exports = router;
