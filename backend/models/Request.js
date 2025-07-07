const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  assignedDriverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null },
  address: String,
  request_type: String,
  message: String,
  email: String,
  status: { type: String, enum: ["pending", "resolved", "rejected"], default: "pending" },
  time: { type: Date, default: Date.now },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  completionPhoto: String
}, { timestamps: true });

requestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Request", requestSchema); 