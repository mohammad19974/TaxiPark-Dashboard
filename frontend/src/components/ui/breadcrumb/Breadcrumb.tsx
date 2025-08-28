import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHomeIcon?: boolean;
  maxItems?: number;
  itemClassName?: string;
  linkClassName?: string;
  currentClassName?: string;
  separatorClassName?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  showHomeIcon = false,
  maxItems,
  itemClassName,
  linkClassName,
  currentClassName,
  separatorClassName,
  className,
  ...props
}) => {
  // Handle max items with ellipsis
  const processedItems = React.useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    if (maxItems <= 2) {
      return [items[0], items[items.length - 1]];
    }

    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 2));
    
    return [
      firstItem,
      { label: '...', href: undefined, current: false },
      ...lastItems,
    ];
  }, [items, maxItems]);

  const renderItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === processedItems.length - 1;
    const isCurrent = item.current || isLast;
    const isEllipsis = item.label === '...';

    const content = (
      <span className="flex items-center gap-1">
        {item.icon && (
          <span className="flex-shrink-0">
            {item.icon}
          </span>
        )}
        {showHomeIcon && index === 0 && !item.icon && (
          <Home className="h-4 w-4 flex-shrink-0" />
        )}
        <span className={isEllipsis ? 'px-1' : ''}>
          {item.label}
        </span>
      </span>
    );

    const itemClasses = cn(
      'flex items-center text-sm',
      itemClassName
    );

    if (isEllipsis) {
      return (
        <li key={`ellipsis-${index}`} className={itemClasses}>
          <span className="text-gray-500">{content}</span>
        </li>
      );
    }

    if (isCurrent || !item.href) {
      return (
        <li key={item.label} className={itemClasses}>
          <span
            className={cn(
              'text-gray-900 font-medium',
              currentClassName
            )}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {content}
          </span>
        </li>
      );
    }

    return (
      <li key={item.label} className={itemClasses}>
        <a
          href={item.href}
          className={cn(
            'text-gray-500 hover:text-gray-700 transition-colors',
            linkClassName
          )}
        >
          {content}
        </a>
      </li>
    );
  };

  const renderSeparator = (index: number) => (
    <li
      key={`separator-${index}`}
      className={cn(
        'flex items-center text-gray-400',
        separatorClassName
      )}
      aria-hidden="true"
    >
      {separator}
    </li>
  );

  return (
    <nav
      className={cn('flex', className)}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {processedItems.map((item, index) => (
          <React.Fragment key={`fragment-${index}`}>
            {renderItem(item, index)}
            {index < processedItems.length - 1 && renderSeparator(index)}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

// Convenience component for simple breadcrumbs
export const SimpleBreadcrumb: React.FC<{
  paths: string[];
  baseHref?: string;
  className?: string;
}> = ({ paths, baseHref = '/', className }) => {
  const items: BreadcrumbItem[] = paths.map((path, index) => ({
    label: path,
    href: index < paths.length - 1 ? `${baseHref}${paths.slice(0, index + 1).join('/')}` : undefined,
    current: index === paths.length - 1,
  }));

  return <Breadcrumb items={items} className={className} />;
};

export default Breadcrumb;