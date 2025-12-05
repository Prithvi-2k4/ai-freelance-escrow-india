const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
  title: {type:String, required:true},
  description: String,
  budget: Number,
  client: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  category: String,
  skills: [String],
  status: {type:String, enum:['open','in_progress','completed'], default:'open'}
},{timestamps:true});
module.exports = mongoose.model('Job', JobSchema);
