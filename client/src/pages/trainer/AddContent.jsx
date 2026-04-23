import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddContent = () => {
  const [skills, setSkills] = useState([]);
  const [contents, setContents] = useState([]);
  const [formData, setFormData] = useState({ skillId: '', status: 'draft' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("id");

  const fetchData = async () => {
    try {
      const skillRes = await axios.get(`http://localhost:5000/api/user/skills/${userId}`);
      setSkills(skillRes.data.filter(s => s.status === 'active'));
      const contentRes = await axios.get(`http://localhost:5000/api/user/content/trainer/${userId}`);
      setContents(contentRes.data.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [userId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file to upload.");

    const data = new FormData();
    data.append('skillId', formData.skillId);
    data.append('status', formData.status);
    data.append('file', file);

    try {
      await axios.post(`http://localhost:5000/api/user/content/add/${userId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Content uploaded successfully!");
      setFile(null);
      fetchData();
    } catch (error) { alert("Failed to upload content."); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/user/content/status/${id}`, { status: newStatus });
      fetchData();
    } catch (error) { alert("Failed to change status."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this content permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/user/content/${id}`);
      fetchData();
    } catch (error) { alert("Failed to delete."); }
  };

  return (
    <div className="container-fluid p-0">
      <h4 className="fw-bold text-dark mb-4">Upload Course Material</h4>
      
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <form onSubmit={handleUpload} className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="small fw-bold text-muted mb-1">Select Skill Category</label>
              <select className="form-select bg-light" onChange={(e) => setFormData({...formData, skillId: e.target.value})} required>
                <option value="">-- Select Active Skill --</option>
                {skills.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="small fw-bold text-muted mb-1">File (PDF, Image)</label>
              <input type="file" className="form-control bg-light" onChange={(e) => setFile(e.target.files[0])} required />
            </div>
            <div className="col-md-2">
              <label className="small fw-bold text-muted mb-1">Visibility</label>
              <select className="form-select bg-light" onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="draft">Draft</option>
                <option value="publish">Publish</option>
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100 fw-bold">Upload</button>
            </div>
          </form>
        </div>
      </div>

      <h5 className="fw-bold text-dark mb-3 mt-5">My Uploaded Content</h5>
      {loading ? <div className="spinner-border text-primary"></div> : (
        <div className="table-responsive bg-white shadow-sm rounded-4">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="ps-4">FILE</th>
                <th>SKILL CATEGORY</th>
                <th>STATUS</th>
                <th className="text-end pe-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {contents.map(c => (
                <tr key={c._id}>
                  <td className="ps-4 fw-bold text-dark">
                    <a 
                      href={c.file.startsWith('http') ? c.file : `http://localhost:5000/uploads/${c.file}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-decoration-none text-primary"
                    >
                      <i className="bi bi-box-arrow-up-right me-2"></i> View Material
                    </a>
                  </td>
                  <td className="text-muted">{c.skillName}</td>
                  <td><span className={`badge ${c.status === 'publish' ? 'bg-success' : c.status === 'blocked' ? 'bg-danger' : 'bg-secondary'}`}>{c.status}</span></td>
                  <td className="text-end pe-4">
                    {c.status !== 'blocked' && (
                      <button className={`btn btn-sm ${c.status === 'publish' ? 'btn-outline-secondary' : 'btn-success'} me-2`} onClick={() => handleStatusChange(c._id, c.status === 'publish' ? 'draft' : 'publish')}>
                        {c.status === 'publish' ? 'Unpublish' : 'Publish'}
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddContent;