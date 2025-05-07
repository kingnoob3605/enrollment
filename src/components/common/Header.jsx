import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../App"; // Import directly from App.jsx

const Header = () => {
  const { currentUser, userType, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="header">
      <div className="logo">
        <h1>Elementary School Learners Profile Management System</h1>
      </div>

      {currentUser && (
        <div className="user-info">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title="Toggle theme"
          >
            {theme === "light" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="moon-icon"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="sun-icon"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <span>
            Logged in as: {currentUser.username} ({userType})
          </span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
