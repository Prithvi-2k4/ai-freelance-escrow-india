import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobsList from './pages/JobsList';
import PostJob from './pages/PostJob';
import JobDetail from './pages/JobDetail';
import Navbar from './components/Navbar';

export default function App(){
  return <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<JobsList/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/post" element={<PostJob/>}/>
      <Route path="/job/:id" element={<JobDetail/>}/>
    </Routes>
  </BrowserRouter>
}
