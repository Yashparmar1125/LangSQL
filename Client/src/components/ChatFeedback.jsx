import React from 'react';
import { motion } from 'framer-motion';
import { X, Send, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

const ChatFeedback = ({ show, onClose, onSubmit }) => {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [feedback, setFeedback] = React.useState(null);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: 'Thank you for your feedback! Is there anything specific about the query results you\'d like to discuss?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    const feedbackMessage = {
      type: 'user',
      content: `Feedback: ${type === 'like' ? '👍' : '👎'}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, feedbackMessage]);
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-background rounded-xl border border-border shadow-lg max-w-2xl w-full h-[600px] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Query Feedback</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Feedback */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={() => handleFeedback('like')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                feedback === 'like'
                  ? 'bg-green-500/10 text-green-500'
                  : 'hover:bg-accent text-muted-foreground'
              }`}
              title="Like results"
            >
              <ThumbsUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleFeedback('dislike')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                feedback === 'dislike'
                  ? 'bg-red-500/10 text-red-500'
                  : 'hover:bg-accent text-muted-foreground'
              }`}
              title="Dislike results"
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatFeedback; 