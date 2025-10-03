import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Table, Zap, Copy, Download, MessageSquare } from 'lucide-react';
import ChatFeedback from './ChatFeedback';

const ResultsTable = ({ results, onCopy, onDownload, onFeedback }) => {
  const [showChatFeedback, setShowChatFeedback] = React.useState(false);

  const handleFeedback = () => {
    setShowChatFeedback(true);
  };

  const handleChatSubmit = (messages) => {
    if (onFeedback) {
      onFeedback('chat', messages);
    }
    setShowChatFeedback(false);
  };

  return (
    <>
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
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>{results.metadata.affectedRows} affected</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Feedback Button */}
            <button
              onClick={handleFeedback}
              className="px-4 py-2 bg-accent hover:bg-accent/90 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feedback</span>
            </button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center space-x-2">
              <button
                onClick={onCopy}
                className="p-2.5 hover:bg-accent rounded-lg transition-all duration-200"
                title="Copy results"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={onDownload}
                className="px-5 py-2.5 bg-accent hover:bg-accent/90 rounded-lg flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
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

      {/* Chat Feedback Modal */}
      <ChatFeedback
        show={showChatFeedback}
        onClose={() => setShowChatFeedback(false)}
        onSubmit={handleChatSubmit}
      />
    </>
  );
};

export default ResultsTable; 