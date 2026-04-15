import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import your new components
import TrainerProfile from './TrainerProfile';
import AddSkills from './AddSkills';
import ChangePassword from '../user/ChangePassword';
import HandshakeRequest from './HandshakeRequest'; 
import AddContent from './AddContent';
import EditProfile from '../user/EditProfile';

const TrainerDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('Profile');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { name: 'Profile', icon: 'bi-person-badge' },
    { name: 'Add Skills', icon: 'bi-plus-circle' },
    { name: 'Add Content', icon: 'bi-cloud-upload' },
    { name: 'Change Password', icon: 'bi-shield-lock' },
    { name: 'Handshake Request', icon: 'bi-hand-index-thumb' },
  ];

  return (
    <div className="dashboard-wrapper d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <div className={`sidebar bg-dark text-white d-flex flex-column transition-all ${collapsed ? 'collapsed' : ''}`} style={{ width: collapsed ? '80px' : '250px', transition: 'width 0.3s' }}>
        <div className="p-3 text-center border-bottom border-secondary d-flex justify-content-between align-items-center">
          <h4 className={`mb-0 ${collapsed ? 'd-none' : ''}`}>Trainer</h4>
          <button className="btn btn-sm btn-outline-light border-0" onClick={() => setCollapsed(!collapsed)}>
            <i className="bi bi-list fs-5"></i>
          </button>
        </div>
        <div className="flex-grow-1 pt-3">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 d-flex align-items-center text-white text-decoration-none ${activeView === item.name ? 'bg-primary' : ''}`} 
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveView(item.name)}
            >
              <i className={`bi ${item.icon} fs-5 ${collapsed ? 'mx-auto' : 'me-3'}`}></i>
              <span className={collapsed ? 'd-none' : ''}>{item.name}</span>
            </div>
          ))}
        </div>
        <div className="p-3 text-danger d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={handleLogout}>
          <i className={`bi bi-box-arrow-right fs-5 ${collapsed ? 'mx-auto' : 'me-3'}`}></i>
          <span className={collapsed ? 'd-none' : ''}>Logout</span>
        </div>
      </div>

      <div className="main-content flex-grow-1 bg-light" style={{ overflowY: 'auto' }}>
        <nav className="navbar navbar-light bg-white shadow-sm px-4 py-3">
          <span className="navbar-brand mb-0 h4 fw-bold text-danger">Welcome to E-study-zone</span>
          <div className="d-flex align-items-center">
            <span className="me-3 d-none d-md-inline small text-muted fw-bold">Trainer Portal</span>
            <img 
              src="https://ui-avatars.com/api/?name=pankaj&background=0d6efd&color=fff" 
              alt="Profile" 
              className="rounded-circle shadow-sm"
              style={{ width: '40px', cursor: 'pointer' }}
              onClick={() => setActiveView('Profile')} 
            />
          </div>
        </nav>
        
        {/* CONDITIONAL RENDERING HERE */}
        <div className="p-3">
          {activeView === 'Profile' && <TrainerProfile setActiveView={setActiveView} />}
          {activeView === 'Add Skills' && <AddSkills />}
          {activeView === 'Add Content' && <AddContent />}
          {activeView === 'Change Password' && <ChangePassword />}
          {activeView === 'Handshake Request' && <HandshakeRequest />}
          {activeView === 'Edit Profile' && <EditProfile />}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;