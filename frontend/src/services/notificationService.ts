import { io, Socket } from 'socket.io-client';
import type { Notification, CreateNotificationDto, QueryNotificationsDto, NotificationResponse } from '../types/notification';
import { authService } from './authService';

class NotificationService {
  private socket: Socket | null = null;
  private baseUrl = 'http://localhost:3001/api';
  private wsUrl = 'http://localhost:3001';

  // Initialize WebSocket connection
  initializeSocket() {
    const token = authService.getToken();
    if (!token) return;

    this.socket = io(this.wsUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to notification WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification WebSocket');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    return this.socket;
  }

  // Disconnect WebSocket
  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Subscribe to notification events
  onNotification(callback: (notification: Notification) => void) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  // Subscribe to booking notifications
  onBookingNotification(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('booking_status_update', callback);
    }
  }

  // Subscribe to driver notifications
  onDriverNotification(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('driver_status_update', callback);
    }
  }

  // Subscribe to vehicle notifications
  onVehicleNotification(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('vehicle_status_update', callback);
    }
  }

  // Join park room for park-specific notifications
  joinParkRoom(parkId: string) {
    if (this.socket) {
      this.socket.emit('join_park', parkId);
    }
  }

  // Join booking room for booking-specific notifications
  joinBookingRoom(bookingId: string) {
    if (this.socket) {
      this.socket.emit('join_booking', bookingId);
    }
  }

  // API Methods
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = authService.getToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get all notifications
  async getNotifications(query?: QueryNotificationsDto): Promise<NotificationResponse> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    return this.makeRequest<NotificationResponse>(
      `/notifications${queryString ? `?${queryString}` : ''}`
    );
  }

  // Get user's notifications
  async getMyNotifications(query?: QueryNotificationsDto): Promise<NotificationResponse> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    return this.makeRequest<NotificationResponse>(
      `/notifications/my-notifications${queryString ? `?${queryString}` : ''}`
    );
  }

  // Get unread count
  async getUnreadCount(): Promise<{ count: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch unread count: ${response.status}`);
        return { count: 0 };
      }

      const data = await response.json();
      // Handle both number response and object response
      if (typeof data === 'number') {
        return { count: data };
      } else if (data && typeof data.count === 'number') {
        return { count: data.count };
      } else {
        return { count: 0 };
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return { count: 0 };
    }
  }

  // Create notification
  async createNotification(notification: CreateNotificationDto): Promise<Notification> {
    return this.makeRequest<Notification>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<Notification> {
    return this.makeRequest<Notification>(`/notifications/${id}/mark-read`, {
      method: 'PATCH',
    });
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<{ updated: number }> {
    return this.makeRequest<{ updated: number }>('/notifications/mark-all-read', {
      method: 'POST',
    });
  }

  // Delete notification
  async deleteNotification(id: string): Promise<void> {
    return this.makeRequest<void>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Send system notification
  async sendSystemNotification(data: {
    title: string;
    message: string;
    priority?: string;
    data?: Record<string, any>;
  }): Promise<Notification> {
    return this.makeRequest<Notification>('/notifications/system-notification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const notificationService = new NotificationService();