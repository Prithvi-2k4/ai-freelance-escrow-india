// backend/models/Proposal.js
const mongoose = require('mongoose');
const proposalSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cover: String,
  bid: Number,
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }
}, { timestamps:true });
module.exports = mongoose.model('Proposal', proposalSchema);
