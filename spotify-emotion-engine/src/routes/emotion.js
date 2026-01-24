const express = require('express');
const emotionController = require('../controllers/emotionController');
const auth = require('../middleware/auth');
const { spotifyLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/analyze', auth, spotifyLimiter, emotionController.analyzeEmotion);
router.get('/history', auth, emotionController.getAnalysisHistory);

module.exports = router;