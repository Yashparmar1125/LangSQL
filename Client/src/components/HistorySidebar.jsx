import React from 'react';
import { motion } from 'framer-motion';
import { Clock, History } from 'lucide-react';

const HistorySidebar = ({
  isOpen,
  promptHistory,
  executionHistory,
  results,
  editorContent,
  onClearPromptHistory,
  onSelectPrompt
}) => {
  return (
    <div className={`w-full sm:w-80 lg:w-72 xl:w-80 flex-shrink-0 border-l border-border bg-background transition-all duration-300 transform ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
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
                    onClick={onClearPromptHistory}
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {promptHistory.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-accent rounded-lg cursor-pointer hover:bg-accent/90 transition-all duration-200 border border-border hover:shadow-md"
                    onClick={() => onSelectPrompt(item.prompt)}
                  >
                    <p className="text-sm text-foreground mb-2 line-clamp-2">{item.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <span className="px-2 py-1 bg-background text-foreground rounded-full">
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {promptHistory.length === 0 && (
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
                  query: editorContent,
                  timestamp: new Date(),
                  response: {
                    metadata: results.metadata
                  }
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
                      <span className="text-xs text-muted-foreground">
                        {execution.responseTime || execution.response?.metadata?.executionTime || 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {execution.query}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-1 bg-background text-foreground rounded-full">
                        Rows: {execution.rows || execution.response?.metadata?.rowCount || 0}
                      </span>
                      <span className="px-2 py-1 bg-background text-foreground rounded-full">
                        Affected: {execution.affectedRows || execution.response?.metadata?.affectedRows || 0}
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
  );
};

export default HistorySidebar; 