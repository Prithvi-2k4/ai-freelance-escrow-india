const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

/* Create Job */
router.post('/', auth, async (req, res) => {
  const job = await Job.create({
    ...req.body,
    postedBy: req.user.email
  });
  res.json(job);
});

/* Get Jobs */
router.get('/', async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

module.exports = router;
