import React, { useState } from "react";
import StudentProfile from "./StudentProfile";
import EnrollmentForm from "../teacher/EnrollmentForm";

const StudentManagement = ({ userType }) => {
  // Mock data - in a real app, this would come from an API
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Depamaylo Angelo",
      grade: "1",
      section: "A",
      lrn: "123456789012",
      status: "Enrolled",
    },
    {
      id: 2,
      name: "Shamir Rasul",
      grade: "1",
      section: "B",
      lrn: "123456789013",
      status: "Enrolled",
    },
    {
      id: 3,
      name: "Jerico Devino",
      grade: "2",
      section: "A",
      lrn: "123456789014",
      status: "Enrolled",
    },
    {
      id: 4,
      name: "Magwate Romyl",
      grade: "2",
      section: "B",
      lrn: "123456789015",
      status: "Enrolled",
    },
    {
      id: 5,
      name: "Brendo Dellatan",
      grade: "3",
      section: "A",
      lrn: "123456789016",
      status: "Enrolled",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterGrade, setFilterGrade] = useState("");
  const [filterSection, setFilterSection] = useState("");

  // Filter students based on search term and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lrn.includes(searchTerm);
    const matchesGrade = filterGrade ? student.grade === filterGrade : true;
    const matchesSection = filterSection
      ? student.section === filterSection
      : true;

    return matchesSearch && matchesGrade && matchesSection;
  });

  // Handle adding a new student
  const handleAddStudent = (newStudent) => {
    const studentWithId = {
      ...newStudent,
      id: students.length + 1,
      status: "Enrolled",
    };

    setStudents([...students, studentWithId]);
    setShowAddForm(false);
  };

  return (
    <div className="student-management">
      <div className="panel-header">
        <h2>Student Management</h2>
        {(userType === "admin" || userType === "teacher") && (
          <button
            className="add-button"
            onClick={() => {
              setSelectedStudent(null);
              setShowAddForm(true);
            }}
          >
            Add New Student
          </button>
        )}
      </div>

      {showAddForm ? (
        <EnrollmentForm
          onClose={() => setShowAddForm(false)}
          onSave={handleAddStudent}
        />
      ) : selectedStudent ? (
        <StudentProfile
          student={students.find((s) => s.id === selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          viewOnly={userType === "parent"}
        />
      ) : (
        <div className="student-list-container">
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or LRN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-controls">
              <div className="filter-group">
                <label>Grade:</label>
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Section:</label>
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>
          </div>

          <table className="students-table">
            <thead>
              <tr>
                <th>LRN</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Section</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.lrn}</td>
                    <td>{student.name}</td>
                    <td>{student.grade}</td>
                    <td>{student.section}</td>
                    <td>{student.status}</td>
                    <td>
                      <button
                        onClick={() => setSelectedStudent(student.id)}
                        className="view-button"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No students found
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

export default StudentManagement;
