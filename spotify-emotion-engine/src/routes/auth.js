const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/url', authController.getAuthUrl);
router.get('/callback', authController.callback);
router.post('/refresh', authController.refreshAccessToken);

module.exports = router;
