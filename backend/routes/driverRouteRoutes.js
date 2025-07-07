const express = require('express');
const router = express.Router();
const driverRouteController = require('../controllers/driverRouteController');

router.get('/', driverRouteController.getDriverRoutes);
router.post('/', driverRouteController.createDriverRoute);
router.put('/:id', driverRouteController.updateDriverRoute);
router.delete('/:id', driverRouteController.deleteDriverRoute);

module.exports = router; 