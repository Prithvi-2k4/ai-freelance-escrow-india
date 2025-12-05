const axios = require('axios');
const User = require('../models/User');

async function recommendFreelancers(job){
  // Basic skill-overlap scoring (fast and works offline)
  const candidates = await User.find({ role:'freelancer'});
  const scored = candidates.map(c=>{
    const overlap = (c.skills || []).filter(s => (job.skills||[]).includes(s)).length;
    return {id:c._id, name:c.name, overlap, skills:c.skills||[]};
  }).sort((a,b)=>b.overlap-a.overlap).slice(0,10);

  // Optional: semantic re-ranking using OpenAI (uncomment to enable)
  if(process.env.OPENAI_API_KEY){
    try{
      const prompt = `Job title: ${job.title}\nDescription: ${job.description}\nCandidates: ${JSON.stringify(scored)}\n\nReturn a JSON array of candidate ids ordered by best fit.`;
      const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-5-thinking-mini",
        messages: [{role:'user', content: prompt}],
        max_tokens: 300
      }, { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } });
      // parse response content for ordering - this is best-effort and may need tuning
      const text = resp.data.choices?.[0]?.message?.content || '';
      // try parse JSON inside response
      const ordered = JSON.parse(text);
      // map ordered ids to scored entries if possible
      const mapped = ordered.map(id => scored.find(s=> String(s.id) === String(id))).filter(Boolean);
      if(mapped.length) return mapped;
    }catch(e){ console.warn('OpenAI reorder failed:', e.message); }
  }

  return scored;
}

module.exports = { recommendFreelancers };
