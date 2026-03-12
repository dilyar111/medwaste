const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, default: 'user' } // Можно делить на врачей и водителей
});

module.exports = mongoose.model('User', userSchema);