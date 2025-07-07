const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Import models first
require('./models');

const adminRoutes = require('./routes/adminRoutes');
const driverRoutes = require('./routes/driverRoutes');
const requestRoutes = require('./routes/requestRoutes');
const driverRouteRoutes = require('./routes/driverRouteRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { errorHandler } = require('./utils/errorHandler');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads/request_photos', express.static(path.join(__dirname, 'uploads/request_photos')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/waste-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/driver-routes', driverRouteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;
