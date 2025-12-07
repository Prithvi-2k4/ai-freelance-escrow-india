// simple notifications route example
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification'); // optional - if you have a model
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

// GET /api/notifications - list notifications for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    // if you have a Notification model:
    // const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    // If not, return an empty array for now
    const notifications = []; // fallback
    return res.json(notifications);
  } catch (e) {
    console.error('GET /api/notifications error', e);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
