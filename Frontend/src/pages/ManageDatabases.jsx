import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Database,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  ChevronRight,
  X,
  Server
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useSelector, useDispatch } from 'react-redux'
import { useToast } from '../contexts/ToastContext'
import {
  addConnection,
  removeConnection,
  setActiveConnection,
  setConnecting,
  setError,
  clearError,
} from '../redux/slices/databaseSlice'

const ManageDatabases = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const { showSuccess, showError } = useToast()
  const { connections, isConnecting, error } = useSelector((state) => state.database)

  const [formData, setFormData] = useState({
    name: '',
    type: 'postgresql',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    ssl: false,
  })

  const databaseTypes = [
    { id: 'postgresql', name: 'PostgreSQL', icon: Database },
    { id: 'mysql', name: 'MySQL', icon: Database },
    { id: 'trino', name: 'Trino', icon: Server },
    { id: 'spark', name: 'Spark SQL', icon: Server },
  ]

  const handleTestConnection = async (id) => {
    setIsLoading(true)
    const connection = connections.find(conn => conn.id === id)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const updatedConnections = connections.map(conn =>
        conn.id === id ? { ...conn, status: 'connected', lastConnected: new Date().toLocaleString() } : conn
      )
      dispatch(setActiveConnection(updatedConnections))
      showSuccess('Connection tested successfully!')
    } catch (error) {
      dispatch(setError(error.message || 'Failed to test connection'))
      showError('Failed to test connection')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConnection = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      dispatch(removeConnection(id))
      setIsDeleteModalOpen(false)
      showSuccess('Connection deleted successfully!')
    } catch (error) {
      dispatch(setError(error.message || 'Failed to delete connection'))
      showError('Failed to delete connection')
    }
  }

  const handleAddConnection = async (e) => {
    e.preventDefault()
    if (formData.name && formData.host) {
      dispatch(setConnecting(true))
      dispatch(clearError())

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        dispatch(addConnection({ ...formData, id: Date.now() }))
        setFormData({
          name: '',
          type: 'postgresql',
          host: '',
          port: '',
          database: '',
          username: '',
          password: '',
          ssl: false,
        })
        setIsAddModalOpen(false)
        showSuccess('Connection added successfully!')
      } catch (error) {
        dispatch(setError(error.message || 'Failed to connect to database'))
        showError('Failed to add connection')
      } finally {
        dispatch(setConnecting(false))
      }
    }
  }

  const handleEditConnection = async (e) => {
    e.preventDefault()
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      const updatedConnections = connections.map(conn =>
        conn.id === selectedConnection.id ? { ...conn, ...formData } : conn
      )
      dispatch(setActiveConnection(updatedConnections))
      setIsEditModalOpen(false)
      showSuccess('Connection updated successfully!')
    } catch (error) {
      dispatch(setError(error.message || 'Failed to update connection'))
      showError('Failed to update connection')
    }
  }

  const openEditModal = (connection) => {
    setSelectedConnection(connection)
    setFormData({
      name: connection.name,
      type: connection.type,
      host: connection.host,
      port: connection.port,
      database: connection.database,
      username: connection.username,
      password: ''
    })
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (connection) => {
    setSelectedConnection(connection)
    setIsDeleteModalOpen(true)
  }

  const openViewDetails = (connection) => {
    setSelectedConnection(connection)
    setIsViewDetailsOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Database Connections</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Connection</span>
            </button>
          </div>

          {/* Connection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="bg-white dark:bg-[#111113] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Database className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{connection.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{connection.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {connection.status === 'connected' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Host: </span>
                    {connection.host}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Database: </span>
                    {connection.database}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Last Connected: </span>
                    {connection.lastConnected}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTestConnection(connection.id)}
                      disabled={isLoading}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={() => openEditModal(connection)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(connection)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => openViewDetails(connection)}
                    className="flex items-center space-x-1 text-sm text-primary hover:text-primary/90 transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Connection Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#111113] rounded-xl p-8 max-w-2xl w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">New Database Connection</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Connection Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Connection Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0B] focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#00E5FF] outline-none transition-all"
                  placeholder="My Database"
                  required
                />
              </div>

              {/* Database Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Database Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0B] focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#00E5FF] outline-none transition-all"
                >
                  {databaseTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              {/* Host & Port */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Host</label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0B] focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#00E5FF] outline-none transition-all"
                    placeholder="localhost"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Port</label>
                  <input
                    type="text"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0B] focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#00E5FF] outline-none transition-all"
                    placeholder="5432"
                    required
                  />
                </div>
              </div>

              {/* Database Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Database Name</label>
                <input
                  type="text"
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0B] focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#00E5FF] outline-none transition-all"
                  placeholder="mydatabase"
                  required
                />
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0B] focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#00E5FF] outline-none transition-all"
                    placeholder="username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0A0B] focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#00E5FF] outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* SSL Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ssl"
                  checked={formData.ssl}
                  onChange={(e) => setFormData({ ...formData, ssl: e.target.checked })}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="ssl" className="text-sm font-medium">
                  Use SSL Connection
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddConnection}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add Connection</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Connection Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Connection</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditConnection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background"
                >
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="MySQL">MySQL</option>
                  <option value="SQLite">SQLite</option>
                  <option value="MongoDB">MongoDB</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Host</label>
                <input
                  type="text"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Port</label>
                <input
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Database Name</label>
                <input
                  type="text"
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background"
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete Connection</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete the connection "{selectedConnection?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConnection(selectedConnection?.id)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewDetailsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Connection Details</h2>
              <button
                onClick={() => setIsViewDetailsOpen(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                <div className="flex items-center space-x-2">
                  {selectedConnection?.status === 'connected' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-destructive" />
                      <span>Disconnected</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                <p>{selectedConnection?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                <p>{selectedConnection?.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Host</label>
                <p>{selectedConnection?.host}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Port</label>
                <p>{selectedConnection?.port}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Database</label>
                <p>{selectedConnection?.database}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
                <p>{selectedConnection?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Last Connected</label>
                <p>{selectedConnection?.lastConnected}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsViewDetailsOpen(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ManageDatabases 