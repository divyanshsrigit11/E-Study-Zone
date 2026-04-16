import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HandshakeRequest = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("id");

  // get all trainers
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/getuser/trainer/get');
        if (res.data && res.data.data) {
          setTrainers(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch trainers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  // for future
  const handleSendRequest = (trainerId) => {
    alert(`Handshake request will be sent to Trainer ID: ${trainerId}`);
    // future: axios.post('/api/handshake/send', { learnerId: currentUserId, trainerId })
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark mb-0">Trainer Directory</h4>
        <span className="badge bg-danger px-3 py-2 rounded-pill">Connect & Learn</span>
      </div>

      {loading ? (
        <div className="text-center mt-5 text-muted">
          <div className="spinner-border text-danger me-2" role="status"></div>
          Loading available trainers...
        </div>
      ) : trainers.length === 0 ? (
        <div className="alert alert-light border border-dashed text-center text-muted p-5 rounded-4">
          <i className="bi bi-people fs-1 d-block mb-3"></i>
          No trainers are currently available on the platform.
        </div>
      ) : (
        <div className="row g-4">
          {trainers.map((trainer) => (
            <div className="col-md-6 col-lg-4" key={trainer._id}>
              <div className="card border-0 shadow-sm rounded-4 h-100 text-center transition-hover">
                <div className="card-body p-4">
                  <img 
                    src={trainer.picture || `https://ui-avatars.com/api/?name=${trainer.name}&background=0d6efd&color=fff&size=100`} 
                    alt="Trainer Profile" 
                    className="rounded-circle shadow-sm mb-3" 
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <h5 className="fw-bold mb-1 text-capitalize text-dark">{trainer.name}</h5>
                  <p className="text-muted small mb-3">{trainer.qualification}</p>
                  
                  <div className="bg-light rounded-3 p-2 mb-4 text-start">
                    <div className="small text-muted mb-1"><i className="bi bi-envelope me-2"></i>{trainer.email}</div>
                    <div className="small text-muted"><i className="bi bi-geo-alt me-2"></i>{trainer.address || 'Remote'}</div>
                  </div>

                  <button 
                    className="btn btn-outline-danger w-100 fw-bold rounded-pill"
                    onClick={() => handleSendRequest(trainer._id)}
                  >
                    <i className="bi bi-hand-index-thumb me-2"></i> Send Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HandshakeRequest;