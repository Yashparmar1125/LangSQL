import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hasConnectedDatabase: true,
  connections: [
    {
      id: 1,
      name: "Local PostgreSQL",
      type: "postgresql",
      host: "localhost",
      port: "5432",
      database: "postgres",
      username: "postgres",
      status: "connected",
      lastConnected: "2024-03-20 10:30 AM"
    },
    {
      id: 2,
      name: "Production MySQL",
      type: "mysql",
      host: "prod-db.example.com",
      port: "3306",
      database: "app_production",
      username: "admin",
      status: "disconnected",
      lastConnected: "2024-03-19 3:45 PM"
    },
    {
      id: 3,
      name: "Analytics Trino",
      type: "trino",
      host: "trino.analytics.com",
      port: "8080",
      database: "analytics",
      username: "analyst",
      status: "connected",
      lastConnected: "2024-03-20 9:15 AM"
    }
  ],
  activeConnection: null,
  isConnecting: false,
  error: null,
}

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    addConnection: (state, action) => {
      state.connections.push(action.payload)
      state.hasConnectedDatabase = true
      localStorage.setItem('hasConnectedDatabase', 'true')
    },
    removeConnection: (state, action) => {
      state.connections = state.connections.filter(conn => conn.id !== action.payload)
      if (state.connections.length === 0) {
        state.hasConnectedDatabase = false
        localStorage.removeItem('hasConnectedDatabase')
      }
    },
    setActiveConnection: (state, action) => {
      state.activeConnection = action.payload
    },
    setConnecting: (state, action) => {
      state.isConnecting = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetConnections: (state) => {
      state.connections = []
      state.activeConnection = null
      state.hasConnectedDatabase = false
      state.isConnecting = false
      state.error = null
      localStorage.removeItem('hasConnectedDatabase')
    },
  },
})

export const {
  addConnection,
  removeConnection,
  setActiveConnection,
  setConnecting,
  setError,
  clearError,
  resetConnections,
} = databaseSlice.actions

export default databaseSlice.reducer 