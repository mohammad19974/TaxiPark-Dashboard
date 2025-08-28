import React from 'react';
import { cn } from '../../../utils/cn';

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'outlined' | 'elevated';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  background?: 'white' | 'gray' | 'transparent';
}

const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({
    className,
    variant = 'flat',
    elevation = 1,
    padding = 'md',
    rounded = 'md',
    background = 'white',
    children,
    ...props
  }, ref) => {
    const baseClasses = 'transition-shadow duration-200';
    
    const variantClasses = {
      flat: '',
      outlined: 'border border-gray-200',
      elevated: ''
    };
    
    const elevationClasses = {
      0: 'shadow-none',
      1: 'shadow-sm',
      2: 'shadow',
      3: 'shadow-md',
      4: 'shadow-lg',
      5: 'shadow-xl'
    };
    
    const paddingClasses = {
      none: '',
      xs: 'p-2',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    };
    
    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full'
    };
    
    const backgroundClasses = {
      white: 'bg-white',
      gray: 'bg-gray-50',
      transparent: 'bg-transparent'
    };
    
    // Use elevation for elevated variant, otherwise use variant-specific shadow
    const shadowClass = variant === 'elevated' 
      ? elevationClasses[elevation]
      : variant === 'flat' 
        ? elevationClasses[0]
        : elevationClasses[1];
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          shadowClass,
          paddingClasses[padding],
          roundedClasses[rounded],
          backgroundClasses[background],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Paper.displayName = 'Paper';

export { Paper };