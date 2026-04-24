import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const userId = localStorage.getItem("id");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/user/change-password/${userId}`, passwords);
      alert(res.data.msg); 
      if (res.data.msg === "Password changed successfully") {
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      alert(error.response?.data?.msg || "Failed to change password");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '400px' }}>
        <div className="card-body p-4 text-center">
          <i className="bi bi-shield-lock text-danger mb-3" style={{ fontSize: '3rem' }}></i>
          <h4 className="fw-bold">Security Verification</h4>
          <p className="text-muted small mb-4">Create a new, strong password for your account.</p>
          
          <form onSubmit={handleSubmit} className="text-start mb-3">
            <label className="form-label small fw-bold text-secondary">Old Password</label>
            <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handleChange} className="form-control mb-2" placeholder="Enter current password" required />
            <label className="form-label small fw-bold text-secondary mt-2">New Password</label>
            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} className="form-control mb-2" placeholder="Enter new password" required />
            <label className="form-label small fw-bold text-secondary mt-2">Confirm Password</label>
            <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} className="form-control mb-3" placeholder="Confirm new password" required />
            <button type="submit" className="btn btn-danger w-100 fw-bold py-2 mb-2">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;