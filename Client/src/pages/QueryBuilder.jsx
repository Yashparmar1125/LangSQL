import { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import queryAutocomplete from "../services/autocomplete/trie";
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
  X,
  Keyboard,
  Info,
  Bot,
  Lightbulb
} from 'lucide-react'
// Lazy load Monaco editor
const Editor = lazy(() => import('@monaco-editor/react'))
import DashboardLayout from '../components/layout/DashboardLayout'
import { useSelector, useDispatch } from 'react-redux'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'
import { sqlAPI } from '../services/api/axios.api'
import { databaseAPI } from '../services/api/axios.api'
import { decryptData } from '../services/encryption/aes.encryption'

// Lazy load components
const LoadingSpinner = lazy(() => import('../components/LoadingSpinner'))
const KeyboardShortcutsModal = lazy(() => import('../components/KeyboardShortcutsModal'))
const ResultsTable = lazy(() => import('../components/ResultsTable'))
const HistorySidebar = lazy(() => import('../components/HistorySidebar'))
const DatabaseSidebar = lazy(() => import('../components/DatabaseSidebar'))

// Enhanced feedback for database connection
const ConnectionStatus = ({ selectedDb, connections }) => {
  const connection = connections.find(conn => conn.id === selectedDb);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedDb ? 'connected' : 'disconnected'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className={`px-4 py-1.5 rounded-lg text-sm flex items-center space-x-2 ${
          selectedDb 
            ? 'bg-emerald-500/10 text-emerald-500'
            : 'bg-amber-500/10 text-amber-500'
        }`}
      >
        <div className={`w-2 h-2 rounded-full ${selectedDb ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <span>{selectedDb ? `Connected to ${connection?.name || 'Unknown Database'}` : 'No database selected'}</span>
      </motion.div>
    </AnimatePresence>
  )
}

const QueryBuilder = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedDb, setSelectedDb] = useState(null)
  const [selectedDialect, setSelectedDialect] = useState('postgresql')
  const [expandedSchemas, setExpandedSchemas] = useState({})
  const [expandedTables, setExpandedTables] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [results, setResults] = useState(null)
  const [savedQueries, setSavedQueries] = useState([])
  const [executionHistory, setExecutionHistory] = useState([])
  const { isDark } = useSelector((state) => state.theme)
  const { showSuccess, showError } = useToast()
  const { connections, activeConnection } = useSelector((state) => state.database)
  const { user } = useSelector((state) => state.auth)
  const [explanation, setExplanation] = useState(null)
  const [optimization, setOptimization] = useState(null)
  const [isExplaining, setIsExplaining] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [editorInstance, setEditorInstance] = useState(null)
  const [databaseMetadata, setDatabaseMetadata] = useState(null)
  const [promptHistory, setPromptHistory] = useState([])
  const [suggestion, setSuggestion] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inlineSuggestion, setInlineSuggestion] = useState('');
  const inputRef = useRef(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [commandPalettePosition, setCommandPalettePosition] = useState({ x: 0, y: 0 })
  const [editorContent, setEditorContent] = useState(`-- Welcome to SQL Query Builder!
-- Press '/' to start using AI to generate SQL queries
-- Example: "Show me all users who made more than 5 orders"
-- 
-- Tips:
-- 1. Type '/' to open AI prompt
-- 2. Describe your query in plain English
-- 3. Press Tab to complete suggestions
-- 4. Press Enter to generate SQL
-- 5. Press Ctrl/Cmd + Enter to execute

`)
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('')
  const [showAIPrompt, setShowAIPrompt] = useState(false)
  const [aiPromptValue, setAIPromptValue] = useState('')
  const [aiInlineSuggestion, setAIInlineSuggestion] = useState('')
  const [aiSuggestions, setAISuggestions] = useState([])
  const [selectedAIIndex, setSelectedAIIndex] = useState(-1)
  const aiPromptRef = useRef(null)
  const [queryFeedback, setQueryFeedback] = useState(null);
  const [showAIOnboarding, setShowAIOnboarding] = useState(false);

  // Add this useEffect for handling suggestions
  useEffect(() => {
    const getSuggestions = () => {
      if (!editorContent.trim()) {
        setSuggestion([]);
        setInlineSuggestion('');
        return;
      }

      try {
        const results = queryAutocomplete.getSuggestions(editorContent);
        console.log('Autocomplete suggestions:', results);
        
        const bestMatch = results.find(r => r.toLowerCase().startsWith(editorContent.toLowerCase()));
        if (bestMatch) {
          setInlineSuggestion(bestMatch.slice(editorContent.length));
        } else {
          setInlineSuggestion('');
        }
        
        setSuggestion(results);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error getting suggestions:', error);
        setSuggestion([]);
        setInlineSuggestion('');
      }
    };

    const timeoutId = setTimeout(getSuggestions, 100);
    return () => clearTimeout(timeoutId);
  }, [editorContent]);

  // Add this function to handle key events
  const handleKeyDown = (e) => {
    if (inlineSuggestion) {
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        setEditorContent(editorContent + inlineSuggestion);
        setInlineSuggestion('');
        setSuggestion([]);
        setSelectedIndex(-1);
        return;
      }
    }

    if (suggestion.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < suggestion.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : suggestion.length - 1));
    } else if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex !== -1) {
        const selectedQuery = suggestion[selectedIndex];
        console.log('Selected query:', selectedQuery); // Debug log
        setEditorContent(selectedQuery);
        setSuggestion([]);
        setInlineSuggestion('');
        setSelectedIndex(-1);
      }
    }
  };

  // Add this function to handle suggestion selection
  const handleSelect = (query) => {
    console.log('Clicked query:', query);
    setEditorContent(query);
    setSuggestion([]);
    setInlineSuggestion('');
    setSelectedIndex(-1);
  };

  // Fetch database metadata when a connection is selected
  useEffect(() => {
    const fetchDatabaseMetadata = async () => {
      if (!selectedDb || !user?._id) return;

      try {
        const response = await databaseAPI.getConnectionDetails(selectedDb);
        if (response.sucess) {
          // The metadata is directly in response.metadata, no need to decrypt
          setDatabaseMetadata({
            id: response.metadata._id,
            db_name: response.metadata.db_name,
            tables: response.metadata.tables.map(table => ({
              name: table.name,
              description: table.description,
              columns: table.columns.map(column => ({
                name: column.name,
                type: column.type,
                isPrimary: column.indexed && column.unique,
                isIndexed: column.indexed,
                isUnique: column.unique,
                nullable: column.nullable,
                description: column.description,
                references: column.references
              }))
            })),
            lastUpdated: response.metadata.last_updated,
            createdAt: response.metadata.created_at
          });
      //    console.log(databaseMetadata)
        //  const buffer=await databaseAPI.getBufferQuestions(databaseMetadata)
         // console.log(buffer)
        } else {
          throw new Error(response.message || 'Failed to fetch metadata');
        }
      } catch (error) {
        console.error('Error fetching database metadata:', error);
        showError('Failed to load database metadata');
      }
    };

    fetchDatabaseMetadata();
  }, [selectedDb, user?._id]);

  useEffect(() => {
    if (databaseMetadata) {
      const fetchBuffer = async () => {
        try {
          const buffer = await databaseAPI.getBufferQuestions(databaseMetadata);
          console.log(buffer);
          localStorage.setItem("bufferData", JSON.stringify(buffer));
        } catch (error) {
          console.error('Error fetching buffer questions:', error);
        }
      };
  
      fetchBuffer();
    }
  }, [databaseMetadata]);

  // Fetch saved queries and execution history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [queryHistoryResponse, promptHistoryResponse] = await Promise.all([
          sqlAPI.getQueryHistory(),
          sqlAPI.getPromptHistory()
        ]);

        if (queryHistoryResponse.success) {
          setSavedQueries(queryHistoryResponse.data.savedQueries || []);
          setExecutionHistory(queryHistoryResponse.data.executionHistory || []);
        } else {
          throw new Error(queryHistoryResponse.message || 'Failed to fetch query history');
        }

        if (promptHistoryResponse.success) {
          setPromptHistory(promptHistoryResponse.data.prompts || []);
        } else {
          throw new Error(promptHistoryResponse.message || 'Failed to fetch prompt history');
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        showError('Failed to load history');
      }
    };

    fetchHistory();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle if not in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'enter':
            e.preventDefault()
            if (editorContent.trim() && selectedDb && !isExecuting) {
              handleExecute()
            }
            break
          case 's':
            e.preventDefault()
            if (editorContent.trim()) {
              handleSave()
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
  }, [editorContent, selectedDb, isExecuting])

  // Add Monaco editor command palette handling
  const handleEditorDidMount = (editor, monaco) => {
    setIsEditorReady(true)
    setEditorInstance(editor)

    // Add keydown event listener
    editor.onKeyDown((e) => {
      handleKeyDown(e);
    });

    // Configure SQL suggestions
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: 'SELECT',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'SELECT',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'FROM',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'FROM',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'WHERE',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'WHERE',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'GROUP BY',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'GROUP BY',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'ORDER BY',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'ORDER BY',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'JOIN',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'JOIN',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'LEFT JOIN',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'LEFT JOIN',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'RIGHT JOIN',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'RIGHT JOIN',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'INNER JOIN',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'INNER JOIN',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'OUTER JOIN',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'OUTER JOIN',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'COUNT',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'COUNT(${1:column})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'SUM',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'SUM(${1:column})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'AVG',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'AVG(${1:column})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'MAX',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'MAX(${1:column})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'MIN',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'MIN(${1:column})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          }
        ];

        // Add table suggestions if database metadata is available
        if (databaseMetadata?.tables) {
          databaseMetadata.tables.forEach(table => {
            suggestions.push({
              label: table.name,
              kind: monaco.languages.CompletionItemKind.Table,
              insertText: table.name,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            });

            // Add column suggestions
            table.columns.forEach(column => {
              suggestions.push({
                label: `${table.name}.${column.name}`,
                kind: monaco.languages.CompletionItemKind.Column,
                insertText: `${table.name}.${column.name}`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
              });
            });
          });
        }

        return { suggestions };
      }
    });

    // Handle command execution
    editor.onDidType((text) => {
      if (text === '/') {
        const position = editor.getPosition()
        const coords = editor.getScrolledVisiblePosition(position)
        const editorDom = editor.getDomNode()
        
        if (editorDom) {
          const rect = editorDom.getBoundingClientRect()
          setCommandPalettePosition({
            x: rect.left + coords.left,
            y: rect.top + coords.top + 20
          })
          setShowAIPrompt(true)
          // Focus the AI prompt input
          setTimeout(() => {
            if (aiPromptRef.current) {
              aiPromptRef.current.focus()
            }
          }, 0)
        }
      }
    })

    // Handle command selection
    editor.onDidChangeModelContent((e) => {
      const model = editor.getModel()
      if (!model) return

      e.changes.forEach(async (change) => {
        const lineContent = model.getLineContent(change.range.startLineNumber)
        if (lineContent.trim() === '/') {
          // Remove the "/" character
          editor.executeEdits('', [{
            range: {
              startLineNumber: change.range.startLineNumber,
              startColumn: change.range.startColumn - 1,
              endLineNumber: change.range.startLineNumber,
              endColumn: change.range.startColumn
            },
            text: ''
          }])
        }
      })
    })
  }

  // Add this function to handle AI input changes
  const handleAIInputChange = (e) => {
    const value = e.target.value;
    setAIPromptValue(value);

    if (!value.trim()) {
      setAIInlineSuggestion('');
      setAISuggestions([]);
      return;
    }

    try {
      // Get suggestions from queryAutocomplete service which uses Trie
      const results = queryAutocomplete.getSuggestions(value);
      console.log('AI Input suggestions from Trie:', results);
      
      // Find the best match for inline suggestion
      const bestMatch = results.find(r => {
        // Check if the suggestion starts with the current input
        const startsWith = r.toLowerCase().startsWith(value.toLowerCase());
        // Check if the suggestion contains the current input as a word
        const containsWord = r.toLowerCase().split(' ').some(word => word.startsWith(value.toLowerCase()));
        return startsWith || containsWord;
      });

      if (bestMatch) {
        // If the suggestion starts with the input, show the rest
        if (bestMatch.toLowerCase().startsWith(value.toLowerCase())) {
          setAIInlineSuggestion(bestMatch.slice(value.length));
        } else {
          // If it's a word match, show the rest of the line
          const words = bestMatch.split(' ');
          const currentWordIndex = words.findIndex(word => 
            word.toLowerCase().startsWith(value.toLowerCase())
          );
          if (currentWordIndex !== -1) {
            setAIInlineSuggestion(' ' + words.slice(currentWordIndex + 1).join(' '));
          }
        }
      } else {
        setAIInlineSuggestion('');
      }
      
      // Filter and sort suggestions based on relevance
      const filteredSuggestions = results
        .filter(r => {
          // Include suggestions that start with the input
          const startsWith = r.toLowerCase().startsWith(value.toLowerCase());
          // Include suggestions that contain the input as a word
          const containsWord = r.toLowerCase().split(' ').some(word => 
            word.startsWith(value.toLowerCase())
          );
          return startsWith || containsWord;
        })
        .sort((a, b) => {
          // Prioritize suggestions that start with the input
          const aStartsWith = a.toLowerCase().startsWith(value.toLowerCase());
          const bStartsWith = b.toLowerCase().startsWith(value.toLowerCase());
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          // Then sort by length (shorter suggestions first)
          return a.length - b.length;
        });

      setAISuggestions(filteredSuggestions);
      setSelectedAIIndex(-1);

      // If we have suggestions, add the current input to the buffer
      if (filteredSuggestions.length > 0) {
        queryAutocomplete.addToBuffer(value);
      }
    } catch (error) {
      console.error('Error getting AI input suggestions:', error);
      setAISuggestions([]);
      setAIInlineSuggestion('');
    }
  };

  // Add this function to handle AI input key events
  const handleAIKeyDown = (e) => {
    if (aiInlineSuggestion) {
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        const newValue = aiPromptValue + aiInlineSuggestion;
        setAIPromptValue(newValue);
        setAIInlineSuggestion('');
        setAISuggestions([]);
        // Add the completed suggestion to the buffer
        queryAutocomplete.addToBuffer(newValue);
        return;
      }
    }

    if (aiSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedAIIndex((prev) => (prev + 1 < aiSuggestions.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedAIIndex((prev) => (prev - 1 >= 0 ? prev - 1 : aiSuggestions.length - 1));
    } else if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      if (selectedAIIndex !== -1) {
        const selectedQuery = aiSuggestions[selectedAIIndex];
        setAIPromptValue(selectedQuery);
        setAISuggestions([]);
        setAIInlineSuggestion('');
        setSelectedAIIndex(-1);
        // Add the selected suggestion to the buffer
        queryAutocomplete.addToBuffer(selectedQuery);
      }
    } else if (e.key === "Escape") {
      setShowAIPrompt(false);
      setAIPromptValue('');
      setAISuggestions([]);
      setAIInlineSuggestion('');
      setSelectedAIIndex(-1);
    }
  };

  // Handle AI prompt submission
  const handleAIPromptSubmit = async (e) => {
    e.preventDefault()
    if (!aiPromptValue.trim()) return

    setIsLoading(true)
    try {
      const response = await sqlAPI.generateQuerry(aiPromptValue, selectedDialect, selectedDb)
      if (response.success && editorInstance) {
        editorInstance.setValue(response.data.sql_query)
        showSuccess('Query generated successfully!')
      }
    } catch (error) {
      showError('Failed to generate query')
    } finally {
      setIsLoading(false)
      setShowAIPrompt(false)
      setAIPromptValue('')
    }
  }

  // Loading indicator component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Processing...</span>
    </div>
  )

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
                    <span>Execute Query</span>
                    <kbd className="px-2 py-1 bg-background rounded-md">⌘/Ctrl + Enter</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-accent rounded-lg">
                    <span>Save Query</span>
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
                    <span>Format Query</span>
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

  const dialects = [
    { id: 'postgresql', name: 'PostgreSQL' },
    { id: 'mysql', name: 'MySQL' },
    { id: 'trino', name: 'Trino' },
    { id: 'spark', name: 'Spark SQL' }
  ]

  const toggleSchema = (dbName, schemaName) => {
    setExpandedSchemas(prev => ({
      ...prev,
      [`${dbName}.${schemaName}`]: !prev[`${dbName}.${schemaName}`]
    }))
  }

  const toggleTable = (dbName, tableName) => {
    setExpandedTables(prev => ({
      ...prev,
      [`${dbName}.${tableName}`]: !prev[`${dbName}.${tableName}`]
    }))
  }

  const handleSelectDatabase = (dbId) => {
    setSelectedDb(dbId);
    const connection = connections.find(conn => conn.id === dbId);
    if (connection) {
      setSelectedDialect(connection.type);
      showSuccess(`Connected to ${connection.name}`);
      console.log("content:",databaseMetadata)
    }
  };

  const handleTableClick = (tableName) => {
    setEditorContent(`SELECT * FROM ${tableName} LIMIT 100;`);
  };

  const handleNaturalLanguageQuery = async () => {
    if (!naturalLanguageInput.trim() || !selectedDb) {
      showError('Please enter a query and select a database')
      return
    }
    
    setIsLoading(true)
    try {
      const response = await sqlAPI.generateQuerry(naturalLanguageInput, selectedDialect, selectedDb)
      
      const query = response.data.sql_query
      setEditorContent(query)
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
    if (!editorContent.trim()) return
    
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
    if (!editorContent.trim()) return
    
    setIsOptimizing(true)
    try {
      // TODO: Call your AI service to optimize the query
      await new Promise(resolve => setTimeout(resolve, 800))
      setOptimization({
        optimizedQuery: editorContent.replace('SELECT *', 'SELECT id, username, email'),
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

  const handleExecute = async () => {
    if (!editorContent.trim()) {
      showError('Please generate or write a SQL query first')
      return
    }
    
    if (!selectedDb) {
      showError('Please connect to a database first')
      return
    }

    setIsExecuting(true)
    try {
      // Show loading state in the editor
      if (editorInstance) {
        editorInstance.updateOptions({
          readOnly: true,
          renderLineHighlight: 'none',
          minimap: { enabled: false }
        })
      }

      const response = await sqlAPI.executeQuery({
        query: editorContent,
        connectionId: selectedDb,
        dialect: selectedDialect
      })

      if (response.success) {
        const { results, metadata } = response.data;
        
        // Format the results for display
        const formattedResults = results.map(row => {
          const formattedRow = {};
          Object.entries(row).forEach(([key, value]) => {
            if (value === null) {
              formattedRow[key] = 'NULL';
            } else if (value instanceof Date) {
              formattedRow[key] = value.toISOString();
            } else {
              formattedRow[key] = value;
            }
          });
          return formattedRow;
        });

        setResults({
          data: formattedResults,
          metadata: {
            rowCount: metadata.rowCount,
            executionTime: metadata.executionTime,
            affectedRows: metadata.affectedRows,
            columns: metadata.columns
          }
        });

        // Add to execution history with success status
        setExecutionHistory(prev => [{
          query: editorContent,
          timestamp: new Date(),
          metadata: metadata,
          status: 'success'
        }, ...prev]);

        showSuccess(response.message || 'Query executed successfully!')
      } else {
        throw new Error(response.message || 'Failed to execute query')
      }
    } catch (error) {
      console.error('Failed to execute query:', error)
      showError(error.message || 'Failed to execute query')
      
      // Add to execution history with error status
      setExecutionHistory(prev => [{
        query: editorContent,
        timestamp: new Date(),
        error: error.message,
        status: 'error'
      }, ...prev]);
    } finally {
      setIsExecuting(false)
      // Reset editor options
      if (editorInstance) {
        editorInstance.updateOptions({
          readOnly: false,
          renderLineHighlight: 'all',
          minimap: { enabled: false }
        })
      }
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent)
    showSuccess('Query copied to clipboard!')
  }

  const handleSave = () => {
    if (!editorContent) return
    setSavedQueries([...savedQueries, { query: editorContent, timestamp: new Date() }])
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

  const handleClearPromptHistory = () => {
    setPromptHistory([])
    showSuccess('Prompt history cleared')
  }

  const handleFeedback = async (type, messages = null) => {
    setQueryFeedback(type);
    try {
      const feedbackData = {
        query: editorContent,
        feedback: type,
        connectionId: selectedDb,
        timestamp: new Date(),
        ...(type === 'chat' && messages && {
          messages: messages.map(msg => ({
            type: msg.type,
            content: msg.content,
            timestamp: msg.timestamp
          }))
        })
      };

      const response = await sqlAPI.submitFeedback(feedbackData);

      if (response.success) {
        showSuccess('Thank you for your feedback!');
      } else {
        throw new Error(response.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      showError('Failed to submit feedback');
    }
  };

  // Add loading fallback component
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingFallback />}>
        <KeyboardShortcutsModal 
          show={showKeyboardShortcuts} 
          onClose={() => setShowKeyboardShortcuts(false)} 
        />
      </Suspense>
      
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
        <Suspense fallback={<LoadingFallback />}>
          <DatabaseSidebar
            isOpen={isSidebarOpen}
            connections={connections}
            selectedDb={selectedDb}
            databaseMetadata={databaseMetadata}
            expandedSchemas={expandedSchemas}
            expandedTables={expandedTables}
            onSelectDatabase={handleSelectDatabase}
            onToggleSchema={toggleSchema}
            onToggleTable={toggleTable}
            onTableClick={handleTableClick}
            onRefresh={() => dispatch(fetchConnections())}
          />
        </Suspense>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background relative">
          <div className="h-full overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 space-y-6">
              {/* Header with Connection Status */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <h1 className="text-2xl font-bold">Query Builder</h1>
                <div className="flex items-center space-x-4">
                  <Suspense fallback={<LoadingFallback />}>
                    <ConnectionStatus selectedDb={selectedDb} connections={connections} />
                  </Suspense>
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

              {/* Single Editor Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-background p-4 lg:p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4 mb-4 lg:mb-0">
                    <h2 className="text-xl font-semibold tracking-tight">SQL Query</h2>
                    <Suspense fallback={<LoadingFallback />}>
                      <ConnectionStatus selectedDb={selectedDb} connections={connections} />
                    </Suspense>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleExplainQuery}
                      disabled={!editorContent || isExplaining}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 group relative"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                        Explain Query (/explain)
                      </span>
                    </button>
                    <button
                      onClick={handleOptimizeQuery}
                      disabled={!editorContent || isOptimizing}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 group relative"
                    >
                      <Zap className="w-5 h-5" />
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                        Optimize Query (/optimize)
                      </span>
                    </button>
                    <button
                      onClick={handleCopy}
                      disabled={!editorContent}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 group relative"
                    >
                      <Copy className="w-5 h-5" />
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                        Copy to clipboard
                      </span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!editorContent}
                      className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200 disabled:opacity-50 group relative"
                    >
                      <Save className="w-5 h-5" />
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                        Save query
                      </span>
                    </button>
                  </div>
                </div>

                <div className="relative min-h-[400px] rounded-xl overflow-hidden border border-border shadow-sm">
                  {!isEditorReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                      <Suspense fallback={<LoadingFallback />}>
                        <LoadingSpinner />
                      </Suspense>
                    </div>
                  )}
                  
                  {/* AI Hint Message */}
                  {!showAIPrompt && editorContent.trim() === '' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-4 left-4 right-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 flex items-center space-x-4 shadow-lg"
                    >
                      <div className="flex-shrink-0 bg-primary/10 p-2 rounded-lg">
                        <Wand2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-semibold text-primary">AI Query Generation</h3>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">New</span>
                        </div>
                        <p className="text-sm text-foreground">
                          Press <kbd className="px-2 py-1 bg-background text-foreground rounded text-xs font-mono">/</kbd> to start generating SQL queries using natural language
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Powered by AI</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Keyboard className="w-3 h-3" />
                            <span>Keyboard shortcut available</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => setShowAIPrompt(true)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2 shadow-sm"
                        >
                          <span>Try it now</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Execution Progress Overlay */}
                  {isExecuting && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                      <Suspense fallback={<LoadingFallback />}>
                        <LoadingSpinner />
                      </Suspense>
                      <div className="text-lg font-medium text-primary mb-2">Executing Query...</div>
                      <div className="text-sm text-muted-foreground">This may take a few moments</div>
                    </div>
                  )}

                  <Suspense fallback={<LoadingFallback />}>
                    <Editor
                      height="400px"
                      defaultLanguage="sql"
                      value={editorContent}
                      onChange={setEditorContent}
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
                        renderLineHighlight: isExecuting ? 'none' : 'all',
                        smoothScrolling: true,
                        cursorSmoothCaretAnimation: true,
                        quickSuggestions: {
                          other: true,
                          comments: true,
                          strings: true
                        },
                        suggestOnTriggerCharacters: true,
                        acceptSuggestionOnEnter: "on",
                        tabCompletion: "on",
                        readOnly: isExecuting,
                        scrollbar: {
                          vertical: 'hidden',
                          horizontal: 'hidden',
                          verticalScrollbarSize: 0,
                          horizontalScrollbarSize: 0
                        },
                        inlineSuggest: {
                          enabled: true,
                          mode: "subword"
                        }
                      }}
                    />
                  </Suspense>

                  {/* AI Prompt Input */}
                  {showAIPrompt && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute bg-background/95 backdrop-blur-sm border border-border shadow-lg z-50 w-full"
                      style={{
                        left: 0,
                        top: 0,
                        borderTopLeftRadius: '0.75rem',
                        borderTopRightRadius: '0.75rem',
                        borderBottom: '1px solid var(--border)'
                      }}
                    >
                      <form onSubmit={handleAIPromptSubmit} className="p-4">
                        <div className="flex items-center justify-between space-x-4 mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full">
                              <Wand2 className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium text-primary">AI Query Generation</span>
                            </div>
                            <div className="h-4 w-px bg-border" />
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>Press</span>
                              <kbd className="px-1.5 py-0.5 bg-background text-foreground rounded text-xs">Tab</kbd>
                              <span>to complete</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <select
                              value={selectedDialect}
                              onChange={(e) => setSelectedDialect(e.target.value)}
                              className="px-3 py-1.5 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            >
                              {dialects.map(dialect => (
                                <option key={dialect.id} value={dialect.id}>
                                  {dialect.name}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAIPrompt(false)
                                setAIPromptValue('')
                                setAISuggestions([])
                                setAIInlineSuggestion('')
                                setSelectedAIIndex(-1)
                              }}
                              className="p-2 hover:bg-accent rounded-lg transition-colors"
                              title="Close AI prompt"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <span className="text-muted-foreground text-sm">/</span>
                          </div>
                          <div className="relative">
                            <input
                              ref={aiPromptRef}
                              type="text"
                              value={aiPromptValue}
                              onChange={handleAIInputChange}
                              onKeyDown={handleAIKeyDown}
                              placeholder="Describe your query in natural language..."
                              className="w-full pl-8 pr-24 py-3 bg-background text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                              autoFocus
                            />
                            {aiInlineSuggestion && (
                              <div className="absolute inset-0 pointer-events-none">
                                <span className="pl-8 text-muted-foreground/50">
                                  {aiPromptValue}
                                  <span className="text-muted-foreground">{aiInlineSuggestion}</span>
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="absolute inset-y-0 right-3 flex items-center space-x-2">
                            {isLoading ? (
                              <div className="flex items-center space-x-2 px-3">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm text-muted-foreground">Generating...</span>
                              </div>
                            ) : (
                              <button
                                type="submit"
                                disabled={!aiPromptValue.trim()}
                                className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
                              >
                                <span>Generate</span>
                                <kbd className="px-1.5 py-0.5 text-xs bg-primary-foreground/20 rounded">↵</kbd>
                              </button>
                            )}
                          </div>
                        </div>
                        {aiSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 space-y-1 max-h-[200px] overflow-y-auto"
                          >
                            {aiSuggestions.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setAIPromptValue(item);
                                  setAISuggestions([]);
                                  setAIInlineSuggestion('');
                                  setSelectedAIIndex(-1);
                                }}
                                className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                                  selectedAIIndex === index
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-accent text-foreground'
                                }`}
                              >
                                {item}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </form>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleExecute}
                    disabled={isExecuting || !editorContent.trim() || !selectedDb}
                    className="group px-6 py-3.5 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-lg flex items-center space-x-3 transition-all duration-200 shadow-sm font-medium min-w-[150px] justify-center relative overflow-hidden"
                  >
                    {isExecuting ? (
                      <>
                        <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        <span>Executing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Execute</span>
                        <kbd className="absolute right-2 top-2 text-xs bg-primary-foreground/20 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          ⌘/Ctrl + ↵
                        </kbd>
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
                  <Suspense fallback={<LoadingFallback />}>
                    <ResultsTable
                      results={results}
                      onCopy={handleCopy}
                      onDownload={handleDownload}
                      onFeedback={handleFeedback}
                    />
                  </Suspense>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* History Sidebar - Right Section */}
        <Suspense fallback={<LoadingFallback />}>
          <HistorySidebar
            isOpen={isHistoryOpen}
            promptHistory={promptHistory}
            executionHistory={executionHistory}
            results={results}
            editorContent={editorContent}
            onClearPromptHistory={handleClearPromptHistory}
            onSelectPrompt={(prompt) => setEditorContent(prompt)}
          />
        </Suspense>

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
