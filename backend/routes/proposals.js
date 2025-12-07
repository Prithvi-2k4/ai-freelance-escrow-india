const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const User = require('../models/User');
const notifyUser = require('../utils/notify');

router.post('/:jobId', auth, async (req, res) => {
  try {
    const { cover, bid } = req.body;
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const p = await Proposal.create({ job: job._id, freelancer: req.user.id, cover, bid });

    // notify owner
    try {
      const owner = await User.findById(job.createdBy);
      if (owner) await notifyUser(owner._id, 'New proposal received', `You got a proposal for "${job.title}"`, owner.email);
    } catch(e){ console.warn(e); }

    res.json(p);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    const filter = String(req.user.id) === String(job.createdBy) ? { job: job._id } : { job: job._id, freelancer: req.user.id };
    const proposals = await Proposal.find(filter).populate('freelancer', 'name email');
    res.json(proposals);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

router.post('/accept/:id', auth, async (req, res) => {
  try {
    const p = await Proposal.findById(req.params.id).populate('job freelancer');
    if (!p) return res.status(404).json({ msg: 'Proposal not found' });
    if (String(p.job.createdBy) !== req.user.id) return res.status(403).json({ msg: 'Not allowed' });
    p.status = 'accepted';
    await p.save();
    await notifyUser(p.freelancer._id, 'Proposal accepted', `Your proposal for "${p.job.title}" was accepted`);
    res.json(p);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;
