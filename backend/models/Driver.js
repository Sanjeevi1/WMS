const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && 
               v.length === 2 && 
               v[0] >= -180 && 
               v[0] <= 180 && 
               v[1] >= -90 && 
               v[1] <= 90;
      },
      message: 'Coordinates must be [longitude, latitude] with valid ranges'
    }
  }
});

const driverSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  license: String,
  vehicle: String,
  vehicleType: String,
  password: String,
  lastLocation: {
    type: pointSchema,
    required: true,
    default: () => ({
      type: 'Point',
      coordinates: [0, 0]
    })
  }
}, { timestamps: true });

driverSchema.index({ lastLocation: '2dsphere' });

driverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const emailPrefix = this.email.slice(0, 4);
  const phoneSuffix = this.phone.slice(-4);
  if (!this.password) this.password = `${emailPrefix}${phoneSuffix}`;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Driver", driverSchema); 