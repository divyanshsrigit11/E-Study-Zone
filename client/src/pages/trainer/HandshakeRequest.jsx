import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HandshakeRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false); // Set to true when backend is ready
  const trainerId = localStorage.getItem("id");

  // FUTURE FETCH LOGIC
  useEffect(() => {
    // const fetchRequests = async () => {
    //   try {
    //     const res = await axios.get(`http://localhost:5000/api/handshake/trainer/${trainerId}`);
    //     setRequests(res.data.data);
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchRequests();
  }, [trainerId]);

  const handleAction = (requestId, status) => {
    alert(`Will mark request ${requestId} as ${status}`);
    // Future: axios.put(`/api/handshake/update/${requestId}`, { status })
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark mb-0">Connection Requests</h4>
        <span className="badge bg-primary px-3 py-2 rounded-pill">Manage Learners</span>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          
          <h6 className="fw-bold border-bottom pb-3 mb-3 text-secondary">Incoming Handshakes</h6>

          {loading ? (
             <div className="text-center py-5 text-muted">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              No pending connection requests at the moment.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-secondary small fw-bold">LEARNER NAME</th>
                    <th className="text-secondary small fw-bold">QUALIFICATION</th>
                    <th className="text-secondary small fw-bold">EMAIL</th>
                    <th className="text-secondary small fw-bold">STATUS</th>
                    <th className="text-center text-secondary small fw-bold">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id}>
                      <td className="fw-bold text-dark text-capitalize">{req.learnerId.name}</td>
                      <td className="text-muted small">{req.learnerId.qualification}</td>
                      <td className="text-primary small">{req.learnerId.email}</td>
                      <td>
                        <span className={`badge ${req.status === 'pending' ? 'bg-warning text-dark' : req.status === 'accepted' ? 'bg-success' : 'bg-danger'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-success rounded-pill px-3 me-2"
                          onClick={() => handleAction(req._id, 'accepted')}
                          disabled={req.status !== 'pending'}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          onClick={() => handleAction(req._id, 'rejected')}
                          disabled={req.status !== 'pending'}
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
  );
};

export default HandshakeRequest;