import React, { useState } from "react";
import TeacherManagement from "./TeacherManagement";
import StudentManagement from "../student/StudentManagement";
import Reports from "./Reports";
import Settings from "./Settings";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("students");

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Admin Dashboard</h3>
        <ul className="nav-menu">
          <li
            className={activeTab === "students" ? "active" : ""}
            onClick={() => setActiveTab("students")}
          >
            Student Management
          </li>
          <li
            className={activeTab === "teachers" ? "active" : ""}
            onClick={() => setActiveTab("teachers")}
          >
            Teacher Management
          </li>
          <li
            className={activeTab === "reports" ? "active" : ""}
            onClick={() => setActiveTab("reports")}
          >
            Reports
          </li>
          <li
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            System Settings
          </li>
        </ul>
      </div>

      <div className="content">
        {activeTab === "students" && <StudentManagement userType="admin" />}
        {activeTab === "teachers" && <TeacherManagement />}
        {activeTab === "reports" && <Reports />}
        {activeTab === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default AdminDashboard;
