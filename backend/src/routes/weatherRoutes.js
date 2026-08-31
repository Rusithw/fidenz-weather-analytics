const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Get Processed Weather Analytics & Rankings
router.get('/', weatherController.getWeatherAnalytics);

// Debug endpoint to verify 5-minute Cache status
router.get('/cache-status', weatherController.getCacheStatus);

module.exports = router;