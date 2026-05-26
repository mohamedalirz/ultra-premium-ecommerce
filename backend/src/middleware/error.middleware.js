const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      details: err
    } : undefined,
    timestamp: new Date()
  });
};

module.exports = errorMiddleware;