// backend/routes/api/jobRoutes.js
const express = require('express');
const router = express.Router();
const Job = require('../../models/Job'); // adjust path to your model

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const { q, skill, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (q) filter.$or = [
      { title: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') }
    ];
    if (skill) filter.skills = skill;

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter)
    ]);

    res.json({ jobs, total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    console.error('jobs route error', e);
    res.status(500).json({ msg: e.message || 'Server error' });
  }
});

module.exports = router;
