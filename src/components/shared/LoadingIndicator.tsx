
import React from 'react';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingIndicator = ({ size = 'md' }: LoadingIndicatorProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-t-2 border-b-2',
    md: 'h-8 w-8 border-t-2 border-b-2',
    lg: 'h-10 w-10 border-t-3 border-b-3'
  };

  return (
    <div className="flex justify-center items-center py-8">
      <div className={`animate-spin ${sizeClasses[size]} border-marketplace-primary rounded-full`}></div>
    </div>
  );
};

export default LoadingIndicator;
