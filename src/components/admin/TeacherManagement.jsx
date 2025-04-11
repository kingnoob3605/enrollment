import React, { useState } from "react";

const TeacherManagement = () => {
  // Mock data - in a real app, this would come from an API
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "John Doe",
      position: "Class Teacher",
      grade: "1",
      section: "A",
      email: "john.doe@school.edu",
      phone: "(123) 456-7890",
    },
    {
      id: 2,
      name: "Romyl S Magwate JR",
      position: "Class Teacher",
      grade: "2",
      section: "B",
      email: "jane.smith@school.edu",
      phone: "(123) 456-7891",
    },
    {
      id: 3,
      name: "Brendo Dellatan",
      position: "Subject Teacher",
      grade: null,
      section: null,
      email: "robert.johnson@school.edu",
      phone: "(123) 456-7892",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // New teacher form state
  const [formData, setFormData] = useState({
    name: "",
    position: "Class Teacher",
    grade: "",
    section: "",
    email: "",
    phone: "",
  });

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingTeacher) {
      // Update existing teacher
      const updatedTeachers = teachers.map((teacher) =>
        teacher.id === editingTeacher.id
          ? { ...formData, id: teacher.id }
          : teacher
      );
      setTeachers(updatedTeachers);
      setEditingTeacher(null);
    } else {
      // Add new teacher
      const newTeacher = {
        ...formData,
        id: Date.now(), // Generate a unique ID
      };
      setTeachers([...teachers, newTeacher]);
    }

    // Reset form and close it
    setFormData({
      name: "",
      position: "Class Teacher",
      grade: "",
      section: "",
      email: "",
      phone: "",
    });
    setShowAddForm(false);
  };

  // Start editing a teacher
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      position: teacher.position,
      grade: teacher.grade || "",
      section: teacher.section || "",
      email: teacher.email,
      phone: teacher.phone,
    });
    setShowAddForm(true);
  };

  // Delete a teacher
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      setTeachers(teachers.filter((teacher) => teacher.id !== id));
    }
  };

  return (
    <div className="teacher-management">
      <div className="panel-header">
        <h2>Teacher Management</h2>
        <button
          className="add-button"
          onClick={() => {
            setEditingTeacher(null);
            setFormData({
              name: "",
              position: "Class Teacher",
              grade: "",
              section: "",
              email: "",
              phone: "",
            });
            setShowAddForm(true);
          }}
        >
          Add New Teacher
        </button>
      </div>

      {showAddForm ? (
        <div className="teacher-form">
          <h3>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name*:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Position*:</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              >
                <option value="Class Teacher">Class Teacher</option>
                <option value="Subject Teacher">Subject Teacher</option>
                <option value="Department Head">Department Head</option>
              </select>
            </div>

            {formData.position === "Class Teacher" && (
              <div className="form-row">
                <div className="form-group">
                  <label>Grade*:</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    required={formData.position === "Class Teacher"}
                  >
                    <option value="">Select Grade</option>
                    <option value="1">Grade 1</option>
                    <option value="2">Grade 2</option>
                    <option value="3">Grade 3</option>
                    <option value="4">Grade 4</option>
                    <option value="5">Grade 5</option>
                    <option value="6">Grade 6</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Section*:</label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    required={formData.position === "Class Teacher"}
                  >
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email*:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone*:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingTeacher ? "Update Teacher" : "Add Teacher"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="teacher-list-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <table className="teachers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Grade & Section</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.name}</td>
                    <td>{teacher.position}</td>
                    <td>
                      {teacher.grade && teacher.section
                        ? `Grade ${teacher.grade}, Section ${teacher.section}`
                        : "N/A"}
                    </td>
                    <td>{teacher.email}</td>
                    <td>{teacher.phone}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
