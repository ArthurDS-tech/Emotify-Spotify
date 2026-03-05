const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, userController.getProfile);
router.get('/history', auth, userController.getListeningHistory);
router.get('/compatible', auth, userController.findCompatibleUsers);
router.get('/connections', auth, userController.getConnections);

module.exports = router;
