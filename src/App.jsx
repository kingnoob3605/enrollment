import React, { useState, useEffect, createContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Login from "./components/auth/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import ParentDashboard from "./components/parent/ParentDashboard";

// Import styles
import "./assets/styles/index.css";
import "./assets/styles/forms.css";
import "./assets/styles/tables.css";
import "./assets/styles/dashboard.css";
import "./assets/styles/utilities.css";
import "./assets/styles/responsive.css";
import "./assets/styles/theme.css"; // Add theme styles
import "./assets/styles/login.css"; // Login styles should be last

// Create theme context directly in App.jsx
export const ThemeContext = createContext();

function App() {
  // State for user authentication
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      return newTheme;
    });
  };

  // Save theme preference to localStorage and apply theme class to body
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme + "-theme";
  }, [theme]);

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

  // Provide both contexts in a single component
  return (
    <div className="app">
      <AuthContext.Provider value={{ currentUser, userType, login, logout }}>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          {!currentUser ? (
            <Login />
          ) : (
            <>
              <Header />
              <main className="main-content">
                {userType === "admin" && <AdminDashboard />}
                {userType === "teacher" && <TeacherDashboard />}
                {userType === "parent" && <ParentDashboard />}
              </main>
              <Footer />
            </>
          )}
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
