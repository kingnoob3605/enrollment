import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    // In a real app, you would send a request to your backend
    // For this demo, we're simulating a login with a timeout
    setTimeout(() => {
      // Simulate user verification logic
      // Here we're hardcoding some test users for demo purposes
      // In a real app, this would be handled by your backend API
      if (
        credentials.username === "admin" &&
        credentials.password === "admin123"
      ) {
        loginSuccess({ username: credentials.username, id: 1 }, "admin");
      } else if (
        credentials.username === "teacher" &&
        credentials.password === "teacher123"
      ) {
        loginSuccess({ username: credentials.username, id: 2 }, "teacher");
      } else if (
        credentials.username === "parent" &&
        credentials.password === "parent123"
      ) {
        loginSuccess({ username: credentials.username, id: 3 }, "parent");
      } else {
        setError("Invalid username or password");
        setIsLoading(false);
      }
    }, 1000);
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

  const loginSuccess = (user, role) => {
    // Call login function from context
    login(user, role);

    // Reset form and loading state
    setCredentials({
      username: "",
      password: "",
      rememberMe: false,
    });
    setIsLoading(false);
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
            <div className="form-group">
              <label htmlFor="fullName">Full Name*</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={registerData.fullName}
                onChange={handleRegisterInputChange}
                placeholder="Enter your full name"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address*</label>
              <input
                id="email"
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterInputChange}
                placeholder="Enter your email address"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registerUsername">Username*</label>
              <input
                id="registerUsername"
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleRegisterInputChange}
                placeholder="Choose a username"
                className="form-control"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="registerPassword">Password*</label>
                <input
                  id="registerPassword"
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterInputChange}
                  placeholder="Create a password"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterInputChange}
                  placeholder="Confirm your password"
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group terms-checkbox">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={registerData.agreeTerms}
                onChange={handleRegisterInputChange}
                required
              />
              <label htmlFor="agreeTerms">
                I agree to the <a href="#terms">Terms of Service</a> and{" "}
                <a href="#privacy">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Create Account"}
            </button>

            <div className="register-footer">
              <p>
                Already have an account?
                <button
                  type="button"
                  className="switch-tab"
                  onClick={() => setActiveTab("login")}
                >
                  Log in here
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
