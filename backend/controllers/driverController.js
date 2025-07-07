const Driver = require('../models/Driver');
const Request = require('../models/Request');
const DriverRoute = require('../models/DriverRoute');
const { isWithinDistance } = require('../utils/haversine');

// Default driver ID and data
const DEFAULT_DRIVER_ID = '67f8aeb84eae41bd3cbd31b6';
const DEFAULT_DRIVER_DATA = {
  _id: DEFAULT_DRIVER_ID,
  name: 'Default Driver',
  email: 'driver@example.com',
  phone: '1234567890',
  license: 'DL123456',
  vehicle: 'Truck 001',
  vehicleType: 'Garbage Truck',
  lastLocation: {
    type: 'Point',
    coordinates: [0, 0]
  }
};

// Get or create default driver
const getOrCreateDefaultDriver = async () => {
  let driver = await Driver.findById(DEFAULT_DRIVER_ID);
  if (!driver) {
    try {
      driver = await Driver.create(DEFAULT_DRIVER_DATA);
      console.log('Created default driver:', driver);
    } catch (error) {
      console.error('Error creating default driver:', error);
      throw error;
    }
  }
  return driver;
};

// Get driver's current route
const myRoute = async (req, res) => {
  try {
    // Ensure default driver exists
    const driver = await getOrCreateDefaultDriver();

    const route = await DriverRoute.findOne({ driverId: DEFAULT_DRIVER_ID })
      .sort('-createdAt')
      .populate({
        path: 'requests',
        match: { status: 'pending' },
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });

    // Format response to match frontend interface
    const response = {
      currentRequest: null,
      upcomingRequests: [],
      driverLocation: {
        lat: driver.lastLocation.coordinates[1] || 0,
        lng: driver.lastLocation.coordinates[0] || 0
      }
    };

    if (route && route.requests.length > 0) {
      // First request is current, rest are upcoming
      [response.currentRequest, ...response.upcomingRequests] = route.requests;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resolve request with photo
const resolveRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    
    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    const request = await Request.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Get or create default driver
    const driver = await getOrCreateDefaultDriver();

    // Check if driver is within 100 meters of request location
    const isNearby = isWithinDistance(
      request.location.coordinates[0],
      request.location.coordinates[1],
      driver.lastLocation.coordinates[0],
      driver.lastLocation.coordinates[1],
      100 // 100 meters radius
    );

    if (!isNearby) {
      return res.status(400).json({ message: 'You must be within 100 meters of the request location' });
    }

    // Save completion photo
    if (req.file) {
      request.completionPhoto = `/uploads/request_photos/${req.file.filename}`;
    }

    request.status = 'resolved';
    await request.save();

    // Remove request from driver's route
    const route = await DriverRoute.findOne({ driverId: DEFAULT_DRIVER_ID });
    if (route) {
      route.requests = route.requests.filter(r => r.toString() !== requestId);
      await route.save();
    }

    res.json({ message: 'Request resolved successfully' });
  } catch (error) {
    console.error('Error resolving request:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get driver's request history
const requestHistory = async (req, res) => {
  try {
    // Ensure default driver exists
    await getOrCreateDefaultDriver();

    const requests = await Request.find({
      assignedDriverId: DEFAULT_DRIVER_ID,
      status: 'resolved'
    })
      .populate('userId', 'name email')
      .sort('-updatedAt');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update driver's location
const locationTracking = async (req, res, next) => {
  try {
    const { lastLocation } = req.body;

    // Detailed validation
    if (!lastLocation) {
      return res.status(400).json({ 
        message: 'Location data is required',
        details: 'Request body must include lastLocation object'
      });
    }

    if (!lastLocation.type || lastLocation.type !== 'Point') {
      return res.status(400).json({ 
        message: 'Invalid location type',
        details: 'Location type must be "Point"'
      });
    }

    if (!lastLocation.coordinates || !Array.isArray(lastLocation.coordinates)) {
      return res.status(400).json({ 
        message: 'Invalid coordinates format',
        details: 'Coordinates must be an array'
      });
    }

    if (lastLocation.coordinates.length !== 2) {
      return res.status(400).json({ 
        message: 'Invalid coordinates length',
        details: 'Coordinates must contain exactly 2 values [longitude, latitude]'
      });
    }

    const [longitude, latitude] = lastLocation.coordinates;
    
    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      return res.status(400).json({ 
        message: 'Invalid coordinate values',
        details: 'Coordinates must be numbers'
      });
    }

    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      return res.status(400).json({ 
        message: 'Invalid coordinate range',
        details: 'Longitude must be between -180 and 180, latitude between -90 and 90'
      });
    }
    
    // Get or create default driver
    const driver = await getOrCreateDefaultDriver();

    // Update location
    driver.lastLocation = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };

    await driver.save();

    // Emit location update through Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('driverLocationUpdate', {
        driverId: driver._id,
        location: {
          lng: longitude,
          lat: latitude
        }
      });
    }

    res.json({ 
      message: 'Location updated successfully',
      location: {
        lng: longitude,
        lat: latitude
      }
    });
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
};

module.exports = {
  myRoute,
  resolveRequest,
  requestHistory,
  locationTracking
}; 