const Admin = require('../models/Admin');
const Driver = require('../models/Driver');

// Default IDs for testing
const DEFAULT_ADMIN_ID = '67f8aeb64eae41bd3cbd31a5';
const DEFAULT_DRIVER_ID = '67f8aeb84eae41bd3cbd31b6';

const adminLogin = async (req, res) => {
  try {
    // Always return default admin
    const admin = await Admin.findById(DEFAULT_ADMIN_ID).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Default admin not found' });
    }

    res.json({
      token: 'dummy-token',
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const driverLogin = async (req, res) => {
  try {
    const driver = await Driver.findById(DEFAULT_DRIVER_ID).select('-password');
    if (!driver) {
      return res.status(404).json({ message: 'Default driver not found' });
    }

    res.json({
      token: 'dummy-token',
      user: {
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        role: 'driver',
        vehicleType: driver.vehicleType,
        license: driver.license,
        vehicle: driver.vehicle
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create initial admin account with specific ID
const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findById(DEFAULT_ADMIN_ID);
    if (!adminExists) {
      await Admin.create({
        _id: DEFAULT_ADMIN_ID,
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'not-used'
      });
      console.log('Admin account created');
    }
  } catch (error) {
    console.error('Error creating admin account:', error);
  }
};

// Create initial driver account with specific ID
const seedDriver = async () => {
  try {
    const driverExists = await Driver.findById(DEFAULT_DRIVER_ID);
    if (!driverExists) {
      await Driver.create({
        _id: DEFAULT_DRIVER_ID,
        name: 'Driver User',
        email: 'driver@example.com',
        password: 'not-used',
        phone: '1234567890',
        license: 'ABC123',
        vehicle: 'Waste Truck 1',
        vehicleType: 'truck',
        lastLocation: {
          type: 'Point',
          coordinates: [0, 0]
        }
      });
      console.log('Driver account created');
    }
  } catch (error) {
    console.error('Error creating driver account:', error);
  }
};

// Call seed functions
seedAdmin();
seedDriver();

module.exports = {
  adminLogin,
  driverLogin
}; 