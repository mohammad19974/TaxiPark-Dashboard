import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { QueryNotificationsDto } from './dto/query-notifications.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';
import { NotificationPriority } from '../database/entities/notification.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  async findAll(@Query() queryDto: QueryNotificationsDto) {
    try {
      // Sanitize and validate query parameters
      const safeQueryDto = queryDto || {};
      
      const validatedQuery = {
        ...safeQueryDto,
        page: safeQueryDto.page ? Math.max(1, Number(safeQueryDto.page) || 1) : 1,
        limit: safeQueryDto.limit ? Math.min(100, Math.max(1, Number(safeQueryDto.limit) || 20)) : 20,
        isRead: safeQueryDto.isRead,
        isSent: safeQueryDto.isSent,
        sortBy: safeQueryDto.sortBy || 'createdAt',
        sortOrder: (safeQueryDto.sortOrder === 'ASC' || safeQueryDto.sortOrder === 'DESC') ? safeQueryDto.sortOrder : 'DESC',
      };
      
      // Remove undefined values
      Object.keys(validatedQuery).forEach(key => {
        if (validatedQuery[key] === undefined) {
          delete validatedQuery[key];
        }
      });
      
      return await this.notificationsService.findAll(validatedQuery);
    } catch (error: any) {
      console.error('Error in findAll notifications:', error);
      throw new BadRequestException(`Failed to fetch notifications: ${error.message || 'Invalid parameters'}`);
    }
  }

  @Get('my-notifications')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  async getMyNotifications(@Request() req: any, @Query() queryDto: QueryNotificationsDto) {
    try {
      // Ensure queryDto is an object and sanitize parameters
      const safeQueryDto = queryDto || {};
      
      // Override recipientId with current user's ID
      safeQueryDto.recipientId = req.user.sub;
      
      // Validate and sanitize query parameters with proper type conversion
      const validatedQuery = {
        ...safeQueryDto,
        page: safeQueryDto.page ? Math.max(1, Number(safeQueryDto.page) || 1) : 1,
        limit: safeQueryDto.limit ? Math.min(100, Math.max(1, Number(safeQueryDto.limit) || 20)) : 20,
        // Boolean parameters are already transformed by DTO
        isRead: safeQueryDto.isRead,
        isSent: safeQueryDto.isSent,
        // Ensure string parameters are properly handled
        sortBy: safeQueryDto.sortBy || 'createdAt',
        sortOrder: (safeQueryDto.sortOrder === 'ASC' || safeQueryDto.sortOrder === 'DESC') ? safeQueryDto.sortOrder : 'DESC',
      };
      
      // Remove undefined values to avoid validation issues
      Object.keys(validatedQuery).forEach(key => {
        if (validatedQuery[key] === undefined) {
          delete validatedQuery[key];
        }
      });
      
      return await this.notificationsService.findAll(validatedQuery);
    } catch (error: any) {
      console.error('Error in getMyNotifications:', error);
      throw new BadRequestException(`Failed to fetch notifications: ${error.message || 'Invalid parameters'}`);
    }
  }

  @Get('unread-count')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  getUnreadCount(@Request() req: any) {
    return this.notificationsService.getUnreadCount(req.user.sub);
  }

  @Post('mark-all-read')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }

  @Post('bulk-send')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  sendBulkNotification(
    @Body() body: { recipientIds: string[]; notification: Omit<CreateNotificationDto, 'recipientId'> },
  ) {
    return this.notificationsService.sendBulkNotification(body.recipientIds, body.notification);
  }

  @Post('system-notification')
  @Roles(UserRole.ADMIN)
  sendSystemNotification(
    @Body() body: {
      title: string;
      message: string;
      priority?: NotificationPriority;
      data?: Record<string, any>;
    },
  ) {
    return this.notificationsService.sendSystemNotification(
      body.title,
      body.message,
      body.priority,
      body.data,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch(':id/mark-read')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }

  // Helper endpoints for common notification types
  @Post('booking-created')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  notifyBookingCreated(
    @Body() body: { bookingId: string; recipientId: string; bookingData: any },
  ) {
    return this.notificationsService.notifyBookingCreated(
      body.bookingId,
      body.recipientId,
      body.bookingData,
    );
  }

  @Post('driver-assigned')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  notifyDriverAssigned(
    @Body() body: { bookingId: string; driverId: string; recipientId: string },
  ) {
    return this.notificationsService.notifyDriverAssigned(
      body.bookingId,
      body.driverId,
      body.recipientId,
    );
  }

  @Post('status-change')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  notifyStatusChange(
    @Body() body: {
      entityType: 'booking' | 'driver' | 'vehicle';
      entityId: string;
      newStatus: string;
      recipientId: string;
    },
  ) {
    return this.notificationsService.notifyStatusChange(
      body.entityType,
      body.entityId,
      body.newStatus,
      body.recipientId,
    );
  }
}