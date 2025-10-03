import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const KeyboardShortcutsModal = ({ show, onClose }) => {
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
          <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
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
  );
};

export default KeyboardShortcutsModal; 