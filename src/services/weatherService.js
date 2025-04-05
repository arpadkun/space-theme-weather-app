const axios = require('axios');
const config = require('../config/config');
const cache = require('../utils/cache');

/**
 * Service for interacting with the weather API
 */
class WeatherService {
  /**
   * Get current weather data for a location
   * @param {string} location - City name or coordinates
   * @param {string} units - Units for temperature (metric or imperial)
   * @returns {Promise<Object>} Weather data
   */
  async getCurrentWeather(location, units = config.weatherApi.units) {
    // Create cache key based on location and units
    const cacheKey = `weather:${location}:${units}`;
    
    // Check if data exists in cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached weather data for:', location);
      return cachedData;
    }
    
    try {
      // Verify API key exists
      if (!config.weatherApi.key) {
        throw new Error('Missing API key for weather service');
      }
      
      // Log API request params for debugging
      console.log('Weather API request:', {
        url: `${config.weatherApi.baseUrl}/weather`,
        params: {
          q: location,
          units: units,
          appid: '***' // Hide API key in logs
        },
        apiKeyLength: config.weatherApi.key.length
      });
      
      // Fetch data from API
      const response = await axios.get(`${config.weatherApi.baseUrl}/weather`, {
        params: {
          q: location,
          units: units,
          appid: config.weatherApi.key
        }
      });
      
      // Log successful response
      console.log('Weather API response received:', {
        status: response.status,
        statusText: response.statusText,
        dataKeys: Object.keys(response.data || {})
      });
      
      // Format the response data
      const weatherData = this._formatWeatherData(response.data);
      
      // Store in cache
      cache.set(cacheKey, weatherData);
      
      return weatherData;
    } catch (error) {
      // Log detailed error information
      console.error('Weather API error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        config: error.config ? {
          url: error.config.url,
          method: error.config.method,
          params: error.config.params ? {
            ...error.config.params,
            appid: '***' // Hide API key in logs
          } : 'undefined'
        } : 'undefined'
      });
      
      // Handle error and provide meaningful message
      if (error.response && error.response.status === 404) {
        throw new Error(`Location '${location}' not found`);
      }
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }
  
  /**
   * Format raw weather data from API
   * @param {Object} data - Raw weather data
   * @returns {Object} Formatted weather data
   * @private
   */
  _formatWeatherData(data) {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      },
      weather: {
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        id: data.weather[0].id
      },
      temperature: {
        current: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        min: Math.round(data.main.temp_min),
        max: Math.round(data.main.temp_max)
      },
      details: {
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        visibility: data.visibility,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset
      },
      timestamp: data.dt,
      timezone: data.timezone
    };
  }
}

module.exports = new WeatherService();
