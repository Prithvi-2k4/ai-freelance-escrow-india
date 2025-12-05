import React, {useEffect, useState} from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function JobsList(){
  const [jobs,setJobs] = useState([]);
  const [q,setQ] = useState('');
  const [page,setPage] = useState(1);
  const [total,setTotal] = useState(0);
  const [limit] = useState(10);

  const load = async () => {
    try{
      const res = await api.get('/jobs', { params: { q, page, limit } });
      setJobs(res.data.jobs || res.data);
      setTotal(res.data.total || 0);
    }catch(e){ console.error(e); }
  };

  useEffect(()=>{ load(); }, [q, page]);

  const pages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Link to="/post" className="text-sm bg-brand-500 text-white px-4 py-2 rounded">Post Job</Link>
      </div>

      <div className="mb-4 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search jobs..." className="border p-2 rounded flex-1" />
        <button onClick={()=>{ setPage(1); load(); }} className="bg-gray-200 px-3 rounded">Search</button>
      </div>

      <div className="grid gap-4">
        {jobs.map(j=> (
          <Link to={`/jobs/${j._id}`} key={j._id} className="bg-white p-4 rounded shadow block">
            <h3 className="text-xl font-semibold">{j.title}</h3>
            <p className="text-sm text-gray-600">{j.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 border rounded">Prev</button>
        <div className="px-3 py-1">Page {page} / {pages||1}</div>
        <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page>=pages} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  );
}
