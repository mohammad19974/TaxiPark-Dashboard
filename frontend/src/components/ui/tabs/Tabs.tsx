import React, { useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TabItem[];
  defaultActiveTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
  tabListClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  contentClassName?: string;
}

const tabVariants = {
  default: {
    container: 'border-b border-gray-200',
    tab: 'border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300',
    activeTab: 'border-primary-500 text-primary-600',
    disabledTab: 'text-gray-300 cursor-not-allowed hover:text-gray-300 hover:border-transparent',
  },
  pills: {
    container: '',
    tab: 'px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-100',
    activeTab: 'bg-primary-100 text-primary-700',
    disabledTab: 'text-gray-300 cursor-not-allowed hover:text-gray-300 hover:bg-transparent',
  },
  underline: {
    container: '',
    tab: 'px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700',
    activeTab: 'border-primary-500 text-primary-600',
    disabledTab: 'text-gray-300 cursor-not-allowed hover:text-gray-300',
  },
  cards: {
    container: 'border-b border-gray-200',
    tab: 'px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 border-b-0 rounded-t-md hover:text-gray-700',
    activeTab: 'bg-white text-gray-900 border-gray-200 border-b-white',
    disabledTab: 'text-gray-300 cursor-not-allowed hover:text-gray-300 bg-gray-50',
  },
};

const tabSizes = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  fullWidth = false,
  tabListClassName,
  tabClassName,
  activeTabClassName,
  contentClassName,
  className,
  ...props
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultActiveTab || items[0]?.id || ''
  );

  const isControlled = controlledActiveTab !== undefined;
  const activeTabId = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (!isControlled) {
        setInternalActiveTab(tabId);
      }
      onTabChange?.(tabId);
    },
    [isControlled, onTabChange]
  );

  const activeTabItem = items.find(item => item.id === activeTabId);
  const variantStyles = tabVariants[variant];

  const tabListClasses = cn(
    'flex',
    orientation === 'horizontal' ? 'flex-row' : 'flex-col',
    fullWidth && orientation === 'horizontal' && 'w-full',
    variantStyles.container,
    tabListClassName
  );

  const getTabClasses = (item: TabItem, isActive: boolean) => {
    return cn(
      'inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      variantStyles.tab,
      tabSizes[size],
      fullWidth && orientation === 'horizontal' && 'flex-1 justify-center',
      isActive && cn(variantStyles.activeTab, activeTabClassName),
      item.disabled && variantStyles.disabledTab,
      tabClassName
    );
  };

  return (
    <div
      className={cn(
        'w-full',
        orientation === 'vertical' && 'flex gap-6',
        className
      )}
      {...props}
    >
      {/* Tab List */}
      <div
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          tabListClasses,
          orientation === 'vertical' && 'flex-shrink-0 w-48'
        )}
      >
        {items.map((item) => {
          const isActive = item.id === activeTabId;
          
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`tabpanel-${item.id}`}
              id={`tab-${item.id}`}
              disabled={item.disabled}
              className={getTabClasses(item, isActive)}
              onClick={() => !item.disabled && handleTabChange(item.id)}
            >
              {item.icon && (
                <span className="flex-shrink-0">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
              {item.badge && (
                <span className="flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTabItem && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTabItem.id}`}
          aria-labelledby={`tab-${activeTabItem.id}`}
          className={cn(
            'flex-1 focus:outline-none',
            orientation === 'horizontal' && 'mt-4',
            contentClassName
          )}
          tabIndex={0}
        >
          {activeTabItem.content}
        </div>
      )}
    </div>
  );
};

export default Tabs;