/**
 * Mock weather data for demo purposes
 * This module provides sample weather data when a valid API key is not available
 */

// Base weather data template
const baseWeatherData = {
  coord: { lon: -122.4194, lat: 37.7749 },
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  base: 'stations',
  main: {
    temp: 22.5,
    feels_like: 21.8,
    temp_min: 18.9,
    temp_max: 26.1,
    pressure: 1015,
    humidity: 58
  },
  visibility: 10000,
  wind: { speed: 4.12, deg: 270 },
  clouds: { all: 0 },
  dt: Math.floor(Date.now() / 1000),
  sys: {
    type: 2,
    id: 2017352,
    country: 'US',
    sunrise: Math.floor(Date.now() / 1000) - 25200, // 7 hours ago
    sunset: Math.floor(Date.now() / 1000) + 25200   // 7 hours from now
  },
  timezone: -25200,
  id: 5391959,
  name: 'San Francisco',
  cod: 200
};

// Weather conditions mapped to IDs
const weatherConditions = {
  'clear': { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
  'clouds': { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
  'scattered clouds': { id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' },
  'broken clouds': { id: 803, main: 'Clouds', description: 'broken clouds', icon: '04d' },
  'rain': { id: 500, main: 'Rain', description: 'light rain', icon: '10d' },
  'heavy rain': { id: 502, main: 'Rain', description: 'heavy rain', icon: '09d' },
  'thunderstorm': { id: 200, main: 'Thunderstorm', description: 'thunderstorm with light rain', icon: '11d' },
  'snow': { id: 600, main: 'Snow', description: 'light snow', icon: '13d' },
  'mist': { id: 701, main: 'Mist', description: 'mist', icon: '50d' }
};

// Cities with mock data
const cities = {
  'london': {
    name: 'London',
    country: 'GB',
    coord: { lon: -0.1257, lat: 51.5085 },
    temp: 14.2,
    condition: 'clouds'
  },
  'new york': {
    name: 'New York',
    country: 'US',
    coord: { lon: -74.006, lat: 40.7143 },
    temp: 18.5,
    condition: 'clear'
  },
  'tokyo': {
    name: 'Tokyo',
    country: 'JP',
    coord: { lon: 139.6917, lat: 35.6895 },
    temp: 25.8,
    condition: 'scattered clouds'
  },
  'paris': {
    name: 'Paris',
    country: 'FR',
    coord: { lon: 2.3488, lat: 48.8534 },
    temp: 17.3,
    condition: 'broken clouds'
  },
  'san francisco': {
    name: 'San Francisco',
    country: 'US',
    coord: { lon: -122.4194, lat: 37.7749 },
    temp: 22.5,
    condition: 'clear'
  },
  'sydney': {
    name: 'Sydney',
    country: 'AU',
    coord: { lon: 151.2073, lat: -33.8679 },
    temp: 28.7,
    condition: 'clear'
  },
  'moscow': {
    name: 'Moscow',
    country: 'RU',
    coord: { lon: 37.6156, lat: 55.7522 },
    temp: 1.2,
    condition: 'snow'
  },
  'cairo': {
    name: 'Cairo',
    country: 'EG',
    coord: { lon: 31.2497, lat: 30.0626 },
    temp: 33.5,
    condition: 'clear'
  },
  'rio de janeiro': {
    name: 'Rio de Janeiro',
    country: 'BR',
    coord: { lon: -43.2075, lat: -22.9028 },
    temp: 30.2,
    condition: 'rain'
  },
  'cape town': {
    name: 'Cape Town',
    country: 'ZA',
    coord: { lon: 18.4232, lat: -33.9258 },
    temp: 24.8,
    condition: 'clear'
  }
};

/**
 * Generate mock weather data for a given location
 * @param {string} location - The location to get weather for
 * @param {string} units - The units to use (metric or imperial)
 * @returns {Object} Mock weather data
 */
function getMockWeatherData(location, units = 'metric') {
  // Normalize location name
  const normalizedLocation = location.toLowerCase();
  
  // Check if we have predefined data for this city
  const cityData = cities[normalizedLocation] || {
    name: location,
    country: 'US',
    coord: { lon: -100, lat: 40 },
    temp: 20 + (Math.random() * 15 - 5),
    condition: ['clear', 'clouds', 'rain'][Math.floor(Math.random() * 3)]
  };
  
  // Create a copy of base weather data
  const weatherData = JSON.parse(JSON.stringify(baseWeatherData));
  
  // Update with city-specific data
  weatherData.name = cityData.name;
  weatherData.sys.country = cityData.country;
  weatherData.coord = cityData.coord;
  
  // Set temperature based on units
  const baseTemp = cityData.temp;
  weatherData.main.temp = baseTemp;
  weatherData.main.feels_like = baseTemp - (Math.random() * 2);
  weatherData.main.temp_min = baseTemp - (Math.random() * 4);
  weatherData.main.temp_max = baseTemp + (Math.random() * 4);
  
  // Convert to imperial if needed
  if (units === 'imperial') {
    weatherData.main.temp = (weatherData.main.temp * 9/5) + 32;
    weatherData.main.feels_like = (weatherData.main.feels_like * 9/5) + 32;
    weatherData.main.temp_min = (weatherData.main.temp_min * 9/5) + 32;
    weatherData.main.temp_max = (weatherData.main.temp_max * 9/5) + 32;
    weatherData.wind.speed = weatherData.wind.speed * 2.237; // Convert to mph
  }
  
  // Set weather condition
  const condition = weatherConditions[cityData.condition] || weatherConditions.clear;
  weatherData.weather = [condition];
  
  // Add some randomness to other values
  weatherData.main.humidity = Math.floor(Math.random() * 50) + 40; // 40-90%
  weatherData.wind.speed = (Math.random() * 5) + 2; // 2-7 m/s
  weatherData.wind.deg = Math.floor(Math.random() * 360);
  
  // Update timestamp
  weatherData.dt = Math.floor(Date.now() / 1000);
  
  return weatherData;
}

module.exports = { getMockWeatherData };