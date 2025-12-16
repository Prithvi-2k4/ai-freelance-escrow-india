import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    nav('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded w-80 shadow">
        <input className="w-full p-2 mb-3 border" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 mb-3 border" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2">Login</button>
      </form>
    </div>
  );
}
