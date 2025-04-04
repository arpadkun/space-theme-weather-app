const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Log environment setup
console.log('Environment setup:', {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  weatherApiKeyExists: !!process.env.WEATHER_API_KEY,
  weatherApiKeyLength: process.env.WEATHER_API_KEY ? process.env.WEATHER_API_KEY.length : 0
});

// Import routes
const weatherRoutes = require('./src/routes/weather');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/weather', weatherRoutes);

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌌 Cosmic Weather App is available at http://localhost:${PORT}`);
});

module.exports = app; // Export for testing