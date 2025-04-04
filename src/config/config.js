// Configuration settings for the application

// Log environment variables for debugging
console.log('Loading config with env vars:', {
  weatherApiKeyExists: !!process.env.WEATHER_API_KEY,
  weatherApiKeyLength: process.env.WEATHER_API_KEY ? process.env.WEATHER_API_KEY.length : 0,
  cacheTTL: process.env.CACHE_TTL
});

module.exports = {
  // Weather API configuration
  weatherApi: {
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    key: process.env.WEATHER_API_KEY || '', // Use the .env key or no key
    units: 'metric' // Default units (can be 'metric' or 'imperial')
  },
  
  // Cache configuration
  cache: {
    ttl: process.env.CACHE_TTL || 300, // Time to live in seconds (default: 5 minutes)
    checkperiod: 60 // Check for expired keys every 60 seconds
  }
};
