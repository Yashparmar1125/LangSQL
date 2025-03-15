import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Database,
  Table,
  Settings,
  User,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'
import { logout } from '../../redux/slices/authSlice'
import { toggleTheme } from '../../redux/slices/themeSlice'
import { useToast } from '../../contexts/ToastContext'

const DashboardLayout = ({ children }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { isDark } = useSelector((state) => state.theme)
  const { showSuccess } = useToast()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Databases', href: '/manage-databases', icon: Database, description: 'Manage and monitor your database connections' },
    { name: 'Query Builder', href: '/query-builder', icon: Table, description: 'Build and execute SQL queries with AI assistance' },
    { name: 'Schema Generator', href: '/schema-generator', icon: Table, description: 'Design and generate database schemas' },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleLogout = () => {
    dispatch(logout())
    showSuccess('Logged out successfully')
  }

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B]">
      {/* Top Navigation Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-md shadow-sm' : 'bg-white dark:bg-[#0A0A0B]'
      }`}>
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center gap-3">
                <img
                  src={isDark ? "/Logo-White.png" : "/Logo-Dark.png"}
                  alt="SQLMind Logo"
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline-block">
                  SQLMind
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-500 text-white dark:bg-[#00E5FF] dark:text-black'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111113] hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111113] hover:text-gray-900 dark:hover:text-white transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111113] hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium hidden sm:inline-block">{user?.name}</span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111113] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-1"
                    >
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0A0A0B] hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111113] hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0B]"
            >
              <div className="px-4 py-3 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-500 text-white dark:bg-[#00E5FF] dark:text-black'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111113] hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {item.description && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Page content */}
      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout 