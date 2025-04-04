/**
 * User Preferences Manager
 * 
 * Handles saving and retrieving user preferences using localStorage,
 * including preferred temperature units and recent locations.
 */

const Preferences = {
  // Default preferences
  defaults: {
    units: 'metric',     // 'metric' (Celsius) or 'imperial' (Fahrenheit)
    recentLocations: []  // Array of recently searched locations
  },
  
  /**
   * Initialize preferences
   * Loads saved preferences or sets defaults
   * @returns {Object} Current preferences
   */
  init() {
    // Get saved preferences or use defaults
    const savedPrefs = localStorage.getItem('cosmicWeatherPrefs');
    let prefs;
    
    if (savedPrefs) {
      try {
        prefs = JSON.parse(savedPrefs);
      } catch (e) {
        console.error('Error parsing saved preferences:', e);
        prefs = Object.assign({}, this.defaults);
      }
    } else {
      prefs = Object.assign({}, this.defaults);
    }
    
    return prefs;
  },
  
  /**
   * Get current temperature units
   * @returns {string} 'metric' or 'imperial'
   */
  getUnits() {
    const prefs = this.init();
    return prefs.units || this.defaults.units;
  },
  
  /**
   * Set temperature units
   * @param {string} units - 'metric' or 'imperial'
   */
  setUnits(units) {
    if (units !== 'metric' && units !== 'imperial') {
      console.error('Invalid units:', units);
      return;
    }
    
    const prefs = this.init();
    prefs.units = units;
    this._savePrefs(prefs);
  },
  
  /**
   * Add a location to recent searches
   * @param {string} location - Location name
   */
  addRecentLocation(location) {
    if (!location) return;
    
    const prefs = this.init();
    const recentLocations = prefs.recentLocations || [];
    
    // Remove if already exists
    const index = recentLocations.indexOf(location);
    if (index !== -1) {
      recentLocations.splice(index, 1);
    }
    
    // Add to beginning of array
    recentLocations.unshift(location);
    
    // Keep only the 5 most recent
    if (recentLocations.length > 5) {
      recentLocations.pop();
    }
    
    prefs.recentLocations = recentLocations;
    this._savePrefs(prefs);
  },
  
  /**
   * Get recent locations
   * @returns {Array} Array of recent location names
   */
  getRecentLocations() {
    const prefs = this.init();
    return prefs.recentLocations || [];
  },
  
  /**
   * Save preferences to localStorage
   * @param {Object} prefs - Preferences object
   * @private
   */
  _savePrefs(prefs) {
    try {
      localStorage.setItem('cosmicWeatherPrefs', JSON.stringify(prefs));
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  }
};
