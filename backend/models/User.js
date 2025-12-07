// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['freelancer', 'client'],   // accept lowercase values
    required: true,
    default: 'freelancer',
    lowercase: true                   // auto-lowercase stored value
  },
  // other fields...
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
