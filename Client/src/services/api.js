import axios from 'axios'
import { handleAPIError } from '../utils/errorHandler'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Demo user credentials
const DEMO_USER = {
  email: 'demo@example.com',
  password: 'demo123',
  name: 'Demo User',
  token: 'demo-token-123',
}

// Auth API
export const authAPI = {
  // Mock login function
  login: async ({ email, password }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Check demo credentials
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const userData = {
        user: {
          id: 1,
          name: DEMO_USER.name,
          email: DEMO_USER.email,
        },
        token: DEMO_USER.token,
      }
      localStorage.setItem('token', DEMO_USER.token)
      return { data: userData }
    }

    throw {
      response: {
        data: {
          message: 'Invalid email or password',
        },
      },
    }
  },

  // Mock register function
  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Simulate email taken error for demo email
    if (userData.email === DEMO_USER.email) {
      throw {
        response: {
          data: {
            message: 'Email already taken',
          },
        },
      }
    }

    return { data: { message: 'Registration successful' } }
  },

  // Mock logout function
  logout: async () => {
    localStorage.removeItem('token')
    return { data: { message: 'Logout successful' } }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw handleAPIError(error)
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      return response.data
    } catch (error) {
      throw handleAPIError(error)
    }
  },

  forgotPassword: async (email) => {
    try {
      await api.post('/auth/forgot-password', { email })
    } catch (error) {
      throw handleAPIError(error)
    }
  },

  resetPassword: async (token, password) => {
    try {
      await api.post('/auth/reset-password', { token, password })
    } catch (error) {
      throw handleAPIError(error)
    }
  },
}

// SQL API
export const sqlAPI = {
  executeQuery: async (query) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      data: {
        results: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        ],
        executionTime: '0.23s',
      },
    }
  },

  generateSchema: async (description) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    return {
      data: {
        schema: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      },
    }
  },

  translateQuery: async (query, from, to) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      data: {
        translatedQuery: query.replace('LIMIT', 'TOP'),
        from,
        to,
      },
    }
  },

  getQueryHistory: async () => {
    try {
      const response = await api.get('/sql/history')
      return response.data
    } catch (error) {
      throw handleAPIError(error)
    }
  },
}

export default api 