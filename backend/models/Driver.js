const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String, required: true },
  licenseExpiry: { type: Date, required: true },
  company: { type: String, required: true },
  plateNumber: { type: String, required: true },
  vehicleModel: String,
  vehicleYear: Number,
  capacity: Number,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  registrationDate: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Driver', DriverSchema);