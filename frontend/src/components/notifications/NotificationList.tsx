import React, { useEffect } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationItem } from './NotificationItem';
import { Loader2, Bell } from 'lucide-react';

interface NotificationListProps {
  onNotificationClick?: () => void;
  limit?: number;
}

export const NotificationList: React.FC<NotificationListProps> = ({ 
  onNotificationClick,
  limit = 10 
}) => {
  const { 
    notifications, 
    isLoading, 
    error, 
    fetchNotifications, 
    markAllAsRead,
    clearError 
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications({ limit, sortBy: 'createdAt', sortOrder: 'DESC' });
  }, [fetchNotifications, limit]);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading notifications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <Bell className="h-12 w-12 mb-3 text-gray-300" />
        <p className="text-lg font-medium mb-1">No notifications</p>
        <p className="text-sm text-center">You're all caught up! New notifications will appear here.</p>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <div className="divide-y divide-gray-100">
      {/* Mark all as read button */}
      {unreadNotifications.length > 0 && (
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Mark all as read ({unreadNotifications.length})
          </button>
        </div>
      )}

      {/* Notification items */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={onNotificationClick}
          />
        ))}
      </div>

      {/* View all notifications link */}
      {notifications.length >= limit && (
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onNotificationClick}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};