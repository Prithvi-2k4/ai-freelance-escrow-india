import React from 'react';

export default function Dashboard(){
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="mt-3">Welcome, <strong>{user?.name}</strong> — role: {user?.role}</p>
      <p className="mt-4 text-sm text-gray-600">Use the site to post jobs (clients) or apply (freelancers) — this is a starter scaffold for your capstone.</p>
    </div>
  );
}
