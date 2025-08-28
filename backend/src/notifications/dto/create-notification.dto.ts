import { IsEnum, IsString, IsOptional, IsArray, IsObject, IsDateString, IsUUID } from 'class-validator';
import { NotificationType, NotificationPriority, NotificationChannel } from '../../database/entities/notification.entity';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority = NotificationPriority.MEDIUM;

  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels: NotificationChannel[];

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @IsUUID()
  recipientId: string;

  @IsUUID()
  @IsOptional()
  senderId?: string;

  @IsUUID()
  @IsOptional()
  parkId?: string;

  @IsDateString()
  @IsOptional()
  scheduledFor?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}