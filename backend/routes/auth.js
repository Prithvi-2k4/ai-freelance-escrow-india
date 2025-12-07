// backend/routes/auth.js  (replace the register handler)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // adjust path if needed

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields: name, email, password, role' });
    }
    if (!['freelancer', 'client'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be freelancer or client' });
    }

    // Check existing user
    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ name, email, password: hash, role });
    await user.save();

    // Return minimal success
    return res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    // Helpful logging for debugging — adjust for production
    console.error('Register error:', err && err.stack ? err.stack : err);
    // Handle duplicate key error if it slipped through:
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered (duplicate key)' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
