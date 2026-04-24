import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Standard imports immediately catch missing files and errors
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import TrainerDashboard from './pages/trainer/trainerDashboard'; 
import UserDashboard from './pages/user/userDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ResetPassword from './pages/public/ResetPassword';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/trainerDashboard" element={<TrainerDashboard />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="*" element={<div className="text-center mt-5 text-danger fw-bold">404 - Page Not Found</div>} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App;
