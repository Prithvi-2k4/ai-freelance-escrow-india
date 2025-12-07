// Login.jsx
import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      const res = await api.post('/auth/login', { email, password });

      // If backend returns token properly
      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        nav('/dashboard'); // redirect to dashboard
      } else {
        // If success but no token (rare case)
        setErr(
          res?.data?.error ||
            res?.data?.message ||
            'Login succeeded but no token returned'
        );
      }
    } catch (e) {
      // Show correct backend error message
      const message =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.response?.data?.msg ||
        'Login failed';
      setErr(message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      {err && <div className="text-red-600 mb-3">{err}</div>}

      <form onSubmit={submit} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />

        <button
          className="w-full bg-brand-500 text-white py-2 rounded hover:opacity-90 transition"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
