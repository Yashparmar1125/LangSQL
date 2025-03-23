import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  X,
  Keyboard,
  Info,
  MessageSquare,
  Zap
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useToast } from '../contexts/ToastContext'
import { useSelector } from 'react-redux'

// Loading indicator component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
    <span className="text-sm">Processing...</span>
  </div>
)

const SchemaGenerator = () => {
  const [schemaDescription, setSchemaDescription] = useState('')
  const [generatedSchema, setGeneratedSchema] = useState('')
  const [selectedDialect, setSelectedDialect] = useState('postgresql')
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [editorInstance, setEditorInstance] = useState(null)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [isExplaining, setIsExplaining] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [explanation, setExplanation] = useState(null)
  const [optimization, setOptimization] = useState(null)
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'enter':
            e.preventDefault()
            if (schemaDescription.trim() && !isGenerating) {
              handleGenerateSchema()
            }
            break
          case 's':
            e.preventDefault()
            if (generatedSchema.trim()) {
              handleSaveSchema()
            }
            break
          case 'k':
            e.preventDefault()
            setShowKeyboardShortcuts(true)
            break
          default:
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [schemaDescription, generatedSchema, isGenerating])

  const dialects = [
    { id: 'postgresql', name: 'PostgreSQL' },
    { id: 'mysql', name: 'MySQL' },
    { id: 'trino', name: 'Trino' },
    { id: 'spark', name: 'Spark SQL' }
  ]

  // Editor ready handler
  const handleEditorDidMount = (editor, monaco) => {
    setIsEditorReady(true)
    setEditorInstance(editor)

    // Add custom SQL completions
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: () => ({
        suggestions: [
          {
            label: 'CREATE TABLE',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'CREATE TABLE ',
          },
          {
            label: 'PRIMARY KEY',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'PRIMARY KEY',
          },
          {
            label: 'FOREIGN KEY',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'FOREIGN KEY',
          },
          // Add more SQL keywords as needed
        ],
      }),
    })
  }

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

  const handleExplainSchema = async () => {
    if (!generatedSchema.trim()) return
    
    setIsExplaining(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setExplanation({
        overview: "This schema defines a basic e-commerce database structure",
        tables: [
          "Users table stores customer information with unique constraints",
          "Orders table tracks all transactions with proper foreign key relationships",
        ],
        relationships: "One-to-many relationship between users and orders",
        bestPractices: "Proper use of timestamps and constraints for data integrity"
      })
      showSuccess('Schema explained!')
    } catch (error) {
      showError('Failed to explain schema')
    } finally {
      setIsExplaining(false)
    }
  }

  const handleOptimizeSchema = async () => {
    if (!generatedSchema.trim()) return
    
    setIsOptimizing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setOptimization({
        suggestions: [
          "Add indexes on frequently queried columns",
          "Consider using UUID instead of AUTO_INCREMENT for better distribution",
          "Add appropriate table partitioning strategy"
        ],
        improvements: "Estimated 30% query performance improvement"
      })
      showSuccess('Optimization suggestions generated!')
    } catch (error) {
      showError('Failed to generate optimization suggestions')
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleCopySchema = () => {
    navigator.clipboard.writeText(generatedSchema)
    showSuccess('Schema copied to clipboard!')
  }

  const handleSaveSchema = () => {
    if (!generatedSchema) return
    // Add save logic here
    showSuccess('Schema saved successfully!')
  }

  const handleDownloadSchema = () => {
    if (!generatedSchema) return
    const blob = new Blob([generatedSchema], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schema.sql'
    a.click()
    URL.revokeObjectURL(url)
    showSuccess('Schema downloaded!')
  }

  // Keyboard shortcuts modal
  const KeyboardShortcutsModal = () => (
    <AnimatePresence>
      {showKeyboardShortcuts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowKeyboardShortcuts(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-background p-6 rounded-xl border border-border shadow-lg max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="p-2 hover:bg-accent rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">General</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-accent rounded-lg">
                    <span>Generate Schema</span>
                    <kbd className="px-2 py-1 bg-background rounded-md">⌘/Ctrl + Enter</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-accent rounded-lg">
                    <span>Save Schema</span>
                    <kbd className="px-2 py-1 bg-background rounded-md">⌘/Ctrl + S</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-accent rounded-lg">
                    <span>Show Shortcuts</span>
                    <kbd className="px-2 py-1 bg-background rounded-md">⌘/Ctrl + K</kbd>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Editor</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-accent rounded-lg">
                    <span>Format Schema</span>
                    <kbd className="px-2 py-1 bg-background rounded-md">Shift + Alt + F</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-accent rounded-lg">
                    <span>Comment Line</span>
                    <kbd className="px-2 py-1 bg-background rounded-md">⌘/Ctrl + /</kbd>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <DashboardLayout>
      <KeyboardShortcutsModal />
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
                  <motion.button
                    key={template}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center w-full p-3 rounded-lg text-sm transition-all duration-200 hover:bg-accent hover:shadow-sm"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    {template}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background relative w-full">
          <div className="h-full overflow-y-auto">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <h1 className="text-2xl font-bold">Schema Generator</h1>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowKeyboardShortcuts(true)}
                    className="p-2 hover:bg-accent rounded-lg transition-all duration-200 flex items-center space-x-2"
                    title="Show Keyboard Shortcuts"
                  >
                    <Keyboard className="w-4 h-4" />
                    <span className="text-sm">Shortcuts</span>
                  </button>
                </div>
              </div>

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
                  className="group w-full mt-4 px-5 py-3.5 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-lg flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm font-medium relative"
                >
                  {isGenerating ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Schema</span>
                      <kbd className="absolute right-2 top-2 text-xs bg-primary-foreground/20 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ⌘/Ctrl + ↵
                      </kbd>
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
                          onClick={handleExplainSchema}
                          disabled={!generatedSchema || isExplaining}
                          className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 group relative"
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                            Explain Schema
                          </span>
                        </button>
                        <button
                          onClick={handleOptimizeSchema}
                          disabled={!generatedSchema || isOptimizing}
                          className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 group relative"
                        >
                          <Zap className="w-5 h-5" />
                          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                            Optimize Schema
                          </span>
                        </button>
                        <button
                          onClick={handleCopySchema}
                          className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 group relative"
                        >
                          <Copy className="w-5 h-5" />
                          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                            Copy to clipboard
                          </span>
                        </button>
                        <button
                          onClick={handleDownloadSchema}
                          className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 group relative"
                        >
                          <Download className="w-5 h-5" />
                          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                            Download schema
                          </span>
                        </button>
                        <button
                          onClick={handleSaveSchema}
                          className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 group relative"
                        >
                          <Save className="w-5 h-5" />
                          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                            Save schema
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden border border-border shadow-sm">
                    {!isEditorReady && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                        <LoadingSpinner />
                      </div>
                    )}
                    <Editor
                      height="100%"
                      defaultLanguage="sql"
                      value={generatedSchema}
                      theme={isDark ? "vs-dark" : "light"}
                      onMount={handleEditorDidMount}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        padding: { top: 16, bottom: 16 },
                        roundedSelection: true,
                        automaticLayout: true,
                        wordWrap: 'on',
                        lineHeight: 1.5,
                        folding: false,
                        renderLineHighlight: 'all',
                        smoothScrolling: true,
                        cursorSmoothCaretAnimation: true,
                        quickSuggestions: true,
                        suggestOnTriggerCharacters: true,
                        scrollbar: {
                          vertical: 'hidden',
                          horizontal: 'hidden',
                          verticalScrollbarSize: 0,
                          horizontalScrollbarSize: 0
                        }
                      }}
                    />
                  </div>

                  {/* Optimization Suggestions */}
                  {optimizationSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 lg:p-5 bg-accent rounded-lg shadow-sm"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-sm font-medium">Optimization Suggestions</h3>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <ul className="space-y-2.5">
                        {optimizationSuggestions.map((suggestion, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-2.5 text-sm text-muted-foreground"
                          >
                            <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                            <span>{suggestion}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* History Sidebar - Right Section */}
        <div className={`w-full sm:w-80 lg:w-72 xl:w-80 flex-shrink-0 border-l border-border bg-background transition-all duration-300 transform ${
          isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 fixed lg:relative right-0 h-full z-40 overflow-hidden`}>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
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
                        className="p-4 bg-accent rounded-lg cursor-pointer hover:bg-accent/90 transition-all duration-200 border border-border hover:shadow-md"
                      >
                        <h3 className="font-medium mb-1">{schema.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{schema.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(schema.timestamp).toLocaleString()}</span>
                        </p>
                      </motion.div>
                    ))}
                    {savedSchemas.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">
                          No saved schemas yet
                        </p>
                      </div>
                    )}
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