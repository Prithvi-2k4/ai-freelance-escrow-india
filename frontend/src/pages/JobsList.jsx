import React, {useEffect, useState} from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function JobsList(){
  const [jobs,setJobs] = useState([]);
  const [loading,setLoading] = useState(true);
  const [err,setErr] = useState('');

  useEffect(() => {
    const load = async () => {
      try{
        const res = await api.get('/jobs'); // backend expects auth; if 401 will throw
        setJobs(res.data);
      }catch(e){
        // if 401 -> no token -> show empty and hint
        if(e.response?.status === 401) setErr('Please login to view jobs.');
        else setErr('Failed to load jobs');
      }finally{ setLoading(false); }
    }
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Link to="/post" className="text-sm bg-brand-500 text-white px-4 py-2 rounded">Post Job</Link>
      </div>

      {loading ? <div>Loading…</div> : null}
      {err && <div className="text-red-600 mb-2">{err}</div>}

      <div className="grid grid-cols-1 gap-4">
        {jobs.length === 0 && !err && !loading ? (
          <div className="text-gray-600">No jobs yet.</div>
        ) : jobs.map(j=> (
          <div key={j._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{j.title}</h3>
            <p className="text-sm text-gray-600">{j.description}</p>
            <div className="mt-2 text-sm text-gray-500">Budget: ₹{j.budget || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
