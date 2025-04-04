const axios = require('axios');
const weatherService = require('../../src/services/weatherService');
const cache = require('../../src/utils/cache');
const mockWeatherData = require('../../src/services/mockWeatherData');

// Mock dependencies
jest.mock('axios');
jest.mock('../../src/utils/cache');
jest.mock('../../src/services/mockWeatherData');

describe('Weather Service', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Sample weather API response
  const mockApiResponse = {
    data: {
      name: 'London',
      sys: { country: 'GB', sunrise: 1617508800, sunset: 1617556800 },
      coord: { lat: 51.51, lon: -0.13 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: {
        temp: 15.5,
        feels_like: 14.8,
        temp_min: 14.0,
        temp_max: 17.2,
        humidity: 76,
        pressure: 1011
      },
      wind: { speed: 3.6, deg: 230 },
      visibility: 10000,
      dt: 1617540000,
      timezone: 3600
    }
  };

  // Expected formatted result
  const expectedResult = {
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
    it('should fetch weather data from API when not in cache', async () => {
      // Mock cache miss
      cache.get.mockReturnValue(null);
      
      // Mock successful API call
      axios.get.mockResolvedValue(mockApiResponse);
      
      // Verify demo mode is not used in tests
      expect(process.env.NODE_ENV).toBe('test');
      expect(process.env.DEMO_MODE).toBe('false');

      // Call the service
      const result = await weatherService.getCurrentWeather('London', 'metric');

      // Verify axios was called correctly
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/weather'),
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'London',
            units: 'metric'
          })
        })
      );

      // Verify mock data was not used
      expect(mockWeatherData.getMockWeatherData).not.toHaveBeenCalled();

      // Verify result was formatted correctly
      expect(result).toEqual(expectedResult);

      // Verify result was cached
      expect(cache.set).toHaveBeenCalledWith(
        'weather:London:metric',
        expectedResult
      );
    });

    it('should return cached data when available', async () => {
      // Mock cache hit
      cache.get.mockReturnValue(expectedResult);

      // Call the service
      const result = await weatherService.getCurrentWeather('London', 'metric');

      // Verify axios was not called
      expect(axios.get).not.toHaveBeenCalled();

      // Verify cache was checked
      expect(cache.get).toHaveBeenCalledWith('weather:London:metric');

      // Verify result matches expected data
      expect(result).toEqual(expectedResult);
    });

    it('should throw a location not found error for 404 response', async () => {
      // Mock cache miss
      cache.get.mockReturnValue(null);

      // Mock 404 API response
      axios.get.mockRejectedValue({
        response: { status: 404 }
      });

      // Expect error to be thrown
      await expect(weatherService.getCurrentWeather('NonExistentCity')).rejects.toThrow(
        "Location 'NonExistentCity' not found"
      );
    });

    it('should throw a general error for other API failures', async () => {
      // Mock cache miss
      cache.get.mockReturnValue(null);

      // Mock general API failure
      axios.get.mockRejectedValue(new Error('Network error'));

      // Expect error to be thrown
      await expect(weatherService.getCurrentWeather('London')).rejects.toThrow(
        "Failed to fetch weather data: Network error"
      );
    });
  });
});
