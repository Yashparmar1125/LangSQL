import React from 'react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
    <span className="text-sm">Processing...</span>
  </div>
);

export default LoadingSpinner; 