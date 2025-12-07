// backend/routes/jobs.js
const express = require('express');
const router = express.Router();

// GET /api/jobs — list jobs (placeholder)
router.get('/jobs', async (req, res) => {
  try {
    const sample = [
      { _id: '1', title: 'Test job #1', description: 'Placeholder' },
      { _id: '2', title: 'Test job #2', description: 'Placeholder' }
    ];
    return res.json(sample);
  } catch (e) {
    console.error('jobs route error', e);
    return res.status(500).json({ msg: e.message || 'Server error' });
  }
});

module.exports = router;
