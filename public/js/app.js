/**
 * Cosmic Weather App - Main Application
 * 
 * This is the main entry point for the Cosmic Weather application.
 * It handles UI interactions, API calls, and data display.
 */

// DOM Elements
const elements = {
  form: document.getElementById('search-form'),
  locationInput: document.getElementById('location-input'),
  weatherContainer: document.getElementById('weather-container'),
  loadingIndicator: document.getElementById('loading'),
  errorMessage: document.getElementById('error-message'),
  errorText: document.getElementById('error-text'),
  locationName: document.getElementById('location-name'),
  locationDate: document.getElementById('location-date'),
  temperature: document.getElementById('temperature'),
  weatherDescription: document.getElementById('weather-description'),
  feelsLike: document.getElementById('feels-like'),
  windSpeed: document.getElementById('wind-speed'),
  humidity: document.getElementById('humidity'),
  pressure: document.getElementById('pressure'),
  visibility: document.getElementById('visibility'),
  cosmicObject: document.getElementById('cosmic-object'),
  celsiusBtn: document.getElementById('celsius-btn'),
  fahrenheitBtn: document.getElementById('fahrenheit-btn')
};

// Current weather data cache
let currentWeatherData = null;

// Initialize the app
function init() {
  // Load user preferences
  const unitsPref = Preferences.getUnits();
  
  // Set active unit button based on preferences
  if (unitsPref === 'imperial') {
    elements.celsiusBtn.classList.remove('active');
    elements.fahrenheitBtn.classList.add('active');
  } else {
    elements.celsiusBtn.classList.add('active');
    elements.fahrenheitBtn.classList.remove('active');
  }
  
  // Event listeners
  elements.form.addEventListener('submit', handleFormSubmit);
  elements.celsiusBtn.addEventListener('click', () => setTemperatureUnit('metric'));
  elements.fahrenheitBtn.addEventListener('click', () => setTemperatureUnit('imperial'));
  
  // Check for a stored location and load it
  const recentLocations = Preferences.getRecentLocations();
  if (recentLocations.length > 0) {
    fetchWeatherData(recentLocations[0]);
  }
}

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  const location = elements.locationInput.value.trim();
  
  if (location) {
    await fetchWeatherData(location);
    elements.locationInput.value = '';
  }
}

/**
 * Fetch weather data from API
 * @param {string} location - Location to fetch weather for
 */
async function fetchWeatherData(location) {
  // Show loading, hide other containers
  showLoading();
  
  try {
    // Get preferred units
    const units = Preferences.getUnits();
    
    // API request
    const response = await fetch(`/api/weather/${encodeURIComponent(location)}?units=${units}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get weather data');
    }
    
    const data = await response.json();
    currentWeatherData = data;
    
    // Store this location in recent searches
    Preferences.addRecentLocation(data.location.name);
    
    // Update UI with weather data
    updateWeatherUI(data);
    
    // Show weather container
    hideLoading();
    elements.weatherContainer.classList.remove('hidden');
    elements.errorMessage.classList.add('hidden');
  } catch (error) {
    console.error('Error fetching weather:', error);
    
    // Show detailed error message
    hideLoading();
    elements.weatherContainer.classList.add('hidden');
    elements.errorMessage.classList.remove('hidden');
    
    // Display the response error message if available, otherwise show the error object
    let errorMessage = '';
    if (error.message) {
      errorMessage = error.message;
    }
    
    // Add more context for debugging
    if (location) {
      errorMessage += `\nLocation: ${location}`;
    }
    if (units) {
      errorMessage += `\nUnits: ${units}`;
    }
    
    elements.errorText.textContent = errorMessage;
    
    // Log additional debugging information to console
    console.debug('Error details:', {
      location,
      units,
      errorObject: error
    });
  }
}

/**
 * Update the UI with weather data
 * @param {Object} data - Weather data object
 */
function updateWeatherUI(data) {
  // Location and date
  elements.locationName.textContent = `${data.location.name}, ${data.location.country}`;
  
  // Format date based on location's timezone
  const localTime = new Date((data.timestamp + data.timezone) * 1000);
  elements.locationDate.textContent = localTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Temperature and description
  const units = Preferences.getUnits();
  const tempSymbol = units === 'metric' ? '°C' : '°F';
  
  elements.temperature.textContent = `${data.temperature.current}${tempSymbol}`;
  elements.feelsLike.textContent = `Feels like: ${data.temperature.feelsLike}${tempSymbol}`;
  
  // Map weather to cosmic description
  const cosmicDescription = ThemeMapper.getCosmicDescription(
    data.weather, 
    data.temperature.current
  );
  elements.weatherDescription.textContent = `${cosmicDescription} (${data.weather.description})`;
  
  // Weather details
  const speedUnit = units === 'metric' ? 'km/h' : 'mph';
  elements.windSpeed.textContent = `${data.details.windSpeed} ${speedUnit}`;
  elements.humidity.textContent = `${data.details.humidity}%`;
  elements.pressure.textContent = `${data.details.pressure} hPa`;
  
  // Visibility (convert from meters to km or miles)
  const visibilityValue = units === 'metric' 
    ? (data.details.visibility / 1000).toFixed(1)
    : (data.details.visibility / 1609.34).toFixed(1);
  const visibilityUnit = units === 'metric' ? 'km' : 'mi';
  elements.visibility.textContent = `${visibilityValue} ${visibilityUnit}`;
  
  // Cosmic object (planet) visualization
  const planetType = ThemeMapper.getPlanetType(data.temperature.current);
  const weatherAnimation = ThemeMapper.getWeatherAnimation(data.weather);
  
  // Reset classes and add new ones
  elements.cosmicObject.className = 'cosmic-object';
  elements.cosmicObject.classList.add(planetType);
  if (weatherAnimation) {
    elements.cosmicObject.classList.add(weatherAnimation);
  }
  
  // Adjust background based on time of day
  ThemeMapper.adjustBackgroundByTime(
    data.timestamp,
    data.details.sunrise,
    data.details.sunset,
    data.timezone
  );
}

/**
 * Set temperature unit (C or F)
 * @param {string} unit - 'metric' for Celsius, 'imperial' for Fahrenheit
 */
function setTemperatureUnit(unit) {
  // Update UI first
  if (unit === 'metric') {
    elements.celsiusBtn.classList.add('active');
    elements.fahrenheitBtn.classList.remove('active');
  } else {
    elements.celsiusBtn.classList.remove('active');
    elements.fahrenheitBtn.classList.add('active');
  }
  
  // Save preference
  Preferences.setUnits(unit);
  
  // If we have current weather data, refetch with new units
  if (currentWeatherData) {
    fetchWeatherData(currentWeatherData.location.name);
  }
}

/**
 * Show loading indicator
 */
function showLoading() {
  elements.loadingIndicator.classList.remove('hidden');
  elements.weatherContainer.classList.add('hidden');
  elements.errorMessage.classList.add('hidden');
}

/**
 * Hide loading indicator
 */
function hideLoading() {
  elements.loadingIndicator.classList.add('hidden');
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
