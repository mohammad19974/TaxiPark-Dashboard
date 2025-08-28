import React from 'react';
import { cn } from '../../../utils/cn';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'white';
  label?: string;
  showLabel?: boolean;
}

const spinnerSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const spinnerVariants = {
  default: 'border-gray-300 border-t-gray-600',
  primary: 'border-primary-200 border-t-primary-600',
  secondary: 'border-gray-200 border-t-gray-500',
  white: 'border-white/30 border-t-white',
};

const labelSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  label,
  showLabel = false,
  className,
  ...props
}) => {
  const spinnerElement = (
    <div
      className={cn(
        'animate-spin rounded-full border-2',
        spinnerSizes[size],
        spinnerVariants[variant],
        className
      )}
      role="status"
      aria-label={label || 'Loading'}
      {...props}
    >
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );

  if (showLabel && label) {
    return (
      <div className="flex flex-col items-center gap-2">
        {spinnerElement}
        <span className={cn('text-gray-600', labelSizes[size])}>
          {label}
        </span>
      </div>
    );
  }

  return spinnerElement;
};

// Convenience component for inline spinners
export const InlineSpinner: React.FC<Omit<SpinnerProps, 'showLabel'>> = (props) => {
  return <Spinner {...props} className={cn('inline-block', props.className)} />;
};

// Convenience component for loading overlays
export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  spinnerProps?: SpinnerProps;
  className?: string;
}> = ({ isLoading, children, spinnerProps, className }) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <Spinner
            size="lg"
            variant="primary"
            label="Loading..."
            showLabel
            {...spinnerProps}
          />
        </div>
      )}
    </div>
  );
};

export default Spinner;