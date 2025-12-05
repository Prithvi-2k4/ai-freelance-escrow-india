import React, {useEffect, useState} from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';
export default ()=> {
  const [jobs,setJobs]=useState([]);
  useEffect(()=>{ API.get('/jobs').then(r=>setJobs(r.data)); },[]);
  return <div>
    <h2>Jobs</h2>
    {jobs.map(j=> <div key={j._id}><Link to={'/job/'+j._id}>{j.title}</Link> - {j.client?.name}</div>)}
  </div>;
}
