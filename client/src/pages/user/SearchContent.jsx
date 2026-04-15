import React from 'react';

const SearchContent = () => {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h3 className="fw-bold mb-3">Find New Courses</h3>
          <div className="input-group input-group-lg shadow-sm mb-5">
            <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
            <input type="text" className="form-control border-start-0" placeholder="Search for React, Node, Python..." />
            <button className="btn btn-danger px-4">Search</button>
          </div>
          <div className="alert alert-light text-muted border border-dashed">
            <i className="bi bi-info-circle me-2"></i> Start typing to browse the global content library.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchContent;