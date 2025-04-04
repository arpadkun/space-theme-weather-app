const request = require('supertest');
const app = require('../../server');
const axios = require('axios');

// Mock external API calls
jest.mock('axios');

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
    });

    it('should return 404 for non-existent location', async () => {
      // Mock 404 API response
      axios.get.mockRejectedValue({
        response: { status: 404 }
      });

      // Make request to our API
      const response = await request(app)
        .get('/api/weather/NonExistentCity');

      // Verify response
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not found');
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
    });
  });
});
