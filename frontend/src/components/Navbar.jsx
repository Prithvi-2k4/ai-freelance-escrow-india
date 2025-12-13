import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Navbar() {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // 🔁 Sync user when storage changes (login/logout in other tabs too)
  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  // 🔔 Load notifications only when logged in
  useEffect(() => {
    let mounted = true;

    if (!user) {
      setUnread(0);
      return;
    }

    const loadUnread = async () => {
      try {
        const res = await api.get('/notifications');
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setUnread(list.filter(n => !n.read).length);
      } catch (err) {
        if (err?.response?.status !== 401) {
          console.warn('failed to load notifications', err);
        }
      }
    };

    loadUnread();

    return () => {
      mounted = false;
    };
  }, [user]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); // ✅ immediate UI update
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-brand-700">
          WorkLink
        </Link>

        <div className="space-x-4 flex items-center">
          <Link to="/jobs" className="text-sm text-gray-600">Jobs</Link>
          <Link to="/post" className="text-sm text-gray-600">Post Job</Link>
          <Link to="/dashboard" className="text-sm text-gray-600">Dashboard</Link>

          {!user ? (
            <>
              <Link to="/login" className="bg-blue-500 text-white px-3 py-1 rounded">
                Login
              </Link>
              <Link to="/register" className="bg-green-500 text-white px-3 py-1 rounded">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/notifications" className="text-sm text-gray-600">
                Notifications
                {unread > 0 && (
                  <span className="ml-1 bg-red-500 text-white rounded-full px-2 text-xs">
                    {unread}
                  </span>
                )}
              </Link>
              <span className="text-sm px-2">{user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
