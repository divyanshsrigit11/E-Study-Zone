import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../../AuthPage.css';
import logo from '../../assets/logo.webp'
import { useState } from 'react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email:'',
        password:''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // For demonstration, we will just navigate to the admin dashboard on form submission.
        // In a real application, you would validate the credentials here.
        navigate('/AdminDashboard');
    }

    const handleChange = (e) => {
        setData(() => ({...data, [e.target.name]:e.target.value}))
    }

    return (
        <div className='container-fluid auth-container p-0'>
            <div className="row g-0 w-100">
                <div className="col-sm-6 brand-section d-none d-md-flex">
                        <img src={logo} alt="logo" className="brand-logo" />
                        <h1 className="display-4 fw-bold">e-study-zone</h1>
                        <p className="lead">Master your future with organized learning.</p>
                        <img src="https://illustrations.popsy.co/white/studying.svg" alt="Study" className="illustration-img" />
                        <footer className='footer mt-auto py-3 text-center '><Link className='text-white' to="/">User Login</Link></footer>
                    </div>
                {/* form */}
                <div className="col-sm-6 form-section">
                    <div className="auth-form-box">
                        <div className="mb-4">
                            <h2 className="fw-bold">Welcome Back Admin!</h2>
                            <p className="text-muted">Enter your credentials to access your dashboard.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-uppercase">Email Address</label>
                                <input type="email" value={data.email} name="email" className="form-control form-control-lg" placeholder="name@example.com" required onChange={handleChange}/>
                            </div>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between">
                                    <label className="form-label small fw-bold text-uppercase">Password</label>
                                </div>
                                <input type="password" name="password" value={data.password} className="form-control form-control-lg" placeholder="••••••••" required onChange={handleChange}/>
                            </div>
                            <button type="submit" className="btn btn-danger btn-lg w-100 shadow-sm mt-2">Sign In</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin