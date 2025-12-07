// backend/routes/auth.js (or controllers/auth.js)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // mongoose model

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing fields' });

    if (!['freelancer','client'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hash, role });
    await user.save();

    // Optionally create JWT here and return token
    return res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
