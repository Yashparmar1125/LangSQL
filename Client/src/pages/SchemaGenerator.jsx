import { useState } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import {
  Database,
  Download,
  Copy,
  Wand2,
  Save,
  Table,
  History,
  ChevronRight,
  ChevronDown,
  Clock,
  Sparkles,
  MenuIcon,
  X
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useToast } from '../contexts/ToastContext'
import { useSelector } from 'react-redux'

const SchemaGenerator = () => {
  const [schemaDescription, setSchemaDescription] = useState('')
  const [generatedSchema, setGeneratedSchema] = useState('')
  const [selectedDialect, setSelectedDialect] = useState('postgresql')
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [savedSchemas] = useState([
    {
      name: "Blog Database Schema",
      description: "A blog database with users, posts, and comments tables",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      schema: `CREATE TABLE users (...);\nCREATE TABLE posts (...);\nCREATE TABLE comments (...);`
    },
    {
      name: "E-commerce Database",
      description: "Complete e-commerce system with products, orders, and customers",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      schema: `CREATE TABLE products (...);\nCREATE TABLE orders (...);\nCREATE TABLE customers (...);`
    },
    {
      name: "Task Management System",
      description: "Project management database with tasks, projects, and users",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      schema: `CREATE TABLE tasks (...);\nCREATE TABLE projects (...);\nCREATE TABLE users (...);`
    }
  ])
  const { showSuccess, showError } = useToast()
  const { isDark } = useSelector((state) => state.theme)

  const dialects = [
    { id: 'postgresql', name: 'PostgreSQL' },
    { id: 'mysql', name: 'MySQL' },
    { id: 'trino', name: 'Trino' },
    { id: 'spark', name: 'Spark SQL' }
  ]

  const handleGenerateSchema = async () => {
    if (!schemaDescription.trim()) {
      showError('Please describe your database schema requirements')
      return
    }
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setGeneratedSchema(`CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);`)
      setOptimizationSuggestions([
        'Consider adding an index on user_id in the orders table for faster lookups',
        'Partitioning the orders table by created_at will improve OLAP queries',
        'Adding a composite index on (user_id, created_at) will optimize common queries'
      ])
      setIsGenerating(false)
      showSuccess('Schema generated successfully!')
    }, 2000)
  }

  const handleCopySchema = () => {
    navigator.clipboard.writeText(generatedSchema)
    showSuccess('Schema copied to clipboard!')
  }

  const handleDownloadSchema = () => {
    const blob = new Blob([generatedSchema], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schema.sql'
    a.click()
    URL.revokeObjectURL(url)
    showSuccess('Schema downloaded!')
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Toggle Templates"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>

        {/* Left Section - Schema Templates */}
        <div className={`w-full sm:w-80 lg:w-64 xl:w-72 flex-shrink-0 border-r border-border bg-background transition-all duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative h-full z-40`}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Templates</h2>
                <button 
                  className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:shadow-sm"
                  title="Refresh Templates"
                >
                  <History className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {['Blog System', 'E-commerce', 'Social Network', 'Task Management'].map((template) => (
                  <button
                    key={template}
                    className="flex items-center w-full p-3 rounded-lg text-sm transition-all duration-200 hover:bg-accent hover:shadow-sm"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    {template}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background relative w-full">
          <div className="h-full overflow-y-auto">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 space-y-6">
              {/* Input Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background p-4 lg:p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col space-y-4 mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Describe Your Schema</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <label className="text-sm font-medium whitespace-nowrap">SQL Dialect:</label>
                      <select
                        value={selectedDialect}
                        onChange={(e) => setSelectedDialect(e.target.value)}
                        className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        {dialects.map(dialect => (
                          <option key={dialect.id} value={dialect.id}>
                            {dialect.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-1.5 bg-accent rounded-lg shadow-sm">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm">AI-Powered</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={schemaDescription}
                    onChange={(e) => setSchemaDescription(e.target.value)}
                    placeholder="Describe your database schema in plain English. For example: 'Create a blog database with users, posts, and comments tables'"
                    className="w-full h-32 sm:h-40 p-4 text-base border border-border rounded-xl bg-accent text-foreground resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button
                  onClick={handleGenerateSchema}
                  disabled={isGenerating || !schemaDescription.trim()}
                  className="w-full mt-4 px-5 py-3.5 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-lg flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm font-medium"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Schema</span>
                    </>
                  )}
                </button>
              </motion.div>

              {/* Generated Schema Section */}
              {generatedSchema && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-background p-4 lg:p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col space-y-4 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-semibold tracking-tight mb-3 sm:mb-0">Generated Schema</h2>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleCopySchema}
                          className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 tooltip"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleDownloadSchema}
                          className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 tooltip"
                          title="Download schema"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {}}
                          className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 tooltip"
                          title="Save schema"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden border border-border shadow-sm">
                    <Editor
                      height="100%"
                      defaultLanguage="sql"
                      value={generatedSchema}
                      theme={isDark ? "vs-dark" : "light"}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        padding: { top: 10, bottom: 10 },
                        roundedSelection: true,
                        automaticLayout: true,
                        wordWrap: 'on',
                        scrollbar: {
                          vertical: 'hidden',
                          horizontal: 'hidden',
                          verticalScrollbarSize: 0,
                          horizontalScrollbarSize: 0
                        }
                      }}
                    />
                  </div>

                  {optimizationSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 sm:p-4 lg:p-5 bg-accent rounded-lg shadow-sm"
                    >
                      <h3 className="text-sm font-medium mb-3">AI Suggestions:</h3>
                      <ul className="space-y-2.5">
                        {optimizationSuggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start space-x-2.5 text-sm text-muted-foreground">
                            <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - History */}
        <div className={`w-full sm:w-80 lg:w-72 xl:w-80 flex-shrink-0 border-l border-border bg-background transition-all duration-300 transform ${
          isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 fixed lg:relative right-0 h-full z-40`}>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 lg:p-6 space-y-6">
                {/* Saved Schemas */}
                <div>
                  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold tracking-tight">Saved Schemas</h2>
                      <button 
                        className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 hover:shadow-sm"
                        title="Clear History"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {savedSchemas.map((schema, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 sm:p-4 bg-accent rounded-lg cursor-pointer hover:bg-accent/90 transition-all duration-200 border border-border hover:shadow-md"
                        onClick={() => setGeneratedSchema(schema.schema)}
                      >
                        <p className="text-sm font-medium mb-1">{schema.name}</p>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {schema.description}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{schema.timestamp.toLocaleString()}</span>
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile History Toggle */}
        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Toggle History"
        >
          <History className="w-5 h-5" />
        </button>
      </div>
    </DashboardLayout>
  )
}

export default SchemaGenerator 