const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  binId: String,
  fullness: Number,
  timestamp: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model('Bin', binSchema);