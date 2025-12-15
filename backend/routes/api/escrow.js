const router = require('express').Router();
const Transaction = require('../../models/Transaction');
const auth = require('../../middleware/auth');

// Client deposits money into escrow
router.post('/deposit', auth, async (req, res) => {
  const { jobId, freelancerId, amount } = req.body;

  const txn = await Transaction.create({
    job: jobId,
    client: req.user.id,
    freelancer: freelancerId,
    amount,
    status: 'ESCROWED',
  });

  res.json({ msg: 'Money locked in escrow', transaction: txn });
});

// Client releases escrow
router.post('/release/:id', auth, async (req, res) => {
  const txn = await Transaction.findById(req.params.id);

  if (!txn) return res.status(404).json({ msg: 'Transaction not found' });

  txn.status = 'RELEASED';
  await txn.save();

  res.json({ msg: 'Payment released to freelancer' });
});

// Refund escrow
router.post('/refund/:id', auth, async (req, res) => {
  const txn = await Transaction.findById(req.params.id);

  txn.status = 'REFUNDED';
  await txn.save();

  res.json({ msg: 'Escrow refunded to client' });
});

module.exports = router;
