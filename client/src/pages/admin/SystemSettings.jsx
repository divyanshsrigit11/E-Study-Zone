import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemSettings = () => {
  const [settings, setSettings] = useState({ maintenanceMode: false, platformName: '' });
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/settings`);
        setSettings(res.data.data);
      } catch (error) {
        console.error(error);
      } finally { setLoading(false); }
    };
    fetchSettings();
  }, [API_URL]);

  const handleSave = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/admin/settings`, settings);
      alert(res.data.msg);
    } catch (error) {
      alert("Failed to save settings.");
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">System Settings</h3>
        <p className="text-muted small">Configure global platform variables and maintenance modes.</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4" style={{maxWidth: '800px'}}>
        <div className="card-body p-4 p-md-5">
          <h5 className="fw-bold mb-4 border-bottom pb-2">Platform Configuration</h5>
          
          <div className="row align-items-center mb-4">
            <div className="col-md-4">
              <strong className="text-danger"><i className="bi bi-exclamation-triangle-fill me-2"></i> Maintenance Mode</strong>
              <p className="text-muted small mb-0">Halt all user operations (GET, PUT, POST).</p>
            </div>
            <div className="col-md-8 text-md-end mt-2 mt-md-0">
              <div className="form-check form-switch d-inline-block fs-4">
                <input 
                  className="form-check-input cursor-pointer bg-danger border-danger" 
                  type="checkbox" 
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                />
              </div>
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-4"><strong className="text-dark">Platform Name</strong></div>
            <div className="col-md-8 mt-2 mt-md-0">
              <input 
                type="text" 
                className="form-control bg-light fw-bold" 
                value={settings.platformName}
                onChange={(e) => setSettings({...settings, platformName: e.target.value})}
              />
            </div>
          </div>

          <button className="btn btn-danger fw-bold px-5 rounded-pill shadow-sm" onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;