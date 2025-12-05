router.get('/', async (req,res) => {
  try {
    const { q, skill, page=1, limit=10 } = req.query;
    const filter = {};
    if(q) filter.$or = [{ title: new RegExp(q,'i') }, { description: new RegExp(q,'i') }];
    if(skill) filter.skills = skill;
    const skip = (page-1)*limit;
    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt:-1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter)
    ]);
    res.json({ jobs, total, page:Number(page), limit:Number(limit) });
  } catch(e){ res.status(500).json({ msg:e.message }); }
});
