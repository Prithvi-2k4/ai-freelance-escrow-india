import React from 'react';
const user = JSON.parse(localStorage.getItem('user')||'null');
export default function Dashboard(){ return <div><h2>Dashboard</h2><pre>{JSON.stringify(user,null,2)}</pre></div> }
