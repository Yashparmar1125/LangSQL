import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark
      document.documentElement.classList.toggle('dark')
    },
    setTheme: (state, action) => {
      state.isDark = action.payload
      if (action.payload) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer 