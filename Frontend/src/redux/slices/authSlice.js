import { createSlice } from '@reduxjs/toolkit'

// Demo user for testing UI
const demoUser = {
  id: 1,
  name: 'Demo User',
  email: 'demo@sqlmind.dev',
  role: 'user',
  createdAt: new Date().toISOString(),
}

const initialState = {
  user: demoUser, // Set demo user by default
  token: 'demo-token', // Demo token
  isAuthenticated: true, // Set authenticated by default
  isLoading: false,
  error: null,
  lastLogin: new Date().toISOString(),
  rememberMe: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.lastLogin = new Date().toISOString()
      state.error = null
    },
    loginFailure: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.error = action.payload
    },
    logout: (state) => {
      // For demo, reset to demo user instead of null
      state.user = demoUser
      state.token = 'demo-token'
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setRememberMe,
  clearError,
  updateUserProfile,
} = authSlice.actions

export default authSlice.reducer 