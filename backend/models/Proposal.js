const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cover: String,
  bid: Number,
  status: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', ProposalSchema);
