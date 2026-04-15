import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSkills = () => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  
  const userId = localStorage.getItem("id") || "";

  // FETCH SKILLS
  const handleFetch = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/skills/${userId}`);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching skills", error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [userId]);

  // ADD SKILL
  const handleAdd = async () => {
    if (!input) return alert("Skill name is required!");
    try {
      const res = await axios.post(`http://localhost:5000/api/user/skills/${userId}`, {
        name: input,
        description: description
      });
      setInput("");
      setDescription("");
      handleFetch(); 
    } catch (error) {
      console.error(error);
      alert("Failed to add skill.");
    }
  };

  // DELETE SKILL
  const handleDelete = async (skillId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this skill?");
    if (confirmDelete) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/user/skills/${userId}/${skillId}`);
        handleFetch();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // EDIT SKILL
  const handleEdit = async (skillId, oldName, oldDesc) => {
    const newName = window.prompt("Enter new skill name:", oldName);
    if (newName === null) return;
    
    const newDesc = window.prompt("Enter new description:", oldDesc);
    if (newDesc === null) return; 

    try {
      const res = await axios.put(`http://localhost:5000/api/user/skills/${userId}/${skillId}`, {
        name: newName,
        description: newDesc
      });
      handleFetch(); 
    } catch (error) {
      console.error(error);
      alert("Failed to update skill.");
    }
  };

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '800px' }}>
        <div className="card-body p-4">
          <h4 className="fw-bold mb-4">Manage Expertise</h4>
          <h3 className='fw-bold mb-3 text-info'>User Id: {userId}</h3>
          
          {/* form section to add skills */}
          <div className="row mb-4">
            <div className="col-md-5 mb-2">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Skill Name (e.g. React)" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
              />
            </div>
            <div className="col-md-5 mb-2">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Description..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            <div className="col-md-2 mb-2">
              <button className="btn btn-primary w-100 fw-bold" onClick={handleAdd}>Add</button>
            </div>
          </div>

          <hr />

          {/* table section to display skills */}
          <h5 className="fw-bold mt-4 mb-3">Current Skills</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{width: '8%'}}>S.No.</th>
                  <th scope="col" style={{width: '25%'}}>Skill Name</th>
                  <th scope="col" style={{width: '40%'}}>Description</th>
                  <th scope="col" style={{width: '20%'}} className="text-center">Action</th>
                  <th scope="col" style={{width: '7%'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, i) => (
                    <tr key={item._id}>
                      <td className="fw-bold">{i + 1}</td>
                      <td className="text-primary fw-bold">{item.name}</td>
                      <td>{item.description}</td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-outline-secondary me-2" 
                          onClick={() => handleEdit(item._id, item.name, item.description)}
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDelete(item._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No skills added yet. Add your first one above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AddSkills;