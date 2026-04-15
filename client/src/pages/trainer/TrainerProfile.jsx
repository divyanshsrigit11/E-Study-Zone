import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainerProfile = ({ setActiveView }) => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchTrainerProfile = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/user/getuser/${userId}`);
        if (res.data && res.data.data) {
          setTrainer(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainerProfile();
  }, [userId]);

  if (loading) return <div className="text-center mt-5 text-muted"><div className="spinner-border text-primary me-2" role="status"></div>Loading profile...</div>;
  if (!trainer) return <div className="text-center mt-5 text-danger">Profile data not found.</div>;

  return (
    <div className="container-fluid p-3">
      
      {/* Top Header Card */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            
            {/* Left side: Avatar & Name */}
            <div className="col-md-5 d-flex align-items-center mb-4 mb-md-0 border-end pe-4">
              <img 
                src={trainer.picture || `https://ui-avatars.com/api/?name=${trainer.name}&background=0d6efd&color=fff&size=150`} 
                alt="profile" 
                className="rounded-circle shadow-sm me-4" 
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
              <div>
                <h3 className="fw-bold mb-1 text-capitalize">{trainer.name}</h3>
                <p className="text-muted small mb-1">{trainer.qualification}</p>
                <p className="text-muted small mb-3">Expert Trainer</p>
                <button className="btn btn-primary btn-sm px-4 rounded-pill" onClick={() => setActiveView('Edit Profile')}>Edit Profile</button>
              </div>
            </div>

            {/* Right side: Basic Details List */}
            <div className="col-md-7 ps-md-4">
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Trainer ID:</div>
                <div className="col-8 text-muted small font-monospace">{trainer._id}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Phone:</div>
                <div className="col-8 text-muted small">{trainer.phone || 'Not provided'}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Email:</div>
                <div className="col-8 text-primary small fw-bold">{trainer.email}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Date of Birth:</div>
                <div className="col-8 text-muted small">{trainer.dob || 'Not provided'}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Address:</div>
                <div className="col-8 text-muted small">{trainer.address || 'Not provided'}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Status:</div>
                <div className="col-8 small fw-bold text-capitalize" style={{ color: trainer.status === 'active' ? '#198754' : '#dc3545' }}>
                   {trainer.status}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Grid for Additional Info Cards */}
      <div className="row g-4">
        
        {/* Expertise Information Card */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4 text-dark">Professional Information</h6>
              
              <div className="d-flex position-relative mb-4">
                <div className="border-start position-absolute h-100 ms-2" style={{ borderColor: '#dee2e6', top: '15px' }}></div>
                <div className="rounded-circle bg-light border border-secondary" style={{ width: '15px', height: '15px', zIndex: 1, marginTop: '4px' }}></div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 small text-dark">Core Qualification</h6>
                  <p className="text-muted small mb-1">{trainer.qualification}</p>
                  <span className="text-muted extra-small">Verified</span>
                </div>
              </div>

              <div className="d-flex position-relative">
                <div className="rounded-circle bg-light border border-secondary" style={{ width: '15px', height: '15px', zIndex: 1, marginTop: '4px' }}></div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 small text-dark">Industry Experience</h6>
                  <p className="text-muted small mb-0">No Details Available</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* System Details Card */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4 text-dark">System Details</h6>
              
              <div className="d-flex position-relative mb-4">
                 <div className="border-start position-absolute h-100 ms-2" style={{ borderColor: '#dee2e6', top: '15px' }}></div>
                <div className="rounded-circle bg-light border border-secondary" style={{ width: '15px', height: '15px', zIndex: 1, marginTop: '4px' }}></div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 small text-dark">Account Created</h6>
                  <p className="text-muted small mb-0">{new Date(trainer.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="d-flex position-relative">
                <div className="rounded-circle bg-light border border-secondary" style={{ width: '15px', height: '15px', zIndex: 1, marginTop: '4px' }}></div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 small text-dark">Last Login</h6>
                  <p className="text-muted small mb-0">Session Active</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainerProfile;