import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageLearners = () => {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchLearners = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/learners`);
      setLearners(res.data.data);
    } catch (error) {
      console.error("Failed to fetch learners", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, [API_URL]);

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      const route = currentStatus === 'active' ? 'block' : 'unblock';
      const res = await axios.get(`${API_URL}/api/admin/${route}/${userId}`);
      alert(res.data.msg);
      fetchLearners(); 
    } catch (error) {
      alert("Failed to update user status.");
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Learner Verification & Management</h3>
          <p className="text-muted small">Review, approve, and manage Learner accounts across the platform.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger"></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-header bg-white p-4 border-bottom-0 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0"><i className="bi bi-mortarboard-fill text-danger me-2"></i> Registered Learners</h5>
            <span className="badge bg-secondary">{learners.length} Total</span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">NAME</th>
                    <th>EMAIL</th>
                    <th>QUALIFICATION</th>
                    <th className="text-center">SYSTEM STATUS</th>
                    <th className="text-center pe-4">ADMIN ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {learners.map((learner) => (
                    <tr key={learner._id}>
                      <td className="ps-4 fw-bold text-dark text-capitalize">{learner.name}</td>
                      <td className="text-primary small">{learner.email}</td>
                      <td className="text-muted small">{learner.qualification}</td>
                      <td className="text-center">
                        {learner.status === 'active' ? (
                          <span className="badge bg-success px-3 py-2 rounded-pill"><i className="bi bi-check-circle me-1"></i> Approved</span>
                        ) : (
                          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><i className="bi bi-hourglass-split me-1"></i> Pending Review</span>
                        )}
                      </td>
                      <td className="text-center pe-4">
                        {learner.status === 'inactive' ? (
                          <button 
                            className="btn btn-sm btn-success rounded-pill px-4 fw-bold shadow-sm"
                            onClick={() => handleStatusChange(learner._id, learner.status)}
                          >
                            Approve Access
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-outline-danger rounded-pill px-4 fw-bold"
                            onClick={() => {
                              if(window.confirm("Are you sure you want to suspend this learner? They will be unable to log in.")) {
                                handleStatusChange(learner._id, learner.status);
                              }
                            }}
                          >
                            Suspend User
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLearners;