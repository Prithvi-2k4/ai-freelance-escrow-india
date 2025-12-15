import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Freelancer');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/auth/register', {
      name, email, password, role
    });
    nav('/login');
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Name" onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e=>setPassword(e.target.value)} />
      <select onChange={e=>setRole(e.target.value)}>
        <option>Freelancer</option>
        <option>Client</option>
      </select>
      <button>Register</button>
    </form>
  );
}
