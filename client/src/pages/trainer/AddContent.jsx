import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddContent = () => {
  const userId = localStorage.getItem("id");
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/user/skills/${userId}`);
        setSkills(res.data);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      }
    };
    fetchSkills();
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFileBase64(reader.result);
      };
    }
  };

  const handleSubmit = async (status) => {
    if (!selectedSkill) return alert("Please select a skill from the dropdown!");
    if (!fileBase64) return alert("Please upload a file!");

    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/user/content/add/${userId}`, {
        skillId: selectedSkill,
        file: fileBase64,
        status: status // 'draft' or 'publish'
      });
      
      alert(res.data.msg);
      
      // reset form
      setSelectedSkill("");
      setFileBase64("");
      document.getElementById('contentFileInput').value = ""; 
      
    } catch (error) {
      console.error(error);
      alert("Failed to save content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="bi bi-cloud-upload text-primary mb-2" style={{ fontSize: '3rem' }}></i>
            <h4 className="fw-bold">Upload Course Content</h4>
            <p className="text-muted small">Select a skill and upload your materials.</p>
          </div>

          {/* skills dropdown */}
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
            {skills.length === 0 && (
              <small className="text-danger mt-1 d-block">
                <i className="bi bi-exclamation-circle me-1"></i>
                You must add skills in the "Add Skills" tab first!
              </small>
            )}
          </div>

          {/* upload files */}
          <div className="mb-5">
            <label className="form-label fw-bold text-secondary small">CONTENT FILE</label>
            <input 
              type="file" 
              className="form-control form-control-lg bg-light" 
              id="contentFileInput" 
              onChange={handleFileChange}
            />
            <small className="text-muted mt-1 d-block">Upload PDFs, Docs, or Images.</small>
          </div>

          <hr className="mb-4" />

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
    </div>
  );
};

export default AddContent;