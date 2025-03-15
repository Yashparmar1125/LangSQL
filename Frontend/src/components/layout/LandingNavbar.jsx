import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Database, Sun, Moon } from 'lucide-react'
import { toggleTheme } from '../../redux/slices/themeSlice'

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isDark } = useSelector((state) => state.theme)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ]

  const handleNavigation = (href) => {
    setIsMobileMenuOpen(false)
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(href)
    }
  }

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={isDark ? "/Logo-White.png" : "/Logo-Dark.png"}
                alt="LangSQL Logo"
                className="h-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-[#00E5FF] bg-clip-text text-transparent">
                LangSQL
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/docs"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Docs
            </Link>
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500 dark:bg-[#00E5FF] text-white dark:text-black text-sm font-medium hover:bg-blue-600 dark:hover:bg-[#00E5FF]/90 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mr-2"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#111113] border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#0A0A0B] transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#0A0A0B] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-500 dark:bg-[#00E5FF] dark:text-black hover:bg-blue-600 dark:hover:bg-[#00E5FF]/90 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default LandingNavbar 