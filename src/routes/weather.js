const express = require('express');
const weatherController = require('../controllers/weatherController');

const router = express.Router();

/**
 * @route GET /api/weather/:location
 * @desc Get current weather for a location
 * @param {string} location - City name (e.g., "London", "New York")
 * @query {string} units - Temperature units (metric or imperial)
 * @access Public
 */
router.get('/:location', weatherController.getCurrentWeather);

module.exports = router;
