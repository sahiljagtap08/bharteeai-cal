/ backend/src/middleware/errorHandler.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

function errorHandler(err, req, res, next) {
  logger.error(err.stack);

  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

module.exports = { errorHandler, logger };

// Update backend/src/app.js to include error handling
const { errorHandler } = require('./middleware/errorHandler');

// ... (other imports and middleware)

app.use(errorHandler);

// Example usage in a controller
const { logger } = require('../middleware/errorHandler');

exports.someController = async (req, res, next) => {
  try {
    // Controller logic
  } catch (error) {
    logger.error('Error in someController:', error);
    next(error);
  }
};