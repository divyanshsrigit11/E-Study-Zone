import React, { useState } from 'react';
import axios from 'axios';

const SearchContent = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const learnerId = localStorage.getItem('id');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/user/trainers/search?q=${query}`);
            setResults(res.data.data);
        } catch (error) { console.error("Search failed", error); } 
        finally { setLoading(false); }
    };

    const sendHandshake = async (trainerId, skillId, skillName) => {
        try {
            const payload = { learnerId, trainerId, skillId, skillName };
            const res = await axios.post('http://localhost:5000/api/user/handshake/send', payload);
            alert(res.data.msg);
        } catch (error) {
            alert(error.response?.data?.msg || "Failed to send request.");
        }
    };

    return (
        <div className="container-fluid p-0">
            <h4 className="fw-bold text-dark mb-4">Discover Trainers</h4>
            
            <form onSubmit={handleSearch} className="mb-4 d-flex gap-2" style={{maxWidth: '500px'}}>
                <input type="text" className="form-control bg-light" placeholder="Search by Skill or Trainer Name..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <button type="submit" className="btn btn-danger px-4 fw-bold">Search</button>
            </form>

            {loading && <div className="spinner-border text-danger"></div>}

            <div className="row g-3">
                {results.map((item, index) => (
                    <div className="col-md-6 col-lg-4" key={index}>
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
                            <h6 className="fw-bold text-capitalize text-dark mb-1">{item.trainerName}</h6>
                            <p className="text-muted small mb-3"><i className="bi bi-journal-code me-1"></i> Skill: {item.skillName}</p>
                            <button className="btn btn-outline-danger btn-sm w-100 fw-bold rounded-pill mt-auto" onClick={() => sendHandshake(item.trainerId, item.skillId, item.skillName)}>
                                <i className="bi bi-person-plus-fill me-1"></i> Send Handshake
                            </button>
                        </div>
                    </div>
                ))}
                {!loading && results.length === 0 && query && <p className="text-muted mt-3">No active trainers found for "{query}".</p>}
            </div>
        </div>
    );
};

export default SearchContent;