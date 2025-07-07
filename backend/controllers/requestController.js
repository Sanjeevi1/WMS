const Request = require('../models/Request');
const Driver = require('../models/Driver');
const DriverRoute = require('../models/DriverRoute');

// Get all requests with filtering
const getRequests = async (req, res) => {
  try {
    const { status, userId, driverId } = req.query;
    
    // Build query based on filters
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (userId) query.userId = userId;
    if (driverId) query.assignedDriverId = driverId;

    const requests = await Request.find(query)
      .populate('userId', 'name email')
      .populate('assignedDriverId', 'name vehicleType')
      .sort('-createdAt');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new request
const createRequest = async (req, res) => {
  try {
    const {
      userId,
      address,
      request_type,
      message,
      email,
      location
    } = req.body;

    const request = new Request({
      userId,
      address,
      request_type,
      message,
      email,
      location: {
        type: 'Point',
        coordinates: location
      }
    });

    await request.save();

    // Find nearest available driver
    const nearestDriver = await Driver.findOne({
      'lastLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location
          },
          $maxDistance: 5000 // 5km radius
        }
      }
    });

    // If driver found, auto-assign
    if (nearestDriver) {
      request.assignedDriverId = nearestDriver._id;
      await request.save();

      // Add to driver's route
      let driverRoute = await DriverRoute.findOne({ driverId: nearestDriver._id });
      if (!driverRoute) {
        driverRoute = new DriverRoute({ driverId: nearestDriver._id, requests: [request._id] });
      } else {
        driverRoute.requests.push(request._id);
      }
      await driverRoute.save();
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update request
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow updating certain fields
    delete updates.userId;
    delete updates.completionPhoto;
    delete updates.createdAt;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // If updating location, ensure proper format
    if (updates.location) {
      updates.location = {
        type: 'Point',
        coordinates: updates.location
      };
    }

    // If changing assigned driver, update driver routes
    if (updates.assignedDriverId && updates.assignedDriverId !== request.assignedDriverId?.toString()) {
      // Remove from old driver's route
      if (request.assignedDriverId) {
        await DriverRoute.updateOne(
          { driverId: request.assignedDriverId },
          { $pull: { requests: request._id } }
        );
      }

      // Add to new driver's route
      let newDriverRoute = await DriverRoute.findOne({ driverId: updates.assignedDriverId });
      if (!newDriverRoute) {
        newDriverRoute = new DriverRoute({
          driverId: updates.assignedDriverId,
          requests: [request._id]
        });
      } else {
        newDriverRoute.requests.push(request._id);
      }
      await newDriverRoute.save();
    }

    Object.assign(request, updates);
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete request
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Remove from driver's route if assigned
    if (request.assignedDriverId) {
      await DriverRoute.updateOne(
        { driverId: request.assignedDriverId },
        { $pull: { requests: request._id } }
      );
    }

    await request.remove();
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRequests,
  createRequest,
  updateRequest,
  deleteRequest
}; 