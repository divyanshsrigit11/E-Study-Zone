import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ setActiveView }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("id");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user/getuser/${userId}`);
        setUser(res.data.data);
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    };
    if (userId) fetchUserProfile();
  }, [userId, API_URL]);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-secondary"></div>
    </div>
  );

  if (!user) return (
    <div className="text-center py-5 text-muted">
      Profile data not found.
    </div>
  );

  const isTrainer = user?.role?.toLowerCase().trim() === 'trainer';
  const themeColor = isTrainer ? 'primary' : 'danger';
  const roleBadgeText = isTrainer ? 'Expert Trainer' : 'Learner Portal';

  const profilePic = user.picture 
    ? (user.picture.startsWith('http') ? user.picture : `${API_URL}/uploads/${user.picture}`)
    : `https://ui-avatars.com/api/?name=${user.name}&background=${isTrainer ? '0d6efd' : 'dc3545'}&color=fff&size=150`;

  const dateJoined = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Recently Joined';

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '900px' }}>
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        
        {/* Dynamic Banner */}
        <div className={`bg-${themeColor} opacity-75`} style={{ height: '100px' }}></div>
        
        <div className="card-body px-4 px-md-5 pb-5 pt-0">
          
          <div className="d-flex flex-column flex-sm-row justify-content-between mb-4 px-2">
            <div className="d-flex flex-column flex-sm-row text-center text-sm-start align-items-center align-items-sm-end">
              
              <div className="position-relative rounded-circle bg-white p-1 shadow" style={{ marginTop: '-65px', width: '130px', height: '130px', zIndex: 10, flexShrink: 0 }}>
                <img 
                  src={profilePic} 
                  alt="avatar" 
                  className="rounded-circle w-100 h-100" 
                  style={{ objectFit: 'cover' }} 
                />
              </div>
              
              <div className="ms-sm-4 mt-3 mt-sm-0 mb-sm-2">
                <h3 className="fw-bold mb-1 text-capitalize text-dark">{user.name}</h3>
                <span className={`badge bg-${themeColor} bg-opacity-10 text-${themeColor} border border-${themeColor} rounded-pill px-3 py-2 mt-1`}>
                   {roleBadgeText}
                </span>
              </div>
            </div>

            <div className="mt-4 mt-sm-2 text-center text-sm-end">
              <button className={`btn btn-outline-${themeColor} fw-bold rounded-pill px-4 shadow-sm`} onClick={() => setActiveView('Edit Profile')}>
                <i className="bi bi-pencil-square me-2"></i>Edit Profile
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="row g-4 mt-2">
            <div className="col-md-6">
              <div className="bg-light p-4 rounded-4 h-100">
                <h6 className="fw-bold text-dark mb-4 border-bottom pb-2">Account Details</h6>
                <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted small">Email</span> 
                    <span className="fw-bold text-dark small text-truncate ms-3" style={{ maxWidth: '200px' }}>{user.email}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">Phone</span> 
                  <span className="fw-bold text-dark small">{user.phone || '-'}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">Date of Birth</span> 
                  <span className="fw-bold text-dark small">{user.dob || '-'}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">Member Since</span> 
                  <span className="fw-bold text-dark small">{dateJoined}</span>
                </div>
                <div className="d-flex justify-content-between">
                    <span className="text-muted small">System Status</span> 
                    <span className={`badge text-capitalize ${user.status === 'active' ? 'bg-success' : 'bg-warning text-dark'}`}>{user.status}</span>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="bg-light p-4 rounded-4 h-100">
                <h6 className="fw-bold text-dark mb-4 border-bottom pb-2">Academic Profile</h6>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">Qualification</span> 
                  <span className="fw-bold text-dark small">{user.qualification}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">High School</span> 
                  <span className="fw-bold text-dark small">{user.highSchool || '-'}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">Board</span> 
                  <span className="fw-bold text-dark small text-uppercase">{user.board || '-'}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">Father's Name</span> 
                  <span className="fw-bold text-dark small">{user.fatherName || '-'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Location</span> 
                  <span className="fw-bold text-dark small text-end" style={{ maxWidth: '150px' }}>{user.address ? `${user.address} ${user.pinCode}` : '-'}</span>
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