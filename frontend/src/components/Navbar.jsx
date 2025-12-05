import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

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
        <div className="space-x-4">
          <Link className="text-sm text-gray-600 hover:text-gray-900" to="/jobs">Jobs</Link>
          <Link className="text-sm text-gray-600 hover:text-gray-900" to="/post">Post Job</Link>
          <Link className="text-sm text-gray-600 hover:text-gray-900" to="/dashboard">Dashboard</Link>
          {user ? (
            <>
              <span className="text-sm px-2">{user.name}</span>
              <button onClick={logout} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
