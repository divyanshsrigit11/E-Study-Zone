import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HandshakeRequest = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("id");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/handshake/learner/${currentUserId}`);
        setHistory(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [currentUserId]);

  // Filter the data
  const pendingRequests = history.filter(req => req.status === 'pending');
  const connectedTrainers = history.filter(req => req.status === 'accepted');

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark mb-0">My Connections</h4>
        <span className="badge bg-danger px-3 py-2 rounded-pill">Learner Dashboard</span>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border text-danger mb-3"></div>
          <p>Loading your connections...</p>
        </div>
      ) : (
        <div className="row g-4">
          
          {/* SECTION 1: CONNECTED TRAINERS */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white p-4 border-bottom-0">
                <h6 className="fw-bold mb-0 text-success">
                  <i className="bi bi-person-check-fill me-2"></i> My Trainers
                  <span className="badge bg-success ms-2">{connectedTrainers.length}</span>
                </h6>
              </div>
              <div className="card-body p-0">
                {connectedTrainers.length === 0 ? (
                  <div className="text-center py-4 text-muted small">You don't have any connected trainers yet.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4">TRAINER NAME</th>
                          <th>CONNECTED SKILL</th> {/* <-- Added missing column header */}
                          <th>CONTACT EMAIL</th>
                          <th className="text-center pe-4">STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {connectedTrainers.map((req) => (
                          <tr key={req._id}>
                            <td className="ps-4 fw-bold text-dark text-capitalize">{req.trainerId?.name}</td>
                            <td className="fw-bold text-success">{req.skillName}</td> {/* <-- Added missing skill data */}
                            <td className="text-primary small">{req.trainerId?.email}</td>
                            <td className="text-center pe-4">
                              <span className="badge bg-success px-3 py-2 rounded-pill">Connected</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: PENDING SENT REQUESTS */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 opacity-75">
              <div className="card-header bg-white p-4 border-bottom-0">
                <h6 className="fw-bold mb-0 text-secondary">
                  <i className="bi bi-clock-history me-2"></i> Pending Sent Requests
                  <span className="badge bg-secondary ms-2">{pendingRequests.length}</span>
                </h6>
              </div>
              <div className="card-body p-0">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-4 text-muted small">No pending requests.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4">TRAINER NAME</th>
                          <th>REQUESTED SKILL</th>
                          <th>CONTACT EMAIL</th>
                          <th className="text-center pe-4">STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRequests.map((req) => (
                          <tr key={req._id}>
                            <td className="ps-4 fw-bold text-dark text-capitalize">{req.trainerId?.name || "Unknown"}</td>
                            <td className="fw-bold text-secondary">{req.skillName}</td>
                            <td className="text-muted small">
                              <span className="fst-italic opacity-50">Hidden until accepted</span>
                            </td>
                            <td className="text-center pe-4">
                              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Pending Approval</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default HandshakeRequest;