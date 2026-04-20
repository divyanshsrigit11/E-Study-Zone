import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/getuser/trainer/get');
      setTrainers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch trainers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  // Use your existing block/unblock backend routes!
  const handleStatusChange = async (userId, currentStatus) => {
    try {
      const route = currentStatus === 'active' ? 'block' : 'unblock';
      const res = await axios.get(`http://localhost:5000/api/user/${route}/${userId}`);
      alert(res.data.msg);
      fetchTrainers(); // Refresh the table
    } catch (error) {
      alert("Failed to update user status.");
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">User Verification & Management</h3>
          <p className="text-muted small">Review, approve, and manage Trainer accounts across the platform.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger"></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-header bg-white p-4 border-bottom-0 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0"><i className="bi bi-person-badge-fill text-danger me-2"></i> Registered Trainers</h5>
            <span className="badge bg-secondary">{trainers.length} Total</span>
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
                  {trainers.map((trainer) => (
                    <tr key={trainer._id}>
                      <td className="ps-4 fw-bold text-dark text-capitalize">{trainer.name}</td>
                      <td className="text-primary small">{trainer.email}</td>
                      <td className="text-muted small">{trainer.qualification}</td>
                      <td className="text-center">
                        {trainer.status === 'active' ? (
                          <span className="badge bg-success px-3 py-2 rounded-pill"><i className="bi bi-check-circle me-1"></i> Approved</span>
                        ) : (
                          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><i className="bi bi-hourglass-split me-1"></i> Pending Review</span>
                        )}
                      </td>
                      <td className="text-center pe-4">
                        {trainer.status === 'inactive' ? (
                          <button 
                            className="btn btn-sm btn-success rounded-pill px-4 fw-bold shadow-sm"
                            onClick={() => handleStatusChange(trainer._id, trainer.status)}
                          >
                            Approve Access
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-outline-danger rounded-pill px-4 fw-bold"
                            onClick={() => {
                              if(window.confirm("Are you sure you want to suspend this trainer? They will be unable to log in.")) {
                                handleStatusChange(trainer._id, trainer.status);
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

export default ManageUsers;