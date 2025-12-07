const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// get current user's notifications
router.get('/', auth, async (req, res) => {
  try {
    const list = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json(list);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// mark as read
router.post('/read/:id', auth, async (req, res) => {
  try {
    const n = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { read: true }, { new: true });
    res.json(n);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;
