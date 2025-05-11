import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import StudentProfile from "./StudentProfile";
import EnrollmentForm from "../teacher/EnrollmentForm";
import printStudentProfile from "../../utils/printStudentProfile";
import exportStudentListToExcel from "../../utils/exportStudentListToExcel";
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
import apiService from "../../utils/api";

const StudentManagement = ({ userType }) => {
  // Get the current user context to access teacher section
  const { currentUser } = useContext(AuthContext);

  // Define Grade 1 sections
  const grade1Sections = ["A", "B", "C", "D", "E"];

  // State for students
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterSection, setFilterSection] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showCharts, setShowCharts] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [studentsBySection, setStudentsBySection] = useState({});

  // Chart data
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

  // Set initial filter section based on teacher's assigned section
  useEffect(() => {
    if (userType === "teacher" && currentUser && currentUser.section) {
      setFilterSection(currentUser.section);
    }
  }, [userType, currentUser]);

  // Load students data
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        // Build filter object
        const filters = {};

        if (searchTerm) filters.search = searchTerm;

        // For teachers, always filter by their section
        if (userType === "teacher" && currentUser && currentUser.section) {
          filters.section = currentUser.section;
        } else if (filterSection) {
          filters.section = filterSection;
        }

        if (filterTeacher) filters.teacher = filterTeacher;
        if (filterStatus) filters.status = filterStatus;

        // Get students from API
        const response = await apiService.getStudents(filters);
        setStudents(response.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [
    searchTerm,
    filterSection,
    filterTeacher,
    filterStatus,
    userType,
    currentUser,
  ]);

  // Load dashboard metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Get section filter
        const section =
          userType === "teacher" && currentUser && currentUser.section
            ? currentUser.section
            : filterSection;

        // Get metrics
        const response = await apiService.getStudentMetrics(section);

        // Update state with metrics
        setTotalStudents(response.data.totalStudents);

        // Create studentsBySection object
        const sectionData = {};
        response.data.studentsBySection.forEach((item) => {
          sectionData[item.section] = item.count;
        });
        setStudentsBySection(sectionData);

        // Update chart data
        setEnrollmentData(
          response.data.studentsBySection.map((item) => ({
            name: `Section ${item.section}`,
            students: item.count,
          }))
        );

        setGenderData(response.data.genderDistribution);
        setBmiData(response.data.nutritionalStatus);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, [filterSection, userType, currentUser]);

  // Handle adding a new student
  const handleAddStudent = async (newStudent) => {
    try {
      // Ensure teacher section rule is enforced
      if (userType === "teacher" && currentUser && currentUser.section) {
        if (newStudent.section !== currentUser.section) {
          alert(
            `As a teacher for Section ${currentUser.section}, you can only add students to your section.`
          );
          return;
        }
      }

      // Create student via API
      await apiService.createStudent(newStudent);

      // Refresh student list
      const response = await apiService.getStudents({
        section:
          userType === "teacher" && currentUser && currentUser.section
            ? currentUser.section
            : filterSection,
      });

      setStudents(response.data.students);
      setShowAddForm(false);

      // Refresh metrics
      const metricsResponse = await apiService.getStudentMetrics(
        userType === "teacher" && currentUser && currentUser.section
          ? currentUser.section
          : filterSection
      );

      setTotalStudents(metricsResponse.data.totalStudents);

      alert("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      alert(
        "Error adding student: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  // Handle viewing a student profile
  const handleViewStudent = async (id) => {
    try {
      const response = await apiService.getStudent(id);
      setSelectedStudent(response.data.student.id);
    } catch (error) {
      console.error("Error fetching student:", error);
      alert("Error loading student profile");
    }
  };

  // Handle printing student profile
  const handlePrintStudentProfile = () => {
    if (!selectedStudent) return;

    try {
      const student = students.find((s) => s.id === selectedStudent);
      if (!student) return;

      // Use the imported utility function
      printStudentProfile(student);
    } catch (error) {
      console.error("Error printing profile:", error);
      alert("Error printing student profile");
    }
  };

  // Handle Excel export
  const handleExportToExcel = () => {
    try {
      // Prepare school info
      const schoolInfo = {
        schoolName: "Elementary School Learners Profile System",
        schoolId: "12345",
        division: "Zamboanga City",
        district: "District 1",
        schoolYear: "2024-2025",
      };

      // Get the section - for teachers, use their assigned section, for admin, use the filter
      const sectionToExport =
        userType === "teacher" && currentUser && currentUser.section
          ? currentUser.section
          : filterSection || "All";

      // Get students to export - filter by section if needed
      const studentsToExport = sectionToExport !== "All" ? students : students;

      // Process students to include all necessary fields
      const processedStudents = studentsToExport.map((student) => {
        // Calculate age from birthdate if available
        let age = "";
        if (student.birthdate) {
          const birthDate = new Date(student.birthdate);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
        }

        // Return processed student with all fields needed for SF1
        return {
          ...student,
          age,
          motherTongue: "Filipino", // Default
          religion: "Catholic", // Default
          motherName: "", // These fields may not be in your data
          ip: "", // Defaults or empty
        };
      });

      // Call the export function
      exportStudentListToExcel(
        processedStudents,
        schoolInfo,
        sectionToExport,
        "1" // Grade level
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting student data");
    }
  };

  // Get list of teachers for filtering
  const teachers = Array.from(
    new Set(students.map((student) => student.teacher_assigned))
  ).filter(Boolean);

  return (
    <div className="student-management">
      <div className="panel-header">
        <h2>
          {userType === "teacher" && currentUser && currentUser.section
            ? `Grade 1 Section ${currentUser.section} Student Management`
            : "Grade 1 Student Management"}
        </h2>
        <div className="panel-actions">
          {(userType === "admin" || userType === "teacher") && (
            <button
              className="action-btn add-button"
              onClick={() => {
                setSelectedStudent(null);
                setShowAddForm(true);
              }}
            >
              Add New Student
            </button>
          )}
          {!showAddForm && !selectedStudent && (
            <>
              <button
                className="action-btn view-button"
                onClick={() => setShowCharts(!showCharts)}
              >
                {showCharts ? "Hide Charts" : "Show Charts"}
              </button>
              {/* Excel export button */}
              {(userType === "admin" || userType === "teacher") && (
                <button
                  className="action-btn export-button"
                  onClick={handleExportToExcel}
                >
                  Export to SF1 Excel
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="loader"></div>
          <p className="loading-text">Loading student data...</p>
        </div>
      ) : (
        <>
          {/* Grade 1 Dashboard Summary */}
          {!showAddForm && !selectedStudent && (
            <div className="dashboard-summary">
              <div className="summary-stats">
                <div className="stat-box">
                  <h4>
                    {userType === "teacher" &&
                    currentUser &&
                    currentUser.section
                      ? `Total Section ${currentUser.section} Students`
                      : "Total Grade 1 Students"}
                  </h4>
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

              {/* Only show section breakdown for admins or all teachers */}
              {(userType === "admin" ||
                (userType === "teacher" &&
                  (!currentUser || !currentUser.section))) && (
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
              )}

              {/* Dashboard Charts */}
              {showCharts && (
                <div className="dashboard-charts">
                  <div className="charts-row">
                    <div className="chart-container">
                      <h4>
                        {userType === "teacher" &&
                        currentUser &&
                        currentUser.section
                          ? `Section ${currentUser.section} Enrollment`
                          : "Enrollment by Section"}
                      </h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={enrollmentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="students"
                            fill="#8884d8"
                            name="Students"
                          />
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
              sections={
                userType === "teacher" && currentUser && currentUser.section
                  ? [currentUser.section] // Teacher can only add to their section
                  : grade1Sections // Admin can add to any section
              }
            />
          ) : selectedStudent ? (
            <>
              <StudentProfile
                student={students.find((s) => s.id === selectedStudent)}
                onClose={() => setSelectedStudent(null)}
                viewOnly={userType === "parent"}
              />
              {userType === "teacher" && (
                <div className="profile-actions" style={{ marginTop: "10px" }}>
                  <button
                    onClick={handlePrintStudentProfile}
                    className="print-button"
                  >
                    Print Detailed Profile
                  </button>
                </div>
              )}
            </>
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
                  {/* Only show section filter if not a teacher or teacher doesn't have a section */}
                  {(userType !== "teacher" ||
                    !currentUser ||
                    !currentUser.section) && (
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
                  )}

                  {/* Only show teacher filter if not a teacher or teacher doesn't have a section */}
                  {(userType !== "teacher" ||
                    !currentUser ||
                    !currentUser.section) &&
                    teachers.length > 0 && (
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
                    )}

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
                  {students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.lrn}</td>
                        <td>{student.name}</td>
                        <td>
                          {student.grade}-{student.section}
                        </td>
                        <td>{student.teacher_assigned}</td>
                        <td>
                          {student.date_enrolled
                            ? new Date(
                                student.date_enrolled
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>{student.status}</td>
                        <td>
                          <button
                            onClick={() => handleViewStudent(student.id)}
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
        </>
      )}
    </div>
  );
};

export default StudentManagement;
