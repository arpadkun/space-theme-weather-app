// Set environment variables for testing
process.env.NODE_ENV = 'test';

// Configure Jest to fail fast and clearly
// Make sure tests fail properly and don't just silently pass with errors
const originalConsoleError = console.error;
console.error = function(message) {
  originalConsoleError.apply(console, arguments);
  
  // Throw an error for any console.error during tests to ensure tests properly fail
  if (message && typeof message === 'string' && !message.includes('Renderer is not mounted')) {
    throw new Error(`Console error occurred during test: ${message}`);
  }
};