const express = require('express');
const router = express.Router();
const { register, login, sendOtp, verifyOtp, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/register-admin', require('../controllers/authController').registerAdmin);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', protect, getMe);

module.exports = router;
// This file was already complete — see controller update below
