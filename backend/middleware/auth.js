/**
 * Authentication middleware
 * Checks for API key in headers
 */
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required'
    });
  }

  // TODO: Implement proper API key validation against database
  // For now, just check if it exists
  if (apiKey.length < 32) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key'
    });
  }

  req.apiKey = apiKey;
  next();
};

/**
 * Rate limiting middleware (basic implementation)
 */
const rateLimit = () => {
  const requests = new Map();
  const WINDOW_MS = 60000; // 1 minute
  const MAX_REQUESTS = 100;

  return (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }

    const userRequests = requests.get(identifier);
    const recentRequests = userRequests.filter(timestamp => now - timestamp < WINDOW_MS);
    
    if (recentRequests.length >= MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later'
      });
    }

    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    
    next();
  };
};

/**
 * Logging middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.message
    });
  }

  if (err.code === 'INSUFFICIENT_FUNDS') {
    return res.status(402).json({
      success: false,
      error: 'Insufficient funds for gas'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = {
  authenticate,
  rateLimit,
  requestLogger,
  errorHandler
};
