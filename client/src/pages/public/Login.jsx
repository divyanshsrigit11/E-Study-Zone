import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../AuthPage.css';
import logo from '../../assets/logo.webp';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/user/login', credentials);
            
            if (res.data.msg === "Login Successfully") {
                // Save token and ID
                localStorage.setItem("token", res.data.data.token);
                localStorage.setItem("id", res.data.data.id);
                
                // Route MUST perfectly match the paths defined in App.jsx
                if (res.data.data.role === 'Trainer') {
                    navigate('/trainerDashboard');
                } else {
                    navigate('/userDashboard');
                }
            } else {
                // Shows backend rejections (e.g., "Password incorrect" or "Pending admin approval")
                alert(res.data.msg);
            }
        } catch (error) {
            console.error("Login Request Failed:", error);
            alert("Server Error: Check if your backend is running on Port 5000.");
        }
    };

    return (
        <div className="container-fluid auth-container p-0">
            <div className="row g-0 w-100 h-100">
                
                {/* Brand Side */}
                <div className="col-md-6 brand-section d-none d-md-flex">
                    <img src={logo} alt="logo" className="brand-logo" />
                    <h1 className="fw-bold">e-study-zone</h1>
                    <p>Welcome back! Pick up right where you left off.</p>
                    <img src="https://illustrations.popsy.co/white/student-going-to-school.svg" alt="Login" className="illustration-img" />
                </div>

                {/* Form Side */}
                <div className="col-md-6 col-12 form-section">
                    <div className="auth-form-box" style={{ maxWidth: '380px' }}>
                        <div className="mb-4">
                            <h2 className="fw-bold mb-0">Welcome Back</h2>
                            <p className="text-muted small">Please enter your details to sign in.</p>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">EMAIL ADDRESS</label>
                                <input type="email" className="form-control form-control-md bg-light border-0" placeholder="name@example.com" name="email" value={credentials.email} onChange={handleChange} required />
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label small fw-bold">PASSWORD</label>
                                <input type="password" className="form-control form-control-md bg-light border-0" placeholder="Enter password" name="password" value={credentials.password} onChange={handleChange} required />
                            </div>

                            <button type="submit" className="btn btn-danger btn-md w-100 shadow-sm py-2 fw-bold">Sign In</button>
                        </form>

                        <p className="text-center mt-4 small">
                            Don't have an account? <Link to="/register" className="text-danger fw-bold text-decoration-none">Sign up for free</Link>
                        </p>
                        
                        <div className="text-center mt-4 pt-3 border-top">
                            <Link to="/adminlogin" className="text-muted small text-decoration-none">
                                <i className="bi bi-shield-lock me-1"></i> Admin Portal Access
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;