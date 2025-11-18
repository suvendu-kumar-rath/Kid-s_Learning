const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../model');
const HttpStatus = require('../enums/httpStatusCode.enum');

const authController = {};

// Register a new child
authController.register = async (req, res) => {
  try {
    const { childName, dateOfBirth, mobileNumber, password } = req.body;

    // Validate inputs
    if (!childName || !dateOfBirth || !mobileNumber || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'All fields are required: childName, dateOfBirth, mobileNumber, password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { mobileNumber } });
    if (existingUser) {
      return res.status(HttpStatus.CONFLICT).json({
        success: false,
        message: 'Mobile number already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      childName,
      dateOfBirth,
      mobileNumber,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, childName: newUser.childName, mobileNumber: newUser.mobileNumber },
      process.env.APP_SUPER_SECRET_KEY || 'your-secret-key',
      { expiresIn: '30d' }
    );

    // Remove password from response
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Child registered successfully',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login
authController.login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // Validate inputs
    if (!mobileNumber || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Mobile number and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ where: { mobileNumber } });
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid mobile number or password'
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid mobile number or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, childName: user.childName, mobileNumber: user.mobileNumber },
      process.env.APP_SUPER_SECRET_KEY || 'your-secret-key',
      { expiresIn: '30d' }
    );

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

module.exports = authController;
