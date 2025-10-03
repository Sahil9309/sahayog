const express = require('express');
const router = express.Router();
const {
  createContribution,
  getMyContributions,
  getEventContributions,
  getContributionStats,
} = require('../controllers/contribution.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// All contribution routes require authentication
router.post('/contributions', authenticateToken, createContribution);
router.get('/contributions/my', authenticateToken, getMyContributions);
router.get('/contributions/event/:eventId', authenticateToken, getEventContributions);
router.get('/contributions/stats', authenticateToken, getContributionStats);

module.exports = router;