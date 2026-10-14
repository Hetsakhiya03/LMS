const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Get API & DB status
 * @access  Public
 */
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    success: true,
    message: 'LearnPulse LMS API is running smooth',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: '1.0.0'
  });
});

module.exports = router;
