const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/login', authController.getAuthUrl);
router.get('/callback', authController.callback);
router.get('/me', auth, authController.getCurrentUser);
router.post('/refresh', auth, authController.refreshToken);
router.post('/logout', auth, authController.logout);

module.exports = router;
