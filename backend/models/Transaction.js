const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      'INITIATED',   // proposal accepted
      'ESCROWED',    // money locked
      'COMPLETED',   // work done
      'RELEASED',    // paid to freelancer
      'REFUNDED'     // returned to client
    ],
    default: 'INITIATED',
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
