// src/components/Register.jsx
import React, { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setError('');
    setSuccess('');
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      // try to parse JSON body safely
      let bodyText = await res.text();
      let body;
      try { body = JSON.parse(bodyText); } catch (_) { body = { message: bodyText }; }

      if (!res.ok) {
        // body may contain { error: '...' } or message
        setError(body.error || body.message || `Registration failed (${res.status})`);
        return;
      }

      // success
      setSuccess(body.message || 'Registered successfully. Please login.');
      // optionally redirect or clear form
      setForm({ name: '', email: '', password: '', role: 'freelancer' });
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card p-4" style={{ width: 420 }}>
        <h3 className="mb-3">Register</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Name"
              required
            />
          </div>

          <div className="mb-2">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="form-control bg-light"
              placeholder="Email"
              required
            />
          </div>

          <div className="mb-2">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="form-control bg-light"
              placeholder="Password"
              required
              minLength={6}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Register as</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </div>

          <button className="btn btn-primary w-100" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
