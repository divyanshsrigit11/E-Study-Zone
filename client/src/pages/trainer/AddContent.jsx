import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddContent = () => {
  const userId = localStorage.getItem("id");
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [uploadFile, setUploadFile] = useState(null); 
  
  const [loading, setLoading] = useState(false);
  const [myContents, setMyContents] = useState([]); // State for the management table

  const fetchSkills = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/skills/${userId}`);
      setSkills(res.data);
    } catch (error) {
      console.error("Failed to fetch skills", error);
    }
  };

  const fetchMyContents = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/content/trainer/${userId}`);
      setMyContents(res.data.data);
    } catch (error) {
      console.error("Failed to fetch my contents", error);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchMyContents();
  }, [userId]);

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleSubmit = async (status) => {
    if (!selectedSkill) return alert("Please select a skill from the dropdown!");
    if (!uploadFile) return alert("Please upload a file!");

    setLoading(true);

    const formData = new FormData();
    formData.append('skillId', selectedSkill);
    formData.append('file', uploadFile);
    formData.append('status', status);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/user/content/add/${userId}`, 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      alert(res.data.msg);
      
      // Reset form and instantly refresh the table!
      setSelectedSkill("");
      setUploadFile(null);
      document.getElementById('contentFileInput').value = ""; 
      fetchMyContents(); 
      
    } catch (error) {
      console.error(error);
      alert("Failed to save content.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Draft/Publish Status
  const handleStatusChange = async (contentId, currentStatus) => {
    const newStatus = currentStatus === 'publish' ? 'draft' : 'publish';
    try {
      const res = await axios.put(`http://localhost:5000/api/user/content/status/${contentId}`, { status: newStatus });
      alert(res.data.msg);
      fetchMyContents();
    } catch (error) {
      alert("Failed to change status");
    }
  };

  // Delete Content
  const handleDelete = async (contentId) => {
    if(!window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) return;
    
    try {
      const res = await axios.delete(`http://localhost:5000/api/user/content/${contentId}`);
      alert(res.data.msg);
      fetchMyContents();
    } catch (error) {
      alert("Failed to delete content");
    }
  };

  return (
    <div className="container py-5">
      
      {/* UPLOAD SECTION */}
      <div className="card border-0 shadow-sm mx-auto mb-5" style={{ maxWidth: '700px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="bi bi-cloud-upload text-primary mb-2" style={{ fontSize: '3rem' }}></i>
            <h4 className="fw-bold">Upload Course Content</h4>
            <p className="text-muted small">Select a skill and upload your materials.</p>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-secondary small">RELATED SKILL</label>
            <select 
              className="form-select form-select-lg bg-light" 
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="" disabled>-- Select a Skill --</option>
              {skills.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.name} {skill.status === 'inactive' ? '(Inactive)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="form-label fw-bold text-secondary small">CONTENT FILE</label>
            <input 
              type="file" 
              className="form-control form-control-lg bg-light" 
              id="contentFileInput" 
              onChange={handleFileChange}
            />
          </div>

          <div className="d-flex gap-3">
            <button 
              className="btn btn-outline-secondary w-50 fw-bold py-2 shadow-sm" 
              onClick={() => handleSubmit('draft')}
              disabled={loading || skills.length === 0}
            >
              <i className="bi bi-archive me-2"></i> Save as Draft
            </button>
            
            <button 
              className="btn btn-primary w-50 fw-bold py-2 shadow-sm" 
              onClick={() => handleSubmit('publish')}
              disabled={loading || skills.length === 0}
            >
              {loading ? 'Uploading...' : <><i className="bi bi-send-check me-2"></i> Publish Content</>}
            </button>
          </div>
        </div>
      </div>

      {/* MANAGEMENT TABLE SECTION */}
      <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '900px' }}>
        <div className="card-header bg-white p-4 border-bottom-0">
          <h5 className="fw-bold mb-0 text-dark">
            <i className="bi bi-folder2-open me-2 text-primary"></i> My Uploaded Files
          </h5>
        </div>
        <div className="card-body p-0">
          {myContents.length === 0 ? (
            <div className="text-center py-5 text-muted small">You haven't uploaded any content yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">FILE NAME</th>
                    <th>ASSOCIATED SKILL</th>
                    <th className="text-center">STATUS</th>
                    <th className="text-center pe-4">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {myContents.map((content) => (
                    <tr key={content._id}>
                      {/* Shorten the filename visually so it doesn't break the table */}
                      <td className="ps-4 text-primary small fw-bold">
                         <i className="bi bi-file-earmark-text me-2"></i> 
                         {content.file.length > 25 ? content.file.substring(0, 25) + '...' : content.file}
                      </td>
                      <td className="text-uppercase fw-bold text-secondary" style={{fontSize: '0.85rem'}}>
                        {content.skillName}
                      </td>
                      <td className="text-center">
                        <span className={`badge rounded-pill ${content.status === 'publish' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {content.status === 'publish' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="text-center pe-4">
                        <button 
                          className="btn btn-sm btn-outline-dark rounded-pill px-3 me-2"
                          onClick={() => handleStatusChange(content._id, content.status)}
                        >
                          {content.status === 'publish' ? 'Move to Draft' : 'Publish Now'}
                        </button>
                        <button 
                          className="btn btn-sm btn-danger rounded-pill px-3"
                          onClick={() => handleDelete(content._id)}
                          title="Delete File"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AddContent;