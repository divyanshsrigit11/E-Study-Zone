import React, { useState } from 'react';
import axios from 'axios';

const SearchContent = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const learnerId = localStorage.getItem('id');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/user/trainers/search?q=${query}`);
            setResults(res.data.data);
        } catch (error) { 
            console.error("Search failed", error); 
        } finally { 
            setLoading(false); 
        }
    };

    const sendHandshake = async (trainerId, skillId, skillName) => {
        try {
            const payload = { learnerId, trainerId, skillId, skillName };
            const res = await axios.post(`${API_URL}/api/user/handshake/send`, payload);
            alert(res.data.msg);
        } catch (error) {
            alert(error.response?.data?.msg || "Failed to send request.");
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="text-center mb-5">
                <h3 className="fw-bold text-dark mb-2">Discover Expert Trainers</h3>
                <p className="text-muted">Find the right mentor to unlock your next skill.</p>
            </div>
            
            {/* Increased width from col-lg-6 to col-lg-8 */}
            <div className="row justify-content-center mb-5">
                <div className="col-md-10 col-lg-8">
                    <form onSubmit={handleSearch} className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
                        <span className="input-group-text bg-white border-0 ps-4">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-0 shadow-none py-3" 
                            placeholder="Search by Skill (e.g. Java, Python) or Trainer Name..." 
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)} 
                        />
                        <button type="submit" className="btn btn-danger px-5 fw-bold transition-all">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            <div className="row g-4">
                {results.map((item, index) => (
                    <div className="col-md-6 col-lg-4" key={index}>
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4 trainer-card transition-all" style={{ borderTop: '4px solid #dc3545' }}>
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger me-3">
                                    <i className="bi bi-person-workspace fs-4"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold text-capitalize text-dark mb-0">{item.trainerName}</h6>
                                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Verified Trainer</small>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="extra-small text-muted fw-bold d-block mb-1">OFFERING SKILL:</label>
                                <span className="badge bg-light text-danger border border-danger border-opacity-25 px-3 py-2 rounded-pill fw-bold">
                                    <i className="bi bi-journal-code me-2"></i> {item.skillName}
                                </span>
                            </div>

                            <button 
                                className="btn btn-outline-danger w-100 fw-bold rounded-pill py-2 mt-auto hover-fill" 
                                onClick={() => sendHandshake(item.trainerId, item.skillId, item.skillName)}
                            >
                                <i className="bi bi-person-plus-fill me-2"></i> Send Connection Request
                            </button>
                        </div>
                    </div>
                ))}
                
                {!loading && results.length === 0 && query && (
                    <div className="col-12 text-center py-5">
                        <i className="bi bi-emoji-frown display-4 text-muted opacity-50 mb-3 d-block"></i>
                        <h5 className="text-muted">No active trainers found for "{query}"</h5>
                    </div>
                )}
            </div>

            <style>{`
                .trainer-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
                .hover-fill:hover { background-color: #dc3545; color: white; }
                .transition-all { transition: all 0.3s ease; }
                .extra-small { font-size: 0.75rem; }
            `}</style>
        </div>
    );
};

export default SearchContent;