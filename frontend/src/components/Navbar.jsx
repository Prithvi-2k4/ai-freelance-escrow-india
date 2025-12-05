import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

// inside Navbar.jsx (useEffect)
useEffect(()=>{
  const token = localStorage.getItem('token');
  if(!token) return;
  api.get('/notifications').then(res => {
    const unread = res.data.filter(n=>!n.read).length;
    setUnread(unread);
  }).catch(()=>{});
}, []);

  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <Link to="/" className="text-xl font-semibold text-brand-700">WorkLink</Link>
        </div>
        <div className="space-x-4 flex items-center">
          <Link className="text-sm text-gray-600 hover:text-gray-900" to="/jobs">Jobs</Link>
          <Link className="text-sm text-gray-600 hover:text-gray-900" to="/post">Post Job</Link>
          <Link className="text-sm text-gray-600 hover:text-gray-900" to="/dashboard">Dashboard</Link>

          {!user ? (
            <>
              <Link to="/login" className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Login</Link>
              <Link to="/register" className="ml-2 text-sm bg-green-500 text-white px-3 py-1 rounded">Register</Link>
              <Link to="/notifications" className="...">Notifications {unread>0 && <span className="ml-1 bg-red-500 text-white rounded-full px-2 text-xs">{unread}</span>}</Link>

            </>
          ) : (
            <>
              <span className="text-sm px-2">{user.name}</span>
              <button onClick={logout} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
