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

    // Get teacher data from localStorage if available
    let teacherAccounts = [];
    try {
      const savedTeachers = localStorage.getItem("teacherData");
      if (savedTeachers) {
        const teachers = JSON.parse(savedTeachers);
        // Create login accounts for each teacher
        teacherAccounts = teachers.map((teacher) => ({
          username: `teacher${teacher.section.toLowerCase()}`,
          password: `teacher${teacher.section.toLowerCase()}123`,
          id: teacher.id,
          name: teacher.name,
          section: teacher.section,
        }));
      }
    } catch (error) {
      console.error("Error loading teacher data:", error);
      // If there's an error, use default teacher accounts
      teacherAccounts = [
        {
          username: "teachera",
          password: "teachera123",
          id: 1,
          name: "Maria Santos",
          section: "A",
        },
        {
          username: "teacherb",
          password: "teacherb123",
          id: 2,
          name: "Juan Dela Cruz",
          section: "B",
        },
        {
          username: "teacherc",
          password: "teacherc123",
          id: 3,
          name: "Ana Reyes",
          section: "C",
        },
        {
          username: "teacherd",
          password: "teacherd123",
          id: 4,
          name: "Pedro Lim",
          section: "D",
        },
        {
          username: "teachere",
          password: "teachere123",
          id: 5,
          name: "Sofia Garcia",
          section: "E",
        },
      ];
    }

    // Default admin and parent accounts
    const defaultAccounts = [
      { username: "admin", password: "admin123", role: "admin", id: 100 },
      { username: "parent", password: "parent123", role: "parent", id: 200 },
    ];

    // Combine teacher accounts and default accounts
    const allAccounts = [
      ...defaultAccounts,
      ...teacherAccounts.map((t) => ({ ...t, role: "teacher" })),
    ];

    // Find matching account
    const account = allAccounts.find(
      (acc) =>
        acc.username === credentials.username &&
        acc.password === credentials.password
    );

    setTimeout(() => {
      if (account) {
        const userData = {
          username: account.username,
          id: account.id,
          name: account.name,
          section: account.section,
        };
        loginSuccess(userData, account.role);
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
