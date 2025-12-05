const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
  room: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String
},{ timestamps:true });
module.exports = mongoose.model('Message', msgSchema);
