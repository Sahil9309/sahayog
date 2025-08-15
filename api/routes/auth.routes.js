// routes/auth.routes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, logoutUser } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', authenticateToken, getProfile); // Protected route

module.exports = router;