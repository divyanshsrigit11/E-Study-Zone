import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import UserProfile from '../user/UserProfile';
import EditProfile from '../user/EditProfile';
import AddSkills from './AddSkills';
import AddContent from './AddContent';
import ChangePassword from '../user/ChangePassword';
import HandshakeRequest from './HandshakeRequest';

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [activeView, setActiveView] = useState('Profile');
  const [collapsed, setCollapsed] = useState(false);
  const [sysSettings, setSysSettings] = useState({ maintenanceMode: false });
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const setRes = await axios.get(`${API_URL}/api/user/settings`);
        const notifRes = await axios.get(`${API_URL}/api/user/notifications`);
        
        setSysSettings(setRes.data.data || { maintenanceMode: false });
        
        const fetchedNotifs = notifRes.data.data || [];
        setNotifications(prev => {
            if (fetchedNotifs.length > prev.length && prev.length !== 0) {
                setHasUnreadNotifs(true); 
            } else if (fetchedNotifs.length > 0 && prev.length === 0) {
                setHasUnreadNotifs(true);
            }
            return fetchedNotifs;
        });
      } catch (e) { }
    };

    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 10000); 
    return () => clearInterval(intervalId);
  }, [API_URL]);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const userRes = await axios.get(`${API_URL}/api/user/getuser/${userId}`);
          setUserData(userRes.data.data);
        } catch (e) { console.error("Failed to fetch user for navbar"); }
      }
    };
    fetchUser();
  }, [userId, API_URL]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { name: 'Profile', icon: 'bi-person-badge' },
    { name: 'Add Skills', icon: 'bi-plus-circle' },
    { name: 'Add Content', icon: 'bi-cloud-arrow-up' },
    { name: 'Change Password', icon: 'bi-shield-lock' },
    { name: 'Handshake Request', icon: 'bi-people' }
  ];

  const profilePic = userData?.picture 
    ? (userData.picture.startsWith('http') ? userData.picture : `${API_URL}/uploads/${userData.picture}`)
    : `https://ui-avatars.com/api/?name=${userData?.name || 'Trainer'}&background=0d6efd&color=fff`;

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {sysSettings.maintenanceMode && (
        <div className="bg-danger text-white text-center py-2 fw-bold w-100 z-3 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> Action Halted: Site is currently under maintenance.
        </div>
      )}

      <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
        <div className={`bg-dark text-white d-flex flex-column transition-all flex-shrink-0 ${collapsed ? 'collapsed' : ''}`} style={{ width: collapsed ? '80px' : '260px', transition: 'width 0.3s' }}>
          <div className="p-4 border-bottom border-secondary d-flex justify-content-between align-items-center">
            <h5 className={`mb-0 fw-bold text-primary ${collapsed ? 'd-none' : ''}`}>Trainer</h5>
            <button className="btn btn-sm btn-outline-light border-0" onClick={() => setCollapsed(!collapsed)}><i className="bi bi-list fs-5"></i></button>
          </div>
          
          <div className="flex-grow-1 pt-3">
            {menuItems.map((item, index) => (
              <div key={index} className={`p-3 mx-2 my-1 rounded-3 d-flex align-items-center text-white ${activeView === item.name ? 'bg-primary shadow-sm' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setActiveView(item.name)}>
                <i className={`bi ${item.icon} fs-5 ${collapsed ? 'mx-auto' : 'me-3'}`}></i>
                <span className={collapsed ? 'd-none' : ''}>{item.name}</span>
              </div>
            ))}
          </div>

          <div className="p-4 mt-auto border-top border-secondary text-danger d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={handleLogout}>
            <i className={`bi bi-box-arrow-right fs-5 ${collapsed ? 'mx-auto' : 'me-3'}`}></i>
            <span className={`fw-bold ${collapsed ? 'd-none' : ''}`}>Logout</span>
          </div>
        </div>

        <div className="flex-grow-1 d-flex flex-column overflow-auto">
          <nav className="navbar navbar-light bg-white shadow-sm px-4 py-3 d-flex justify-content-between">
            <span className="navbar-brand mb-0 h4 fw-bold text-dark">Welcome to E-study-zone</span>
            
            <div className="d-flex align-items-center position-relative">
              <span className="text-muted small me-3 fw-bold d-none d-md-block">Trainer Portal</span>
              
              <div 
                className="position-relative me-4" 
                style={{cursor: 'pointer'}} 
                onClick={() => { 
                  setShowNotif(!showNotif); 
                  setShowProfileMenu(false); 
                  setHasUnreadNotifs(false); 
                }}
              >
                <i className="bi bi-bell-fill fs-4 text-secondary"></i>
                {hasUnreadNotifs && notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications.length}
                  </span>
                )}
              </div>

              {showNotif && (
                <div className="position-absolute bg-white shadow rounded-3 p-3 top-100 end-0 mt-3 z-3" style={{width: '300px', maxHeight: '400px', overflowY: 'auto'}}>
                  <h6 className="fw-bold text-danger border-bottom pb-2">SYSTEM BROADCASTS</h6>
                  {notifications.length === 0 ? <p className="text-muted small text-center my-3">No alerts</p> : 
                    notifications.map(n => (
                      <div key={n._id} className="mb-2 border-bottom pb-2">
                        <small className="text-muted d-block" style={{fontSize: '0.7rem'}}>{new Date(n.date).toLocaleString()}</small>
                        <span className="small text-dark fw-bold">{n.message}</span>
                      </div>
                    ))
                  }
                </div>
              )}

              <div className="position-relative" style={{cursor: 'pointer'}} onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotif(false); }}>
                <img 
                  src={profilePic} 
                  alt="Profile" 
                  className="rounded-circle shadow-sm border border-2 border-primary"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
                
                {showProfileMenu && (
                  <div className="position-absolute bg-white shadow-sm border rounded-3 py-2 top-100 end-0 mt-3 z-3" style={{width: '160px'}}>
                    <div className="px-3 py-2 text-dark dropdown-item" onClick={() => setActiveView('Profile')}>
                      <i className="bi bi-person-fill me-2 text-muted"></i> My Profile
                    </div>
                    <div className="dropdown-divider my-1"></div>
                    <div className="px-3 py-2 text-danger fw-bold dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </div>
                  </div>
                )}
              </div>

            </div>
          </nav>
          
          <div className="p-4 flex-grow-1 position-relative">
             {sysSettings.maintenanceMode && <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-50 z-2" style={{cursor: 'not-allowed'}}></div>}
             
             {activeView === 'Profile' && <UserProfile setActiveView={setActiveView} />}
             {activeView === 'Edit Profile' && <EditProfile setActiveView={setActiveView} />}
             {activeView === 'Add Skills' && <AddSkills />}
             {activeView === 'Add Content' && <AddContent />}
             {activeView === 'Change Password' && <ChangePassword />}
             {activeView === 'Handshake Request' && <HandshakeRequest />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;