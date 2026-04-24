import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyContent = () => {
    const learnerId = localStorage.getItem('id');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const [vault, setVault] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVault = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/user/learner/content/${learnerId}`);
                setVault(res.data.data);
            } catch (error) { console.error("Vault fetch failed", error); } 
            finally { setLoading(false); }
        };
        fetchVault();
    }, [learnerId, API_URL]);

    return (
        <div className="container-fluid p-0">
            <h4 className="fw-bold text-dark mb-4">My Learning Vault</h4>
            {loading ? <div className="spinner-border text-danger"></div> : 
             vault.length === 0 ? (
                <div className="text-center py-5"><i className="bi bi-folder-x display-1 text-muted opacity-50 mb-3 d-block"></i><p className="text-muted">No content available yet. Connect with trainers!</p></div>
            ) : (
                <div className="row g-3">
                    {vault.map((item, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-danger bg-opacity-10 p-2 rounded text-danger me-3"><i className={`bi ${item.file.endsWith('.pdf') ? 'bi-file-earmark-pdf-fill' : 'bi-image-fill'} fs-4`}></i></div>
                                    <h6 className="fw-bold text-truncate mb-0">Study Material</h6>
                                </div>
                                <p className="text-muted small mb-1">Trainer: <span className="fw-bold text-dark">{item.trainerName}</span></p>
                                <p className="text-muted small mb-3">Skill: {item.skillName}</p>
                                <a href={item.file.startsWith('http') ? item.file : `${API_URL}/uploads/${item.file}`} target="_blank" rel="noreferrer" className="btn btn-danger btn-sm rounded-pill fw-bold mt-auto w-100"><i className="bi bi-eye-fill me-1"></i> Access Content</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyContent;