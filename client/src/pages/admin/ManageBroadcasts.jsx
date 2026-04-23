import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageBroadcasts = () => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/notifications');
      setHistory(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSendBroadcast = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    try {
      await axios.post('http://localhost:5000/api/admin/broadcast', { message });
      alert("Broadcast sent successfully to all users!");
      setMessage(""); 
      fetchHistory(); 
    } catch (er) { alert("Failed to send broadcast."); } 
    finally { setIsSending(false); }
  };

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">Global Broadcasts</h3>
        <p className="text-muted small">Send live alerts to all users and view your broadcast history.</p>
      </div>

      <div className="row g-4">
        {/* COMPOSER SECTION */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white p-4 border-bottom-0">
              <h5 className="fw-bold mb-0 text-danger">
                <i className="bi bi-broadcast-pin me-2 fs-5 align-middle"></i> New Broadcast
              </h5>
            </div>
            <div className="card-body p-4 pt-0 d-flex flex-column">
              <div className="alert alert-danger bg-opacity-10 border-0 text-danger d-flex align-items-center mb-4 rounded-3">
                <i className="bi bi-info-circle-fill fs-4 me-3"></i>
                <p className="mb-0 small fw-medium">This message will be sent instantly to all active Trainers and Learners.</p>
              </div>
              <div className="position-relative flex-grow-1 mb-4">
                <textarea 
                  className="form-control bg-light border-0 shadow-none rounded-3 p-3 h-100" 
                  rows="6" placeholder="Type your urgent alert here..."
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  style={{ resize: 'none' }} maxLength={250}
                ></textarea>
                <div className={`position-absolute bottom-0 end-0 p-2 small fw-bold ${message.length >= 250 ? 'text-danger' : 'text-muted'}`}>
                  {message.length} / 250
                </div>
              </div>
              <button 
                className="btn btn-danger w-100 fw-bold rounded-pill py-2 shadow-sm d-flex align-items-center justify-content-center mt-auto" 
                onClick={handleSendBroadcast} disabled={isSending || !message.trim()}
              >
                {isSending ? <><span className="spinner-border spinner-border-sm me-2"></span> Sending...</> : <><i className="bi bi-send-fill me-2"></i> Send to All Users</>}
              </button>
            </div>
          </div>
        </div>

        {/* HISTORY SECTION */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white p-4 border-bottom-0">
              <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-clock-history text-secondary me-2"></i> Broadcast History</h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>
              ) : history.length === 0 ? (
                <div className="text-center py-5 text-muted">No broadcasts have been sent yet.</div>
              ) : (
                <div className="list-group list-group-flush rounded-bottom-4" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {history.map((item) => (
                    <div key={item._id} className="list-group-item p-4 border-light">
                      <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                        <small className="text-muted fw-bold">
                          <i className="bi bi-calendar-check me-1"></i>
                          {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </small>
                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill">Sent</span>
                      </div>
                      <p className="mb-0 text-dark">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBroadcasts;