import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = ({ setActiveView}) => {
  const userId = localStorage.getItem("id");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState("Learner"); 

  // for all fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    fatherName: '',
    address: '',
    pinCode: '',
    highSchool: '',
    board: '',
    picture: '' 
  });

  // dynmaic color based on  role
  const themeClass = role === 'Trainer' ? 'primary' : 'danger';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/user/getuser/${userId}`);
        if (res.data && res.data.data) {
          const user = res.data.data;
          setRole(user.role || 'Learner');
          
          // if fields are missing in the response, default to empty string to avoid uncontrolled input issues
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            dob: user.dob || '',
            fatherName: user.fatherName || '',
            address: user.address || '',
            pinCode: user.pinCode || '',
            highSchool: user.highSchool || '',
            board: user.board || '',
            picture: user.picture || ''
          });
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/user/update-profile/${userId}`, formData);
      alert("Profile updated successfully!");
      setActiveView('Profile'); // go back to profile view after saving
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5 text-muted">
        <div className="spinner-border text-secondary me-2" role="status"></div>
        Loading profile editor...
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h4 className="fw-bold mb-4 text-dark">Edit Profile</h4>
      
      <form onSubmit={handleSubmit}>
        
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-4 text-dark border-bottom pb-2">Basic Informations</h6>
            
            <div className="row">
              <div className="col-md-3 d-flex flex-column align-items-center justify-content-center mb-4 mb-md-0">
                <div className="position-relative" style={{ width: '150px', height: '150px' }}>
                  <img 
                    src={formData.picture || `https://ui-avatars.com/api/?name=${formData.name}&background=e9ecef&color=343a40&size=150`} 
                    alt="Profile" 
                    className="rounded border shadow-sm"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  <label 
                    className="position-absolute bottom-0 w-100 text-center text-white bg-dark bg-opacity-75 py-1 m-0" 
                    style={{ cursor: 'pointer', borderBottomLeftRadius: '0.375rem', borderBottomRightRadius: '0.375rem', fontSize: '0.8rem' }}
                  >
                    edit
                    <input type="file" className="d-none" accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="col-md-9">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="text" className="form-control bg-light border-0" id="nameInput" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                      <label htmlFor="nameInput" className="text-muted small">Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="tel" className="form-control bg-light border-0" id="phoneInput" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile" />
                      <label htmlFor="phoneInput" className="text-muted small">Mobile</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="email" className="form-control bg-light border-0" id="emailInput" name="email" value={formData.email} placeholder="Email" readOnly title="Email cannot be changed" />
                      <label htmlFor="emailInput" className="text-muted small">Email (Read Only)</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="date" className="form-control bg-light border-0" id="dobInput" name="dob" value={formData.dob} onChange={handleChange} placeholder="Date of Birth" />
                      <label htmlFor="dobInput" className="text-muted small">Date of Birth</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-4 text-dark border-bottom pb-2">Additional Information</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="form-floating">
                  <input type="text" className="form-control bg-light border-0" id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" />
                  <label htmlFor="fatherName" className="text-muted small">Father's Name</label>
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-floating">
                  <input type="text" className="form-control bg-light border-0" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                  <label htmlFor="address" className="text-muted small">Address</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-floating">
                  <input type="text" className="form-control bg-light border-0" id="pinCode" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="Pin Code" />
                  <label htmlFor="pinCode" className="text-muted small">Pin Code</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-4 text-dark border-bottom pb-2">High School Informations</h6>
            <div className="row g-3">
              <div className="col-md-8">
                <div className="form-floating">
                  <input type="text" className="form-control bg-light border-0" id="highSchool" name="highSchool" value={formData.highSchool} onChange={handleChange} placeholder="Institution" />
                  <label htmlFor="highSchool" className="text-muted small">Institution</label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating">
                  <input type="text" className="form-control bg-light border-0" id="board" name="board" value={formData.board} onChange={handleChange} placeholder="Board" />
                  <label htmlFor="board" className="text-muted small">Board (e.g. CBSE)</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3">
          <button type="button" className="btn btn-light px-4 fw-bold shadow-sm" onClick={() => setActiveView('Profile')}>Cancel</button>
          <button type="submit" className={`btn btn-${themeClass} px-5 fw-bold shadow-sm`} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProfile;