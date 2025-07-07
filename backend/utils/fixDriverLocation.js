const mongoose = require('mongoose');
const Driver = require('../models/Driver');

// MongoDB connection string - match app.js configuration
const MONGODB_URI = 'mongodb://localhost:27017/waste-management';

async function fixDriverLocation() {
  let connection;
  try {
    // Connect with the same options as app.js
    connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find the driver with invalid location
    const driver = await Driver.findById('67f8aeb84eae41bd3cbd31b6');
    
    if (!driver) {
      console.log('Driver not found');
      return;
    }

    console.log('Current driver data:', driver);

    // Update with valid GeoJSON Point
    const updateResult = await Driver.findByIdAndUpdate(
      '67f8aeb84eae41bd3cbd31b6',
      {
        $set: {
          lastLocation: {
            type: 'Point',
            coordinates: [0, 0] // Default to [0, 0] (null island)
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!updateResult) {
      throw new Error('Failed to update driver location');
    }

    console.log('Successfully updated driver location to valid GeoJSON format:', updateResult.lastLocation);

  } catch (error) {
    console.error('Error:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors);
    }
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

// Run the fix
fixDriverLocation().catch(console.error); 