import React, {useState} from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function PostJob(){
  const [title,setTitle]=useState('');
  const [desc,setDesc]=useState('');
  const [budget,setBudget]=useState('');
  const [skills,setSkills]=useState('');
  const [err,setErr]=useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try{
      await api.post('/jobs', { title, description: desc, budget: Number(budget), skills: skills.split(',').map(s=>s.trim()) });
      nav('/jobs');
    }catch(e){
      setErr(e.response?.data?.msg || 'Failed to post job');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Post Job</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border p-2 rounded" />
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="w-full border p-2 rounded" />
        <input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Budget (INR)" className="w-full border p-2 rounded" />
        <input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="Skills (csv)" className="w-full border p-2 rounded" />
        <button className="w-full bg-brand-500 text-white py-2 rounded">Create</button>
      </form>
    </div>
  );
}
