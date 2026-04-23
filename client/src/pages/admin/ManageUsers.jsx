import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrainers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/trainers');
            setTrainers(res.data.data);
        } catch (error) { 
            console.error("Failed to fetch trainers", error); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchTrainers(); }, []);

    const handleStatusChange = async (userId, currentStatus) => {
        const action = currentStatus === 'active' ? 'suspend' : 'approve';
        if(!window.confirm(`Are you sure you want to ${action} this trainer?`)) return;

        try {
            const route = currentStatus === 'active' ? 'block' : 'unblock';
            const res = await axios.get(`http://localhost:5000/api/admin/${route}/${userId}`);
            alert(res.data.msg);
            fetchTrainers(); // Instantly refresh the table
        } catch (error) { 
            alert(`Failed to ${action} trainer`); 
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="mb-4">
                <h3 className="fw-bold text-dark mb-1">Manage Trainers</h3>
                <p className="text-muted small">Review and approve Trainer accounts before they can access the platform.</p>
            </div>
            
            {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-0 table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4 py-3">TRAINER NAME</th>
                                    <th>EMAIL</th>
                                    <th>STATUS</th>
                                    <th className="text-center pe-4">ADMIN ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="ps-4 fw-bold text-capitalize">{user.name}</td>
                                        <td className="text-muted small">{user.email}</td>
                                        <td>
                                            {user.status === 'active' ? (
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">Approved</span>
                                            ) : (
                                                <span className="badge bg-warning bg-opacity-10 text-warning-emphasis border border-warning rounded-pill px-3 py-2">Pending Approval</span>
                                            )}
                                        </td>
                                        <td className="text-center pe-4">
                                            {user.status === 'active' ? (
                                                <button className="btn btn-sm btn-outline-danger rounded-pill px-4 fw-bold" onClick={() => handleStatusChange(user._id, user.status)}>
                                                    Suspend
                                                </button>
                                            ) : (
                                                <button className="btn btn-sm btn-success rounded-pill px-4 fw-bold shadow-sm" onClick={() => handleStatusChange(user._id, user.status)}>
                                                    Approve Access
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {trainers.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-5 text-muted">No trainers found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;