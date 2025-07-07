const errorHandler = (err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
      details: err.message
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value entered',
      details: err.keyValue
    });
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = { errorHandler }; 