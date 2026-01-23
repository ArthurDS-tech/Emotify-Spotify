const express = require('express');
const emotionController = require('../controllers/emotionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/analyze', auth, emotionController.analyzeEmotion);
router.get('/history', auth, emotionController.getAnalysisHistory);

module.exports = router;
