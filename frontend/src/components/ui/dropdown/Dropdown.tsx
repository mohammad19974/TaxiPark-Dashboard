import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface DropdownItem {
  id: string;
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  separator?: boolean;
  danger?: boolean;
}

export interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
  onSelect?: (item: DropdownItem) => void;
  selectedValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  closeOnSelect?: boolean;
  maxHeight?: string;
}

const positionClasses = {
  'bottom-left': 'top-full left-0 mt-1',
  'bottom-right': 'top-full right-0 mt-1',
  'top-left': 'bottom-full left-0 mb-1',
  'top-right': 'bottom-full right-0 mb-1',
};

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  trigger,
  onSelect,
  selectedValue,
  placeholder = 'Select an option',
  disabled = false,
  position = 'bottom-left',
  className,
  triggerClassName,
  menuClassName,
  itemClassName,
  closeOnSelect = true,
  maxHeight = '300px',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectableItems = items.filter(item => !item.separator && !item.disabled);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
      setFocusedIndex(-1);
    }
  }, [disabled]);

  const handleSelect = useCallback((item: DropdownItem) => {
    if (!item.disabled && !item.separator) {
      onSelect?.(item);
      if (closeOnSelect) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
  }, [onSelect, closeOnSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          handleSelect(selectableItems[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < selectableItems.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : selectableItems.length - 1
          );
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [disabled, isOpen, focusedIndex, selectableItems, handleSelect]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Scroll focused item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && menuRef.current) {
      const focusedElement = menuRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, focusedIndex]);

  const selectedItem = selectedValue !== undefined 
    ? items.find(item => item.value === selectedValue)
    : undefined;

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          disabled && 'opacity-50 cursor-not-allowed hover:bg-white',
          triggerClassName
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {React.isValidElement(trigger) ? (
          trigger
        ) : (
          <>
            <span className="flex items-center gap-2">
              {selectedItem?.icon && (
                <span className="flex-shrink-0">
                  {selectedItem.icon}
                </span>
              )}
              <span className="truncate">
                {selectedItem?.label || placeholder}
              </span>
            </span>
            <ChevronDown 
              className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'transform rotate-180'
              )} 
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg',
            positionClasses[position],
            menuClassName
          )}
          style={{ maxHeight }}
          role="listbox"
        >
          <div className="py-1 overflow-auto" style={{ maxHeight }}>
            {items.map((item, index) => {
              if (item.separator) {
                return (
                  <div
                    key={`separator-${index}`}
                    className="border-t border-gray-100 my-1"
                    role="separator"
                  />
                );
              }

              const selectableIndex = selectableItems.findIndex(si => si.id === item.id);
              const isFocused = selectableIndex === focusedIndex;
              const isSelected = selectedValue !== undefined && item.value === selectedValue;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  disabled={item.disabled}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors',
                    item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-900 hover:bg-gray-100',
                    item.danger && !item.disabled && 'text-red-600 hover:bg-red-50',
                    isFocused && !item.disabled && 'bg-gray-100',
                    isSelected && 'bg-primary-50 text-primary-700',
                    itemClassName
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="flex items-center gap-2">
                    {item.icon && (
                      <span className="flex-shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </span>
                  
                  {isSelected && (
                    <Check className="h-4 w-4 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;