import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationList } from './NotificationList';

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, fetchUnreadCount, initializeWebSocket, disconnectWebSocket } = useNotificationStore();

  useEffect(() => {
    // Initialize WebSocket connection
    initializeWebSocket();
    
    // Fetch initial unread count
    fetchUnreadCount();

    // Cleanup on unmount
    return () => {
      disconnectWebSocket();
    };
  }, [initializeWebSocket, disconnectWebSocket, fetchUnreadCount]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeDropdown}
            aria-hidden="true"
          />
          
          {/* Notification Dropdown */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={closeDropdown}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                aria-label="Close notifications"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              <NotificationList onNotificationClick={closeDropdown} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};