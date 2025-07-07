const Admin = require('../models/Admin');
const Driver = require('../models/Driver');

// Default IDs for testing
const DEFAULT_ADMIN_ID = '67f8aeb64eae41bd3cbd31a5';
const DEFAULT_DRIVER_ID = '67f8aeb84eae41bd3cbd31b6';

const protectAdmin = async (req, res, next) => {
  // No token check, just proceed
  next();
};

const protectDriver = async (req, res, next) => {
  // No token check, just proceed
  next();
};

module.exports = { protectAdmin, protectDriver }; 