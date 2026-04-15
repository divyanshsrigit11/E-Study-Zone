import React from 'react'

const AddContent = () => {
  return (
    <div className="m-5 container-fluid">
      <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Add Skills
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Action</a>
      </div>
    </div>

    <div class="input-group mb-3">
      <input type="file" class="form-control" id="inputGroupFile02" />
      <label class="input-group-text" for="inputGroupFile02">Upload</label>
    </div>



    </div>
  )
}

export default AddContent