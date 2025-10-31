import axios from "axios";

/**
 * API Service Configuration
 * Centralized API calls to backend
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.message);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Event API endpoints
 */
export const eventAPI = {
  // Get all events
  getAllEvents: async (params = {}) => {
    const response = await api.get("/events", { params });
    return response.data;
  },

  // Get single event by ID
  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Get upcoming events
  getUpcomingEvents: async (limit = 50) => {
    const response = await api.get("/events", {
      params: { upcoming: true, limit },
    });
    return response.data;
  },
};

/**
 * Email Capture API endpoints
 */
export const emailCaptureAPI = {
  // Capture email when user clicks "Get Tickets"
  captureEmail: async (emailData) => {
    const response = await api.post("/email-capture", emailData);
    return response.data;
  },

  // Get all email captures (admin)
  getAllCaptures: async (params = {}) => {
    const response = await api.get("/email-capture", { params });
    return response.data;
  },

  // Get captures for specific event
  getCapturesByEvent: async (eventId) => {
    const response = await api.get(`/email-capture/event/${eventId}`);
    return response.data;
  },
};

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await api.get("/health");
  return response.data;
};

export default api;
