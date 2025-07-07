const DriverRoute = require('../models/DriverRoute');
const Request = require('../models/Request');

// Get all driver routes
const getDriverRoutes = async (req, res) => {
  try {
    const routes = await DriverRoute.find()
      .populate('driverId', 'name vehicleType')
      .populate({
        path: 'requests',
        select: 'address request_type status location',
        match: { status: 'pending' }
      })
      .sort('-createdAt');

    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new driver route
const createDriverRoute = async (req, res) => {
  try {
    const { driverId, requests } = req.body;

    // Validate requests exist and are unassigned
    const validRequests = await Request.find({
      _id: { $in: requests },
      status: 'pending',
      assignedDriverId: null
    });

    if (validRequests.length !== requests.length) {
      return res.status(400).json({ message: 'Some requests are invalid or already assigned' });
    }

    const route = new DriverRoute({
      driverId,
      requests
    });

    await route.save();

    // Update requests with assigned driver
    await Request.updateMany(
      { _id: { $in: requests } },
      { assignedDriverId: driverId }
    );

    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update driver route
const updateDriverRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { requests } = req.body;

    const route = await DriverRoute.findById(id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Remove driver assignment from old requests
    await Request.updateMany(
      { _id: { $in: route.requests } },
      { $unset: { assignedDriverId: 1 } }
    );

    // Validate and update new requests
    const validRequests = await Request.find({
      _id: { $in: requests },
      status: 'pending'
    });

    if (validRequests.length !== requests.length) {
      return res.status(400).json({ message: 'Some requests are invalid' });
    }

    // Update requests with new driver
    await Request.updateMany(
      { _id: { $in: requests } },
      { assignedDriverId: route.driverId }
    );

    route.requests = requests;
    await route.save();

    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete driver route
const deleteDriverRoute = async (req, res) => {
  try {
    const { id } = req.params;
    
    const route = await DriverRoute.findById(id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Remove driver assignment from requests
    await Request.updateMany(
      { _id: { $in: route.requests } },
      { $unset: { assignedDriverId: 1 } }
    );

    await route.remove();
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDriverRoutes,
  createDriverRoute,
  updateDriverRoute,
  deleteDriverRoute
}; 