import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyContent = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for the Modal
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(''); 
  const currentUserId = localStorage.getItem("id");

  useEffect(() => {
    const fetchMyContent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/learner/content/${currentUserId}`);
        setContentList(res.data.data);
      } catch (error) {
        console.error("Failed to fetch content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyContent();
  }, [currentUserId]);

  const handleLearnMore = (filename) => {
    const fileUrl = `http://localhost:5000/uploads/${filename}`;
    setSelectedFile(fileUrl);

    // Check the file extension to prevent browser auto-download panics
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      setFileType('image');
    } else if (ext === 'pdf') {
      setFileType('pdf');
    } else {
      setFileType('other'); // For .docx, .zip, etc.
    }
  };

  const closeModal = () => {
    setSelectedFile(null);
    setFileType('');
  };

  return (
    <div className="container-fluid py-4">
      <h4 className="fw-bold text-secondary mb-4">My Learning Vault</h4>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
        </div>
      ) : contentList.length === 0 ? (
        <div className="text-center py-5 text-muted bg-light rounded-4">
          <i className="bi bi-folder-x fs-1 mb-3 d-block"></i>
          <h5>No content available yet.</h5>
          <p>Connect with trainers and wait for them to publish materials!</p>
        </div>
      ) : (
        <div className="row g-4">
          {contentList.map((content) => (
            <div className="col-md-4 col-lg-3" key={content._id}>
              
              {/* Decorative Dots */}
              <div className="d-flex justify-content-center gap-2 mb-2">
                <span className="bg-danger rounded-circle p-2"></span>
                <span className="bg-danger rounded-circle p-2 opacity-50"></span>
                <span className="bg-success rounded-circle p-2 opacity-50"></span>
              </div>
              
              {/* Dynamic Card */}
              <div className="card h-100 border-danger border-2 rounded-4 text-center shadow-sm transition-hover">
                <div className="card-body p-4 d-flex flex-column">
                  
                  <h5 className="fw-bold text-dark mb-2 text-uppercase">{content.skillName}</h5>
                  <h6 className="fw-bold text-success mb-3">By: {content.trainerName}</h6>
                  
                  <img 
                    src="https://illustrations.popsy.co/amber/freelancer.svg" 
                    alt="Course illustration" 
                    className="img-fluid mb-4 mx-auto" 
                    style={{ height: '100px' }} 
                  />
                  
                  <div className="mt-auto">
                    <p className="text-muted small mb-3">
                      <i className="bi bi-calendar-check me-2"></i>
                      Posted: {new Date(content.createdAt).toLocaleDateString()}
                    </p>
                    
                    {/* TWO BUTTONS: View and Download */}
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-danger rounded-pill w-75 fw-bold"
                        onClick={() => handleLearnMore(content.file)}
                      >
                        <i className="bi bi-eye me-2"></i> View
                      </button>
                      
                      <a 
                        href={`http://localhost:5000/uploads/${content.file}`} 
                        download={content.file}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-danger rounded-pill w-25"
                        title="Download File"
                      >
                        <i className="bi bi-download"></i>
                      </a>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- CONTENT VIEWER MODAL --- */}
      {selectedFile && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} 
          tabIndex="-1"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              
              <div className="modal-header bg-dark text-white border-0">
                <h5 className="modal-title fw-bold"><i className="bi bi-file-earmark-text me-2"></i> Course Material</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeModal} 
                  aria-label="Close"
                ></button>
              </div>
              
              <div className="modal-body p-0 bg-light d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                
                {/* Condition 1: It's an Image */}
                {fileType === 'image' && (
                  <img src={selectedFile} alt="Course Content" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                )}

                {/* Condition 2: It's a PDF */}
                {fileType === 'pdf' && (
                  <iframe 
                    src={selectedFile} 
                    title="Course Content" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 'none' }}
                  />
                )}

                {/* Condition 3: Unrenderable File (Word, Excel, Zip) */}
                {fileType === 'other' && (
                  <div className="text-center p-5">
                    <i className="bi bi-file-earmark-x text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                    <h4 className="fw-bold text-secondary">Preview Not Available</h4>
                    <p className="text-muted">Your browser cannot display this file type directly.</p>
                    <a 
                      href={selectedFile} 
                      download 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn btn-primary rounded-pill px-4 mt-3"
                    >
                      <i className="bi bi-download me-2"></i> Download to View
                    </a>
                  </div>
                )}

              </div>
              
              <div className="modal-footer bg-light border-0 justify-content-center py-3">
                <button type="button" className="btn btn-secondary px-5 rounded-pill fw-bold shadow-sm" onClick={closeModal}>
                  Close Viewer
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyContent;