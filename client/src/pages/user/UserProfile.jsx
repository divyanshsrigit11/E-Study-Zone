import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ setActiveView }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/user/getuser/${userId}`);
        if (res.data && res.data.data) {
          setUser(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);

  if (loading) return <div className="text-center mt-5 text-muted"><div className="spinner-border text-danger me-2" role="status"></div>Loading profile...</div>;
  if (!user) return <div className="text-center mt-5 text-danger">Profile data not found.</div>;

  return (
    <div className="container-fluid p-3">
      
      {/* Top Header Card */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            
            {/* Left side: Avatar & Name */}
            <div className="col-md-5 d-flex align-items-center mb-4 mb-md-0 border-end pe-4">
              <img 
                src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=dc3545&color=fff&size=150`} 
                alt="profile" 
                className="rounded-circle shadow-sm me-4" 
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
              <div>
                <h3 className="fw-bold mb-1 text-capitalize">{user.name}</h3>
                <p className="text-muted small mb-1">{user.qualification}</p>
                <p className="text-muted small mb-3">Learner at E-Study Zone</p>
                <button className="btn btn-danger btn-sm px-4 rounded-pill" onClick={() => setActiveView('Edit Profile')}>Edit Profile</button>
              </div>
            </div>

            {/* Right side: Basic Details List */}
            <div className="col-md-7 ps-md-4">
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Enrollment ID:</div>
                <div className="col-8 text-muted small font-monospace">{user._id}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Phone:</div>
                <div className="col-8 text-muted small">{user.phone || 'Not provided'}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Email:</div>
                <div className="col-8 text-danger small fw-bold">{user.email}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Date of Birth:</div>
                <div className="col-8 text-muted small">{user.dob || 'Not provided'}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Address:</div>
                <div className="col-8 text-muted small">{user.address || 'Not provided'}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold text-secondary small">Status:</div>
                <div className="col-8 small fw-bold text-capitalize" style={{ color: user.status === 'active' ? '#198754' : '#dc3545' }}>
                   {user.status}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Grid for Additional Info Cards */}
      <div className="row g-4">
        
        {/* Educational Information Card */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4 text-dark">Educational Information</h6>
              
              {/* Timeline Style Item 1 */}
              <div className="d-flex position-relative mb-4">
                <div className="border-start position-absolute h-100 ms-2" style={{ borderColor: '#dee2e6', top: '15px' }}></div>
                <div className="rounded-circle bg-light border border-secondary" style={{ width: '15px', height: '15px', zIndex: 1, marginTop: '4px' }}></div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 small text-dark">Highest Qualification</h6>
                  <p className="text-muted small mb-1">{user.qualification}</p>
                  <span className="text-muted extra-small">Added on Registration</span>
                </div>
              </div>

              {/* Timeline Style Item 2 (Placeholder) */}
              <div className="d-flex position-relative">
                <div className="rounded-circle bg-light border border-secondary" style={{ width: '15px', height: '15px', zIndex: 1, marginTop: '4px' }}></div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 small text-dark">Additional Details</h6>
                  <p className="text-muted small mb-0">No Details Available</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Certificate Details Card */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4 text-dark">Certificate Details</h6>
              
              <div className="d-flex position-relative mb-4">
                 <div className="border-start position-absolute h-100 ms-2" style={{ borderColor: '#dee2e6', top: '15px' }}></div>
                <div className="rounded-circle bg-light border border-secondary" style={{ width: '15px', height: '15px', zIndex: 1, marginTop: '4px' }}></div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 small text-dark">Certificate Number</h6>
                  <p className="text-muted small mb-0">No Details Available</p>
                </div>
              </div>

              <div className="d-flex position-relative mb-4">
                 <div className="border-start position-absolute h-100 ms-2" style={{ borderColor: '#dee2e6', top: '15px' }}></div>
                <div className="rounded-circle bg-light border border-secondary" style={{ width: '15px', height: '15px', zIndex: 1, marginTop: '4px' }}></div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 small text-dark">Grade</h6>
                  <p className="text-muted small mb-0">No Details Available</p>
                </div>
              </div>

              <div className="d-flex position-relative">
                <div className="rounded-circle bg-light border border-secondary" style={{ width: '15px', height: '15px', zIndex: 1, marginTop: '4px' }}></div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1 small text-dark">Certification Date</h6>
                  <p className="text-muted small mb-0">No Details Available</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;