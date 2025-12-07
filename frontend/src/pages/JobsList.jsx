import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api'; // same client you use in Login.jsx

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await api.get('/jobs'); // adjust path if your backend uses a different route
        // debug the raw payload so you can adapt quickly
        console.log('GET /jobs response:', res && res.data ? res.data : res);

        // Normalize to an array:
        // - If res.data is an array -> use it
        // - else if res.data.jobs is an array -> use that
        // - else fallback to empty array
        const raw = res?.data;
        const arr = Array.isArray(raw)
          ? raw
          : (raw && Array.isArray(raw.jobs) ? raw.jobs : []);

        if (!mounted) return;
        setJobs(arr);
      } catch (e) {
        console.error('Failed to fetch jobs', e);
        if (!mounted) return;
        setErr(e?.response?.data?.msg || e.message || 'Failed to load jobs');
        setJobs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Loading jobs…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;

  if (!jobs.length) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Jobs</h2>
        <p className="text-gray-600">No jobs yet.</p>
        <Link to="/post" className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded">Post Job</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Jobs</h2>
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job._id || job.id} className="border rounded p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">
                  <Link to={`/job/${job._id || job.id}`} className="text-blue-600 hover:underline">
                    {job.title || job.name || 'Untitled job'}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {job.description ? (job.description.length > 140 ? job.description.slice(0, 140) + '…' : job.description) : 'No description'}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  {job.budget ? `Budget: ${job.budget}` : null}
                  {job.location ? ` • ${job.location}` : null}
                </div>
              </div>

              <div className="ml-4">
                <Link to={`/job/${job._id || job.id}`} className="text-sm bg-brand-500 text-white px-3 py-1 rounded">
                  View
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
