import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import API from '../api/api';
export default function JobDetail(){
  const {id}=useParams();
  const [job,setJob]=useState(null), [sug,setSug]=useState([]);
  useEffect(()=>{ API.get(`/jobs/${id}/recommend`).then(r=>{ setJob(r.data.job); setSug(r.data.suggestions); }); },[id]);
  return <div>
    <h2>{job?.title}</h2>
    <p>{job?.description}</p>
    <h3>AI Suggestions</h3>
    {sug.map(s=> <div key={String(s.id)}>{s.name} — score:{s.overlap}</div>)}
  </div>;
}
