import React, { useState, useEffect } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Login from "./components/auth/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import ParentDashboard from "./components/parent/ParentDashboard";
import "./assets/styles/index.css";
import "./assets/styles/login.css";
import "./assets/styles/dashboard.css";
import "./assets/styles/forms.css";
import "./assets/styles/tables.css";
import "./assets/styles/responsive.css";
import "./assets/styles/utilities.css";

function App() {
  // State for user authentication
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedUserType = localStorage.getItem("userType");

    if (savedUser && savedUserType) {
      setCurrentUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }

    setLoading(false);
  }, []);

  // Login
  const login = (user, type) => {
    setCurrentUser(user);
    setUserType(type);

    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("userType", type);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setUserType(null);

    // Clear localStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userType");
  };

  // Show loading indicator while checking localStorage
  if (loading) {
    return (
      <div className="loading-overlay">
        <div>
          <div className="loader"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, show login screen
  if (!currentUser) {
    return (
      <div className="app">
        <AuthContext.Provider value={{ currentUser, userType, login, logout }}>
          <Login />
        </AuthContext.Provider>
      </div>
    );
  }

  // Render appropriate dashboard based on user type
  return (
    <div className="app">
      <AuthContext.Provider value={{ currentUser, userType, login, logout }}>
        <Header />
        <main className="main-content">
          {userType === "admin" && <AdminDashboard />}
          {userType === "teacher" && <TeacherDashboard />}
          {userType === "parent" && <ParentDashboard />}
        </main>
        <Footer />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
