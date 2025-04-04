module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!**/node_modules/**'
  ],
  // Set NODE_ENV to test for all tests
  setupFiles: ['<rootDir>/tests/setup.js'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80
    }
  },
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true,
  bail: true,
  testFailureExitCode: 1
};