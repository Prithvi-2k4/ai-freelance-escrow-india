// src/components/Register.jsx
import React, { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer', // default
  });
  const [err, setErr] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      // success: redirect or show message
      console.log('registered', data);
    } catch (error) {
      console.error(error);
      setErr(error.message || 'Registration failed');
    }
  };

  return (
    <div className="card p-4" style={{maxWidth: 420}}>
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="Name" required />
        </div>
        <div className="mb-2">
          <input name="email" type="email" value={form.email} onChange={handleChange} className="form-control bg-light" placeholder="Email" required />
        </div>
        <div className="mb-2">
          <input name="password" type="password" value={form.password} onChange={handleChange} className="form-control bg-light" placeholder="Password" required minLength={6} />
        </div>

        {/* ROLE DROPDOWN */}
        <div className="mb-3">
          <label className="form-label">Register as</label>
          <select name="role" value={form.role} onChange={handleChange} className="form-select" required>
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        <button className="btn btn-primary w-100" type="submit">Register</button>
      </form>
    </div>
  );
}
