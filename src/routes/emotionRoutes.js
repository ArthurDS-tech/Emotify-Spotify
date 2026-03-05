const express = require('express');
const emotionController = require('../controllers/emotionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/analyze/top-tracks', auth, emotionController.analyzeTopTracks);
router.get('/analyze/track/:trackId', auth, emotionController.analyzeTrack);
router.get('/analyses', auth, emotionController.getUserAnalyses);
router.get('/distribution', auth, emotionController.getEmotionDistribution);
router.get('/insights', auth, emotionController.getInsights);

module.exports = router;
