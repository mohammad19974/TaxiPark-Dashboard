export enum NotificationType {
  BOOKING_CREATED = 'booking_created',
  BOOKING_UPDATED = 'booking_updated',
  BOOKING_CANCELLED = 'booking_cancelled',
  DRIVER_ASSIGNED = 'driver_assigned',
  DRIVER_STATUS_CHANGE = 'driver_status_change',
  VEHICLE_STATUS_CHANGE = 'vehicle_status_change',
  SYSTEM_ALERT = 'system_alert',
  MAINTENANCE_REMINDER = 'maintenance_reminder',
  PAYMENT_RECEIVED = 'payment_received',
  SHIFT_STARTED = 'shift_started',
  SHIFT_ENDED = 'shift_ended',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  data?: Record<string, any>;
  isRead: boolean;
  isSent: boolean;
  sentAt?: Date;
  readAt?: Date;
  scheduledFor?: Date;
  expiresAt?: Date;
  recipientId: string;
  senderId?: string;
  parkId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationDto {
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  channels?: NotificationChannel[];
  data?: Record<string, any>;
  recipientId: string;
  senderId?: string;
  parkId?: string;
  scheduledFor?: Date;
  expiresAt?: Date;
}

export interface QueryNotificationsDto {
  type?: NotificationType;
  priority?: NotificationPriority;
  isRead?: boolean;
  isSent?: boolean;
  recipientId?: string;
  senderId?: string;
  parkId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
