const mongoose = require('mongoose');
const ProposalSchema = new mongoose.Schema({
  job: {type: mongoose.Schema.Types.ObjectId, ref:'Job'},
  freelancer: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  bid: Number,
  cover: String,
  accepted: {type:Boolean, default:false}
},{timestamps:true});
module.exports = mongoose.model('Proposal', ProposalSchema);
