const mongoose = require('mongoose');
const TxSchema = new mongoose.Schema({
  job: {type: mongoose.Schema.Types.ObjectId, ref:'Job'},
  client: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  freelancer: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  amount: Number,
  status: {type:String, enum:['held','released','refunded'], default:'held'},
  upiRef: String
},{timestamps:true});
module.exports = mongoose.model('Transaction', TxSchema);
