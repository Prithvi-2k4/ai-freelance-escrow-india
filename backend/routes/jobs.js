// backend/routes/jobs.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // your auth
const Job = require('../models/Job');
const upload = require('../middleware/upload');

// create job with files
router.post('/', auth, upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, description, budget, skills } = req.body;
    const skillsArr = skills ? (typeof skills === 'string' ? JSON.parse(skills) : skills) : [];
    const files = (req.files || []).map(f => ({
      url: f.path || f.secure_url || f.url,
      public_id: f.filename || f.public_id,
      filename: f.originalname || f.name
    }));
    const job = await Job.create({
      title, description, budget, skills: skillsArr, attachments: files, createdBy: req.user.id
    });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// existing routes...
module.exports = router;
