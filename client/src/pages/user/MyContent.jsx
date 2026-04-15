import React from 'react';

const MyContent = () => {
  return (
    <div className="container-fluid py-4">
      <h4 className="fw-bold text-secondary mb-4">Assigned Technologies</h4>
      <div className="row g-4">
        
        {/* Card 1 */}
        <div className="col-md-4">
          <div className="d-flex justify-content-center gap-2 mb-2">
            <span className="bg-danger rounded-circle p-2"></span>
            <span className="bg-danger rounded-circle p-2 opacity-50"></span>
            <span className="bg-success rounded-circle p-2 opacity-50"></span>
            <span className="bg-success rounded-circle p-2 opacity-50"></span>
          </div>
          <div className="card h-100 border-danger border-2 rounded-4 text-center shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold text-dark mb-0">FOUNDATION</h5>
              <small className="text-muted d-block mb-3">Start Strong, Build Right.</small>
              <img src="https://illustrations.popsy.co/amber/freelancer.svg" alt="Foundation" className="img-fluid mb-3" style={{height: '120px'}} />
              <h6 className="fw-bold text-danger">Foundation-FSD</h6>
              <p className="text-muted small mb-4">Foundation for Full Stack Development -2025</p>
              <button className="btn btn-outline-danger rounded-pill px-4 fw-bold">Learn More...</button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-md-4">
          <div className="d-flex justify-content-center gap-2 mb-2">
            <span className="bg-success rounded-circle p-2"></span>
            <span className="bg-success rounded-circle p-2 opacity-50"></span>
            <span className="bg-warning rounded-circle p-2 opacity-50"></span>
            <span className="bg-success rounded-circle p-2 opacity-50"></span>
          </div>
          <div className="card h-100 border-primary border-2 rounded-4 text-center shadow-sm">
            <div className="card-body p-4">
              <img src="https://illustrations.popsy.co/amber/web-design.svg" alt="Web" className="img-fluid mb-3 mt-3" style={{height: '120px'}} />
              <div className="bg-primary text-white py-1 mb-3 fw-bold w-100">Web Technologies</div>
              <h6 className="fw-bold text-danger">Web Technologies-FSD</h6>
              <p className="text-muted small mb-4">Web Technologies for Full Stack Development</p>
              <button className="btn btn-outline-danger rounded-pill px-4 fw-bold">Learn More...</button>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-md-4">
           <div className="d-flex justify-content-start ms-4 gap-2 mb-2">
            <span className="bg-danger rounded-circle p-2"></span>
          </div>
          <div className="card h-100 border-warning border-2 rounded-4 text-center shadow-sm">
            <div className="card-body p-4">
              <img src="https://illustrations.popsy.co/amber/surreal-hourglass.svg" alt="MERN" className="img-fluid mb-3 mt-3" style={{height: '120px'}} />
              <h6 className="fw-bold text-danger">MERN</h6>
              <p className="text-muted small mb-4">MERN</p>
              <button className="btn btn-outline-danger rounded-pill px-4 fw-bold mt-4">Learn More...</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyContent;