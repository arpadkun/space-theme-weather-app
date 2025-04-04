// Set environment variables for testing
process.env.NODE_ENV = 'test';

// Configure Jest to fail fast and clearly
// Make sure tests fail properly and don't just silently pass with errors
// But don't fail in specific test cases where we're testing error handling

// Store original console methods
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

// Track if we're in a test that is explicitly testing error handling
let inErrorTest = false;

// Override console.error
console.error = function(message) {
  // Log the original message
  originalConsoleError.apply(console, arguments);
  
  // Don't throw if we're in a test that's supposed to be testing error handling
  // or if we're in the controller test for service errors
  const isErrorHandlingTest = inErrorTest || 
                             (message && 
                              typeof message === 'string' && 
                              (message.includes('Weather API error in controller') || 
                               message.includes('Renderer is not mounted')));
  
  if (message && typeof message === 'string' && !isErrorHandlingTest) {
    throw new Error(`Console error occurred during test: ${message}`);
  }
};

// Add a function to mark the beginning of a test that's expected to have errors
global.expectErrors = function() {
  inErrorTest = true;
  
  // Return a function to mark the end of the error test
  return function endErrorTest() {
    inErrorTest = false;
  };
};