import axios from "axios";
import { handleAPIError } from "../utils/errorHandler";

const API_URL = import.meta.env.VITE_API_HOST || "http://localhost:3000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // No need to manually set Authorization header
    // The cookie will be automatically sent by the browser
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
    // Just reject the error, no need to handle token removal
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Real login function
  login: async ({ email, password }) => {
    try {
      // Make API call to the login endpoint
      const response = await api.post(
        "/api/auth/login",
        { email, password },
        {
          withCredentials: true, // Send cookies with the request
        }
      );

      // Since we're using cookie-based auth, we don't need to handle tokens manually
      // The cookie will be automatically handled by the browser
      return { data: response.data };
    } catch (error) {
      // Handle errors without redirecting
      const errorMessage =
        error.response?.data?.message || "Invalid credentials";
      throw {
        response: {
          status: error.response?.status,
          data: { message: errorMessage },
        },
      };
    }
  },

  // Real register function
  register: async (userData) => {
    try {
      // Make API call to the register endpoint
      const response = await api.post("/api/auth/register", userData, {
        withCredentials: true, // Send cookies with the request
      });

      return { data: response.data };
    } catch (error) {
      throw {
        response: {
          data: {
            message: error.response?.data?.message || "Error registering",
          },
        },
      };
    }
  },

  // Real logout function
  logout: async () => {
    try {
      // Make API call to the logout endpoint
      const response = await api.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      return { data: response.data };
    } catch (error) {
      throw {
        response: {
          data: {
            message: error.response?.data?.message || "Error logging out",
          },
        },
      };
    }
  },

  completeTutorial: async () => {
    try {
      const response = await api.post("/api/auth/tutorial/complete", {
        withCredentials: true,
      });
      return { data: response.data };
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Get the current logged-in user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/api/auth/me", {
        withCredentials: true, // Send cookies with the request
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Update the user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/api/auth/profile", profileData, {
        withCredentials: true, // Send cookies with the request
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      await api.post(
        "/api/auth/forgot-password",
        { email },
        {
          withCredentials: true, // Send cookies with the request
        }
      );
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      await api.post(
        "/api/auth/reset-password",
        { token, password },
        {
          withCredentials: true, // Send cookies with the request
        }
      );
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};

// SQL API
export const sqlAPI = {
  executeQuery: async (query) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      data: {
        results: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
        ],
        executionTime: "0.23s",
      },
    };
  },

  generateSchema: async (description) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      data: {
        schema: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      },
    };
  },

  translateQuery: async (query, from, to) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      data: {
        translatedQuery: query.replace("LIMIT", "TOP"),
        from,
        to,
      },
    };
  },

  getQueryHistory: async () => {
    try {
      const response = await api.get("/sql/history");
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};

export default api;
