// backend/routes/proposals.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Proposal = require('../models/Proposal');
const Job = require('../models/Job');

// apply to a job
router.post('/:jobId', auth, async (req, res) => {
  try {
    const { cover, bid } = req.body;
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const p = await Proposal.create({
      job: req.params.jobId,
      freelancer: req.user.id,
      cover,
      bid
    });

    // plain response — notifications/emails removed
    res.json(p);
  } catch (e) {
    console.error('POST /proposals/:jobId error', e);
    res.status(500).json({ msg: e.message });
  }
});

// get proposals for job (owner or freelancer)
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    // owner sees all proposals; freelancer sees only their own
    const filter =
      String(req.user.id) === String(job.createdBy)
        ? { job: req.params.jobId }
        : { job: req.params.jobId, freelancer: req.user.id };

    const proposals = await Proposal.find(filter).populate('freelancer', 'name email');
    res.json(proposals);
  } catch (e) {
    console.error('GET /proposals/job/:jobId error', e);
    res.status(500).json({ msg: e.message });
  }
});

// owner accepts a proposal
router.post('/accept/:id', auth, async (req, res) => {
  try {
    const p = await Proposal.findById(req.params.id).populate('job freelancer');
    if (!p) return res.status(404).json({ msg: 'Proposal not found' });

    // Ensure only job owner can accept
    if (String(p.job.createdBy) !== req.user.id) return res.status(403).json({ msg: 'Not allowed' });

    p.status = 'accepted';
    await p.save();

    // plain response — notifications/emails removed
    res.json(p);
  } catch (e) {
    console.error('POST /proposals/accept/:id error', e);
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
