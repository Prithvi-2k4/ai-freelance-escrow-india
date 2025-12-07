import React, { useEffect, useState } from 'react';
import api from '../api/api'; // your centralized axios instance
import { Link } from 'react-router-dom';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadJobs() {
      try {
        setErr(null);
        const res = await api.get('/jobs'); // ensure api.baseURL points to your backend
        // console.log('GET /jobs raw response:', res);

        // normalize possible shapes:
        // 1) res.data is an array -> use it
        // 2) res.data = { jobs: [...] } -> use res.data.jobs
        // 3) res.data = null/other -> fallback to []
        const raw = res?.data;
        const arr = Array.isArray(raw)
          ? raw
          : (raw && Array.isArray(raw.jobs) ? raw.jobs : []);

        if (!mounted) return;
        setJobs(arr);
      } catch (e) {
        if (!mounted) return;
        console.error('Failed to fetch jobs', e);
        setErr(e?.response?.data?.msg || e?.message || 'Failed to load jobs');
        setJobs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadJobs();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Loading jobs...</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Link to="/post-job" className="btn">Post Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-gray-600">No jobs yet.</div>
      ) : (
        <ul className="space-y-4">
          {jobs.map(job => (
            <li key={job._id || job.id} className="p-4 border rounded bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{job.title || 'Untitled'}</h2>
                  <p className="text-sm text-gray-600">{job.company || job.description || ''}</p>
                </div>
                <div className="text-right">
                  <Link to={`/jobs/${job._id || job.id}`} className="text-blue-600">View</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
