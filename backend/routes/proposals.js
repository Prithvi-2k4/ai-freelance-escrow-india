const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const Transaction = require('../models/Transaction');

router.post('/', auth, async (req,res)=>{
  try{
    const p = await Proposal.create({ ...req.body, freelancer: req.user.id });
    res.json(p);
  }catch(e){console.error(e); res.status(500).json({msg:'err'})}
});

router.post('/:id/accept', auth, async (req,res)=>{
  try{
    const proposal = await Proposal.findById(req.params.id).populate('job');
    if(!proposal) return res.status(404).json({msg:'No proposal'});
    proposal.accepted = true;
    await proposal.save();
    const tx = await Transaction.create({
      job: proposal.job._id,
      client: proposal.job.client,
      freelancer: proposal.freelancer,
      amount: proposal.bid,
      upiRef: 'UPI-MOCK-'+Date.now()
    });
    await Job.findByIdAndUpdate(proposal.job._id,{status:'in_progress'});
    res.json({proposal, tx});
  }catch(e){console.error(e); res.status(500).json({msg:'err'})}
});

router.post('/:txId/release', auth, async (req,res)=>{
  try{
    const tx = await Transaction.findById(req.params.txId);
    if(!tx) return res.status(404).json({msg:'No tx'});
    tx.status='released';
    await tx.save();
    await Job.findByIdAndUpdate(tx.job, {status:'completed'});
    res.json(tx);
  }catch(e){console.error(e); res.status(500).json({msg:'err'})}
});

module.exports = router;
