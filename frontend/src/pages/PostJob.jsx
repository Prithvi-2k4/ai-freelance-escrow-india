import React, {useState} from 'react';
import API from '../api/api';
export default function PostJob(){
  const [title,setTitle]=useState(''); const [desc,setDesc]=useState(''); const [budget,setBudget]=useState(''); const [sk,setSk]=useState('');
  const submit=async e=>{ e.preventDefault(); await API.post('/jobs', {title, description:desc, budget, skills: sk.split(',').map(s=>s.trim())}); window.location='/'; }
  return <form onSubmit={submit}>
    <h2>Post Job</h2>
    <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)}/>
    <textarea placeholder="desc" value={desc} onChange={e=>setDesc(e.target.value)}/>
    <input placeholder="budget" value={budget} onChange={e=>setBudget(e.target.value)}/>
    <input placeholder="skills(csv)" value={sk} onChange={e=>setSk(e.target.value)}/>
    <button>Post</button>
  </form>
}
