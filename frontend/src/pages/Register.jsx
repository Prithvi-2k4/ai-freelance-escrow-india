import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Freelancer',
  });

  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    setErr('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (e) {
      setErr(e.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      {err && <div className="text-red-600 mb-2">{err}</div>}

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
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />

        {/* ✅ THIS IS THE DROPDOWN */}
        <div>
          <label className="block text-sm mb-1">Register as</label>
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="w-full border p-2 rounded"
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
