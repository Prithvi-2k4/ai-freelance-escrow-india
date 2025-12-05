const router = require('express').Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

router.get('/:room', auth, async (req,res)=>{
  const msgs = await Message.find({ room: req.params.room }).sort({ createdAt: 1 }).populate('sender','name');
  res.json(msgs);
});

module.exports = router;
