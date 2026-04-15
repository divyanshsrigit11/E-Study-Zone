import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import your new components
import UserProfile from './UserProfile';
import SearchContent from './SearchContent';
import MyContent from './MyContent';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';

const UserDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('Profile');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { name: 'Profile', icon: 'bi-person' },
    { name: 'Search Content', icon: 'bi-search' },
    { name: 'My Content', icon: 'bi-collection-play' },
    { name: 'Change Password', icon: 'bi-key' },
  ];

  return (
    <div className="dashboard-wrapper d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <div className={`sidebar bg-dark text-white d-flex flex-column transition-all ${collapsed ? 'collapsed' : ''}`} style={{ width: collapsed ? '80px' : '250px', transition: 'width 0.3s' }}>
        <div className="p-3 text-center border-bottom border-secondary d-flex justify-content-between align-items-center">
          <h4 className={`mb-0 ${collapsed ? 'd-none' : ''}`}>Learner</h4>
          <button className="btn btn-sm btn-outline-light border-0" onClick={() => setCollapsed(!collapsed)}>
            <i className={`bi ${collapsed ? 'bi-list' : 'bi-x'} fs-5`}></i>
          </button>
        </div>
        <div className="flex-grow-1 pt-3">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 d-flex align-items-center text-white text-decoration-none ${activeView === item.name ? 'bg-danger' : ''}`} 
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
          <span className="navbar-brand mb-0 h4 fw-bold">Welcome to E-study-zone</span>
          <img 
            src="https://ui-avatars.com/api/?name=lala&background=dc3545&color=fff" 
            alt="Profile" 
            className="rounded-circle shadow-sm"
            style={{ width: '40px', cursor: 'pointer' }}
            onClick={() => setActiveView('Profile')} 
          />
        </nav>
        
        {/* CONDITIONAL RENDERING HERE */}
        <div className="p-3">
        {activeView === 'Profile' && <UserProfile setActiveView={setActiveView} />}
        {activeView === 'Search Content' && <SearchContent />}
        {activeView === 'My Content' && <MyContent />}
        {activeView === 'Change Password' && <ChangePassword />}
        {activeView === 'Edit Profile' && <EditProfile setActiveView={setActiveView} />}
      </div>

      </div>
    </div>
  );
};

export default UserDashboard;