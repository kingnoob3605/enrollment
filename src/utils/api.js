import axios from "axios";

// Base URL of your Laravel API
const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userType");
      window.location.href = "/"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Create API service object with methods
const apiService = {
  // Auth
  login: (credentials) => api.post("/login", credentials),

  // Students
  getStudents: (filters = {}) =>
    api.get("/admin/students", { params: filters }),
  getStudent: (id) => api.get(`/admin/students/${id}`),
  createStudent: (data) => api.post("/admin/students", data),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getStudentMetrics: (section) =>
    api.get("/student-metrics", { params: { section } }),

  // Teachers
  getTeachers: () => api.get("/admin/teachers"),
  getTeacher: (id) => api.get(`/admin/teachers/${id}`),
  createTeacher: (data) => api.post("/admin/teachers", data),
  updateTeacher: (id, data) => api.put(`/admin/teachers/${id}`, data),
  deleteTeacher: (id) => api.delete(`/admin/teachers/${id}`),
  getTeacherMetrics: () => api.get("/teacher-metrics"),

  // Admin Dashboard
  getDashboard: () => api.get("/admin/dashboard"),
  getReports: () => api.get("/admin/reports"),
  getSettings: () => api.get("/admin/settings"),
};

export default apiService;
