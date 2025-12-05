import React, {useState} from 'react';
import API from '../api/api';
export default function Login(){
  const [email,setEmail]=useState(''); const [pw,setPw]=useState('');
  const submit = async e=>{
    e.preventDefault();
    const res = await API.post('/auth/login',{email,password:pw});
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    window.location='/dashboard';
  };
  return <form onSubmit={submit}>
    <h2>Login</h2>
    <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
    <input placeholder="password" type="password" value={pw} onChange={e=>setPw(e.target.value)}/>
    <button>Login</button>
    <p>Or register via API /auth/register</p>
  </form>;
}
