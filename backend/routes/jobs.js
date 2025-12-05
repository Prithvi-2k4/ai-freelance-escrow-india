const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const ai = require('../services/aiService');

router.post('/', auth, async (req,res)=>{
  try{
    const job = await Job.create({ ...req.body, client: req.user.id });
    res.json(job);
  }catch(e){console.error(e); res.status(500).json({msg:'err'});}
});

router.get('/', async (req,res)=> {
  const jobs = await Job.find().populate('client','name');
  res.json(jobs);
});

router.get('/:id', async (req,res)=> {
  const job = await Job.findById(req.params.id).populate('client','name email');
  if(!job) return res.status(404).json({msg:'No job'});
  res.json(job);
});

router.get('/:id/recommend', async (req,res)=>{
  const job = await Job.findById(req.params.id);
  if(!job) return res.status(404).json({msg:'No job'});
  const suggestions = await ai.recommendFreelancers(job);
  res.json({job, suggestions});
});

module.exports = router;
