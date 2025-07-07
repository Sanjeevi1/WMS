const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { protectDriver } = require('../utils/authMiddleware');

// Apply auth middleware to all routes
router.use(protectDriver);

router.get('/my-route', driverController.myRoute);
router.post('/resolve-request', driverController.resolveRequest);
router.get('/history', driverController.requestHistory);
router.post('/location', driverController.locationTracking);

module.exports = router; 