const mongoose = require('mongoose');

const driverRouteSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }]
}, { timestamps: true });

module.exports = mongoose.model('DriverRoute', driverRouteSchema); 