import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    if (import.meta.env.MODE === "development") {
      console.log("🔍 API Request:", config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/login";
    }
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
