import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import authReducer from './slices/authSlice'
import onboardingReducer from './slices/onboardingSlice'
import databaseReducer from './slices/databaseSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    onboarding: onboardingReducer,
    database: databaseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store 