import React from 'react';

const Terms = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Terms & Conditions</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body p-4" style={{ fontSize: '0.9rem' }}>
            <p className="fw-bold">1. Acceptance of Terms</p>
            <p className="text-muted">By creating an account at e-study-zone, you agree to follow our educational guidelines and community standards.</p>
            
            <p className="fw-bold mt-3">2. User Privacy</p>
            <p className="text-muted">Your data is used solely for personalizing your learning experience. We do not sell your study habits to third parties.</p>
            
            <p className="fw-bold mt-3">3. Usage Policy</p>
            <p className="text-muted">Users must not upload copyrighted materials or engage in academic dishonesty using our tools.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger w-100" onClick={onClose}>I Understand</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;