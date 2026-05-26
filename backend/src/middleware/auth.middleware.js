const { verifyToken } = require('../utils/jwt.utils');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'No token provided',
      error: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ 
      message: 'Invalid token',
      error: 'Token verification failed'
    });
  }
  
  req.user = decoded;
  next();
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied',
      error: 'Admin privileges required'
    });
  }
  next();
};

module.exports = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;