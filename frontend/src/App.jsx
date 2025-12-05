import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JobsList from './pages/JobsList';
import PostJob from './pages/PostJob';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<JobsList />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/post" element={
              <ProtectedRoute><PostJob/></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard/></ProtectedRoute>
            } />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
