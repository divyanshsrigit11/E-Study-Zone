import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSkills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("id");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchSkills = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user/skills/${userId}`);
      setSkills(res.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchSkills(); }, [userId]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/user/skills/${userId}`, newSkill);
      setNewSkill({ name: '', description: '' });
      fetchSkills();
    } catch (error) { alert("Failed to add skill"); }
  };

  const handleToggleStatus = async (skillId) => {
    try {
      await axios.patch(`${API_URL}/api/user/skills/${userId}/${skillId}/toggle`);
      fetchSkills();
    } catch (error) { alert("Failed to toggle status"); }
  };

  const handleDelete = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await axios.delete(`${API_URL}/api/user/skills/${userId}/${skillId}`);
      fetchSkills();
    } catch (error) { alert("Failed to delete skill"); }
  };

  return (
    <div className="container-fluid p-0">
      <h4 className="fw-bold text-dark mb-4">Manage My Skills</h4>
      
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <form onSubmit={handleAddSkill} className="row g-3">
            <div className="col-md-4">
              <input type="text" className="form-control bg-light" placeholder="Skill Name (e.g., ReactJS)" value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control bg-light" placeholder="Short Description" value={newSkill.description} onChange={(e) => setNewSkill({...newSkill, description: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100 fw-bold">Add Skill</button>
            </div>
          </form>
        </div>
      </div>

      {loading ? <div className="spinner-border text-primary"></div> : (
        <div className="row g-3">
          {skills.map(skill => (
            <div className="col-md-6" key={skill._id}>
              <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold text-dark mb-0">{skill.name}</h6>
                  <span className={`badge ${skill.status === 'active' ? 'bg-success' : 'bg-warning text-dark'}`}>{skill.status}</span>
                </div>
                <p className="text-muted small mb-3">{skill.description}</p>
                <div className="mt-auto d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary w-50" onClick={() => handleToggleStatus(skill._id)}>Toggle Status</button>
                  <button className="btn btn-sm btn-outline-danger w-50" onClick={() => handleDelete(skill._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {skills.length === 0 && <p className="text-muted">You haven't added any skills yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AddSkills;