import React from 'react';
import { cn } from '../../../utils/cn';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

export interface PanelHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

export interface PanelBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface PanelFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between';
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseClasses = 'rounded-lg overflow-hidden';
    
    const variantClasses = {
      default: 'bg-white shadow-sm',
      bordered: 'bg-white border border-gray-200',
      filled: 'bg-gray-50 border border-gray-200'
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const PanelHeader = React.forwardRef<HTMLDivElement, PanelHeaderProps>(
  ({ 
    className, 
    title, 
    subtitle, 
    actions, 
    collapsible = false,
    collapsed = false,
    onToggle,
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-4 py-3 bg-gray-50 border-b border-gray-200',
          collapsible && 'cursor-pointer hover:bg-gray-100',
          className
        )}
        onClick={collapsible ? onToggle : undefined}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {title && (
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {title}
                </h3>
                {collapsible && (
                  <svg
                    className={cn(
                      'ml-2 h-4 w-4 text-gray-500 transition-transform',
                      collapsed ? 'rotate-0' : 'rotate-90'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">
                {subtitle}
              </p>
            )}
            {children}
          </div>
          {actions && (
            <div className="ml-4 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }
);

const PanelBody = React.forwardRef<HTMLDivElement, PanelBodyProps>(
  ({ className, padding = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const PanelFooter = React.forwardRef<HTMLDivElement, PanelFooterProps>(
  ({ className, align = 'right', children, ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between'
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center px-4 py-3 bg-gray-50 border-t border-gray-200',
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Panel.displayName = 'Panel';
PanelHeader.displayName = 'PanelHeader';
PanelBody.displayName = 'PanelBody';
PanelFooter.displayName = 'PanelFooter';

export { Panel, PanelHeader, PanelBody, PanelFooter };