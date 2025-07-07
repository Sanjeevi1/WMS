const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const createMockAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Delete existing admin if any
    await Admin.deleteOne({ email: 'san@gmail.com' });

    // Create new admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new Admin({
      name: 'san',
      email: 'san@gmail.com',
      password: hashedPassword
    });

    await admin.save();
    console.log('Mock admin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating mock admin:', error);
    process.exit(1);
  }
};

createMockAdmin(); 