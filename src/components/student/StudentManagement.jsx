import React, { useState, useEffect } from "react";
import StudentProfile from "./StudentProfile";
import EnrollmentForm from "../teacher/EnrollmentForm";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
      const gender = Math.random() > 0.5 ? "Male" : "Female";

      // Generate health metrics appropriate for grade 1 students
      const height =
        gender === "Male"
          ? Math.floor(Math.random() * 15) + 110 // 110-125 cm for boys
          : Math.floor(Math.random() * 15) + 108; // 108-123 cm for girls

      const weight =
        gender === "Male"
          ? Math.floor(Math.random() * 10) + 18 // 18-28 kg for boys
          : Math.floor(Math.random() * 10) + 17; // 17-27 kg for girls

      // Calculate BMI
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

      // Determine nutritional status based on BMI
      let nutritionalStatus;
      if (bmi < 14) nutritionalStatus = "Severely Underweight";
      else if (bmi < 15) nutritionalStatus = "Underweight";
      else if (bmi < 18.5) nutritionalStatus = "Normal";
      else if (bmi < 21) nutritionalStatus = "Overweight";
      else nutritionalStatus = "Obese";

      students.push({
        id: i + 1,
        name: getRandomName(),
        grade: "1", // Focus on Grade 1
        section: section,
        gender: gender,
        lrn: generateRandomLRN(),
        status: "Enrolled",
        dateEnrolled: "07/29/24",
        teacherAssigned: `Teacher ${section}`, // Each section has a designated teacher
        health: {
          height: height,
          weight: weight,
          bmi: bmi,
          nutritionalStatus: nutritionalStatus,
          vision: Math.random() > 0.9 ? "Needs Correction" : "Normal",
          hearing: Math.random() > 0.97 ? "Needs Assistance" : "Normal",
          vaccinations: Math.random() > 0.92 ? "Incomplete" : "Complete",
          dentalHealth: Math.random() > 0.8 ? "Needs Attention" : "Good",
        },
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
  const [showCharts, setShowCharts] = useState(true);

  // Prepare data for charts
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [bmiData, setBmiData] = useState([]);

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  // Update chart data when students data changes
  useEffect(() => {
    if (students && students.length > 0) {
      // Prepare enrollment by section data
      const sectionCounts = {};
      grade1Sections.forEach((section) => {
        sectionCounts[section] = 0;
      });

      students.forEach((student) => {
        if (sectionCounts.hasOwnProperty(student.section)) {
          sectionCounts[student.section]++;
        }
      });

      const sectionData = Object.keys(sectionCounts).map((section) => ({
        name: `Section ${section}`,
        students: sectionCounts[section],
      }));

      setEnrollmentData(sectionData);

      // Prepare gender distribution data
      const maleCount = students.filter((s) => s.gender === "Male").length;
      const femaleCount = students.filter((s) => s.gender === "Female").length;

      setGenderData([
        { name: "Male", value: maleCount },
        { name: "Female", value: femaleCount },
      ]);

      // Calculate BMI categories
      const bmiCategories = {
        "Severely Underweight": 0,
        Underweight: 0,
        Normal: 0,
        Overweight: 0,
        Obese: 0,
      };

      students.forEach((student) => {
        if (student.health && student.health.nutritionalStatus) {
          bmiCategories[student.health.nutritionalStatus]++;
        }
      });

      setBmiData(
        Object.keys(bmiCategories).map((category) => ({
          name: category,
          value: bmiCategories[category],
        }))
      );
    }
  }, [students]);

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
        <div className="panel-actions">
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
          {!showAddForm && !selectedStudent && (
            <button
              className="view-button"
              onClick={() => setShowCharts(!showCharts)}
            >
              {showCharts ? "Hide Charts" : "Show Charts"}
            </button>
          )}
        </div>
      </div>

      {/* Grade 1 Dashboard Summary */}
      {!showAddForm && !selectedStudent && (
        <div className="dashboard-summary">
          <div className="summary-stats">
            <div className="stat-box">
              <h4>Total Grade 1 Students</h4>
              <p className="stat-value">{totalStudents}</p>
            </div>
            <div className="stat-box">
              <h4>Male Students</h4>
              <p className="stat-value">
                {students.filter((s) => s.gender === "Male").length}
              </p>
            </div>
            <div className="stat-box">
              <h4>Female Students</h4>
              <p className="stat-value">
                {students.filter((s) => s.gender === "Female").length}
              </p>
            </div>
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
                  <p className="section-count">
                    {studentsBySection[section] || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Charts */}
          {showCharts && (
            <div className="dashboard-charts">
              <div className="charts-row">
                <div className="chart-container">
                  <h4>Enrollment by Section</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={enrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" fill="#8884d8" name="Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h4>Gender Distribution</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {genderData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Students"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-container">
                <h4>Nutritional Status (BMI Categories)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bmiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
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

      {/* Add CSS for the charts layout */}
      <style jsx="true">{`
        .panel-actions {
          display: flex;
          gap: 1rem;
        }

        .dashboard-charts {
          margin-top: 2rem;
        }

        .charts-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .chart-container {
          flex: 1;
          min-width: 300px;
          background-color: var(--bg-secondary, white);
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: var(--box-shadow, 0 2px 5px rgba(0, 0, 0, 0.1));
          margin-bottom: 1.5rem;
        }

        .chart-container h4 {
          margin-bottom: 1rem;
          color: var(--text-secondary, #7f8c8d);
          text-align: center;
        }

        @media (max-width: 768px) {
          .charts-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentManagement;
