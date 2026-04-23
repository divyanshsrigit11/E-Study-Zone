import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HandshakeRequest = () => {
    const trainerId = localStorage.getItem('id');
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/user/handshake/trainer/${trainerId}`);
            setRequests(res.data.data);
        } catch (error) { console.error("Fetch failed", error); }
    };

    useEffect(() => { fetchRequests(); }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/user/handshake/update/${id}`, { status });
            alert(`Request ${status}!`);
            fetchRequests();
        } catch (error) { alert("Failed to update status."); }
    };

    return (
        <div className="container-fluid p-0">
            <h4 className="fw-bold text-dark mb-4">Connection Requests</h4>
            <div className="list-group list-group-flush bg-white shadow-sm rounded-4">
                {requests.length === 0 ? <div className="p-4 text-muted text-center">No pending requests.</div> : 
                 requests.map(req => (
                    <div key={req._id} className="list-group-item p-4 d-flex justify-content-between align-items-center border-light">
                        <div>
                            <h6 className="fw-bold mb-1 text-capitalize">{req.learnerId?.name}</h6>
                            <p className="text-muted small mb-0">Requested access to: <strong className="text-primary">{req.skillName}</strong></p>
                            <span className={`badge mt-2 ${req.status === 'accepted' ? 'bg-success' : req.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                {req.status.toUpperCase()}
                            </span>
                        </div>
                        {req.status === 'pending' && (
                            <div className="d-flex gap-2">
                                <button className="btn btn-success btn-sm rounded-pill px-3" onClick={() => updateStatus(req._id, 'accepted')}>Accept</button>
                                <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => updateStatus(req._id, 'rejected')}>Reject</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HandshakeRequest;