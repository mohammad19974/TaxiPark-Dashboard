import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  title?: string;
  description?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

const alertVariants = {
  default: {
    container: 'bg-gray-50 border-gray-200 text-gray-800',
    icon: 'text-gray-600',
    title: 'text-gray-800',
    description: 'text-gray-700',
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-600',
    title: 'text-green-800',
    description: 'text-green-700',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-600',
    title: 'text-yellow-800',
    description: 'text-yellow-700',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-600',
    title: 'text-red-800',
    description: 'text-red-700',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-600',
    title: 'text-blue-800',
    description: 'text-blue-700',
  },
};

const defaultIcons = {
  default: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  title,
  description,
  children,
  dismissible = false,
  onDismiss,
  icon,
  showIcon = true,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const variantStyles = alertVariants[variant];
  const IconComponent = (icon || defaultIcons[variant]) as React.ComponentType<{ className?: string; size?: number; }>;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4',
        variantStyles.container,
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex">
        {showIcon && IconComponent && (
          <div className="flex-shrink-0">
            {React.isValidElement(icon) ? (
              icon
            ) : (
              <IconComponent className={cn('h-5 w-5', variantStyles.icon)} />
            )}
          </div>
        )}
        
        <div className={cn('flex-1', showIcon && IconComponent && 'ml-3')}>
          {title && (
            <h3 className={cn('text-sm font-medium', variantStyles.title)}>
              {title}
            </h3>
          )}
          
          {description && (
            <div className={cn('text-sm', title && 'mt-1', variantStyles.description)}>
              {description}
            </div>
          )}
          
          {children && (
            <div className={cn('text-sm', (title || description) && 'mt-2', variantStyles.description)}>
              {children}
            </div>
          )}
        </div>
        
        {dismissible && (
          <div className="flex-shrink-0 ml-3">
            <button
              type="button"
              className={cn(
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                variantStyles.icon,
                'hover:bg-black/5 focus:ring-black/20'
              )}
              onClick={handleDismiss}
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;