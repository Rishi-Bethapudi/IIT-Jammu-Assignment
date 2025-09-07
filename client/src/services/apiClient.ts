// src/services/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://localhost:5000/api
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token automatically if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, force logout
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login"; // simple redirect for small project
    }
    return Promise.reject(error);
  }
);

export default apiClient;
