const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,
  postedBy: String
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
