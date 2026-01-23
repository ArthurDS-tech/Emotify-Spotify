// === src/routes/auth.js ===
const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/url', authController.getAuthUrl);
router.get('/callback', authController.callback);
router.post('/refresh', authController.refreshAccessToken);

module.exports = router;

// === src/routes/user.js ===
const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;

// === src/routes/emotion.js ===
const express = require('express');
const emotionController = require('../controllers/emotionController');
const auth = require('../middleware/auth');
const { spotifyLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/analyze', auth, spotifyLimiter, emotionController.analyzeEmotion);
router.get('/history', auth, emotionController.getAnalysisHistory);

module.exports = router;

// === src/routes/tracks.js ===
const express = require('express');
const tracksController = require('../controllers/tracksController');
const auth = require('../middleware/auth');
const { spotifyLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/top', auth, spotifyLimiter, tracksController.getTopTracks);
router.get('/recently-played', auth, spotifyLimiter, tracksController.getRecentlyPlayed);

module.exports = router;