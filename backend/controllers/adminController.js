const Admin = require('../models/Admin');
const Driver = require('../models/Driver');
const Request = require('../models/Request');
const DriverRoute = require('../models/DriverRoute');
const { isWithinDistance } = require('../utils/haversine');

// Default admin ID
const DEFAULT_ADMIN_ID = '67f8aeb64eae41bd3cbd31a5';

// Admin controller
const dashboard = async (req, res) => {
  try {
    // Get request stats
    const [
      totalRequests,
      pendingRequests,
      completedRequests
    ] = await Promise.all([
      Request.countDocuments(),
      Request.countDocuments({ status: 'pending' }),
      Request.countDocuments({ status: 'completed' })
    ]);

    // Get active drivers
    const activeDrivers = await Driver.countDocuments({ status: 'active' });

    // Get driver locations
    const drivers = await Driver.find({
      'lastLocation.coordinates': { $exists: true }
    }).select('lastLocation status');

    const driverLocations = drivers.map(driver => ({
      driverId: driver._id,
      location: {
        lat: driver.lastLocation.coordinates[1],
        lng: driver.lastLocation.coordinates[0]
      },
      status: driver.status
    }));

    res.json({
      totalRequests,
      pendingRequests,
      completedRequests,
      activeDrivers,
      driverLocations
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    
    const requests = await Request.find(query)
      .populate('assignedDriverId', 'name vehicleType')
      .sort('-createdAt');
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignDriver = async (req, res) => {
  try {
    const { requestId, driverId } = req.body;
    
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Update request
    request.assignedDriverId = driverId;
    await request.save();

    // Add to driver's route
    let driverRoute = await DriverRoute.findOne({ driverId });
    if (!driverRoute) {
      driverRoute = new DriverRoute({ driverId, requests: [requestId] });
    } else {
      driverRoute.requests.push(requestId);
    }
    await driverRoute.save();

    res.json({ message: 'Driver assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Request rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password').sort('name');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDriver = async (req, res) => {
  try {
    const { name, email, phone, license, vehicle, vehicleType } = req.body;
    
    // Check if driver with email or phone exists
    const existingDriver = await Driver.findOne({ $or: [{ email }, { phone }] });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver with this email or phone already exists' });
    }

    const driver = new Driver({
      name,
      email,
      phone,
      license,
      vehicle,
      vehicleType
    });

    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).select('-password');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const filterDrivers = async (req, res) => {
  try {
    const { vehicleType } = req.params;
    const drivers = await Driver.find({ vehicleType }).select('-password');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const callAutoAssignAPI = async (req, res) => {
  try {
    const { requestId } = req.body;
    
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Find available drivers
    const drivers = await Driver.find({
      'lastLocation.coordinates': { $exists: true }
    });

    if (!drivers.length) {
      return res.status(404).json({ message: 'No available drivers found' });
    }

    // Find nearest driver
    let nearestDriver = null;
    let shortestDistance = Infinity;

    drivers.forEach(driver => {
      const distance = isWithinDistance(
        request.location.coordinates[0],
        request.location.coordinates[1],
        driver.lastLocation.coordinates[0],
        driver.lastLocation.coordinates[1]
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestDriver = driver;
      }
    });

    if (!nearestDriver) {
      return res.status(404).json({ message: 'No suitable driver found' });
    }

    // Assign request to nearest driver
    request.assignedDriverId = nearestDriver._id;
    await request.save();

    // Add to driver's route
    let driverRoute = await DriverRoute.findOne({ driverId: nearestDriver._id });
    if (!driverRoute) {
      driverRoute = new DriverRoute({ driverId: nearestDriver._id, requests: [requestId] });
    } else {
      driverRoute.requests.push(requestId);
    }
    await driverRoute.save();

    res.json({ message: 'Request auto-assigned successfully', driverId: nearestDriver._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  dashboard,
  getAllRequests,
  assignDriver,
  rejectRequest,
  getAllDrivers,
  createDriver,
  getDriverProfile,
  filterDrivers,
  callAutoAssignAPI
}; 