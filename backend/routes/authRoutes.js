const express = require('express');
const router = express.Router();
const { adminLogin, driverLogin } = require('../controllers/authController');

// No validation middleware needed
router.post('/admin/login', adminLogin);
router.post('/driver/login', driverLogin);

module.exports = router; 