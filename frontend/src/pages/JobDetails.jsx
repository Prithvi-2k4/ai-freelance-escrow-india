import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams } from 'react-router-dom';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(e => setErr(e.response?.data?.msg || 'Failed to load'));
  }, [id]);

  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!job) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <p className="mb-4">{job.description}</p>
      {/* Apply form (example) */}
      <ApplyForm jobId={id} />
    </div>
  );
}

function ApplyForm({ jobId }) {
  const [cover, setCover] = useState('');
  const [bid, setBid] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api.post(`/proposals/${jobId}`, { cover, bid });
      setMsg('Applied successfully');
    } catch (e) {
      setMsg(e.response?.data?.msg || 'Apply failed');
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md">
      {msg && <div className="text-green-600 mb-2">{msg}</div>}
      <textarea value={cover} onChange={e => setCover(e.target.value)} placeholder="Cover message" className="w-full border p-2 mb-2" />
      <input value={bid} onChange={e => setBid(e.target.value)} placeholder="Bid amount" className="w-full border p-2 mb-2" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Apply</button>
    </form>
  );
}
