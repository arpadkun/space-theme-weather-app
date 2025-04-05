const request = require('supertest');
const app = require('../../server');
const axios = require('axios');
const config = require('../../src/config/config');

// Mock external API calls
jest.mock('axios');
jest.mock('../../src/config/config', () => {
  return {
    weatherApi: {
      baseUrl: 'https://api.openweathermap.org/data/2.5',
      key: 'test-api-key-for-integration-tests',
      units: 'metric'
    },
    cache: {
      ttl: 300,
      checkperiod: 60
    }
  };
});

describe('Weather API Routes', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/weather/:location', () => {
    it('should return weather data for a valid location', async () => {
      // Mock successful API response
      axios.get.mockResolvedValue(mockApiResponse);

      // Make request to our API
      const response = await request(app)
        .get('/api/weather/London')
        .query({ units: 'metric' });

      // Verify response
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('location.name', 'London');
      expect(response.body).toHaveProperty('weather.condition', 'Clear');
      
      // Make sure we're actually checking that these expectations run
      const apiWasCalled = axios.get.mock.calls.length > 0;
      expect(apiWasCalled).toBe(true);
    });

    it('should return 404 for non-existent location', async () => {
      // Mark this test as one that expects errors
      const endErrorTest = expectErrors();
      
      try {
        // Mock 404 API response
        axios.get.mockRejectedValue({
          response: { status: 404 },
          message: "Location 'NonExistentCity' not found"
        });
  
        // Make request to our API
        const response = await request(app)
          .get('/api/weather/NonExistentCity');
  
        // Verify response
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('not found');
        
        // Make sure we're actually checking that these expectations run
        const apiWasCalled = axios.get.mock.calls.length > 0 || axios.get.mock.results.length > 0;
        expect(apiWasCalled).toBe(true);
      } finally {
        // End the error expectation regardless of test result
        endErrorTest();
      }
    });

    it('should accept units query parameter', async () => {
      // Mock successful API response
      axios.get.mockResolvedValue(mockApiResponse);

      // Make request to our API with imperial units
      await request(app)
        .get('/api/weather/London')
        .query({ units: 'imperial' });

      // Verify axios was called with correct units parameter
      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            units: 'imperial'
          })
        })
      );
      
      // Make sure API was actually called
      const apiWasCalled = axios.get.mock.calls.length > 0;
      expect(apiWasCalled).toBe(true);
    });
  });
});
