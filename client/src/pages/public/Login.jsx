import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../AuthPage.css';
import logo from '../../assets/logo.webp';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    
    // --- Login States ---
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Forgot Password States ---
    const [isForgotMode, setIsForgotMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
    const [userCaptcha, setUserCaptcha] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Generating a simple Math Captcha to prevent bot spam
    const generateCaptcha = () => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        setCaptcha({ num1: n1, num2: n2, answer: n1 + n2 });
        setUserCaptcha('');
    };

    // Regenerating captcha whenever the user switches to Forgot Password mode
    useEffect(() => {
        if (isForgotMode) generateCaptcha();
    }, [isForgotMode]);

    // --- Handlers ---
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await axios.post(`${API_URL}/api/user/login`, credentials);
            
            if (res.data.msg === "Login Successfully") {
                localStorage.setItem("token", res.data.data.token);
                localStorage.setItem("id", res.data.data.id);
                
                if (res.data.data.role === 'Trainer') {
                    navigate('/trainerDashboard');
                } else {
                    navigate('/userDashboard');
                }
            } else {
                alert(res.data.msg);
            }
        } catch (error) {
            console.error("Login Request Failed:", error);
            alert("Server Error: Check if your backend is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        // Verify Captcha
        if (parseInt(userCaptcha) !== captcha.answer) {
            alert("Incorrect Captcha Answer. Please try again.");
            generateCaptcha();
            return;
        }

        setIsSubmitting(true);
        try {
            // This expects a backend route that generates a JWT and emails a one-time login link
            const res = await axios.post(`${API_URL}/api/password/forgot-password`, { email: forgotEmail });            
            alert(res.data.msg || "If an account exists, a recovery link has been sent.");
            
            // Reset and go back to login screen
            setIsForgotMode(false);
            setForgotEmail('');
        } catch (error) {
            console.error("Forgot Password Request Failed:", error);
            alert("Server Error. Please try again later.");
        } finally {
            setIsSubmitting(false);
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
                    <div className="auth-form-box" style={{ maxWidth: '380px', width: '100%' }}>
                        
                        {/* =========================================
                            VIEW 1: STANDARD LOGIN FORM
                            ========================================= */}
                        {!isForgotMode ? (
                            <>
                                <div className="mb-4">
                                    <h2 className="fw-bold mb-0">Welcome Back</h2>
                                    <p className="text-muted small">Please enter your details to sign in.</p>
                                </div>

                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">EMAIL ADDRESS</label>
                                        <input type="email" className="form-control form-control-md bg-light border-0" placeholder="name@example.com" name="email" value={credentials.email} onChange={handleChange} required disabled={isSubmitting} />
                                    </div>
                                    
                                    <div className="mb-2">
                                        <label className="form-label small fw-bold d-flex justify-content-between">
                                            PASSWORD
                                            <span 
                                                className="text-danger" 
                                                style={{cursor: 'pointer', fontWeight: 'normal'}}
                                                onClick={() => setIsForgotMode(true)}
                                            >
                                                Forgot password?
                                            </span>
                                        </label>
                                        <input type="password" className="form-control form-control-md bg-light border-0" placeholder="Enter password" name="password" value={credentials.password} onChange={handleChange} required disabled={isSubmitting} />
                                    </div>

                                    <button type="submit" className="btn btn-danger btn-md w-100 shadow-sm py-2 fw-bold mt-4" disabled={isSubmitting}>
                                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </form>
                            </>
                        ) : (
                        
                        /* =========================================
                           VIEW 2: FORGOT PASSWORD FORM
                           ========================================= */
                            <>
                                <div className="mb-4">
                                    <h2 className="fw-bold mb-0">Reset Password</h2>
                                    <p className="text-muted small">Enter your email and we'll send you a recovery link.</p>
                                </div>

                                <form onSubmit={handleForgotPassword}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">REGISTERED EMAIL</label>
                                        <input type="email" className="form-control form-control-md bg-light border-0" placeholder="name@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required disabled={isSubmitting} />
                                    </div>

                                    {/* Security Captcha */}
                                    <div className="mb-4 p-3 bg-light rounded-3 border border-secondary border-opacity-25">
                                        <label className="form-label small fw-bold text-dark mb-2">SECURITY CHECK</label>
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="fs-5 fw-bold bg-white px-3 py-1 rounded shadow-sm border text-secondary user-select-none">
                                                {captcha.num1} + {captcha.num2} =
                                            </span>
                                            <input 
                                                type="number" 
                                                className="form-control form-control-md border-0 shadow-sm" 
                                                placeholder="?" 
                                                value={userCaptcha} 
                                                onChange={(e) => setUserCaptcha(e.target.value)} 
                                                required 
                                                disabled={isSubmitting}
                                                style={{ maxWidth: '80px' }}
                                            />
                                            <i className="bi bi-arrow-clockwise fs-4 text-muted ms-auto" style={{cursor: 'pointer'}} onClick={generateCaptcha} title="Refresh Captcha"></i>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-danger btn-md w-100 shadow-sm py-2 fw-bold" disabled={isSubmitting}>
                                        {isSubmitting ? 'Sending...' : 'Send Recovery Link'}
                                    </button>
                                </form>

                                <button 
                                    className="btn btn-light w-100 mt-3 text-muted fw-bold" 
                                    onClick={() => { setIsForgotMode(false); setForgotEmail(''); }}
                                    disabled={isSubmitting}
                                >
                                    <i className="bi bi-arrow-left me-2"></i>Back to Login
                                </button>
                            </>
                        )}

                        {/* Shared Footer Links */}
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