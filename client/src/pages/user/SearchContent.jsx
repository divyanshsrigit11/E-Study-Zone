import React, { useState } from 'react';
import axios from 'axios';

const SearchContent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent page reload if triggered via form submission
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const res = await axios.get(`http://localhost:5000/api/user/content/search?q=${query}`);
      setResults(res.data.data);
    } catch (error) {
      console.error("Search failed", error);
      alert("Failed to perform search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewContent = (trainerName) => {
    // Placeholder for your future Handshake logic!
    alert(`Content Access Locked.\n\nYou must establish a connection (Handshake) with Trainer ${trainerName} to view this material.`);
  };

  return (
    <div className="container py-4">
      
      {/* Search Bar Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 text-center">
          <h3 className="fw-bold mb-3 text-dark">Find New Courses</h3>
          
          <form onSubmit={handleSearch}>
            <div className="input-group input-group-lg shadow-sm mb-4">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Search by Skill (e.g., React) or Trainer Name..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn btn-danger px-4 fw-bold"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {!hasSearched && (
            <div className="alert alert-light text-muted border border-dashed rounded-4">
              <i className="bi bi-info-circle me-2"></i> Start typing to browse the global content library.
            </div>
          )}
        </div>
      </div>

      {/* Search Results Section */}
      {hasSearched && !loading && (
        <div className="mt-4">
          <h5 className="fw-bold mb-4 text-secondary">
            Search Results {results.length > 0 && <span className="badge bg-danger rounded-pill ms-2">{results.length}</span>}
          </h5>

          {results.length === 0 ? (
            <div className="text-center py-5 text-muted bg-white shadow-sm rounded-4 border-0">
              <i className="bi bi-search fs-1 d-block mb-3 opacity-50"></i>
              <p className="fs-5">No content found for "<strong>{query}</strong>"</p>
              <p className="small">Try searching for a different skill or trainer.</p>
            </div>
          ) : (
            <div className="row g-4">
              {results.map((item) => (
                <div className="col-md-6 col-lg-4" key={item._id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 transition-hover">
                    <div className="card-body p-4 d-flex flex-column">
                      
                      {/* Badge & Icon Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold">
                          {item.skillName || 'Unknown Skill'}
                        </span>
                        <i className="bi bi-file-earmark-pdf fs-3 text-secondary opacity-50"></i>
                      </div>

                      {/* Content Details */}
                      <h5 className="fw-bold text-dark mb-1">
                        {item.skillName || 'Course Material'} 
                      </h5>
                      <p className="text-muted small mb-4">
                        By Trainer: <span className="fw-bold text-dark text-capitalize">{item.userId?.name || 'Unknown'}</span>
                      </p>

                      {/* Footer Actions (Pushed to bottom) */}
                      <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Uploaded: {new Date(item.createdAt).toLocaleDateString()}
                        </small>
                        <button 
                          className="btn btn-sm btn-outline-danger rounded-pill fw-bold px-3"
                          onClick={() => handleViewContent(item.userId?.name)}
                        >
                          <i className="bi bi-lock-fill me-1"></i> View Content
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchContent;