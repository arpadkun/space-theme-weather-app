/**
 * Theme Mapper - Maps weather conditions to cosmic themes
 * 
 * This module handles the mapping of weather conditions to cosmic visual elements
 * such as planet types, animations, and descriptions.
 */

const ThemeMapper = {
  /**
   * Get the planet type based on temperature
   * @param {number} temp - Temperature in celsius
   * @returns {string} Planet type CSS class
   */
  getPlanetType(temp) {
    if (temp >= 30) return 'planet-hot';
    if (temp >= 20) return 'planet-warm';
    if (temp >= 10) return 'planet-mild';
    if (temp >= 0) return 'planet-cool';
    return 'planet-cold';
  },

  /**
   * Get weather animation class based on weather condition
   * @param {Object} weather - Weather data object
   * @returns {string} Weather animation CSS class
   */
  getWeatherAnimation(weather) {
    const id = weather.id;
    
    // Thunderstorm
    if (id >= 200 && id < 300) {
      return 'weather-thunder';
    }
    // Rain and Drizzle
    else if ((id >= 300 && id < 400) || (id >= 500 && id < 600)) {
      return 'weather-rain';
    }
    // Snow
    else if (id >= 600 && id < 700) {
      return 'weather-snow';
    }
    // Atmosphere (fog, mist, etc)
    else if (id >= 700 && id < 800) {
      return 'weather-fog';
    }
    // Clear
    else if (id === 800) {
      return 'weather-clear';
    }
    // Clouds
    else if (id > 800) {
      return 'weather-clouds';
    }
    
    return '';
  },

  /**
   * Get cosmic description based on weather condition
   * @param {Object} weather - Weather data object
   * @param {number} temp - Temperature in celsius
   * @returns {string} Cosmic-themed weather description
   */
  getCosmicDescription(weather, temp) {
    const condition = weather.condition.toLowerCase();
    const description = weather.description;
    
    const cosmicDescriptions = {
      // Temperature based
      hot: [
        'Solar flares intensifying',
        'Cosmic radiation levels high',
        'Approaching stellar hotspot'
      ],
      cold: [
        'Entering outer rim ice zone',
        'Cosmic winter in progress',
        'Deep space cooling detected'
      ],
      
      // Weather condition based
      thunderstorm: [
        'Cosmic electrical storm',
        'Planetary lightning disturbance',
        'Electromagnetic anomaly detected'
      ],
      rain: [
        'Meteor shower precipitation',
        'Astral condensation downpour',
        'Galactic water cycle active'
      ],
      snow: [
        'Crystalline cosmic particles',
        'Frozen stellar fragments',
        'Interstellar ice precipitation'
      ],
      clear: [
        'Perfect solar visibility',
        'Cosmic skies clear',
        'Stellar view optimal'
      ],
      clouds: [
        'Cosmic nebula formation',
        'Gas giant influence',
        'Interstellar cloud passing'
      ],
      fog: [
        'Space dust concentration',
        'Galactic mist detected',
        'Cosmic haze interference'
      ],
      default: [
        'Cosmic conditions nominal',
        'Standard planetary weather',
        'Local atmospheric conditions'
      ]
    };
    
    // Choose descriptions based on temperature or weather condition
    let descriptionArray;
    if (temp >= 30) {
      descriptionArray = cosmicDescriptions.hot;
    } else if (temp <= 0) {
      descriptionArray = cosmicDescriptions.cold;
    } else if (condition.includes('thunderstorm')) {
      descriptionArray = cosmicDescriptions.thunderstorm;
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      descriptionArray = cosmicDescriptions.rain;
    } else if (condition.includes('snow')) {
      descriptionArray = cosmicDescriptions.snow;
    } else if (condition === 'clear') {
      descriptionArray = cosmicDescriptions.clear;
    } else if (condition.includes('cloud')) {
      descriptionArray = cosmicDescriptions.clouds;
    } else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
      descriptionArray = cosmicDescriptions.fog;
    } else {
      descriptionArray = cosmicDescriptions.default;
    }
    
    // Get a random description from the appropriate array
    const randomIndex = Math.floor(Math.random() * descriptionArray.length);
    return descriptionArray[randomIndex];
  },

  /**
   * Adjust background based on time of day
   * @param {number} timestamp - Current timestamp
   * @param {number} sunrise - Sunrise timestamp
   * @param {number} sunset - Sunset timestamp
   * @param {number} timezone - Timezone offset in seconds
   */
  adjustBackgroundByTime(timestamp, sunrise, sunset, timezone) {
    const localTime = timestamp + timezone;
    const localSunrise = sunrise + timezone;
    const localSunset = sunset + timezone;
    
    const body = document.body;
    const background = document.querySelector('.galaxy-background');
    
    // Night time
    if (localTime < localSunrise || localTime > localSunset) {
      body.classList.add('night-time');
      background.style.background = 'linear-gradient(125deg, #05071b 0%, #0a1033 100%)';
      background.style.opacity = '1';
    }
    // Dawn/Dusk
    else if (Math.abs(localTime - localSunrise) < 3600 || Math.abs(localTime - localSunset) < 3600) {
      body.classList.add('dawn-dusk');
      if (Math.abs(localTime - localSunrise) < 3600) {
        // Dawn
        background.style.background = 'linear-gradient(125deg, #1a1b3a 0%, #4a3b78 100%)';
      } else {
        // Dusk
        background.style.background = 'linear-gradient(125deg, #2d1b3d 0%, #4f2c63 100%)';
      }
      background.style.opacity = '1';
    }
    // Day time
    else {
      body.classList.remove('night-time', 'dawn-dusk');
      background.style.background = 'linear-gradient(125deg, #0a0d23 0%, #121a3e 100%)';
      background.style.opacity = '1';
    }
  }
};
