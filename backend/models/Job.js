// backend/models/Job.js (update schema)
const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,
  skills: [String],
  attachments: [{ url: String, public_id: String, filename: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Job', jobSchema);
