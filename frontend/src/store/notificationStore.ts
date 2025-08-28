import { create } from 'zustand';
import type { Notification, NotificationResponse, QueryNotificationsDto } from '../types/notification';
import { notificationService } from '../services/notificationService';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  
  // Actions
  fetchNotifications: (query?: QueryNotificationsDto) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  initializeWebSocket: () => void;
  disconnectWebSocket: () => void;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  isConnected: false,

  fetchNotifications: async (query?: QueryNotificationsDto) => {
    set({ isLoading: true, error: null });
    try {
      const response: NotificationResponse = await notificationService.getMyNotifications(query);
      set({ 
        notifications: response.notifications,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        isLoading: false 
      });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationService.getUnreadCount();
      set({ unreadCount: response.count });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      const { notifications, unreadCount } = get();
      const updatedNotifications = notifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true, readAt: new Date() }
          : notification
      );
      const wasUnread = notifications.find(n => n.id === id && !n.isRead);
      set({ 
        notifications: updatedNotifications,
        unreadCount: wasUnread ? Math.max(0, unreadCount - 1) : unreadCount
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to mark as read' });
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true,
        readAt: new Date()
      }));
      set({ 
        notifications: updatedNotifications,
        unreadCount: 0
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to mark all as read' });
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      const { notifications, unreadCount } = get();
      const notificationToDelete = notifications.find(n => n.id === id);
      const updatedNotifications = notifications.filter(notification => notification.id !== id);
      set({ 
        notifications: updatedNotifications,
        unreadCount: notificationToDelete && !notificationToDelete.isRead 
          ? Math.max(0, unreadCount - 1) 
          : unreadCount
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete notification' });
    }
  },

  addNotification: (notification: Notification) => {
    const { notifications, unreadCount } = get();
    set({ 
      notifications: [notification, ...notifications],
      unreadCount: !notification.isRead ? unreadCount + 1 : unreadCount
    });
  },

  updateNotification: (id: string, updates: Partial<Notification>) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, ...updates }
        : notification
    );
    set({ notifications: updatedNotifications });
  },

  initializeWebSocket: () => {
    const socket = notificationService.initializeSocket();
    if (socket) {
      set({ isConnected: true });
      
      // Listen for new notifications
      notificationService.onNotification((notification: Notification) => {
        get().addNotification(notification);
      });

      // Listen for booking updates
      notificationService.onBookingNotification((data: any) => {
        // Handle booking-specific notifications
        console.log('Booking notification:', data);
      });

      // Listen for driver updates
      notificationService.onDriverNotification((data: any) => {
        // Handle driver-specific notifications
        console.log('Driver notification:', data);
      });

      // Listen for vehicle updates
      notificationService.onVehicleNotification((data: any) => {
        // Handle vehicle-specific notifications
        console.log('Vehicle notification:', data);
      });

      socket.on('disconnect', () => {
        set({ isConnected: false });
      });

      socket.on('connect', () => {
        set({ isConnected: true });
      });
    }
  },

  disconnectWebSocket: () => {
    notificationService.disconnectSocket();
    set({ isConnected: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));