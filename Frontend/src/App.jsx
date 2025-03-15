import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import { useSelector } from 'react-redux'

// Pages
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import QueryBuilder from './pages/QueryBuilder'
import SchemaGenerator from './pages/SchemaGenerator'
import Settings from './pages/Settings'
import About from './pages/About'
import ManageDatabases from './pages/ManageDatabases'

// Components
import Tutorial from './components/onboarding/Tutorial'
import DatabaseConnection from './components/database/DatabaseConnection'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { hasCompletedTutorial } = useSelector((state) => state.onboarding)
  const location = window.location

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Show tutorial only after login and if not completed
  if (!hasCompletedTutorial && 
      !localStorage.getItem('skipTutorial') && 
      location.pathname !== '/tutorial' && 
      location.pathname !== '/') {
    return <Navigate to="/tutorial" replace />
  }

  return children
}

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  return (
    <ToastProvider>
      <Routes>
        {/* Public Routes - Always accessible */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />

        {/* Onboarding Routes - Only after authentication */}
        <Route
          path="/tutorial"
          element={
            <ProtectedRoute>
              <Tutorial />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connect-database"
          element={
            <ProtectedRoute>
              <DatabaseConnection />
            </ProtectedRoute>
          }
        />

        {/* Core Feature Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-databases"
          element={
            <ProtectedRoute>
              <ManageDatabases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/query-builder"
          element={
            <ProtectedRoute>
              <QueryBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schema-generator"
          element={
            <ProtectedRoute>
              <SchemaGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - Redirect to landing if not authenticated */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? '/dashboard' : '/'}
              replace
            />
          }
        />
      </Routes>
    </ToastProvider>
  )
}

export default App
