import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Freelancer'); // ✅ IMPORTANT (capitalized)
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role, // ✅ send role
      });

      // optional auto-login
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      nav('/dashboard');
    } catch (e) {
      setErr(e.response?.data?.error || e.response?.data?.msg || 'Register failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      {err && <div className="text-red-600 mb-2">{err}</div>}

      <form onSubmit={submit} className="space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          className="w-full border p-2 rounded"
          required
        />

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />

        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />

        {/* ✅ ROLE DROPDOWN */}
        <div>
          <label className="block text-sm mb-1">Register as</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full border p-2 rounded bg-white"
          >
            <option value="Freelancer">Freelancer</option>
            <option value="Client">Client</option>
          </select>
        </div>

        <button className="w-full bg-brand-500 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
