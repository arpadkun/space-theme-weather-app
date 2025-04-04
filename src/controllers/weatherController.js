const weatherService = require('../services/weatherService');

/**
 * Controller for weather-related endpoints
 */
const weatherController = {
  /**
   * Get current weather for a location
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCurrentWeather(req, res) {
    try {
      const { location } = req.params;
      const { units } = req.query;
      
      console.log('Request received for location:', location, 'with units:', units || 'default');
      
      if (!location) {
        return res.status(400).json({ error: 'Location is required' });
      }
      
      const weatherData = await weatherService.getCurrentWeather(location, units);
      console.log('Weather data retrieved successfully for:', location);
      res.json(weatherData);
    } catch (error) {
      // Check for specific error types
      if (error.message.includes('not found')) {
        console.log('Location not found error:', error.message);
        return res.status(404).json({ error: error.message });
      }
      
      console.error('Weather API error in controller:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
  }
};

module.exports = weatherController;
