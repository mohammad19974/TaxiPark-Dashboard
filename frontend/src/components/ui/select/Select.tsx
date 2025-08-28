import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options?: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    label,
    error,
    helperText,
    placeholder,
    options = [],
    id,
    children,
    ...props
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseClasses = 'w-full rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 appearance-none bg-white';
    
    const variantClasses = {
      default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
      success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
    };
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 pr-8 text-sm',
      md: 'px-3 py-2 pr-10 text-sm',
      lg: 'px-4 py-3 pr-12 text-base'
    };
    
    const iconSizeClasses = {
      sm: 'h-4 w-4 right-2',
      md: 'h-5 w-5 right-3',
      lg: 'h-6 w-6 right-4'
    };
    
    const currentVariant = error ? 'error' : variant;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              baseClasses,
              variantClasses[currentVariant],
              sizeClasses[size],
              props.disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
            
            {children}
          </select>
          
          <ChevronDown className={cn(
            'absolute top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none',
            iconSizeClasses[size]
          )} />
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            'mt-1 text-xs',
            error ? 'text-red-600' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };