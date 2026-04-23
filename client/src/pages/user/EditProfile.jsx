import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = ({ setActiveView }) => {
  const userId = localStorage.getItem("id");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState("Learner"); 

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', dob: '',
    fatherName: '', address: '', pinCode: '',
    highSchool: '', board: ''
  });

  const [pictureFile, setPictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(''); 

  const themeClass = role === 'Trainer' ? 'primary' : 'danger';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/getuser/${userId}`);
        if (res.data && res.data.data) {
          const user = res.data.data;
          setRole(user.role || 'Learner');
          
          setFormData({
            name: user.name || '', email: user.email || '',
            phone: user.phone || '', dob: user.dob || '',
            fatherName: user.fatherName || '', address: user.address || '',
            pinCode: user.pinCode || '', highSchool: user.highSchool || '',
            board: user.board || ''
          });

          if (user.picture) {
            setPreviewUrl(`http://localhost:5000/uploads/${user.picture}`);
          } else {
            setPreviewUrl(`https://ui-avatars.com/api/?name=${user.name}&background=e9ecef&color=343a40&size=150`);
          }
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPictureFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (pictureFile) data.append('picture', pictureFile);

    try {
      await axios.put(`http://localhost:5000/api/user/update-profile/${userId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Profile updated successfully!");
      if (typeof setActiveView === 'function') setActiveView('Profile'); 
    } catch (error) { alert("Failed to update profile."); } 
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-secondary"></div></div>;

  return (
    <div className="container-fluid py-4" style={{maxWidth: '900px'}}>
      <h4 className="fw-bold mb-4 text-dark">Edit Profile</h4>
      
      <form onSubmit={handleSubmit}>
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            
            <div className="row g-4 align-items-center">
              <div className="col-md-4 text-center border-end">
                <div className="position-relative d-inline-block mb-3">
                  <img src={previewUrl} alt="Preview" className="rounded-circle shadow-sm border border-3 border-light" style={{ width: '130px', height: '130px', objectFit: 'cover' }} />
                  <label className={`btn btn-${themeClass} rounded-circle position-absolute bottom-0 end-0 shadow`} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                    <i className="bi bi-camera-fill"></i>
                    <input type="file" className="d-none" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
                <p className="text-muted small fw-bold">Upload Photo</p>
              </div>

              <div className="col-md-8">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="small text-muted fw-bold">Full Name</label>
                    <input type="text" className="form-control bg-light border-0" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted fw-bold">Email Address</label>
                    <input type="email" className="form-control bg-light border-0 text-muted" value={formData.email} readOnly disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted fw-bold">Phone Number</label>
                    <input type="tel" className="form-control bg-light border-0" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted fw-bold">Date of Birth</label>
                    <input type="date" className="form-control bg-light border-0" name="dob" value={formData.dob} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4 border-light" />

            <div className="row g-3">
              <div className="col-md-4">
                <label className="small text-muted fw-bold">Father's Name</label>
                <input type="text" className="form-control bg-light border-0" name="fatherName" value={formData.fatherName} onChange={handleChange} />
              </div>
              <div className="col-md-5">
                <label className="small text-muted fw-bold">Full Address</label>
                <input type="text" className="form-control bg-light border-0" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="small text-muted fw-bold">Pin Code</label>
                <input type="text" className="form-control bg-light border-0" name="pinCode" value={formData.pinCode} onChange={handleChange} />
              </div>
            </div>

            <hr className="my-4 border-light" />

            <div className="row g-3 mb-3">
              <div className="col-md-8">
                <label className="small text-muted fw-bold">High School / Institution</label>
                <input type="text" className="form-control bg-light border-0" name="highSchool" value={formData.highSchool} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="small text-muted fw-bold">Board (e.g. CBSE)</label>
                <input type="text" className="form-control bg-light border-0" name="board" value={formData.board} onChange={handleChange} />
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