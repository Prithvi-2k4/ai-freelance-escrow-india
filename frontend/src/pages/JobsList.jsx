import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function JobsList(){
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get('/jobs'); // hits /api/jobs
        if (!mounted) return;
        // res.data is expected to be an array
        const raw = res?.data;
        const arr = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.jobs) ? raw.jobs : []);
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

  if (loading) return <div className="p-6">Loading jobs...</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Link to="/post" className="btn">Post Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div>No jobs yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map(j => (
            <div key={j._id || j.id} className="p-4 border rounded">
              <h3 className="text-xl font-semibold">{j.title}</h3>
              <p className="text-sm text-gray-600">{j.description}</p>
              <div className="mt-2">
                <Link to={`/jobs/${j._id || j.id}`} className="text-blue-600">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
