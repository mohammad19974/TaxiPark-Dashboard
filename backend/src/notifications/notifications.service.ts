import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, In } from 'typeorm';
import { Notification, NotificationType, NotificationPriority, NotificationChannel } from '../database/entities/notification.entity';
import { User } from '../database/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { QueryNotificationsDto } from './dto/query-notifications.dto';
import { RealtimeGateway } from '../websocket/websocket.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    // Verify recipient exists
    const recipient = await this.userRepository.findOne({
      where: { id: createNotificationDto.recipientId },
    });
    if (!recipient) {
      throw new NotFoundException(`Recipient with ID ${createNotificationDto.recipientId} not found`);
    }

    // Verify sender exists if provided
    if (createNotificationDto.senderId) {
      const sender = await this.userRepository.findOne({
        where: { id: createNotificationDto.senderId },
      });
      if (!sender) {
        throw new NotFoundException(`Sender with ID ${createNotificationDto.senderId} not found`);
      }
    }

    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      scheduledFor: createNotificationDto.scheduledFor ? new Date(createNotificationDto.scheduledFor) : undefined,
      expiresAt: createNotificationDto.expiresAt ? new Date(createNotificationDto.expiresAt) : undefined,
    });

    const savedNotification = await this.notificationRepository.save(notification);

    // Send real-time notification if in_app channel is included
    if (savedNotification.channels.includes(NotificationChannel.IN_APP)) {
      await this.sendRealtimeNotification(savedNotification);
    }

    return savedNotification;
  }

  async findAll(queryDto: QueryNotificationsDto): Promise<{ notifications: Notification[]; total: number; page?: number; limit?: number; totalPages?: number }> {
    try {
      // Sanitize and validate parameters
      const {
        type,
        priority,
        isRead,
        isSent,
        recipientId,
        senderId,
        parkId,
        search,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = queryDto || {};

      // Validate sortBy to prevent SQL injection
      const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'type', 'isRead'];
      const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
      
      // Validate sortOrder
      const safeSortOrder = ['ASC', 'DESC'].includes(sortOrder) ? sortOrder : 'DESC';
      
      // Validate pagination parameters
      const safePage = Math.max(1, Math.floor(Number(page)) || 1);
      const safeLimit = Math.min(100, Math.max(1, Math.floor(Number(limit)) || 20));

      const queryBuilder = this.notificationRepository
        .createQueryBuilder('notification')
        .leftJoinAndSelect('notification.recipient', 'recipient')
        .leftJoinAndSelect('notification.sender', 'sender')
        .leftJoinAndSelect('notification.park', 'park');

    // Apply filters
    if (type) {
      queryBuilder.andWhere('notification.type = :type', { type });
    }

    if (priority) {
      queryBuilder.andWhere('notification.priority = :priority', { priority });
    }

    if (typeof isRead === 'boolean') {
      queryBuilder.andWhere('notification.isRead = :isRead', { isRead });
    }

    if (typeof isSent === 'boolean') {
      queryBuilder.andWhere('notification.isSent = :isSent', { isSent });
    }

    if (recipientId) {
      queryBuilder.andWhere('notification.recipientId = :recipientId', { recipientId });
    }

    if (senderId) {
      queryBuilder.andWhere('notification.senderId = :senderId', { senderId });
    }

    if (parkId) {
      queryBuilder.andWhere('notification.parkId = :parkId', { parkId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(notification.title LIKE :search OR notification.message LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting with sanitized parameters
    queryBuilder.orderBy(`notification.${safeSortBy}`, safeSortOrder as 'ASC' | 'DESC');

    // Apply pagination with sanitized parameters
    const skip = (safePage - 1) * safeLimit;
    queryBuilder.skip(skip).take(safeLimit);

    const [notifications, total] = await queryBuilder.getManyAndCount();

    return { 
      notifications, 
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit)
    };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('invalid input syntax')) {
        throw new BadRequestException('Invalid query parameters provided');
      }
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        throw new BadRequestException('Invalid sort field specified');
      }
      
      throw new BadRequestException(`Failed to fetch notifications: ${error.message || 'Unknown error'}`);
    }
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['recipient', 'sender', 'park'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);

    // Handle date conversions
    const updateData = {
      ...updateNotificationDto,
      sentAt: updateNotificationDto.sentAt ? new Date(updateNotificationDto.sentAt) : undefined,
      readAt: updateNotificationDto.readAt ? new Date(updateNotificationDto.readAt) : undefined,
      scheduledFor: updateNotificationDto.scheduledFor ? new Date(updateNotificationDto.scheduledFor) : undefined,
      expiresAt: updateNotificationDto.expiresAt ? new Date(updateNotificationDto.expiresAt) : undefined,
    };

    Object.assign(notification, updateData);
    return await this.notificationRepository.save(notification);
  }

  async remove(id: string): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.isRead = true;
    notification.readAt = new Date();
    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await this.notificationRepository.update(
      { recipientId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: { recipientId, isRead: false },
    });
  }

  async sendRealtimeNotification(notification: Notification): Promise<void> {
    const notificationData = {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      data: notification.data,
      createdAt: notification.createdAt,
    };

    // Send to specific user
    this.realtimeGateway.sendNotificationToUser(notification.recipientId, notificationData);

    // Mark as sent
    notification.isSent = true;
    notification.sentAt = new Date();
    await this.notificationRepository.save(notification);
  }

  async sendBulkNotification(
    recipientIds: string[],
    notificationData: Omit<CreateNotificationDto, 'recipientId'>
  ): Promise<Notification[]> {
    const notifications = recipientIds.map(recipientId => ({
      ...notificationData,
      recipientId,
    }));

    const createdNotifications = await Promise.all(
      notifications.map(notification => this.create(notification))
    );

    return createdNotifications;
  }

  async sendSystemNotification(
    title: string,
    message: string,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
    data?: Record<string, any>
  ): Promise<void> {
    const systemNotification = {
      title,
      message,
      priority,
      data,
      timestamp: new Date().toISOString(),
    };

    this.realtimeGateway.broadcastSystemNotification(systemNotification);
  }

  // Helper methods for common notification types
  async notifyBookingCreated(bookingId: string, recipientId: string, bookingData: any): Promise<Notification> {
    return this.create({
      type: NotificationType.BOOKING_CREATED,
      title: 'New Booking Created',
      message: `A new booking has been created: ${bookingData.bookingNumber}`,
      priority: NotificationPriority.MEDIUM,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      data: { bookingId, ...bookingData },
      recipientId,
    });
  }

  async notifyDriverAssigned(bookingId: string, driverId: string, recipientId: string): Promise<Notification> {
    return this.create({
      type: NotificationType.DRIVER_ASSIGNED,
      title: 'Driver Assigned',
      message: 'A driver has been assigned to your booking',
      priority: NotificationPriority.HIGH,
      channels: [NotificationChannel.IN_APP, NotificationChannel.SMS],
      data: { bookingId, driverId },
      recipientId,
    });
  }

  async notifyStatusChange(
    entityType: 'booking' | 'driver' | 'vehicle',
    entityId: string,
    newStatus: string,
    recipientId: string
  ): Promise<Notification> {
    const typeMap = {
      booking: NotificationType.BOOKING_UPDATED,
      driver: NotificationType.DRIVER_STATUS_CHANGED,
      vehicle: NotificationType.VEHICLE_STATUS_CHANGED,
    };

    return this.create({
      type: typeMap[entityType],
      title: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Status Updated`,
      message: `${entityType} status has been changed to ${newStatus}`,
      priority: NotificationPriority.MEDIUM,
      channels: [NotificationChannel.IN_APP],
      data: { entityType, entityId, newStatus },
      recipientId,
    });
  }
}