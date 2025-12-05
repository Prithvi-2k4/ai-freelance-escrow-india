const router = require('express').Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

router.get('/', auth, async (req,res) => {
  const notes = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notes);
});

router.post('/mark-read/:id', auth, async (req,res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ ok:true });
});

module.exports = router;
