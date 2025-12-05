import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function PostJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post('/jobs', { title, description });
      nav('/jobs');
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.msg || 'Post failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Post Job</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border p-2" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full border p-2" />
        <button className="bg-brand-500 text-white px-4 py-2 rounded">Post Job</button>
      </form>
    </div>
  );
}
