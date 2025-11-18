const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Register new child
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

module.exports = router;
