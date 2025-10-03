import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, ChevronRight, ChevronDown, Table, Columns, Key, RefreshCw } from 'lucide-react';

const DatabaseSidebar = ({
  isOpen,
  connections,
  selectedDb,
  databaseMetadata,
  expandedSchemas,
  expandedTables,
  onSelectDatabase,
  onToggleSchema,
  onToggleTable,
  onTableClick,
  onRefresh
}) => {
  const navigate = useNavigate();

  return (
    <div className={`w-full sm:w-80 lg:w-64 xl:w-72 flex-shrink-0 border-r border-border bg-background transition-all duration-300 transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 fixed lg:relative h-full z-40 overflow-hidden`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Databases</h2>
            <button 
              className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:shadow-sm"
              title="Refresh"
              onClick={onRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
          <div className="space-y-2">
            {connections.map(conn => (
              <div key={conn.id} className="space-y-1">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  onClick={() => onSelectDatabase(conn.id)}
                  className={`flex items-center w-full p-3 rounded-lg text-sm transition-all duration-200 ${
                    selectedDb === conn.id 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-accent hover:shadow-sm'
                  }`}
                >
                  <Database className="w-4 h-4 mr-2" />
                  {conn.name}
                </motion.button>
                {selectedDb === conn.id && databaseMetadata && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-4"
                  >
                    {databaseMetadata.tables?.map(table => (
                      <div key={table.name}>
                        <button
                          onClick={() => onToggleTable(conn.id, table.name)}
                          className="flex items-center w-full p-2.5 text-sm hover:bg-accent rounded-lg transition-all duration-200"
                        >
                          {expandedTables[`${conn.id}.${table.name}`] ? (
                            <ChevronDown className="w-3 h-3 mr-2" />
                          ) : (
                            <ChevronRight className="w-3 h-3 mr-2" />
                          )}
                          <Table className="w-4 h-4 mr-2" />
                          {table.name}
                        </button>
                        {expandedTables[`${conn.id}.${table.name}`] && (
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
            {connections.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No database connections available
                </p>
                <button
                  onClick={() => navigate('/manage-databases')}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                >
                  Add Connection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSidebar; 