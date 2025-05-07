import React, { useState, useEffect } from "react";
import StudentProfile from "./StudentProfile";
import EnrollmentForm from "../teacher/EnrollmentForm";

// Helper function to generate random LRN (12 digits)
const generateRandomLRN = () => {
  let lrn = "";
  for (let i = 0; i < 12; i++) {
    lrn += Math.floor(Math.random() * 10);
  }
  return lrn;
};

// Helper to generate random Filipino names
const getRandomName = () => {
  const firstNames = [
    "Miguel",
    "Sofia",
    "Juan",
    "Maria",
    "Gabriel",
    "Isabella",
    "Rafael",
    "Camila",
    "Antonio",
    "Mariana",
    "Jose",
    "Angela",
    "Carlos",
    "Gabriela",
    "Andres",
    "Ana",
    "Francisco",
    "Elena",
    "Luis",
    "Beatriz",
    "Eduardo",
    "Bianca",
    "Manuel",
    "Carmen",
    "Emilio",
    "Rosario",
    "Fernando",
    "Teresa",
  ];

  const lastNames = [
    "Santos",
    "Reyes",
    "Cruz",
    "Bautista",
    "Ramos",
    "Mendoza",
    "Flores",
    "Rivera",
    "Aquino",
    "Garcia",
    "Torres",
    "Gonzales",
    "Diaz",
    "Castro",
    "Rodriguez",
    "Rosario",
    "Fernandez",
    "Morales",
    "Del Rosario",
    "Gomez",
    "Perez",
    "Hernandez",
    "Villanueva",
    "De Guzman",
    "Domingo",
    "Santiago",
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
};

const StudentManagement = ({ userType }) => {
  // Define Grade 1 sections - assuming there are 15 teachers managing these sections
  const grade1Sections = ["A", "B", "C", "D", "E"];

  // Generate random students for Grade 1 sections
  const generateGrade1Students = (count) => {
    const students = [];

    // Generate students distributed across Grade 1 sections
    for (let i = 0; i < count; i++) {
      const section =
        grade1Sections[Math.floor(Math.random() * grade1Sections.length)];

      students.push({
        id: i + 1,
        name: getRandomName(),
        grade: "1", // Focus on Grade 1
        section: section,
        lrn: generateRandomLRN(),
        status: "Enrolled",
        dateEnrolled: "07/29/24",
        teacherAssigned: `Teacher ${section}`, // Each section has a designated teacher
      });
    }

    return students;
  };

  // State for students (focusing on Grade 1 with more students)
  const [students, setStudents] = useState(generateGrade1Students(50)); // More students for Grade 1
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterSection, setFilterSection] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Get list of teachers for filtering
  const teachers = Array.from(
    new Set(students.map((student) => student.teacherAssigned))
  );

  // Filter students based on search term and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lrn.includes(searchTerm);
    const matchesSection = filterSection
      ? student.section === filterSection
      : true;
    const matchesTeacher = filterTeacher
      ? student.teacherAssigned === filterTeacher
      : true;
    const matchesStatus = filterStatus ? student.status === filterStatus : true;

    return matchesSearch && matchesSection && matchesTeacher && matchesStatus;
  });

  // Handle adding a new student
  const handleAddStudent = (newStudent) => {
    const studentWithId = {
      ...newStudent,
      id: students.length + 1,
      status: "Enrolled",
      dateEnrolled: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      }),
      teacherAssigned: `Teacher ${newStudent.section}`,
    };

    setStudents([...students, studentWithId]);
    setShowAddForm(false);
  };

  // Get counts for dashboard
  const totalStudents = students.length;
  const studentsBySection = {};
  grade1Sections.forEach((section) => {
    studentsBySection[section] = students.filter(
      (s) => s.section === section
    ).length;
  });

  return (
    <div className="student-management">
      <div className="panel-header">
        <h2>Grade 1 Student Management</h2>
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

      {/* Grade 1 Dashboard Summary */}
      {!showAddForm && !selectedStudent && (
        <div className="dashboard-summary">
          <div className="stat-box">
            <h4>Total Grade 1 Students</h4>
            <p className="stat-value">{totalStudents}</p>
          </div>

          <div className="section-summary">
            <h4>Students by Section</h4>
            <div className="section-grid">
              {grade1Sections.map((section) => (
                <div
                  key={section}
                  className="section-card"
                  onClick={() => setFilterSection(section)}
                >
                  <h5>Section {section}</h5>
                  <p className="section-count">{studentsBySection[section]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddForm ? (
        <EnrollmentForm
          onClose={() => setShowAddForm(false)}
          onSave={handleAddStudent}
          defaultGrade="1" // Default to Grade 1
          sections={grade1Sections} // Only show Grade 1 sections
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
                <label>Section:</label>
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                >
                  <option value="">All Sections</option>
                  {grade1Sections.map((section) => (
                    <option key={section} value={section}>
                      Section {section}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Teacher:</label>
                <select
                  value={filterTeacher}
                  onChange={(e) => setFilterTeacher(e.target.value)}
                >
                  <option value="">All Teachers</option>
                  {teachers.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Promoted">Promoted</option>
                  <option value="Transferred">Transferred</option>
                </select>
              </div>
            </div>
          </div>

          <table className="students-table">
            <thead>
              <tr>
                <th>LRN</th>
                <th>Name</th>
                <th>Section</th>
                <th>Teacher</th>
                <th>Date</th>
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
                    <td>1-{student.section}</td>
                    <td>{student.teacherAssigned}</td>
                    <td>{student.dateEnrolled}</td>
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
                  <td colSpan="7" className="no-results">
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
