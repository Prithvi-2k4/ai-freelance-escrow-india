import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/jobs').then(res => setJobs(res.data));
  }, []);

  const logout = () => {
    localStorage.clear();
    location.href = '/login';
  };

  return (
    <div className="p-6">
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 mb-4">Logout</button>

      <h1 className="text-xl font-bold mb-4">Jobs</h1>
      {jobs.map(job => (
        <div key={job._id} className="border p-3 mb-2">
          <h2 className="font-semibold">{job.title}</h2>
          <p>{job.description}</p>
          <p className="text-sm">₹{job.budget}</p>
        </div>
      ))}
    </div>
  );
}
