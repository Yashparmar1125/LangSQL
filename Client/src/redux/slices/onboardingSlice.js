import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hasCompletedTutorial: false,
  currentStep: 0,
}

// Clear any stored tutorial state
localStorage.removeItem('hasCompletedTutorial')
localStorage.removeItem('skipTutorial')

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    completeTutorial: (state) => {
      state.hasCompletedTutorial = true
      localStorage.setItem('hasCompletedTutorial', 'true')
    },
    skipTutorial: (state) => {
      state.hasCompletedTutorial = true
      localStorage.setItem('skipTutorial', 'true')
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload
    },
    resetOnboarding: (state) => {
      state.hasCompletedTutorial = false
      state.currentStep = 0
      localStorage.removeItem('hasCompletedTutorial')
      localStorage.removeItem('skipTutorial')
    },
  },
})

export const { completeTutorial, skipTutorial, setCurrentStep, resetOnboarding } = onboardingSlice.actions

export default onboardingSlice.reducer 