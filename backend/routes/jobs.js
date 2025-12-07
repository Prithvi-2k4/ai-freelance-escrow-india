const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// PUBLIC: list jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(50).populate('createdBy', 'name email');
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// AUTH: create job
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const j = await Job.create({ title, description, budget, createdBy: req.user.id });
    res.json(j);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// get job by id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email');
    if (!job) return res.status(404).json({ msg: 'Not found' });
    res.json(job);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;
