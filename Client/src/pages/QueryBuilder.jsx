import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Copy, 
  Save, 
  Download, 
  Table, 
  Clock, 
  Database, 
  ChevronRight, 
  ChevronDown, 
  TableProperties,
  Columns,
  Key,
  RefreshCw,
  Wand2,
  Sparkles,
  MessageSquare,
  Zap,
  History,
  MenuIcon,
  X
} from 'lucide-react'
import Editor from '@monaco-editor/react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useSelector } from 'react-redux'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'

const QueryBuilder = () => {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [selectedDb, setSelectedDb] = useState(null)
  const [selectedDialect, setSelectedDialect] = useState('postgresql')
  const [expandedSchemas, setExpandedSchemas] = useState({})
  const [expandedTables, setExpandedTables] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [results, setResults] = useState(null)
  const [savedQueries, setSavedQueries] = useState([
    {
      query: "Show me all users who have made purchases in the last month",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      generated: "SELECT u.username, COUNT(o.order_id) as order_count, SUM(o.total_amount) as total_spent FROM users u JOIN orders o ON u.id = o.user_id WHERE o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH) GROUP BY u.username"
    },
    {
      query: "Find the top 5 most expensive products in Electronics category",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      generated: "SELECT name, price, category FROM products WHERE category = 'Electronics' ORDER BY price DESC LIMIT 5"
    },
    {
      query: "List all orders with their customer details",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      generated: "SELECT o.order_id, u.username, o.total_amount, o.status FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.order_date DESC"
    }
  ])
  const [executionHistory] = useState([
    {
      query: "SELECT * FROM products WHERE category = 'Electronics'",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      metadata: {
        rowCount: 15,
        executionTime: '0.124s',
        affectedRows: 15
      }
    },
    {
      query: "UPDATE products SET stock = stock - 1 WHERE product_id = 101",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      metadata: {
        rowCount: 1,
        executionTime: '0.086s',
        affectedRows: 1
      }
    },
    {
      query: "SELECT COUNT(*) as total_orders, SUM(total_amount) as revenue FROM orders WHERE status = 'completed'",
      timestamp: new Date(Date.now() - 1000 * 60 * 90), // 90 mins ago
      metadata: {
        rowCount: 1,
        executionTime: '0.156s',
        affectedRows: 0
      }
    }
  ])
  const { isDark } = useSelector((state) => state.theme)
  const { showSuccess, showError } = useToast()
  const { activeConnection } = useSelector((state) => state.database)
  const [aiMode, setAiMode] = useState('natural') // 'natural' | 'sql'
  const [explanation, setExplanation] = useState(null)
  const [optimization, setOptimization] = useState(null)
  const [isExplaining, setIsExplaining] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)

  const dialects = [
    { id: 'postgresql', name: 'PostgreSQL' },
    { id: 'mysql', name: 'MySQL' },
    { id: 'trino', name: 'Trino' },
    { id: 'spark', name: 'Spark SQL' }
  ]

  // Mock databases and their schemas (replace with real data from your backend)
  const mockDatabases = [
    {
      name: 'ecommerce_db',
      schemas: [
        {
          name: 'public',
          tables: [
            {
              name: 'users',
              columns: [
                { name: 'id', type: 'integer', isPrimary: true },
                { name: 'username', type: 'varchar(50)', isPrimary: false },
                { name: 'email', type: 'varchar(100)', isPrimary: false },
                { name: 'created_at', type: 'timestamp', isPrimary: false }
              ]
            },
            {
              name: 'products',
              columns: [
                { name: 'product_id', type: 'integer', isPrimary: true },
                { name: 'name', type: 'varchar(100)', isPrimary: false },
                { name: 'price', type: 'decimal(10,2)', isPrimary: false },
                { name: 'category', type: 'varchar(50)', isPrimary: false }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'analytics_db',
      schemas: [
        {
          name: 'public',
          tables: [
            {
              name: 'events',
              columns: [
                { name: 'event_id', type: 'integer', isPrimary: true },
                { name: 'event_type', type: 'varchar(50)', isPrimary: false },
                { name: 'timestamp', type: 'timestamp', isPrimary: false }
              ]
            }
          ]
        }
      ]
    }
  ]

  const toggleSchema = (dbName, schemaName) => {
    setExpandedSchemas(prev => ({
      ...prev,
      [`${dbName}.${schemaName}`]: !prev[`${dbName}.${schemaName}`]
    }))
  }

  const toggleTable = (dbName, schemaName, tableName) => {
    setExpandedTables(prev => ({
      ...prev,
      [`${dbName}.${schemaName}.${tableName}`]: !prev[`${dbName}.${schemaName}.${tableName}`]
    }))
  }

  const handleSelectDatabase = (dbName) => {
    setSelectedDb(dbName)
    showSuccess(`Connected to ${dbName}`)
  }

  const handleTableClick = (tableName) => {
    setOutput(`SELECT * FROM ${tableName} LIMIT 100;`)
  }

  const handleNaturalLanguageQuery = async () => {
    if (!input.trim() || !selectedDb) {
      showError('Please enter a query and select a database')
      return
    }
    
    setIsLoading(true)
    try {
      // TODO: Call your AI service to convert natural language to SQL
      await new Promise(resolve => setTimeout(resolve, 1000))
      const query = 'SELECT u.username, COUNT(o.order_id) as order_count ' +
                   'FROM users u ' +
                   'LEFT JOIN orders o ON u.id = o.user_id ' +
                   'GROUP BY u.username ' +
                   'HAVING COUNT(o.order_id) > 5;'
      setOutput(query)
      setSuggestions([
        'You might also want to include the total order value',
        'Consider adding a date range filter',
        'You could join with the products table to see what they bought'
      ])
      showSuccess('Query generated successfully!')
    } catch (error) {
      showError('Failed to generate query')
      console.error('Failed to generate query:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExplainQuery = async () => {
    if (!output.trim()) return
    
    setIsExplaining(true)
    try {
      // TODO: Call your AI service to explain the query
      await new Promise(resolve => setTimeout(resolve, 800))
      setExplanation({
        overview: "This query finds users who have placed more than 5 orders",
        steps: [
          "Joins the users table with orders table",
          "Groups results by username",
          "Filters for users with more than 5 orders",
          "Returns username and order count"
        ],
        performance: "The query uses an index on user_id for efficient joining"
      })
      showSuccess('Query explained!')
    } catch (error) {
      showError('Failed to explain query')
    } finally {
      setIsExplaining(false)
    }
  }

  const handleOptimizeQuery = async () => {
    if (!output.trim()) return
    
    setIsOptimizing(true)
    try {
      // TODO: Call your AI service to optimize the query
      await new Promise(resolve => setTimeout(resolve, 800))
      setOptimization({
        optimizedQuery: output.replace('SELECT *', 'SELECT id, username, email'),
        improvements: [
          "Replaced SELECT * with specific columns",
          "Added index hint for better performance",
          "Restructured JOIN for better execution plan"
        ],
        estimatedImprovement: "~40% performance increase"
      })
      showSuccess('Query optimized!')
    } catch (error) {
      showError('Failed to optimize query')
    } finally {
      setIsOptimizing(false)
    }
  }

  // Mock data scenarios
  const mockDataScenarios = {
    users: {
      data: [
        { id: 1, username: 'john_doe', email: 'john@example.com', age: 25, created_at: '2024-01-15' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', age: 30, created_at: '2024-02-01' },
        { id: 3, username: 'bob_wilson', email: 'bob@example.com', age: 28, created_at: '2024-02-15' },
        { id: 4, username: 'alice_brown', email: 'alice@example.com', age: 35, created_at: '2024-03-01' },
      ],
      metadata: {
        rowCount: 4,
        executionTime: '0.086s',
        affectedRows: 4,
      }
    },
    products: {
      data: [
        { product_id: 101, name: 'Laptop Pro', category: 'Electronics', price: 1299.99, stock: 50 },
        { product_id: 102, name: 'Wireless Mouse', category: 'Accessories', price: 29.99, stock: 100 },
        { product_id: 103, name: 'Gaming Monitor', category: 'Electronics', price: 499.99, stock: 25 },
        { product_id: 104, name: 'Mechanical Keyboard', category: 'Accessories', price: 149.99, stock: 75 },
      ],
      metadata: {
        rowCount: 4,
        executionTime: '0.092s',
        affectedRows: 4,
      }
    },
    orders: {
      data: [
        { order_id: 1001, user_id: 1, total_amount: 1329.98, status: 'completed', order_date: '2024-03-10' },
        { order_id: 1002, user_id: 2, total_amount: 499.99, status: 'processing', order_date: '2024-03-11' },
        { order_id: 1003, user_id: 3, total_amount: 179.98, status: 'pending', order_date: '2024-03-12' },
      ],
      metadata: {
        rowCount: 3,
        executionTime: '0.078s',
        affectedRows: 3,
      }
    },
    aggregate: {
      data: [
        { category: 'Electronics', total_sales: 8999.93, avg_price: 899.99, item_count: 10 },
        { category: 'Accessories', total_sales: 2999.80, avg_price: 89.99, item_count: 25 },
        { category: 'Software', total_sales: 1499.95, avg_price: 49.99, item_count: 15 },
      ],
      metadata: {
        rowCount: 3,
        executionTime: '0.156s',
        affectedRows: 3,
      }
    },
    empty: {
      data: [],
      metadata: {
        rowCount: 0,
        executionTime: '0.042s',
        affectedRows: 0,
      }
    },
    update: {
      data: [],
      metadata: {
        rowCount: 0,
        executionTime: '0.064s',
        affectedRows: 5,
      }
    }
  }

  const handleExecute = async () => {
    if (!output.trim()) {
      showError('Please generate or write a SQL query first')
      return
    }
    
    if (!selectedDb) {
      showError('Please connect to a database first')
      return
    }

    setIsExecuting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Determine which mock data to return based on the query content
      const query = output.toLowerCase()
      let mockResult

      if (query.includes('update ') || query.includes('delete ') || query.includes('insert ')) {
        mockResult = mockDataScenarios.update
      } else if (query.includes('count(') || query.includes('sum(') || query.includes('avg(')) {
        mockResult = mockDataScenarios.aggregate
      } else if (query.includes('product')) {
        mockResult = mockDataScenarios.products
      } else if (query.includes('order')) {
        mockResult = mockDataScenarios.orders
      } else if (query.includes('user')) {
        mockResult = mockDataScenarios.users
      } else if (query.includes('where') && query.includes('not exists')) {
        mockResult = mockDataScenarios.empty
      } else {
        // Default to users if no specific match
        mockResult = mockDataScenarios.users
      }

      setResults(mockResult)
      showSuccess(mockResult.data.length > 0 ? 'Query executed successfully!' : 'Query executed successfully (no results)')
    } catch (error) {
      showError('Failed to execute query')
      console.error('Failed to execute query:', error)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    showSuccess('Query copied to clipboard!')
  }

  const handleSave = () => {
    if (!output) return
    setSavedQueries([...savedQueries, { query: output, timestamp: new Date() }])
    showSuccess('Query saved successfully!')
  }

  const handleDownload = () => {
    if (!results) return
    const csv = [
      Object.keys(results.data[0]).join(','),
      ...results.data.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const element = document.createElement('a')
    const file = new Blob([csv], { type: 'text/csv' })
    element.href = URL.createObjectURL(file)
    element.download = 'query_results.csv'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    showSuccess('Results downloaded successfully!')
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground relative">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Toggle Database Explorer"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>

        {/* Database Sidebar - Left Section */}
        <div className={`w-full sm:w-80 lg:w-64 xl:w-72 flex-shrink-0 border-r border-border bg-background transition-all duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative h-full z-40 overflow-hidden`}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold tracking-tight">Databases</h2>
                <button 
                  className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:shadow-sm"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
              <div className="space-y-2">
                {mockDatabases.map(db => (
                  <div key={db.name} className="space-y-1">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleSelectDatabase(db.name)}
                      className={`flex items-center w-full p-3 rounded-lg text-sm transition-all duration-200 ${
                        selectedDb === db.name 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'hover:bg-accent hover:shadow-sm'
                      }`}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      {db.name}
                    </motion.button>
                    {selectedDb === db.name && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-4"
                      >
                        {db.schemas.map(schema => (
                          <div key={schema.name}>
                            <button
                              onClick={() => toggleSchema(db.name, schema.name)}
                              className="flex items-center w-full p-2.5 text-sm hover:bg-accent rounded-lg transition-all duration-200"
                            >
                              {expandedSchemas[`${db.name}.${schema.name}`] ? (
                                <ChevronDown className="w-3 h-3 mr-2" />
                              ) : (
                                <ChevronRight className="w-3 h-3 mr-2" />
                              )}
                              <TableProperties className="w-4 h-4 mr-2" />
                              {schema.name}
                            </button>
                            {expandedSchemas[`${db.name}.${schema.name}`] && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="ml-7"
                              >
                                {schema.tables.map(table => (
                                  <div key={table.name}>
                                    <button
                                      onClick={() => handleTableClick(table.name)}
                                      className="flex items-center w-full p-2.5 text-sm hover:bg-accent rounded-lg transition-all duration-200 group"
                                    >
                                      {expandedTables[`${db.name}.${schema.name}.${table.name}`] ? (
                                        <ChevronDown className="w-3 h-3 mr-2" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3 mr-2" />
                                      )}
                                      <Table className="w-4 h-4 mr-2" />
                                      {table.name}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleTableClick(table.name)
                                        }}
                                        className="ml-auto opacity-0 group-hover:opacity-100 p-1.5 hover:bg-accent/20 rounded-md transition-all duration-200"
                                        title="Query table"
                                      >
                                        <Play className="w-3 h-3" />
                                      </button>
                                    </button>
                                    {expandedTables[`${db.name}.${schema.name}.${table.name}`] && (
                                      <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="ml-7 border-l border-border"
                                      >
                                        {table.columns.map(column => (
                                          <div
                                            key={column.name}
                                            className="flex items-center p-2 text-sm"
                                          >
                                            {column.isPrimary ? (
                                              <Key className="w-3 h-3 mr-2 text-primary" />
                                            ) : (
                                              <Columns className="w-3 h-3 mr-2" />
                                            )}
                                            <span className="text-foreground">
                                              {column.name}
                                            </span>
                                            <span className="ml-2 text-xs text-muted-foreground">
                                              {column.type}
                                            </span>
                                          </div>
                                        ))}
                                      </motion.div>
                                    )}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background relative">
          <div className="h-full overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 space-y-6">
              {/* Mode Toggle */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4"
              >
                <div className="flex items-center space-x-4 bg-background p-1.5 rounded-lg border border-border shadow-sm">
                  <button
                    onClick={() => setAiMode('natural')}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg flex-1 justify-center transition-all duration-200 ${
                      aiMode === 'natural'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-accent hover:shadow-sm'
                    }`}
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Natural Language</span>
                  </button>
                  <button
                    onClick={() => setAiMode('sql')}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg flex-1 justify-center transition-all duration-200 ${
                      aiMode === 'sql'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-accent hover:shadow-sm'
                    }`}
                  >
                    <Database className="w-4 h-4" />
                    <span>SQL</span>
                  </button>
                </div>
              </motion.div>

              {/* Input Section */}
              {aiMode === 'natural' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-background p-4 lg:p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold tracking-tight mb-4 lg:mb-0">Describe your query</h2>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">SQL Dialect:</label>
                        <select
                          value={selectedDialect}
                          onChange={(e) => setSelectedDialect(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Describe what you want to query in plain English. For example: 'Show me all users who have placed more than 5 orders'"
                      className="w-full h-32 lg:h-40 p-4 text-base border border-border rounded-xl bg-accent text-foreground resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={handleNaturalLanguageQuery}
                    disabled={isLoading || !input.trim() || !selectedDb}
                    className="w-full mt-4 px-5 py-3.5 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-lg flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm font-medium"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        <span>Generate SQL</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* SQL Editor Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-background p-4 lg:p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4 mb-4 lg:mb-0">
                    <h2 className="text-xl font-semibold tracking-tight">SQL Query</h2>
                    {selectedDb && (
                      <span className="px-4 py-1.5 bg-accent text-accent-foreground rounded-lg text-sm shadow-sm">
                        Connected to: {selectedDb}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleExplainQuery}
                      disabled={!output || isExplaining}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 tooltip"
                      title="Explain Query"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleOptimizeQuery}
                      disabled={!output || isOptimizing}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 tooltip"
                      title="Optimize Query"
                    >
                      <Zap className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCopy}
                      disabled={!output}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 tooltip"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!output}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 tooltip"
                      title="Save query"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="relative min-h-[200px] max-h-[400px] rounded-xl overflow-hidden border border-border shadow-sm">
                  <Editor
                    height="200px"
                    defaultLanguage="sql"
                    value={output}
                    onChange={setOutput}
                    theme={isDark ? "vs-dark" : "light"}
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
                      scrollbar: {
                        vertical: 'hidden',
                        horizontal: 'hidden',
                        verticalScrollbarSize: 0,
                        horizontalScrollbarSize: 0
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-4 space-y-4 lg:space-y-0">
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex-1 mr-6 p-4 lg:p-5 bg-accent rounded-lg shadow-sm"
                    >
                      <h3 className="text-sm font-medium mb-3">AI Suggestions:</h3>
                      <ul className="space-y-2.5">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start space-x-2.5 text-sm text-muted-foreground">
                            <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                  <button
                    onClick={handleExecute}
                    disabled={isExecuting || !output.trim() || !selectedDb}
                    className="px-6 py-3.5 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-lg flex items-center space-x-3 transition-all duration-200 shadow-sm font-medium min-w-[150px] justify-center sticky bottom-4 lg:static"
                  >
                    {isExecuting ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Execute</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Results Section */}
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden mb-20"
                >
                  <div className="p-4 lg:p-5 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                      <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-6">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{results.metadata.executionTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Table className="w-4 h-4" />
                          <span>{results.metadata.rowCount} rows</span>
                        </div>
                      </div>
                      <button
                        onClick={handleDownload}
                        className="px-5 py-2.5 bg-accent hover:bg-accent/90 rounded-lg flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-accent/80 backdrop-blur-sm sticky top-0">
                          {results.data.length > 0 && Object.keys(results.data[0]).map((key) => (
                            <th
                              key={key}
                              className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {results.data.map((row, i) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="hover:bg-accent/50 transition-colors duration-150"
                          >
                            {Object.values(row).map((value, j) => (
                              <td
                                key={j}
                                className="px-6 py-4 text-sm whitespace-nowrap"
                              >
                                {value}
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                {/* Prompts History */}
                <div>
                  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold tracking-tight">Prompts History</h2>
                      <button 
                        className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 hover:shadow-sm"
                        title="Clear History"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {savedQueries.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-accent rounded-lg cursor-pointer hover:bg-accent/90 transition-all duration-200 border border-border hover:shadow-md"
                        onClick={() => setInput(item.query)}
                      >
                        <p className="text-sm text-foreground mb-2 line-clamp-2">{item.query}</p>
                        <p className="text-xs text-muted-foreground flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                        </p>
                      </motion.div>
                    ))}
                    {savedQueries.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">
                          No prompts history yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Execution History */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Execution History</h2>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    {[...executionHistory, ...(results ? [{
                      query: output,
                      timestamp: new Date(),
                      metadata: results.metadata
                    }] : [])].map((execution, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-accent rounded-lg border border-border hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {index === 0 && results ? (
                              <span className="text-primary">Latest Execution</span>
                            ) : (
                              'Previous Execution'
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">{execution.metadata.executionTime}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {execution.query}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-1 bg-background text-foreground rounded-full">
                            Rows: {execution.metadata.rowCount}
                          </span>
                          <span className="px-2 py-1 bg-background text-foreground rounded-full">
                            Affected: {execution.metadata.affectedRows}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {executionHistory.length === 0 && !results && (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">
                          No execution history yet
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

export default QueryBuilder 