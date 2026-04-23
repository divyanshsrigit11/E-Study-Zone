import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminChangePassword = () => {
    const adminId = localStorage.getItem("id");
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5000/api/admin/change-password/${adminId}`, passwords);
            alert(res.data.msg);
            if(res.data.msg === "Password changed successfully") {
                localStorage.clear();
                navigate('/adminlogin');
            }
        } catch (error) {
            alert("Failed to change password. Please check your inputs.");
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="mb-4">
                <h3 className="fw-bold text-dark mb-1">Security Settings</h3>
                <p className="text-muted small">Update your Super Admin password.</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4" style={{ maxWidth: '600px' }}>
                <div className="card-body p-4 p-md-5">
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control bg-light border-0" id="oldPassword" name="oldPassword" placeholder="Current Password" onChange={handleChange} required />
                            <label htmlFor="oldPassword">Current Password</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control bg-light border-0" id="newPassword" name="newPassword" placeholder="New Password" onChange={handleChange} required />
                            <label htmlFor="newPassword">New Password</label>
                        </div>
                        <div className="form-floating mb-4">
                            <input type="password" className="form-control bg-light border-0" id="confirmPassword" name="confirmPassword" placeholder="Confirm New Password" onChange={handleChange} required />
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                        </div>
                        <button type="submit" className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow-sm">
                            <i className="bi bi-shield-lock-fill me-2"></i>Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminChangePassword;