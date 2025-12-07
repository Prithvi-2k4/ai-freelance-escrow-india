// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api'; // <-- update path if your api client is elsewhere

export default function Navbar(){
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadUnread = async () => {
      if (!api || !api.get) {
        setUnread(0);
        return;
      }
      try {
        const res = await api.get('/notifications'); // expects array
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setUnread(list.filter(n => !n.read).length);
      } catch (err) {
        console.warn('failed to load notifications', err?.message || err);
      }
    };

    loadUnread();

    // optional socket listener (if you expose socket as window.__APP_IO__)
    const io = window.__APP_IO__ || null;
    if (io && io.on) {
      const handler = () => setUnread(prev => prev + 1);
      io.on('notification', handler);
      return () => {
        mounted = false;
        io.off('notification', handler);
      };
    }

    return () => { mounted = false; };
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

          {/* Notifications - shown for logged-in users */}
          {user && (
            <Link to="/notifications" className="text-sm text-gray-600 hover:text-gray-900">
              Notifications {unread > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-2 text-xs">{unread}</span>}
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Login</Link>
              <Link to="/register" className="ml-2 text-sm bg-green-500 text-white px-3 py-1 rounded">Register</Link>
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
