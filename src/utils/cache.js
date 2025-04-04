const NodeCache = require('node-cache');
const config = require('../config/config');

// Initialize cache with configuration
const cache = new NodeCache({
  stdTTL: config.cache.ttl,
  checkperiod: config.cache.checkperiod
});

module.exports = cache;
