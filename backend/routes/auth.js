const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req,res)=>{
  try{
    const {name,email,password,role} = req.body;
    if(!name||!email||!password) return res.status(400).json({msg:'Missing fields'});
    const exists = await User.findOne({email});
    if(exists) return res.status(400).json({msg:'Email taken'});
    const hashed = await bcrypt.hash(password,10);
    const user = await User.create({name,email,password:hashed,role});
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
    res.json({user:{id:user._id,name:user.name,email:user.email,role:user.role},token});
  }catch(e){ console.error(e); res.status(500).json({msg:'err'})}
});

router.post('/login', async (req,res)=>{
  try{
    const {email,password}=req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(404).json({msg:'No user'});
    const ok = await bcrypt.compare(password,user.password);
    if(!ok) return res.status(401).json({msg:'Invalid'});
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
    res.json({user:{id:user._id,name:user.name,email:user.email,role:user.role},token});
  }catch(e){ console.error(e); res.status(500).json({msg:'err'})}
});

module.exports = router;
