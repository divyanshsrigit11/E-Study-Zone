import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/admin/login`, credentials);
            if (res.data.msg === "Login Successfully") {
                localStorage.setItem("adminToken", res.data.data.token);
                localStorage.setItem("id", res.data.data.id);
                navigate('/admindashboard');
            } else {
                alert(res.data.msg);
            }
        } catch (error) {
            alert("Server Error. Please try again.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center mb-4">
                    <h3 className="fw-bold text-danger mb-1">E-Study Zone</h3>
                    <p className="text-muted small fw-bold">ADMINISTRATION PORTAL</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <div className="form-floating mb-3">
                        <input type="email" className="form-control bg-light border-0" id="adminEmail" name="email" placeholder="name@example.com" onChange={handleChange} required />
                        <label htmlFor="adminEmail" className="text-muted">Admin Email</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input type="password" className="form-control bg-light border-0" id="adminPassword" name="password" placeholder="Password" onChange={handleChange} required />
                        <label htmlFor="adminPassword" className="text-muted">Password</label>
                    </div>
                    <button type="submit" className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow-sm mb-3">
                        Secure Login
                    </button>
                </form>
                <div className="text-center">
                    <a href="/" className="text-decoration-none text-muted small"><i className="bi bi-arrow-left me-1"></i>Back to Main Site</a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;