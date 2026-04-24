import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

import ManageUsers from './ManageUsers';
import ManageLearners from './ManageLearners';
import DashboardOverview from './DashboardOverview';
import ContentModeration from './ContentModeration';
import SystemSettings from './SystemSettings';
import ManageBroadcasts from './ManageBroadcasts';
import AdminChangePassword from './AdminChangePassword';

const AdminDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeView, setActiveView] = useState('Dashboard Overview'); 
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.clear();
      navigate('/'); 
    };
  
    const menuItems = [
      { name: 'Dashboard Overview', icon: 'bi-pie-chart-fill' },
      { name: 'Manage Trainers', icon: 'bi-person-badge-fill' }, 
      { name: 'Manage Learners', icon: 'bi-mortarboard-fill' },  
      { name: 'Content Moderation', icon: 'bi-shield-check' },
      { name: 'Broadcasts', icon: 'bi-broadcast-pin' },
      { name: 'System Settings', icon: 'bi-gear-fill' },
      { name: 'Change Password', icon: 'bi-key-fill' }
    ];

  return (
    <div className="dashboard-wrapper d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      
      <div className={`sidebar bg-dark text-white d-flex flex-column transition-all flex-shrink-0 ${collapsed ? 'collapsed' : ''}`} style={{ width: collapsed ? '80px' : '260px', transition: 'width 0.3s' }}>
        <div className="p-4 text-center border-bottom border-secondary d-flex justify-content-between align-items-center">
          <h5 className={`mb-0 fw-bold text-danger ${collapsed ? 'd-none' : ''}`}>ADMIN PANEL</h5>
          <button className="btn btn-sm btn-outline-light border-0" onClick={() => setCollapsed(!collapsed)}>
            <i className="bi bi-list fs-5"></i>
          </button>
        </div>
        
        <div className="flex-grow-1 pt-3">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 mx-2 my-1 rounded-3 d-flex align-items-center text-white text-decoration-none ${activeView === item.name ? 'bg-danger shadow-sm' : ''}`} 
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setActiveView(item.name)}
            >
              <i className={`bi ${item.icon} fs-5 ${collapsed ? 'mx-auto' : 'me-3'}`}></i>
              <span className={collapsed ? 'd-none' : ''}>{item.name}</span>
            </div>
          ))}
        </div>

        <div className="p-4 mt-auto border-top border-secondary text-white-50 d-flex align-items-center transition-hover" style={{ cursor: 'pointer' }} onClick={handleLogout}>
          <i className={`bi bi-box-arrow-right fs-5 ${collapsed ? 'mx-auto text-danger' : 'me-3 text-danger'}`}></i>
          <span className={`fw-bold ${collapsed ? 'd-none' : ''}`}>Secure Logout</span>
        </div>
      </div>

      <div className="main-content flex-grow-1 bg-light d-flex flex-column" style={{ overflowY: 'auto' }}>
        
        <nav className="navbar navbar-light bg-white shadow-sm px-4 py-3 d-flex justify-content-between flex-shrink-0">
          <span className="navbar-brand mb-0 h4 fw-bold text-dark">E-Study Zone <span className="text-danger">Admin Control</span></span>
          <div className="d-flex align-items-center">
            <span className="badge bg-danger rounded-pill px-3 py-2 shadow-sm me-3">Super Admin</span>
            <img 
              src="https://ui-avatars.com/api/?name=Admin&background=dc3545&color=fff" 
              alt="Profile" 
              className="rounded-circle shadow-sm"
              style={{ width: '45px' }}
            />
          </div>
        </nav>
        
        <div className="p-4 flex-grow-1">
          {activeView === 'Dashboard Overview' && <DashboardOverview />}
          {activeView === 'Manage Trainers' && <ManageUsers />}
          {activeView === 'Manage Learners' && <ManageLearners />} 
          {activeView === 'Content Moderation' && <ContentModeration />}
          {activeView === 'Broadcasts' && <ManageBroadcasts />}
          {activeView === 'System Settings' && <SystemSettings />}
          {activeView === 'Change Password' && <AdminChangePassword />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;