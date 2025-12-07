// src/components/Register.jsx
import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'freelancer' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const nav = useNavigate();

  const onChange = e => {
    setErr('');
    setOk('');
    setForm(s => ({ ...s, [e.target.name]: e.target.value }));
  };

  const submit = async e => {
    e.preventDefault();
    setErr('');
    setOk('');
    try {
      const res = await api.post('/auth/register', form);
      // If your backend returns a message:
      setOk(res.data?.message || 'Registered successfully. Please login.');
      // optional: redirect after short delay
      setTimeout(() => nav('/login'), 900);
    } catch (error) {
      // axios error handling
      const message = error?.response?.data?.error || error?.response?.data?.msg || error?.message || 'Registration failed';
      setErr(message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      {err && <div className="text-red-600 mb-3">{err}</div>}
      {ok && <div className="text-green-600 mb-3">{ok}</div>}

      <form onSubmit={submit} className="space-y-3">
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Name"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
          className="w-full border p-2 rounded bg-slate-50"
          required
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="Password"
          className="w-full border p-2 rounded bg-slate-50"
          required
        />

        <div className="flex items-center gap-3">
          <label className="text-sm">Register as</label>
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="border p-2 rounded"
          >
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
        </div>

        <button className="w-full bg-brand-500 text-white py-2 rounded" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
