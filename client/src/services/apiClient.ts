// src/services/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token from localStorage
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers!["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

// Optional: global 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request. Token may be invalid or expired.");
      // Optional: dispatch logout if using Redux
    }
    return Promise.reject(error);
  }
);

export default apiClient;
