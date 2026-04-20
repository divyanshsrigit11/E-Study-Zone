import React, { useState } from 'react';
import axios from 'axios';

// Accept setActiveView as a prop so we can redirect the user after sending a request
const SearchContent = ({ setActiveView }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const currentUserId = localStorage.getItem("id");

  const handleSearch = async (e) => {
    e.preventDefault(); 
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const res = await axios.get(`http://localhost:5000/api/user/trainers/search?q=${query}`);
      setResults(res.data.data);
    } catch (error) {
      console.error("Search failed", error);
      alert("Failed to perform search.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (trainerId, skillId, skillName) => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/handshake/send', {
        learnerId: currentUserId,
        trainerId: trainerId,
        skillId: skillId,     
        skillName: skillName
      });
      alert(res.data.msg);
      // Redirect to Handshake Request tab to see the pending status
      if(setActiveView) setActiveView('Handshake Request');
    } catch (error) {
      alert(error.response?.data?.msg || "Failed to send request.");
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 text-center">
          <h3 className="fw-bold mb-3 text-dark">Find Expert Trainers</h3>
          <form onSubmit={handleSearch}>
            <div className="input-group input-group-lg shadow-sm mb-3">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input 
                type="text" 
                id="trainerSearch"  
                name="trainerSearch"
                aria-label="Search for a skill or trainer"
                className="form-control border-start-0" 
                placeholder="Search for a skill (e.g., React, Java)..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-danger px-4 fw-bold" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Table */}
      {hasSearched && !loading && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-header bg-white p-4 border-bottom-0">
            <h5 className="fw-bold mb-0 text-secondary">
              Search Results <span className="badge bg-danger ms-2">{results.length}</span>
            </h5>
          </div>
          <div className="card-body p-0">
            {results.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p className="fs-5">No trainers found for "<strong>{query}</strong>"</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="ps-4">S.No.</th>
                      <th>Trainer Name</th>
                      <th>Trainer ID</th>
                      <th>Skill</th>
                      <th>Status</th>
                      <th className="text-center pe-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((item, index) => (
                      <tr key={index}>
                        <td className="ps-4 fw-bold text-muted">{index + 1}</td>
                        <td className="fw-bold text-dark text-capitalize">{item.trainerName}</td>
                        <td className="font-monospace text-muted small">{item.trainerId}</td>
                        <td className="fw-bold text-danger">{item.skillName}</td>
                        <td>
                          <span className={`badge ${item.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="text-center pe-4">
                          <button 
                            className="btn btn-sm btn-outline-danger rounded-pill fw-bold px-3 w-100"
                            onClick={() => handleSendRequest(item.trainerId, item.skillId, item.skillName)}
                            disabled={item.status !== 'active'}
                          >
                            <i className="bi bi-person-plus-fill me-1"></i> Send Request
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
      )}
    </div>
  );
};

export default SearchContent;