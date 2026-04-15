import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../AuthPage.css';
import logo from '../../assets/logo.webp'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        email:'',
        password:''
    });

    const handleChange = (e) => {
        setData(() => ({...data, [e.target.name]:e.target.value}))
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:5000/api/user/login', data);
            alert(res.data.msg);

            if(res.data.msg=="Login Successfully"){
            localStorage.setItem("name", res.data.data.name);
            localStorage.setItem("email", res.data.data.email);
            localStorage.setItem("id", res.data.data.id);
            localStorage.setItem("role", res.data.data.role);
            localStorage.setItem("token", res.data.data.token);
                if(res.data.data.role=="Trainer") {
                    navigate('/trainerdashboard')
                } else if(res.data.data.role=="Learner") {
                    navigate('/userdashboard')
                }
            }
        } catch(er) {
            console.log(er);
            alert("Sorry try again later..!!");
        }
    }
        
    return (
        <div className="container-fluid auth-container p-0">
            <div className="row g-0 w-100">
                {/* Brand Side */}
                <div className="col-md-6 brand-section d-none d-md-flex">
                    <img src={logo} alt="logo" className="brand-logo" />
                    <h1 className="display-4 fw-bold">e-study-zone</h1>
                    <p className="lead">Master your future with organized learning.</p>
                    <img src="https://illustrations.popsy.co/white/studying.svg" alt="Study" className="illustration-img" />
                    <footer className='footer mt-auto py-3 text-center '><Link className='text-white' to="/AdminLogin">Admin Login</Link></footer>
                </div>

                {/* Form Side */}
                <div className="col-md-6 col-12 form-section">
                    <div className="auth-form-box">
                        <div className="mb-4">
                            <h2 className="fw-bold">Welcome Back!</h2>
                            <p className="text-muted">Enter your credentials to access your dashboard.</p>
                        </div>

                        <div className="d-grid gap-2 mb-4">
                            <button className="btn btn-outline-dark social-btn py-2">
                                <i className='bx bxl-google text-danger'></i> Sign in with Google
                            </button>
                        </div>

                        <div className="text-center mb-4">
                            <hr className="text-muted" />
                            <span className="bg-white px-2 small text-muted text-uppercase" style={{marginTop: '-25px', display: 'inline-block', position: 'relative'}}>Or login with email</span>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-uppercase">Email Address</label>
                                <input type="email" value={data.email} name="email" className="form-control form-control-lg" placeholder="name@example.com" required onChange={handleChange}/>
                            </div>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between">
                                    <label className="form-label small fw-bold text-uppercase">Password</label>
                                    <a href="#" className="text-danger small text-decoration-none">Forgot Password?</a>
                                </div>
                                <input type="password" name="password" value={data.password} className="form-control form-control-lg" placeholder="••••••••" required onChange={handleChange}/>
                            </div>
                            <button type="submit" className="btn btn-danger btn-lg w-100 shadow-sm mt-2">Sign In</button>
                        </form>

                        <p className="text-center mt-4 small">
                            New here? <Link to="/register" className="text-danger fw-bold text-decoration-none">Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;