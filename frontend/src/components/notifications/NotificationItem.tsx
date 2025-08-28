import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell, 
  Car, 
  User, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trash2,
  Eye
} from 'lucide-react';
import type { Notification, NotificationType, NotificationPriority } from '../../types/notification';
import { useNotificationStore } from '../../store/notificationStore';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
  showActions?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onClick,
  showActions = true 
}) => {
  const { markAsRead, deleteNotification } = useNotificationStore();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.BOOKING_CREATED:
      case NotificationType.BOOKING_UPDATED:
      case NotificationType.BOOKING_CANCELLED:
        return Calendar;
      case NotificationType.DRIVER_ASSIGNED:
      case NotificationType.DRIVER_STATUS_CHANGE:
        return User;
      case NotificationType.VEHICLE_STATUS_CHANGE:
      case NotificationType.MAINTENANCE_REMINDER:
        return Car;
      case NotificationType.SYSTEM_ALERT:
        return AlertTriangle;
      case NotificationType.PAYMENT_RECEIVED:
        return CheckCircle;
      case NotificationType.SHIFT_STARTED:
      case NotificationType.SHIFT_ENDED:
        return Clock;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return 'text-red-600 bg-red-100';
      case NotificationPriority.HIGH:
        return 'text-orange-600 bg-orange-100';
      case NotificationPriority.MEDIUM:
        return 'text-yellow-600 bg-yellow-100';
      case NotificationPriority.LOW:
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notification.id);
  };

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    onClick?.();
  };

  const Icon = getNotificationIcon(notification.type);
  const priorityColor = getPriorityColor(notification.priority);
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  return (
    <div 
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 p-2 rounded-full ${priorityColor}`}>
          <Icon className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${
                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </h4>
              <p className={`mt-1 text-sm ${
                !notification.isRead ? 'text-gray-700' : 'text-gray-500'
              }`}>
                {notification.message}
              </p>
              
              {/* Additional data */}
              {notification.data && Object.keys(notification.data).length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {Object.entries(notification.data).map(([key, value]) => (
                    <span key={key} className="inline-block mr-3">
                      <span className="font-medium">{key}:</span> {String(value)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center space-x-1 ml-2">
                {!notification.isRead && (
                  <button
                    onClick={handleMarkAsRead}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                    title="Mark as read"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">{timeAgo}</span>
            
            {/* Priority badge */}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              notification.priority === NotificationPriority.URGENT ? 'bg-red-100 text-red-800' :
              notification.priority === NotificationPriority.HIGH ? 'bg-orange-100 text-orange-800' :
              notification.priority === NotificationPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {notification.priority}
            </span>
          </div>
        </div>

        {/* Unread indicator */}
        {!notification.isRead && (
          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
        )}
      </div>
    </div>
  );
};