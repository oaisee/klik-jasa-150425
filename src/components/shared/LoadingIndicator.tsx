
import { useState, useEffect } from 'react';

interface LoadingIndicatorProps {
  size?: 'sm' | 'default' | 'lg';
  text?: string;
}

const LoadingIndicator = ({ size = 'default', text }: LoadingIndicatorProps) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const dotSizeMap = {
    sm: 'w-1 h-1',
    default: 'w-1.5 h-1.5',
    lg: 'w-2 h-2'
  };

  // Create 12 dots for the spinner
  const dots = Array.from({ length: 12 });
  
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className={`relative ${sizeMap[size]}`}>
        {dots.map((_, index) => (
          <div 
            key={index}
            className={`absolute ${dotSizeMap[size]} rounded-full bg-marketplace-primary transform opacity-0`}
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: '0 -100%',
              transform: `rotate(${index * 30}deg) translateY(-100%)`,
              animation: `dotFade 1.2s linear infinite`,
              animationDelay: `${index * 0.1}s`
            }}
          />
        ))}
      </div>
      {text && <p className="mt-3 text-sm text-gray-500">{text}</p>}

      {/* Add the keyframes animation */}
      <style jsx global>{`
        @keyframes dotFade {
          0%, 20% {
            opacity: 0;
          }
          30%, 70% {
            opacity: 1;
          }
          80%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator;
