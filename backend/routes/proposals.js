// backend/routes/proposals.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const User = require('../models/User'); // ensure you have a User model
const notifyUser = require('../utils/notify'); // backend/utils/notify.js

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

    // Notify job owner (in-app + optional email)
    try {
      const owner = await User.findById(job.createdBy);
      const ownerEmail = owner?.email || null;
      const title = 'New proposal received';
      const body = `You received a new proposal for "${job.title}"`;

      // create in-app notification + optionally send email
      await notifyUser(owner._id, title, body, ownerEmail);

      // emit real-time notification via socket.io if available
      const io = req.app.get('io');
      if (io) {
        // Emit to a room named after the owner's user id (you can change convention)
        io.to(String(owner._id)).emit('notification', { title, body, jobId: job._id, type: 'proposal' });
      }
    } catch (nerr) {
      console.warn('notifyUser error (non-fatal):', nerr && nerr.message ? nerr.message : nerr);
    }

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

    // Notify freelancer about acceptance
    try {
      const freelancer = await User.findById(p.freelancer._id);
      const freelancerEmail = freelancer?.email || null;
      const title = 'Your proposal was accepted';
      const body = `Your proposal on "${p.job.title}" was accepted by the owner.`;

      await notifyUser(freelancer._id, title, body, freelancerEmail);

      const io = req.app.get('io');
      if (io) {
        // notify the freelancer in real-time (room convention: userId)
        io.to(String(freelancer._id)).emit('notification', { title, body, jobId: p.job._id, type: 'proposal_accepted' });
      }
    } catch (nerr) {
      console.warn('notifyUser error (non-fatal):', nerr && nerr.message ? nerr.message : nerr);
    }

    res.json(p);
  } catch (e) {
    console.error('POST /proposals/accept/:id error', e);
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
