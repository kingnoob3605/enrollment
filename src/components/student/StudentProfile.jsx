import React, { useState } from "react";

const StudentProfile = ({ student, onClose, viewOnly = false }) => {
  // In a real app, you would fetch detailed student data
  // Here we're using mock data based on the student prop
  const [studentData, setStudentData] = useState({
    ...student,
    birthdate: "2015-05-15",
    gender: "Male",
    address: "123 Main St, City",
    parent: "Ana Amari",
    contact: "(123) 456-7890",
    email: "parent@example.com",
    health: {
      height: 125,
      weight: 28,
      bmi: 17.9,
      vision: "Normal",
      hearing: "Normal",
      vaccinations: "Complete",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...studentData });

  // Handle changes in edit form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  // Handle changes in health section of edit form
  const handleHealthChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      health: {
        ...editData.health,
        [name]: value,
      },
    });
  };

  // Calculate BMI
  const calculateBMI = () => {
    if (editData.health.height && editData.health.weight) {
      const heightInMeters = editData.health.height / 100;
      return (
        editData.health.weight /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
    }
    return "";
  };

  // Save edited student data
  const handleSave = () => {
    // Calculate BMI before saving
    const bmi = calculateBMI();
    const updatedData = {
      ...editData,
      health: {
        ...editData.health,
        bmi,
      },
    };

    setStudentData(updatedData);
    setIsEditing(false);
    // In a real app, you would send updated data to your backend
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData({ ...studentData });
    setIsEditing(false);
  };

  return (
    <div className="student-profile">
      <div className="profile-header">
        <h2>{studentData.name}'s Profile</h2>
        {onClose && (
          <button onClick={onClose} className="close-button">
            Close
          </button>
        )}
      </div>

      {isEditing ? (
        // Edit form
        <div className="profile-edit-form">
          <div className="form-sections">
            <div className="form-section">
              <h3>Personal Information (SF1)</h3>

              <div className="form-group">
                <label>LRN:</label>
                <input
                  type="text"
                  name="lrn"
                  value={editData.lrn}
                  onChange={handleChange}
                  disabled // LRN should not be editable
                />
              </div>

              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Grade:</label>
                  <select
                    name="grade"
                    value={editData.grade}
                    onChange={handleChange}
                  >
                    <option value="1">Grade 1</option>
                    <option value="2">Grade 2</option>
                    <option value="3">Grade 3</option>
                    <option value="4">Grade 4</option>
                    <option value="5">Grade 5</option>
                    <option value="6">Grade 6</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Section:</label>
                  <select
                    name="section"
                    value={editData.section}
                    onChange={handleChange}
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Birth Date:</label>
                <input
                  type="date"
                  name="birthdate"
                  value={editData.birthdate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={editData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address:</label>
                <textarea
                  name="address"
                  value={editData.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Parent/Guardian:</label>
                <input
                  type="text"
                  name="parent"
                  value={editData.parent}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Contact Number:</label>
                <input
                  type="text"
                  name="contact"
                  value={editData.contact}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Health Information (SF8)</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Height (cm):</label>
                  <input
                    type="number"
                    name="height"
                    value={editData.health.height}
                    onChange={handleHealthChange}
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label>Weight (kg):</label>
                  <input
                    type="number"
                    name="weight"
                    value={editData.health.weight}
                    onChange={handleHealthChange}
                    step="0.1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>BMI:</label>
                <input type="text" value={calculateBMI()} readOnly disabled />
              </div>

              <div className="form-group">
                <label>Vision:</label>
                <select
                  name="vision"
                  value={editData.health.vision}
                  onChange={handleHealthChange}
                >
                  <option value="Normal">Normal</option>
                  <option value="Needs Correction">Needs Correction</option>
                </select>
              </div>

              <div className="form-group">
                <label>Hearing:</label>
                <select
                  name="hearing"
                  value={editData.health.hearing}
                  onChange={handleHealthChange}
                >
                  <option value="Normal">Normal</option>
                  <option value="Needs Assistance">Needs Assistance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Vaccinations:</label>
                <select
                  name="vaccinations"
                  value={editData.health.vaccinations}
                  onChange={handleHealthChange}
                >
                  <option value="Complete">Complete</option>
                  <option value="Incomplete">Incomplete</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button onClick={handleSave} className="save-button">
              Save Changes
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // View-only profile
        <div className="profile-sections">
          <div className="profile-section">
            <h3>Personal Information (SF1)</h3>
            <div className="profile-details">
              <div className="detail-item">
                <label>LRN:</label>
                <span>{studentData.lrn}</span>
              </div>
              <div className="detail-item">
                <label>Name:</label>
                <span>{studentData.name}</span>
              </div>
              <div className="detail-item">
                <label>Grade & Section:</label>
                <span>
                  Grade {studentData.grade}, Section {studentData.section}
                </span>
              </div>
              <div className="detail-item">
                <label>Birth Date:</label>
                <span>{studentData.birthdate}</span>
              </div>
              <div className="detail-item">
                <label>Gender:</label>
                <span>{studentData.gender}</span>
              </div>
              <div className="detail-item">
                <label>Address:</label>
                <span>{studentData.address}</span>
              </div>
              <div className="detail-item">
                <label>Parent/Guardian:</label>
                <span>{studentData.parent}</span>
              </div>
              <div className="detail-item">
                <label>Contact Number:</label>
                <span>{studentData.contact}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{studentData.email}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Health Information (SF8)</h3>
            <div className="profile-details">
              <div className="detail-item">
                <label>Height (cm):</label>
                <span>{studentData.health.height}</span>
              </div>
              <div className="detail-item">
                <label>Weight (kg):</label>
                <span>{studentData.health.weight}</span>
              </div>
              <div className="detail-item">
                <label>BMI:</label>
                <span>{studentData.health.bmi}</span>
              </div>
              <div className="detail-item">
                <label>Vision:</label>
                <span>{studentData.health.vision}</span>
              </div>
              <div className="detail-item">
                <label>Hearing:</label>
                <span>{studentData.health.hearing}</span>
              </div>
              <div className="detail-item">
                <label>Vaccinations:</label>
                <span>{studentData.health.vaccinations}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isEditing && !viewOnly && (
        <div className="profile-actions">
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit Information
          </button>
          <button className="print-button">Print Profile</button>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
