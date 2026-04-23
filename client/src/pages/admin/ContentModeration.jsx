import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentModeration = () => {
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllContent = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/content/all');
      setAllContent(res.data.data);
    } catch (error) {
      console.error("Failed to fetch all content", error);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAllContent(); }, []);

  const handleHideContent = async (contentId) => {
    if(!window.confirm("Are you sure you want to block this file? Learners will no longer see it.")) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/content/hide/${contentId}`);
      alert(res.data.msg);
      fetchAllContent(); 
    } catch (error) { alert("Failed to hide content"); }
  };

  const handleRestoreContent = async (contentId) => {
    if(!window.confirm("Restore this content? It will be published live immediately.")) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/content/unhide/${contentId}`);
      alert(res.data.msg);
      fetchAllContent(); 
    } catch (error) { alert("Failed to restore content"); }
  };

  const filteredContent = allContent.filter((content) => {
    const searchLower = searchQuery.toLowerCase();
    const trainerName = content.userId?.name?.toLowerCase() || '';
    const skillName = content.skillName?.toLowerCase() || '';
    return trainerName.includes(searchLower) || skillName.includes(searchLower);
  });

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">Global Content Moderation</h3>
        <p className="text-muted small">Monitor, review, and manage course materials uploaded across the platform.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-header bg-white p-4 border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <h5 className="fw-bold mb-0"><i className="bi bi-folder-check text-danger me-2"></i> Platform Content Vault</h5>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input type="text" className="form-control bg-light border-start-0" placeholder="Search Trainer or Skill..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">FILE NAME</th>
                    <th>UPLOADER (TRAINER)</th>
                    <th>SKILL</th>
                    <th className="text-center">STATUS</th>
                    <th className="text-center pe-4">ADMIN ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContent.map((content) => (
                    <tr key={content._id}>
                      <td className="ps-4 text-primary small fw-bold">
                        <i className="bi bi-file-earmark-text me-2 text-muted"></i> 
                        <a 
                          href={content.file.startsWith('http') ? content.file : `http://localhost:5000/uploads/${content.file}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-decoration-none"
                        >
                          View Document
                        </a>
                      </td>
                      <td className="text-capitalize small fw-bold text-dark">{content.userId?.name || 'Unknown User'}</td>
                      <td className="text-uppercase text-secondary small fw-bold">{content.skillName}</td>
                      <td className="text-center">
                        <span className={`badge rounded-pill ${content.status === 'publish' ? 'bg-success' : content.status === 'blocked' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                          {content.status === 'publish' ? 'Live' : content.status === 'blocked' ? 'Blocked' : 'Draft'}
                        </span>
                      </td>
                      <td className="text-center pe-4">
                        {content.status === 'publish' ? (
                          <button className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold" onClick={() => handleHideContent(content._id)}>
                            <i className="bi bi-shield-lock-fill me-1"></i> Block
                          </button>
                        ) : content.status === 'blocked' ? (
                          <button className="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm" onClick={() => handleRestoreContent(content._id)}>
                            <i className="bi bi-unlock-fill me-1"></i> Unblock
                          </button>
                        ) : (
                           <span className="text-muted small fst-italic">Drafted by Trainer</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModeration;