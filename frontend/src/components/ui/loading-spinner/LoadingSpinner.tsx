import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  text = 'Loading...',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3',
      fullScreen && 'min-h-screen bg-gray-50',
      !fullScreen && 'p-8',
      className
    )}>
      <Loader2 className={cn(
        'animate-spin text-blue-600',
        sizeClasses[size]
      )} />
      {text && (
        <p className={cn(
          'text-gray-600 font-medium',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  return content;
};

// Page Loading Component - specifically for route lazy loading
export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Loading page...' }) => (
  <LoadingSpinner 
    size="lg" 
    text={text} 
    fullScreen 
    className="animate-fade-in"
  />
);

export default LoadingSpinner;