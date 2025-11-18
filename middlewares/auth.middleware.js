const jwt = require('jsonwebtoken');
const HttpStatus = require('../enums/httpStatusCode.enum');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Authorization token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.APP_SUPER_SECRET_KEY || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;
