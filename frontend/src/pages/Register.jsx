import React, {useState} from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [role,setRole] = useState('client');
  const [err,setErr] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try{
      const res = await api.post('/auth/register', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/dashboard');
    }catch(err){
      setErr(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border p-2 rounded" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border p-2 rounded" />
        <select value={role} onChange={e=>setRole(e.target.value)} className="w-full border p-2 rounded">
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>
        <button className="w-full bg-brand-500 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
