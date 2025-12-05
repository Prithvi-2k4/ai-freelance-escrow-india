const mongoose = require('mongoose');
const notifSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  body: String,
  read: { type: Boolean, default: false },
  meta: {}
}, { timestamps:true });
module.exports = mongoose.model('Notification', notifSchema);
