const express = require('express');
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/url', authController.getAuthUrl);
router.get('/callback', authController.callback);
router.post('/refresh', authLimiter, authController.refreshAccessToken);

module.exports = router;