import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../utils/api";
import apiService from "../../utils/api";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register'
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials({
      ...credentials,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegisterInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData({
      ...registerData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      // Call the API to login using apiService
      const response = await apiService.login({
        username: credentials.username,
        password: credentials.password,
      });

      // If login is successful
      const { user, userType, token } = response.data;

      // Call the login function from context
      login(user, userType);

      // Store the token
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (
      !registerData.fullName ||
      !registerData.email ||
      !registerData.username ||
      !registerData.password
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!registerData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    // In a real app, you would send a registration request to your backend
    // For this demo, we're just showing a success message and switching to login
    setTimeout(() => {
      setIsLoading(false);
      setActiveTab("login");
      // Show success notification (in a real app)
      alert(
        "Registration successful! You can now log in with your credentials."
      );

      // Reset form
      setRegisterData({
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
      });
    }, 1500);
  };

  const forgotPassword = () => {
    // In a real app, this would redirect to a password recovery page
    alert("Password recovery functionality would be implemented here.");
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <h2>Elementary School Learners Profile System</h2>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`login-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <input
                id="username"
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Enter your username or email"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="form-control"
              />
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={credentials.rememberMe}
                  onChange={handleInputChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>

              <button
                type="button"
                className="forgot-password"
                onClick={forgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            <div className="login-help">
              <p className="login-hint">
                <strong>Demo Accounts:</strong>
              </p>
              <ul className="demo-accounts">
                <li>
                  <strong>Admin:</strong> admin / admin123
                </li>
                <li>
                  <strong>Teacher A:</strong> teachera / teachera123
                </li>
                <li>
                  <strong>Teacher B:</strong> teacherb / teacherb123
                </li>
                <li>
                  <strong>Teacher C:</strong> teacherc / teacherc123
                </li>
                <li>
                  <strong>Teacher D:</strong> teacherd / teacherd123
                </li>
                <li>
                  <strong>Teacher E:</strong> teachere / teachere123
                </li>
                <li>
                  <strong>Parent:</strong> parent / parent123
                </li>
              </ul>
            </div>

            <div className="login-footer">
              <p>
                Don't have an account?
                <button
                  type="button"
                  className="switch-tab"
                  onClick={() => setActiveTab("register")}
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="register-form">
            {/* Registration form content - keep as is */}
            {/* ... */}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
