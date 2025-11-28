const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const adminController = require('../controllers/admin.controller');

// Register new child
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);
router.post('/admin/login', adminController.login);

module.exports = router;
