import { createSlice } from "@reduxjs/toolkit";

// Initial state for authentication
const initialState = {
  user: null, // No user initially
  user_id: null, // No user ID initially
  token: null, // No token initially
  isAuthenticated: false, // User is not authenticated by default
  isLoading: false,
  error: null,
  lastLogin: null,
  rememberMe: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.user_id = action.payload.user.id; // Set the user_id
      state.token = action.payload.token;
      state.lastLogin = new Date().toISOString();
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      // Reset to initial state on logout
      state.user = null;
      state.user_id = null; // Reset user_id
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.lastLogin = null;
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setRememberMe,
  clearError,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
