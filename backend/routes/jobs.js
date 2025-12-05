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

// backend/routes/jobs.js - list
router.get('/', async (req,res) => {
  try {
    const { q, skill, page = 1, limit = 10 } = req.query;
    const filter = {};
    if(q) filter.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q,'i') }];
    if(skill) filter.skills = skill;
    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt:-1 }).skip(Number(skip)).limit(Number(limit)),
      Job.countDocuments(filter)
    ]);
    res.json({ jobs, total, page: Number(page), limit: Number(limit) });
  } catch(e){ res.status(500).json({ msg: e.message }); }
});

// existing routes...
module.exports = router;
