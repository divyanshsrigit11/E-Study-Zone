import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardOverview = () => {
  const [statsData, setStatsData] = useState({
    totalLearners: 0,
    activeTrainers: 0,
    pendingApprovals: 0,
    publishedFiles: 0,
    latestTrainers: [],
    latestLearners: [],
    latestContent: []
  });
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/dashboard-stats`);
        setStatsData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [API_URL]);

  const stats = [
    { title: 'Total Learners', count: statsData.totalLearners, icon: 'bi-mortarboard', color: 'primary' },
    { title: 'Active Trainers', count: statsData.activeTrainers, icon: 'bi-person-video3', color: 'success' },
    { title: 'Pending Approvals', count: statsData.pendingApprovals, icon: 'bi-hourglass-split', color: 'warning' },
    { title: 'Published Files', count: statsData.publishedFiles, icon: 'bi-file-earmark-check', color: 'danger' }
  ];

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">Dashboard Overview</h3>
        <p className="text-muted small">Welcome back. Here is the live status of the E-Study Zone platform.</p>
      </div>

      <div className="row g-4 mb-5">
        {stats.map((stat, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <div className={`card border-0 shadow-sm rounded-4 border-start border-${stat.color} border-4 h-100`}>
              <div className="card-body p-4 d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted fw-bold small mb-1 text-uppercase">{stat.title}</p>
                  <h2 className="fw-bold mb-0 text-dark">
                    {loading ? <span className="spinner-border spinner-border-sm text-secondary"></span> : stat.count}
                  </h2>
                </div>
                <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center`} style={{width: '60px', height: '60px'}}>
                  <i className={`bi ${stat.icon} text-${stat.color} fs-4`}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-header bg-white p-4 border-bottom-0">
                <h5 className="fw-bold mb-0"><i className="bi bi-people-fill text-primary me-2"></i> Recent Registrations</h5>
                </div>
                <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                    {statsData.latestTrainers?.map(trainer => (
                        <li key={trainer._id} className="list-group-item p-4 border-light d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 text-success p-2 rounded-circle me-3"><i className="bi bi-person-video3"></i></div>
                            <div>
                                <strong className="d-block text-dark text-capitalize">{trainer.name}</strong>
                                <small className="text-muted">Registered as a Trainer ({trainer.status})</small>
                            </div>
                            <span className="ms-auto badge bg-light text-dark border">Trainer</span>
                        </li>
                    ))}
                    {statsData.latestLearners?.map(learner => (
                        <li key={learner._id} className="list-group-item p-4 border-light d-flex align-items-center bg-light bg-opacity-50">
                            <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle me-3"><i className="bi bi-mortarboard"></i></div>
                            <div>
                                <strong className="d-block text-dark text-capitalize">{learner.name}</strong>
                                <small className="text-muted">Registered as a Learner</small>
                            </div>
                            <span className="ms-auto badge bg-light text-dark border">Learner</span>
                        </li>
                    ))}
                    {(!statsData.latestTrainers?.length && !statsData.latestLearners?.length && !loading) && (
                        <li className="list-group-item p-4 text-center text-muted small">No recent registrations.</li>
                    )}
                </ul>
                </div>
            </div>
        </div>

        <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-header bg-white p-4 border-bottom-0">
                <h5 className="fw-bold mb-0"><i className="bi bi-cloud-arrow-up-fill text-danger me-2"></i> Recently Uploaded Vault Files</h5>
                </div>
                <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                    {statsData.latestContent?.map(content => (
                        <li key={content._id} className="list-group-item p-4 border-light d-flex align-items-center">
                            <i className="bi bi-file-earmark-text fs-3 text-secondary me-3"></i>
                            <div className="text-truncate">
                                <strong className="d-block text-dark text-truncate" style={{maxWidth: '250px'}}>
                                    {content.file}
                                </strong>
                                <small className="text-muted">
                                    Uploaded by: <span className="fw-bold text-capitalize">{content.userId?.name || 'Unknown'}</span> 
                                </small>
                            </div>
                            <span className={`ms-auto badge rounded-pill ${content.status === 'publish' ? 'bg-success' : content.status === 'blocked' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                {content.status}
                            </span>
                        </li>
                    ))}
                    {(!statsData.latestContent?.length && !loading) && (
                        <li className="list-group-item p-4 text-center text-muted small">No files have been uploaded recently.</li>
                    )}
                </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;