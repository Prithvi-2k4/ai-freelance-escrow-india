// src/components/Register.jsx
import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer',
  });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onChange = (e) => {
    setErr('');
    setOk('');
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setOk('');
    setLoading(true);

    try {
      // normalize role before sending
      const payload = {
        ...form,
        role: (form.role || '').toString().trim().toLowerCase(),
      };

      const res = await api.post('/auth/register', payload);

      // If backend returns a token -> auto-login & go dashboard
      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        nav('/dashboard');
        return;
      }

      // Otherwise show success message and redirect to login
      const message = res?.data?.message || res?.data?.ok || 'Registered successfully. Please login.';
      setOk(message);
      // short delay so user sees success toast then redirect
      setTimeout(() => nav('/login'), 900);
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        (typeof error?.response?.data === 'string' ? error.response.data : null) ||
        error?.message ||
        'Registration failed';
      setErr(message);
    } finally {
      setLoading(false);
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

        <button
          className={`w-full ${loading ? 'opacity-70 cursor-not-allowed' : 'bg-brand-500'} text-white py-2 rounded`}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
