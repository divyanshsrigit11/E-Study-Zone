import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../AuthPage.css';

const ResetPassword = () => {
    const { id, token } = useParams(); 
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.password !== passwords.confirmPassword) {
            return alert("Passwords do not match!");
        }

        setIsSubmitting(true);
        try {
            // hitting the backend route to reset password using the id and token from the URL
            const res = await axios.post(`${API_URL}/api/password/reset-password/${id}/${token}`, {
                newPassword: passwords.password
            });

            alert(res.data.msg);
            
            if (res.data.status === "success") {
                navigate('/'); // Send them back to login!
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.msg || "Link expired or invalid. Please request a new one.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container-fluid auth-container p-0 d-flex justify-content-center align-items-center bg-light vh-100">
            <div className="auth-form-box shadow-lg bg-white rounded-4 p-5" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="text-center mb-4">
                    <h3 className="fw-bold text-dark">Create New Password</h3>
                    <p className="text-muted small">Your new password must be different from previous used passwords.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">NEW PASSWORD</label>
                        <input 
                            type="password" 
                            className="form-control form-control-md bg-light border-0" 
                            name="password" 
                            value={passwords.password} 
                            onChange={handleChange} 
                            required 
                            minLength="6"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="form-label small fw-bold">CONFIRM NEW PASSWORD</label>
                        <input 
                            type="password" 
                            className="form-control form-control-md bg-light border-0" 
                            name="confirmPassword" 
                            value={passwords.confirmPassword} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn btn-danger btn-md w-100 shadow-sm py-2 fw-bold" disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Reset Password'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link to="/" className="text-muted small text-decoration-none">
                        <i className="bi bi-arrow-left me-1"></i> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;