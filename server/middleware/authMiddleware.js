const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Safely access the Authorization header
  const authHeader = req.headers['authorization'];

  // Check if the Authorization header is present and extract token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify the token using the JWT secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
