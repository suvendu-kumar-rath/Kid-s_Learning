const jwt = require('jsonwebtoken');
const HttpStatus = require('../enums/httpStatusCode.enum');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin@123';

const adminController = {};

adminController.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'username and password are required'
      });
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const token = jwt.sign(
      { role: 'admin', username: ADMIN_USERNAME },
      process.env.APP_SUPER_SECRET_KEY || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Admin login successful',
      data: { token }
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Admin login failed',
      error: error.message
    });
  }
};

module.exports = adminController;
