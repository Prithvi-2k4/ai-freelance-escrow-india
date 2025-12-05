// backend/models/Notification.js
const mongoose = require('mongoose');

const notifSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  read: { type: Boolean, default: false },
  meta: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notifSchema);
