const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.dashboard);
router.get('/requests', adminController.getAllRequests);
router.post('/requests/assign', adminController.assignDriver);
router.post('/requests/reject', adminController.rejectRequest);
router.get('/drivers', adminController.getAllDrivers);
router.post('/drivers', adminController.createDriver);
router.get('/drivers/:id', adminController.getDriverProfile);
router.get('/drivers/filter/:vehicleType', adminController.filterDrivers);
router.post('/requests/auto-assign', adminController.callAutoAssignAPI);

module.exports = router; 