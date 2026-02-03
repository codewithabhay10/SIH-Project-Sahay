import axios from "axios";

// Environment variables for API endpoints
// For Next.js, use process.env.NEXT_PUBLIC_* for client-side access
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1604";
export const API_BASE_URL = `${API_URL}/api`;
export const TRANSLATION_API_URL = process.env.NEXT_PUBLIC_TRANSLATION_API || "http://localhost:8000";
export const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API || "http://localhost:8000";
export const BLOCKCHAIN_API_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_API || "http://localhost:3002";

// Create a pre-configured axios instance for the main backend
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login
      if (typeof window !== "undefined") {
        // Optionally clear auth and redirect
        // localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Create axios instance for translation API
export const translationApi = axios.create({
  baseURL: TRANSLATION_API_URL,
  withCredentials: false,
});

// Create axios instance for chatbot API
export const chatbotApi = axios.create({
  baseURL: CHATBOT_API_URL,
  withCredentials: false,
});

export default api;
