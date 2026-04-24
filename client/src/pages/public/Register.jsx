import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { QUALIFICATIONS, ROLES } from '../../constants';
import '../../AuthPage.css';
import logo from '../../assets/logo.webp';
import Terms from './Terms';
import axios from 'axios';

const Register = () => {
    const [showTerms, setShowTerms] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        qualification: QUALIFICATIONS[0],
        role: ROLES[0]
    });

    const handleChange = (e) => {
        setData(() => ({...data, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Lock the form
        try {
            const res = await axios.post(`${API_URL}/api/user/register`, data);
            
            if (res.data.msg === "User already Registered") {
                alert(res.data.msg);
            } else {
                alert("User Registered Successfully..!!");
                
                setData({
                    name: '',
                    email: '',
                    password: '',
                    qualification: QUALIFICATIONS[0],
                    role: ROLES[0]
                });
                setTermsChecked(false); 
            }
        } catch(er) {
            console.log(er);
            alert(er.response?.data?.msg || "Registration failed");
        } finally {
            setIsSubmitting(false); // Unlock the form
        }
    }
    
    return (
        <div className="container-fluid auth-container p-0">
            <div className="row g-0 w-100 h-100">
                {/* Brand Side */}
                <div className="col-md-6 brand-section d-none d-md-flex">
                    <img src={logo} alt="logo" className="brand-logo" />
                    <h1 className="fw-bold">e-study-zone</h1>
                    <p>Join thousands of students today.</p>
                    <img src="https://illustrations.popsy.co/white/student-going-to-school.svg" alt="Register" className="illustration-img" />
                </div>

                {/* Form Side */}
                <div className="col-md-6 col-12 form-section">
                    <div className="auth-form-box">
                        <div className="mb-3">
                            <h2 className="fw-bold mb-0">Get Started</h2>
                            <p className="text-muted small">Create your account to start learning.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <label className="form-label small fw-bold">FULL NAME</label>
                                <input type="text" className="form-control form-control-sm" placeholder="User Name" name="name" value={data.name} required onChange={handleChange} disabled={isSubmitting} />
                            </div>
                            
                            <div className="mb-2">
                                <label className="form-label small fw-bold">EMAIL ADDRESS</label>
                                <input type="email" className="form-control form-control-sm" placeholder="name@example.com" name="email" value={data.email} required onChange={handleChange} disabled={isSubmitting} />
                            </div>

                            <div className="row g-2 mb-2">
                                <div className="col-6">
                                    <label className="form-label small fw-bold">QUALIFICATION</label>
                                    <select className="form-select form-select-sm" name="qualification" value={data.qualification} onChange={handleChange} disabled={isSubmitting}>
                                        {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold">ROLE</label>
                                    <select className="form-select form-select-sm" name="role" value={data.role} onChange={handleChange} disabled={isSubmitting}>
                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="form-label small fw-bold">PASSWORD</label>
                                <input type="password" className="form-control form-control-sm" placeholder="Create password" name="password" value={data.password} required onChange={handleChange} disabled={isSubmitting} />
                            </div>
                            
                            <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" id="terms" checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)} required disabled={isSubmitting} />
                                <label className="form-check-label extra-small text-muted" htmlFor="terms">
                                    I agree to the <span className="text-danger ps-1" style={{ cursor: 'pointer', fontWeight:'bold' }} onClick={() => setShowTerms(true)}>Terms & Conditions</span>
                                </label>
                            </div>

                            <button type="submit" className="btn btn-danger btn-md w-100 shadow-sm fw-bold" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Processing...
                                    </>
                                ) : "Create Account"}
                            </button>
                        </form>

                        <p className="text-center mt-3 small">
                            Already have an account? <Link to="/" className="text-danger fw-bold text-decoration-none">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>

            <Terms isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </div>
    );
};

export default Register;