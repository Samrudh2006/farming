import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Pre-configured Axios instance for ISIN API.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("isin_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("isin_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── API Functions ──────────────────────────────────

// Auth
export const authApi = {
  register: (data: { email: string; password: string; full_name: string; college?: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getProfile: () => api.get("/auth/me"),
};

// Tasks
export const tasksApi = {
  list: (params?: { difficulty?: string; task_type?: string; limit?: number }) =>
    api.get("/tasks", { params }),
  get: (taskId: string) => api.get(`/tasks/${taskId}`),
  generate: () => api.post("/tasks/generate"),
};

// Submissions
export const submissionsApi = {
  submit: (data: { task_id: string; code: string; language?: string }) =>
    api.post("/submissions", data),
  get: (submissionId: string) => api.get(`/submissions/${submissionId}`),
  listMine: () => api.get("/submissions"),
};

// Passports
export const passportsApi = {
  getMine: () => api.get("/passports/me"),
  getPublic: (passportId: string) => api.get(`/passports/${passportId}`),
  getMySkills: () => api.get("/passports/me/skills"),
};

// Recruiter
export const recruiterApi = {
  search: (query: {
    min_score?: number;
    max_score?: number;
    skills?: string[];
    min_trust?: number;
    limit?: number;
  }) => api.post("/recruiter/search", query),
};

// Admin
export const adminApi = {
  stats: () => api.get("/admin/stats"),
  users: () => api.get("/admin/users"),
};
