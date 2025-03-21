import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Moon,
  Sun,
  Bell,
  Globe,
  Shield,
  Save,
  Trash2,
  ChevronRight,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/slices/themeSlice'
import { useToast } from '../contexts/ToastContext'

const Settings = () => {
  const dispatch = useDispatch()
  const { isDark } = useSelector((state) => state.theme)
  const { showSuccess } = useToast()
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    notifications: {
      email: true,
      push: false,
      updates: true,
    },
    language: 'en',
    theme: isDark ? 'dark' : 'light',
  })

  const handleSave = () => {
    showSuccess('Settings saved successfully')
  }

  const handleDeleteAccount = () => {
    // Add account deletion logic here
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="relative mb-12">
            {/* Background gradient effect */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl transform rotate-12" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block mb-4 px-6 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 shadow-xl"
            >
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ⚙️ Settings
              </span>
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your account preferences and settings
            </p>
          </div>

          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 space-y-6"
          >
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-muted-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 space-y-6"
          >
            <div className="flex items-center mb-6">
              <Bell className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold">Preferences</h2>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
              <div className="flex items-center">
                {isDark ? (
                  <Moon className="h-5 w-5 text-primary mr-3" />
                ) : (
                  <Sun className="h-5 w-5 text-primary mr-3" />
                )}
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(toggleTheme())}
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                Toggle Theme
              </motion.button>
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language
                  </p>
                </div>
              </div>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="font-medium">Notification Settings</h3>
              {Object.entries(formData.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium capitalize">{key} Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive {key} notifications about updates
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-background peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 space-y-6"
          >
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {}}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-primary mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-muted-foreground">
                      Update your password
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {}}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-primary mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </motion.button>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDeleteAccount}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Account
            </motion.button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Settings 