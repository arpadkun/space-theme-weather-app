const weatherController = require('../../src/controllers/weatherController');
const weatherService = require('../../src/services/weatherService');

// Mock dependencies
jest.mock('../../src/services/weatherService');

describe('Weather Controller', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock Express request and response objects
  let req, res;

  beforeEach(() => {
    req = {
      params: { location: 'London' },
      query: { units: 'metric' }
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  // Sample weather data
  const mockWeatherData = {
    location: {
      name: 'London',
      country: 'GB',
      coordinates: { lat: 51.51, lon: -0.13 }
    },
    weather: {
      condition: 'Clear',
      description: 'clear sky',
      icon: '01d',
      id: 800
    },
    temperature: {
      current: 16,
      feelsLike: 15,
      min: 14,
      max: 17
    },
    details: {
      humidity: 76,
      pressure: 1011,
      windSpeed: 3.6,
      windDirection: 230,
      visibility: 10000,
      sunrise: 1617508800,
      sunset: 1617556800
    },
    timestamp: 1617540000,
    timezone: 3600
  };

  describe('getCurrentWeather', () => {
    it('should return weather data for a valid location', async () => {
      // Mock successful weather service call
      weatherService.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Call the controller
      await weatherController.getCurrentWeather(req, res);

      // Verify service was called with correct parameters
      expect(weatherService.getCurrentWeather).toHaveBeenCalledWith('London', 'metric');

      // Verify JSON response with weather data
      expect(res.json).toHaveBeenCalledWith(mockWeatherData);
    });

    it('should return 400 error if location is missing', async () => {
      // Set up request with missing location
      req.params = {};

      // Call the controller
      await weatherController.getCurrentWeather(req, res);

      // Verify 400 status
      expect(res.status).toHaveBeenCalledWith(400);
      
      // Verify error message
      expect(res.json).toHaveBeenCalledWith({ error: 'Location is required' });
    });

    it('should return 404 error if location is not found', async () => {
      // Mock location not found error
      weatherService.getCurrentWeather.mockRejectedValue(new Error("Location 'NonExistentCity' not found"));
      req.params.location = 'NonExistentCity';

      // Call the controller
      await weatherController.getCurrentWeather(req, res);

      // Verify 404 status
      expect(res.status).toHaveBeenCalledWith(404);
      
      // Verify error message
      expect(res.json).toHaveBeenCalledWith({ error: "Location 'NonExistentCity' not found" });
    });

    it('should return 500 error for general service failures', async () => {
      // Mock general service error
      weatherService.getCurrentWeather.mockRejectedValue(new Error('Service failure'));

      // Call the controller
      await weatherController.getCurrentWeather(req, res);

      // Verify 500 status
      expect(res.status).toHaveBeenCalledWith(500);
      
      // Verify error message
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve weather data' });
    });
  });
});
