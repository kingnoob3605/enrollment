import React, { createContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext({
  currentUser: null,
  userType: null,
  login: () => {},
  logout: () => {},
});

// Note: We're using the AuthProvider component now
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [userType, setUserType] = useState(() => {
    return localStorage.getItem("userType") || null;
  });

  // Login function - updated to work with our API
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
    localStorage.removeItem("token");
  };

  // Provide the context to children
  return (
    <AuthContext.Provider value={{ currentUser, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
