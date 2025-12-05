import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [myJobs, setMyJobs] = useState([]);

  useEffect(() => {
    api.get('/jobs/my')
      .then(res => setMyJobs(res.data || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <Link to="/post-job" className="btn mb-4">Post new job</Link>
      <h2 className="text-xl mb-2">My Jobs</h2>
      {myJobs.length === 0 ? <p>No jobs posted</p> : (
        <ul>
          {myJobs.map(j => (
            <li key={j._id}><Link to={`/jobs/${j._id}`} className="text-blue-600">{j.title}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
