import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs')
      .then(res => setJobs(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Link to="/post-job" className="btn">Post Job</Link>
      </div>
      {loading ? <p>Loading...</p> : (
        jobs.length === 0 ? <p>No jobs yet.</p> : (
          <div className="grid gap-4">
            {jobs.map(j => (
              <div key={j._id} className="p-4 border rounded">
                <h3 className="text-xl font-semibold">{j.title}</h3>
                <p className="text-sm">{j.description?.slice(0, 150)}</p>
                <Link to={`/jobs/${j._id}`} className="text-blue-600">View</Link>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
