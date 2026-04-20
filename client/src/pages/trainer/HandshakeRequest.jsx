import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HandshakeRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const trainerId = localStorage.getItem("id");

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/handshake/trainer/${trainerId}`);
      setRequests(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [trainerId]);

  const handleAction = async (requestId, status) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/user/handshake/update/${requestId}`, { status });
      alert(res.data.msg);
      fetchRequests(); // Refresh the lists instantly
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    }
  };

  // Filter the data into two separate arrays
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const connectedLearners = requests.filter(req => req.status === 'accepted');

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark mb-0">Connection Management</h4>
        <span className="badge bg-primary px-3 py-2 rounded-pill">Trainer Portal</span>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border text-primary mb-2"></div>
          <p>Loading your connections...</p>
        </div>
      ) : (
        <div className="row g-4">
          
          {/* SECTION 1: INCOMING PENDING REQUESTS */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white p-4 border-bottom-0">
                <h6 className="fw-bold mb-0 text-warning">
                  <i className="bi bi-bell-fill me-2"></i> Incoming Requests
                  <span className="badge bg-warning text-dark ms-2">{pendingRequests.length}</span>
                </h6>
              </div>
              <div className="card-body p-0">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-4 text-muted small">No pending connection requests.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4">LEARNER NAME</th>
                          <th>REQUESTED SKILL</th>
                          <th>QUALIFICATION</th>
                          <th className="text-center pe-4">ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRequests.map((req) => (
                          <tr key={req._id}>
                            <td className="ps-4 fw-bold text-dark text-capitalize">{req.learnerId?.name}</td>
                            <td className="fw-bold text-primary">{req.skillName}</td>
                            <td className="text-muted small">{req.learnerId?.qualification}</td>
                            <td className="text-center pe-4">
                              <button 
                                className="btn btn-sm btn-success rounded-pill px-3 me-2"
                                onClick={() => handleAction(req._id, 'accepted')}
                              >
                                Accept
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                onClick={() => handleAction(req._id, 'rejected')}
                              >
                                Reject
                              </button>
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

          {/* SECTION 2: CONNECTED LEARNERS */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white p-4 border-bottom-0">
                <h6 className="fw-bold mb-0 text-success">
                  <i className="bi bi-people-fill me-2"></i> My Connected Learners
                  <span className="badge bg-success ms-2">{connectedLearners.length}</span>
                </h6>
              </div>
              <div className="card-body p-0">
                {connectedLearners.length === 0 ? (
                  <div className="text-center py-4 text-muted small">You haven't accepted any learners yet.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4">LEARNER NAME</th>
                          <th>CONNECTED SKILL</th>
                          <th>EMAIL</th>
                          <th>QUALIFICATION</th>
                          <th className="text-center pe-4">ACTION</th> {/* <-- Changed to Action */}
                        </tr>
                      </thead>
                      <tbody>
                        {connectedLearners.map((req) => (
                          <tr key={req._id}>
                            <td className="ps-4 fw-bold text-dark text-capitalize">{req.learnerId?.name}</td>
                            <td className="fw-bold text-success">{req.skillName}</td>
                            <td className="text-primary small">{req.learnerId?.email}</td>
                            <td className="text-muted small">{req.learnerId?.qualification}</td>
                            <td className="text-center pe-4">
                              {/* <-- Added Disconnect Button */}
                              <button 
                                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to disconnect this learner?")) {
                                    handleAction(req._id, 'rejected');
                                  }
                                }}
                              >
                                <i className="bi bi-person-x-fill me-1"></i> Disconnect
                              </button>
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