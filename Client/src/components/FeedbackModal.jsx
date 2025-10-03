import React from 'react';
import { motion } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, MessageSquare, Star } from 'lucide-react';

const FeedbackModal = ({ show, onClose, onSubmit }) => {
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');
  const [category, setCategory] = React.useState('general');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      rating,
      feedback,
      category,
      timestamp: new Date()
    });
    onClose();
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
        className="bg-background p-6 rounded-xl border border-border shadow-lg max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Query Feedback</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 rounded-lg transition-all ${
                    rating >= star
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-muted-foreground hover:text-yellow-500'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="general">General</option>
              <option value="performance">Performance</option>
              <option value="accuracy">Accuracy</option>
              <option value="suggestions">Suggestions</option>
              <option value="bug">Bug Report</option>
            </select>
          </div>

          {/* Feedback Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Detailed Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[100px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!rating || !feedback.trim()}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Feedback
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackModal; 