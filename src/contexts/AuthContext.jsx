import React, { createContext } from "react";

// Create context
export const AuthContext = createContext({
  currentUser: null,
  userType: null,
  login: () => {},
  logout: () => {},
});

// Note: We're no longer using the AuthProvider component
// Instead, we're providing the context directly in App.jsx
