// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Freelancer','Client'], required: true, default: 'freelancer' },
  // other fields...
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
